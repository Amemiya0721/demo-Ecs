const API_BASE = "http://127.0.0.1:8000";

let product = null;

document.addEventListener("DOMContentLoaded", async () => {
    const id = new URLSearchParams(location.search).get("id");

    if (!id) {
        showError("商品IDがありません");
        return;
    }

    await loadProduct(id);
    render();
});

// JSON取得して1件抽出
async function loadProduct(id) {

    try {

        const res = await fetch(
            `${API_BASE}/api/products/${id}?ver=${Date.now()}`,
            {
                cache: "no-store"
            }
        );

        if (!res.ok) {
            throw new Error("商品取得に失敗しました");
        }

        product = await res.json();

        if (product.message) {
            showError(product.message);
            product = null;
        }

    } catch (e) {

        console.error(e);

        showError("読み込み失敗");

    }

}

// 描画
function render() {

    const el = document.getElementById("product-detail");
    const url = location.href;

    el.innerHTML = `
        <div class="col-md-6">

            <!-- メイン画像 -->
            <div id="mainImageArea" class="text-center mb-3">

                ${product.images?.length > 0 ? `
                    <img
                        id="mainImage"
                        src="${escapeHtml(product.images[0])}"
                        class="img-fluid rounded border w-100"
                        style="max-height:500px;object-fit:contain;"
                        onerror="imageError(this)">
                ` : `
                    <div
                        class="border rounded d-flex justify-content-center align-items-center"
                        style="height:500px;background:#f8f9fa;">
                        <p class="text-muted mb-0">
                            現在、この商品の画像は登録されていません。
                        </p>
                    </div>
                `}

            </div>

            <!-- サムネイル -->
            ${product.images?.length > 1 ? `
                <div class="d-flex justify-content-center gap-2 flex-wrap">

                    ${product.images.map(img => `
                        <img
                            src="${escapeHtml(img)}"
                            class="img-thumbnail thumb-image"
                            onclick="changeImage('${escapeHtml(img)}')"
                            onerror="this.style.display='none'"
                            style="width:90px;height:90px;object-fit:cover;cursor:pointer;">
                    `).join("")}

                </div>
            ` : ""}

        </div>

        <div class="col-md-6">

            <h2>${escapeHtml(product.name)}</h2>

            <p class="text-muted">${escapeHtml(product.category)}</p>

            <h3 class="text-danger">
                ¥${product.price.toLocaleString()}
            </h3>

            <div class="product-description">
                ${renderDescription(product.description)}
            </div>

            <div class="mb-3">

                <div class="mb-2">
                    <strong>メーカー：</strong>
                    ${escapeHtml(product.manufacturer)}
                </div>

                <div class="mb-3">
                    <strong>スペック</strong>
                        <ul>
                            <li>
                                重量：
                                ${escapeHtml(product.spec?.weight ?? "-")}
                                </li>
                                <li>
                                変速：
                                ${escapeHtml(product.spec?.speed ?? "-")}
                                </li>
                                <li>
                                素材：
                                ${escapeHtml(product.spec?.material ?? "-")}
                                </li>
                                </ul>
                    </div>



                <div class="mb-2">

                    <strong>年式：</strong>
                    ${escapeHtml(product.year ?? "不明")}
                </div>

                <div class="d-flex align-items-center gap-2">

                    <strong>状態：</strong>

                    <span class="rank-badge rank-${product.condition?.rank}">
                        ${escapeHtml(product.condition?.rank ?? "-")}
                    </span>


                    ${product.condition?.junk
            ?
            `
                    <span class="junk-badge">
                    JUNK
                    </span>
                    `
            :
            ""
        }

                    <span class="rank-text">
                    ${getRankName(product.condition?.rank)}
                    </span>

                    </div>
                </div>

            <button
                class="btn btn-dark w-100 mb-3"
                onclick="addToCart()">
                カートに入れる
            </button>

            <div class="d-flex gap-2 flex-wrap">

                <button
                    class="btn btn-outline-secondary btn-sm"
                    onclick="copyURL()">
                    URLコピー
                </button>

                <a
                    class="btn btn-outline-dark btn-sm"
                    target="_blank"
                    href="https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(product.name + '｜OVERHAUL')}">
                    X共有
                </a>

                <a
                    class="btn btn-success btn-sm"
                    target="_blank"
                    href="https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}">
                    LINE共有
                </a>

            </div>

        </div>
    `;
}
function changeImage(src) {

    const mainImage = document.getElementById("mainImage");

    if (!mainImage) {
        return;
    }

    mainImage.src = src;
}
function imageError(img) {

    img.outerHTML = `
        <div
            class="border rounded d-flex justify-content-center align-items-center"
            style="height:500px;background:#f8f9fa;">
            <p class="text-muted mb-0">
                画像を読み込めませんでした。
            </p>
        </div>
    `;

}
// ランク表示名
function getRankName(rank) {

    const names = {

        A: "美品",

        B: "良品",

        C: "傷・使用感あり"

    };


    return names[rank] || "";

}

// 商品説明（見出し＋本文の配列）をHTMLへ変換
// product.description = [{ heading: "商品状態", body: "動作確認済み\n歯の摩耗少なめ" }, ...]
function renderDescription(sections) {
    if (!Array.isArray(sections) || sections.length === 0) {
        return "";
    }

    return sections.map(sec => {
        const heading = escapeHtml(sec.heading || "");

        const bodyItems = (sec.body || "")
            .split("\n")
            .map(line => line.trim())
            .filter(line => line !== "")
            .map(line => `<li>${escapeHtml(line)}</li>`)
            .join("");

        // 本文が1行だけの場合はリストではなく通常テキストとして表示
        const bodyHtml = bodyItems
            ? `<ul class="mb-0">${bodyItems}</ul>`
            : "";

        return `
            <div class="description-section mb-3">
                ${heading ? `<h5>${heading}</h5>` : ""}
                ${bodyHtml}
            </div>
        `;
    }).join("");
}

// HTMLエスケープ（XSS対策）
function escapeHtml(str) {
    if (str == null) return "";
    return String(str).replace(/[&<>"']/g, (c) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[c]));
}

// エラー
function showError(msg) {
    document.getElementById("product-detail").innerHTML = `
        <div class="col-12 text-center text-danger">
            <h4>${escapeHtml(msg)}</h4>
        </div>
    `;
}
// ==============================
// カート機能
// ==============================

// カート追加
function addToCart() {

    let cart = getCart();

    const item = cart.find(p => p.id === product.id);

    if (item) {

        alert("この商品は既にカートに入っています。");
        return;

    }

    cart.push({
        id: product.id
    });

    saveCart(cart);

    alert("カートへ追加しました。");

}
// URLコピー
async function copyURL() {

    try {

        await navigator.clipboard.writeText(location.href);

        alert("URLをコピーしました。");

    } catch (e) {

        alert("URLのコピーに失敗しました。");

    }

}
// Cookieから取得
function getCart() {

    const cookie = document.cookie
        .split("; ")
        .find(row => row.startsWith("cart="));

    if (!cookie) {
        return [];
    }

    try {
        return JSON.parse(decodeURIComponent(cookie.split("=")[1]));
    } catch {
        return [];
    }
}

// Cookieへ保存
function saveCart(cart) {

    document.cookie =
        "cart=" +
        encodeURIComponent(JSON.stringify(cart)) +
        ";path=/;max-age=" + (60 * 60 * 24 * 7);

}