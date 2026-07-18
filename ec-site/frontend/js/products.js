// =====================================
// OVERHAUL
// products.js
// =====================================

const PAGE_SIZE = 20;

let products = [];
let filteredProducts = [];
let currentPage = 1;

// 初期処理
document.addEventListener("DOMContentLoaded", init);

async function init() {
    await loadProducts();

    if (!products.length) {
        console.warn("商品データが空です");
        return;
    }

    initializeFilters();
    applyFilters();

    // イベント登録
    document.getElementById("search").addEventListener("input", applyFilters);
    document.getElementById("category").addEventListener("change", applyFilters);
    document.getElementById("manufacturer").addEventListener("change", applyFilters);
    document.getElementById("status").addEventListener("change", applyFilters);
    document.getElementById("sort").addEventListener("change", applyFilters);
}

// JSON読込
async function loadProducts() {
    try {
        const response = await fetch("./data/products.json");

        if (!response.ok) {
            throw new Error("JSONの取得に失敗しました");
        }

        products = await response.json();

        console.log("loaded products:", products);

    } catch (error) {
        console.error(error);
    }
}

// フィルター初期化
function initializeFilters() {
    createOptions("category", products.map(p => p.category));
    createOptions("manufacturer", products.map(p => p.manufacturer));
}

function createOptions(id, list) {
    const select = document.getElementById(id);

    const unique = [...new Set(list)].sort();

    unique.forEach(item => {
        select.innerHTML += `
            <option value="${escapeHtml(item)}">
                ${escapeHtml(item)}
            </option>
        `;
    });
}

// 検索・絞り込み
function applyFilters() {

    const keyword = document.getElementById("search").value.toLowerCase();
    const category = document.getElementById("category").value;
    const manufacturer = document.getElementById("manufacturer").value;
    const status = document.getElementById("status").value;

    filteredProducts = products.filter(product => {

        return (
            (
                product.name.toLowerCase().includes(keyword) ||
                product.manufacturer.toLowerCase().includes(keyword)
            )
            &&
            (!category || product.category === category)
            &&
            (!manufacturer || product.manufacturer === manufacturer)
            &&
            (!status || product.status === status)
        );

    });

    sortProducts();

    currentPage = 1;

    render();
}

// 並び替え
function sortProducts() {

    const sort = document.getElementById("sort").value;

    switch (sort) {

        case "priceAsc":
            filteredProducts.sort((a, b) => a.price - b.price);
            break;

        case "priceDesc":
            filteredProducts.sort((a, b) => b.price - a.price);
            break;

        default:
            filteredProducts.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
    }

}

// 描画
function render() {

    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;

    const pageProducts = filteredProducts.slice(start, end);

    displayProducts(pageProducts);

    document.getElementById("count").textContent = filteredProducts.length;

    renderPagination();

}

// 商品表示
function displayProducts(list) {

    const container = document.getElementById("product-list");

    container.innerHTML = list.map(createCard).join("");

}

// カード生成
function createCard(product) {

    // 一覧で表示する画像
    const image = product.images?.[0] ?? "assets/images/noimage.jpg";

    return `
        <div class="col-xl-3 col-lg-4 col-md-6">

            <div class="card product-card h-100">

                <img
                    src="${escapeHtml(image)}"
                    class="card-img-top"
                    alt="${escapeHtml(product.name)}"
                    onerror="this.src='assets/images/noimage.jpg';">

                <div class="card-body d-flex flex-column">

                    <!-- 価格 + ランク -->
                    <div class="price-area">

                        <div class="price">
                            ¥${product.price.toLocaleString()}
                        </div>

                        <span class="rank-badge rank-${product.rank}">
                            ${escapeHtml(product.rank)}
                        </span>

                    </div>

                    <!-- 商品名 -->
                    <div class="product-name">
                        ${escapeHtml(product.name)}
                    </div>

                    <p class="mt-3">
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

// ページング
function renderPagination() {

    const pagination = document.getElementById("pagination");

    const pageCount = Math.ceil(filteredProducts.length / PAGE_SIZE);

    let html = "";

    for (let i = 1; i <= pageCount; i++) {

        html += `
            <li class="page-item ${i === currentPage ? "active" : ""}">
                <a
                    class="page-link"
                    href="#"
                    onclick="changePage(${i})">

                    ${i}

                </a>
            </li>
        `;

    }

    pagination.innerHTML = html;

}

function changePage(page) {

    currentPage = page;

    render();

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