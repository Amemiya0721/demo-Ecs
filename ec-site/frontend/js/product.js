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
        const res = await fetch("./data/products.json");

        if (!res.ok) throw new Error("fetch error");

        const data = await res.json();

        product = data.find(p => String(p.id) === String(id));

        if (!product) {
            showError("商品が見つかりません");
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
            <img src="${product.thumbnail}" class="img-fluid rounded">
        </div>

        <div class="col-md-6">

            <h2>${product.name}</h2>

            <p class="text-muted">${product.category}</p>

            <h3 class="text-danger">¥${product.price.toLocaleString()}</h3>

            <p>${product.description}</p>

            <div class="mb-3">
                <strong>メーカー:</strong> ${product.manufacturer}<br>
                <strong>ランク:</strong> ${product.rank}
            </div>
                <button
                    class="btn btn-dark w-100 mb-3"
                    onclick="addToCart()">
                  カートに入れる
                </button>

            <div class="d-flex gap-2 flex-wrap">

                <button class="btn btn-outline-secondary btn-sm" onclick="copyURL()">
                    URLコピー
                </button>

                <a class="btn btn-outline-dark btn-sm"
                   target="_blank"
                   href="https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(product.name + '｜OVERHAUL')}">
                    X共有
                </a>

                <a class="btn btn-success btn-sm"
                   target="_blank"
                   href="https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}">
                    LINE共有
                </a>

            </div>

        </div>
    `;
}

// URLコピー
function copyURL() {
    navigator.clipboard.writeText(location.href);
    alert("コピーしました");
}

// エラー
function showError(msg) {
    document.getElementById("product-detail").innerHTML = `
        <div class="col-12 text-center text-danger">
            <h4>${msg}</h4>
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
        item.qty++;
    } else {
        cart.push({
            id: product.id,
            qty: 1
        });
    }

    saveCart(cart);

    alert("カートへ追加しました。");
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