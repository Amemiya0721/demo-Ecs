(function () {
    const KEY = 'ledger_entries_v1';
    const EXP_TYPES = ['仕入', '手数料', '送料', 'その他経費'];
    const $ = id => document.getElementById(id);
    const yen = n => '¥' + Math.round(n).toLocaleString('ja-JP');
    const todayISO = () => { const d = new Date(); const o = d.getTimezoneOffset(); return new Date(d - o * 60000).toISOString().slice(0, 10) };
    const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

    let entries = load();
    let editingId = null;

    function load() { try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch (e) { return [] } }
    function save() { try { localStorage.setItem(KEY, JSON.stringify(entries)) } catch (e) { alert('保存に失敗しました。ブラウザの設定をご確認ください。') } }
    const isIncome = t => t === '売上';
    const ym = d => d.slice(0, 7);

    /* ---- scope selector ---- */
    function buildScope() {
        const sel = $('scopeSel'); const months = [...new Set(entries.map(e => ym(e.date)))].sort().reverse();
        const cur = ym(todayISO()); if (!months.includes(cur)) months.unshift(cur);
        const prev = sel.value;
        sel.innerHTML = '<option value="all">すべての期間</option>' + months.map(m => `<option value="${m}">${m.replace('-', '年')}月</option>`).join('');
        sel.value = (prev && [...sel.options].some(o => o.value === prev)) ? prev : cur;
    }
    function inScope(e) { const s = $('scopeSel').value; return s === 'all' ? true : ym(e.date) === s }

    /* ---- summary ---- */
    function renderSummary() {
        const rows = entries.filter(inScope);
        let inc = 0, exp = 0; const chSales = {};
        rows.forEach(e => { if (isIncome(e.type)) { inc += e.amount; if (e.channel) chSales[e.channel] = (chSales[e.channel] || 0) + e.amount; } else exp += e.amount; });
        $('cInc').textContent = yen(inc);
        $('cExp').textContent = yen(exp);
        $('cPro').textContent = yen(inc - exp);
        $('cPro').style.color = (inc - exp) >= 0 ? 'var(--navy)' : 'var(--expense)';
        // channel mix on income card
        const own = chSales['自社サイト'] || 0; const total = inc || 1;
        $('cIncSub').textContent = inc ? `自社サイト比率 ${Math.round(own / total * 100)}%` : '—';
        // expense breakdown
        const byType = {}; rows.filter(e => !isIncome(e.type)).forEach(e => byType[e.type] = (byType[e.type] || 0) + e.amount);
        const parts = EXP_TYPES.filter(t => byType[t]).map(t => `${t} ${yen(byType[t])}`);
        $('cExpSub').textContent = parts.length ? parts.join(' ／ ') : '—';
        const s = $('scopeSel').value;
        $('cProSub').textContent = (s === 'all' ? '全期間' : s.replace('-', '年') + '月') + '：売上 − 経費';
    }

    /* ---- chart (last 6 months) ---- */
    function renderChart() {
        const map = {};
        entries.forEach(e => { const k = ym(e.date); map[k] = map[k] || { inc: 0, exp: 0 }; if (isIncome(e.type)) map[k].inc += e.amount; else map[k].exp += e.amount; });
        // build last 6 months ending at current or latest
        const keys = Object.keys(map); const base = keys.length ? keys.sort().slice(-1)[0] : ym(todayISO());
        const [by, bm] = base.split('-').map(Number);
        const months = []; for (let i = 5; i >= 0; i--) { const d = new Date(by, bm - 1 - i, 1); months.push(d.toISOString().slice(0, 7)); }
        const max = Math.max(1, ...months.map(m => Math.max(map[m]?.inc || 0, map[m]?.exp || 0)));
        $('chart').innerHTML = months.map(m => {
            const inc = map[m]?.inc || 0, exp = map[m]?.exp || 0;
            const hi = Math.round(inc / max * 128), he = Math.round(exp / max * 128);
            const lbl = m.slice(5) + '月';
            return `<div class="col"><div class="bars">
        <div class="bar b-inc" style="height:${hi}px" title="売上 ${yen(inc)}"></div>
        <div class="bar b-exp" style="height:${he}px" title="経費 ${yen(exp)}"></div>
      </div><div class="m">${lbl}</div></div>`;
        }).join('');
    }

    /* ---- table ---- */
    function renderTable() {
        const q = $('qSearch').value.trim(), qt = $('qType').value, qc = $('qCh').value;
        let rows = entries.filter(inScope).filter(e => {
            if (qt && e.type !== qt) return false;
            if (qc && e.channel !== qc) return false;
            if (q) { const h = (e.item + ' ' + (e.memo || '')).toLowerCase(); if (!h.includes(q.toLowerCase())) return false; }
            return true;
        }).sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));

        const tb = $('tbody'); tb.innerHTML = '';
        $('empty').style.display = entries.length ? 'none' : 'block';
        let inc = 0, exp = 0;
        rows.forEach(e => {
            const income = isIncome(e.type); if (income) inc += e.amount; else exp += e.amount;
            const tr = document.createElement('tr');
            tr.innerHTML = `<td class="mono" style="white-space:nowrap">${e.date}</td>
        <td><span class="badge bg-${e.type}">${e.type}</span></td>
        <td>${esc(e.item) || '<span class="ch">（無題）</span>'}</td>
        <td class="ch">${e.channel || '—'}</td>
        <td class="ch">${esc(e.memo) || '—'}</td>
        <td class="num" style="color:var(--income)">${income ? yen(e.amount) : ''}</td>
        <td class="num" style="color:var(--expense)">${income ? '' : yen(e.amount)}</td>
        <td><div class="row-act"><button class="ico" data-ed="${e.id}" title="編集">✎</button><button class="ico" data-del="${e.id}" title="削除">🗑</button></div></td>`;
            tb.appendChild(tr);
        });
        const scopeTxt = $('scopeSel').value === 'all' ? '全期間' : $('scopeSel').value.replace('-', '年') + '月';
        $('subtot').innerHTML = rows.length
            ? `<span>${scopeTxt}・${rows.length}件</span><span>売上 <b style="color:var(--income)">${yen(inc)}</b></span><span>経費 <b style="color:var(--expense)">${yen(exp)}</b></span><span>利益 <b>${yen(inc - exp)}</b></span>`
            : '';
    }
    function esc(s) { return (s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])) }

    function renderAll() { buildScope(); renderSummary(); renderChart(); renderTable(); }

    /* ---- add / edit ---- */
    function resetForm() {
        editingId = null; $('fItem').value = ''; $('fAmt').value = ''; $('fMemo').value = '';
        $('addBtn').textContent = '＋ 追加'; $('cancelBtn').style.display = 'none'; $('editNote').style.display = 'none';
    }
    $('addBtn').onclick = () => {
        const date = $('fDate').value || todayISO();
        const type = $('fType').value;
        const amount = Math.abs(parseFloat($('fAmt').value) || 0);
        if (!amount) { $('fAmt').focus(); return; }
        const rec = { id: editingId || uid(), date, type, item: $('fItem').value.trim(), amount, channel: $('fCh').value, memo: $('fMemo').value.trim() };
        if (editingId) { const i = entries.findIndex(x => x.id === editingId); if (i > -1) entries[i] = rec; }
        else entries.push(rec);
        save(); resetForm(); $('fDate').value = date; renderAll();
    };
    $('cancelBtn').onclick = resetForm;

    document.addEventListener('click', ev => {
        const ed = ev.target.closest('[data-ed]'); const del = ev.target.closest('[data-del]');
        if (ed) {
            const e = entries.find(x => x.id === ed.dataset.ed); if (!e) return;
            editingId = e.id; $('fDate').value = e.date; $('fType').value = e.type; $('fItem').value = e.item; $('fAmt').value = e.amount; $('fCh').value = e.channel || ''; $('fMemo').value = e.memo || '';
            $('addBtn').textContent = '更新'; $('cancelBtn').style.display = 'block'; $('editNote').style.display = 'block';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        if (del) { if (confirm('この記録を削除しますか？')) { entries = entries.filter(x => x.id !== del.dataset.del); save(); if (editingId === del.dataset.del) resetForm(); renderAll(); } }
    });

    ['scopeSel', 'qSearch', 'qType', 'qCh'].forEach(id => $(id).addEventListener('input', () => { renderSummary(); renderTable(); if (id === 'scopeSel') renderChart(); }));

    /* ---- CSV ---- */
    $('csvBtn').onclick = () => {
        if (!entries.length) { alert('データがありません'); return; }
        const head = ['日付', '種別', '品目・内容', '販路', '相手先・メモ', '収入', '支出'];
        const lines = [head.join(',')];
        entries.slice().sort((a, b) => a.date.localeCompare(b.date)).forEach(e => {
            const inc = isIncome(e.type) ? e.amount : ''; const exp = isIncome(e.type) ? '' : e.amount;
            lines.push([e.date, e.type, q(e.item), e.channel || '', q(e.memo || ''), inc, exp].join(','));
        });
        const blob = new Blob(['\uFEFF' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
        dl(blob, `帳簿_${todayISO()}.csv`);
    };
    function q(s) { s = String(s || ''); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }

    /* ---- backup / restore ---- */
    $('backupBtn').onclick = () => dl(new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' }), `帳簿バックアップ_${todayISO()}.json`);
    $('restoreBtn').onclick = () => $('restoreFile').click();
    $('restoreFile').onchange = e => {
        const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => {
            try {
                const d = JSON.parse(r.result); if (!Array.isArray(d)) throw 0;
                if (confirm(`${d.length}件を読み込みます。現在のデータは置き換えられます。よろしいですか？`)) { entries = d.map(x => ({ id: x.id || uid(), date: x.date, type: x.type, item: x.item || '', amount: Math.abs(+x.amount || 0), channel: x.channel || '', memo: x.memo || '' })); save(); resetForm(); renderAll(); }
            } catch (err) { alert('読み込めませんでした（JSON形式をご確認ください）') }
        }; r.readAsText(f); e.target.value = '';
    };

    $('clearBtn').onclick = () => { if (confirm('すべての記録を消去します。元に戻せません。よろしいですか？')) { entries = []; save(); resetForm(); renderAll(); } };

    function dl(blob, name) { const u = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = u; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(u), 1000); }

    /* ---- demo ---- */
    $('demoBtn') && ($('demoBtn').onclick = () => {
        const m = todayISO().slice(0, 7);
        const s = [
            { t: '仕入', i: 'Cannondale CAAD13 54', a: 78000, c: '', mo: '△△サイクル（下取り）' },
            { t: '売上', i: 'Cannondale CAAD13 54', a: 124000, c: '自社サイト', mo: '' },
            { t: '手数料', i: 'CAAD13 決済手数料', a: 4340, c: '自社サイト', mo: '' },
            { t: '送料', i: 'CAAD13 発送(ヤマト)', a: 3800, c: '', mo: '' },
            { t: '仕入', i: 'Honda CB400SF', a: 132000, c: '', mo: '個人売主・本人確認済' },
            { t: '売上', i: 'Honda CB400SF', a: 198000, c: 'メルカリ', mo: '' },
            { t: '手数料', i: 'CB400 メルカリ手数料10%', a: 19800, c: 'メルカリ', mo: '' },
            { t: 'その他経費', i: '梱包資材', a: 2400, c: '', mo: '' },
        ];
        s.forEach((x, k) => entries.push({ id: uid(), date: `${m}-${String(3 + k).padStart(2, '0')}`, type: x.t, item: x.i, amount: x.a, channel: x.c, memo: x.mo }));
        save(); renderAll();
    });

    /* init */
    $('fDate').value = todayISO();
    renderAll();
})();
