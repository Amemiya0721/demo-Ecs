// =====================================
// OVERHAUL
// index.js
// TOPページ
// =====================================

// 商品一覧表示数
const DISPLAY_COUNT = 4;

// JSON読込
async function loadProducts() {

    try {

        const response = await fetch("data/products.json");

        if (!response.ok) {
            throw new Error("商品データの取得に失敗しました。");
        }

        const products = await response.json();

        // 新着順
        products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // 最大件数表示
        displayProducts(products.slice(0, DISPLAY_COUNT));

    } catch (error) {

        console.error("商品データの取得に失敗しました。", error);

    }

}

// 商品表示
function displayProducts(products) {

    const productList = document.getElementById("product-list");

    productList.innerHTML = "";

    products.forEach(product => {

        productList.innerHTML += createCard(product);

    });

}

// 商品カード生成
function createCard(product) {

    // メイン画像（なければNo Image）
    const image = product.images?.[0] || "assets/images/noimage.jpg";

    return `

    <div class="col-xl-3 col-lg-4 col-md-6">

        <div class="card product-card h-100">

            <img
                src="${escapeHtml(image)}"
                class="card-img-top"
                alt="${escapeHtml(product.name)}"
                onerror="this.src='assets/images/noimage.jpg';">

            <div class="card-body d-flex flex-column">

                <div class="price">
                    ¥${Number(product.price).toLocaleString()}
                </div>

                <div class="d-flex justify-content-between align-items-center mt-2">

                    <span class="product-name">
                        ${escapeHtml(product.name)}
                    </span>

                    <span class="rank-badge rank-${escapeHtml(product.rank)}">
                        ${escapeHtml(product.rank)}
                    </span>

                </div>

                <p class="description mt-3">
                    ${getDescriptionPreview(product.description)}
                </p>

                <a
                    href="product.html?id=${product.id}"
                    class="btn btn-dark mt-auto">

                    詳細を見る

                </a>

            </div>

        </div>

    </div>

    `;

}

// 商品説明プレビュー
function getDescriptionPreview(description) {

    if (!Array.isArray(description) || description.length === 0) {
        return "";
    }

    const body = description[0].body ?? "";

    return escapeHtml(body.split("\n")[0]);

}

// HTMLエスケープ
function escapeHtml(str) {

    if (str == null) return "";

    return String(str).replace(/[&<>"']/g, c => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#39;"
    }[c]));

}

// 読み込み
document.addEventListener("DOMContentLoaded", () => {

    loadProducts();

});