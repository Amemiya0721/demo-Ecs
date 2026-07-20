// =====================================
// OVERHAUL
// admin.js
// =====================================

const API_BASE = "http://127.0.0.1:8000";

let products = [];
let filteredProducts = [];

// 初期処理
document.addEventListener("DOMContentLoaded", init);

async function init() {

    await loadProducts();

    registerEvents();

    applyFilter();

}

//==============================
// イベント
//==============================

function registerEvents() {

    document
        .getElementById("search")
        .addEventListener("input", applyFilter);

    document
        .getElementById("sort")
        .addEventListener("change", applyFilter);

}

//==============================
// 商品取得
//==============================

async function loadProducts() {

    try {

        const res = await fetch(
            `${API_BASE}/api/products?ver=${Date.now()}`,
            {
                cache: "no-store"
            }
        );

        if (!res.ok) {
            throw new Error("商品取得失敗");
        }

        products = await res.json();

    } catch (e) {

        console.error(e);

        products = [];

    }

}

//==============================
// 検索
//==============================

function applyFilter() {

    const keyword = document
        .getElementById("search")
        .value
        .toLowerCase();

    filteredProducts = products.filter(product => {

        return (

            product.name.toLowerCase().includes(keyword)

            ||

            product.manufacturer.toLowerCase().includes(keyword)

            ||

            product.category.toLowerCase().includes(keyword)

        );

    });

    sortProducts();

    renderTable();

}

//==============================
// 並び替え
//==============================

function sortProducts() {

    const sort = document.getElementById("sort").value;

    switch (sort) {

        case "priceAsc":

            filteredProducts.sort(
                (a, b) => a.price - b.price
            );

            break;

        case "priceDesc":

            filteredProducts.sort(
                (a, b) => b.price - a.price
            );

            break;

        default:

            filteredProducts.sort(
                (a, b) =>
                    new Date(b.createdAt) -
                    new Date(a.createdAt)
            );

    }

}

//==============================
// 描画
//==============================

function renderTable() {

    const tbody = document.getElementById("productTable");

    tbody.innerHTML = filteredProducts
        .map(createRow)
        .join("");

    document.getElementById("count").textContent =
        filteredProducts.length;

}

//==============================
// 1行生成
//==============================

function createRow(product) {

    const image =
        product.images?.[0] ??
        "assets/images/noimage.jpg";

    return `

<tr>

<td>

${product.id}

</td>

<td>

<img
src="${image}"
class="rounded border"
style="width:70px;height:70px;object-fit:cover;"
onerror="this.src='assets/images/noimage.jpg'">

</td>

<td>

${escapeHtml(product.name)}

</td>

<td>

${escapeHtml(product.manufacturer)}

</td>

<td>

${escapeHtml(product.category)}

</td>

<td class="text-end">

¥${Number(product.price).toLocaleString()}

</td>

<td class="text-center">

<span class="badge bg-secondary">

${escapeHtml(product.condition?.rank ?? "-")}

</span>

${product.condition?.junk
            ?
            `<span class="badge bg-danger ms-1">
JUNK
</span>`
            :
            ""
        }

</td>

<td class="text-center">

${getStatusBadge(product.status)}

</td>

<td>

<a
href="product-edit.html?id=${product.id}"
class="btn btn-outline-primary btn-sm">

編集

</a>

<button
class="btn btn-outline-danger btn-sm"
onclick="deleteProduct(${product.id})">

削除

</button>

</td>

</tr>

`;

}

//==============================
// ステータス表示
//==============================

function getStatusBadge(status) {

    switch (status) {

        case "available":

            return `
<span class="badge bg-success">
販売中
</span>`;

        case "reserved":

            return `
<span class="badge bg-warning text-dark">
予約中
</span>`;

        case "sold":

            return `
<span class="badge bg-dark">
売却済
</span>`;

        default:

            return `
<span class="badge bg-secondary">
不明
</span>`;

    }

}

//==============================
// 削除
//==============================

async function deleteProduct(id) {

    if (!confirm("この商品を削除しますか？")) {

        return;

    }

    alert("次にDELETE APIを接続します。\nID：" + id);

}

//==============================
// HTMLエスケープ
//==============================

function escapeHtml(str) {

    if (str == null) {

        return "";

    }

    return String(str).replace(/[&<>"']/g, c => ({

        "&": "&amp;",

        "<": "&lt;",

        ">": "&gt;",

        "\"": "&quot;",

        "'": "&#39;"

    }[c]));

}