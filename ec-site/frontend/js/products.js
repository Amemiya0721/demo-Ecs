// =====================================
// OVERHAUL
// products.js
// =====================================
const API_BASE = "http://127.0.0.1:8000";

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

    // フィルター初期化
    initializeFilters();

    // URLパラメータ反映
    initializeQuery();

    // イベント登録
    registerEvents();

    // 初回描画
    applyFilters();

}

function initializeQuery() {

    const params = new URLSearchParams(window.location.search);

    const category = params.get("category");
    const manufacturer = params.get("manufacturer");
    const status = params.get("status");

    if (category) {
        document.getElementById("category").value = category;
    }

    if (manufacturer) {
        document.getElementById("manufacturer").value = manufacturer;
    }

    if (status) {
        document.getElementById("status").value = status;
    }

}

function registerEvents() {

    document.getElementById("search")
        .addEventListener("input", applyFilters);

    document.getElementById("category")
        .addEventListener("change", applyFilters);

    document.getElementById("manufacturer")
        .addEventListener("change", applyFilters);

    document.getElementById("status")
        .addEventListener("change", applyFilters);

    document.getElementById("sort")
        .addEventListener("change", applyFilters);

}

// JSON読込
async function loadProducts() {

    try {

        const response = await fetch(
            `${API_BASE}/api/products?ver=${Date.now()}`,
            {
                cache: "no-store"
            }
        );


        if (!response.ok) {

            throw new Error(
                "JSONの取得に失敗しました"
            );

        }


        const data = await response.json();


        products = Array.isArray(data)
            ? data
            : [data];


        console.log(
            "loaded products:",
            products
        );


    } catch (error) {

        console.error(error);

        products = [];

    }

}

// フィルター初期化
function initializeFilters() {

    createOptions(
        "category",
        products.map(p => p.category)
    );


    createOptions(
        "manufacturer",
        products.map(p => p.manufacturer)
    );


    createOptions(
        "year",
        products.map(p => p.year)
    );

}

function createOptions(id, list) {

    const select = document.getElementById(id);


    if (!select) {
        return;
    }


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
                product.name.toLowerCase().includes(keyword)
                ||
                product.manufacturer.toLowerCase().includes(keyword)
                ||
                product.condition?.text?.toLowerCase().includes(keyword)
                ||
                (
                    product.condition?.junk &&
                    "ジャンク".includes(keyword)
                )
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

    const image =
        product.images &&
            product.images.length > 0
            ? product.images[0]
            : "assets/images/noimage.jpg";

    const sold = product.status === "sold";
    const reserved = product.status === "reserved";

    return `
        <div class="col-xl-3 col-lg-4 col-md-6">

            <div class="card product-card h-100 position-relative">

    ${sold
            ? `<span class="status-badge sold">SOLD</span>`
            : reserved
                ? `<span class="status-badge reserved">HOLD</span>`
                : ""
        }

                <img
                    src="${escapeHtml(image)}"
                    class="card-img-top"
                    alt="${escapeHtml(product.name)}"
                    onerror="
                            this.onerror=null;
                            this.src='assets/images/noimage.jpg';
                        ">

                <div class="card-body d-flex flex-column">

                    <!-- 価格 + ランク -->
                    <div class="price-area">

                        <div class="price">
                            ¥${Number(product.price).toLocaleString()}
                        </div>

 <div class="condition-area">

<span class="condition-badge">
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
</div>
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
                        class="btn ${sold ? "btn-secondary disabled" : "btn-dark"} mt-auto">

                        ${sold
            ? "売り切れ"
            : reserved
                ? "入金待ち"
                : "詳細を見る"
        }
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