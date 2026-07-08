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

        const products = await response.json();

        // 新着順
        products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // 最大20件表示
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

    return `

    <div class="col-xl-3 col-lg-4 col-md-6">

        <div class="card product-card h-100">

            <img
                src="${product.thumbnail}"
                class="card-img-top"
                alt="${product.name}">

            <div class="card-body d-flex flex-column">

                <div class="price">

                    ¥${Number(product.price).toLocaleString()}

                </div>

                <div class="d-flex justify-content-between align-items-center mt-2">

                    <span class="product-name">

                        ${product.name}

                    </span>

                    <span class="rank">

                        ${product.rank}

                    </span>

                </div>

                <p class="description mt-3">

                    ${product.description}

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

// 読み込み
document.addEventListener("DOMContentLoaded", () => {

    loadProducts();

});