const API_BASE = "http://127.0.0.1:8000";
document.addEventListener("DOMContentLoaded", loadCart);
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
async function loadCart() {

    const cart = getCart();

    const res = await fetch(
        `${API_BASE}/api/products?ver=${Date.now()}`,
        {
            cache: "no-store"
        }
    );

    const products = await res.json();

    const area = document.getElementById("cart-items");

    let total = 0;

    if (cart.length === 0) {

        area.innerHTML = `
            <div class="alert alert-secondary">
                カートは空です。
            </div>
        `;

        document.getElementById("cart-total").innerText = "¥0";

        return;
    }

    area.innerHTML = "";

    cart.forEach((item, index) => {

        const product = products.find(p => p.id == item.id);

        if (!product) return;

        const image = product.images?.[0] || "assets/images/noimage.jpg";

        total += product.price;

        area.innerHTML += `

<div class="card mb-4 shadow-sm">

    <div class="row g-0">

        <div class="col-md-3">

            <img
                src="${escapeHtml(image)}"
                class="img-fluid rounded-start"
                alt="${escapeHtml(product.name)}"
                onerror="this.src='assets/images/noimage.jpg';">

        </div>

        <div class="col-md-9">

            <div class="card-body">

                <h4>
                    ${escapeHtml(product.name)}
                </h4>

                <p class="text-muted">

                    サイズ：
                    ${item.size || "-"}

                </p>

                <p>

                    価格：
                    ¥${product.price.toLocaleString()}

                </p>

                <h5 class="text-danger">

                    小計：
                    ¥${product.price.toLocaleString()}

                </h5>

                <button
                    class="btn btn-outline-danger mt-3"
                    onclick="removeItem(${index})">

                    カートから削除

                </button>

            </div>

        </div>

    </div>

</div>

`;

    });


    document.getElementById("cart-total").innerText =
        "¥" + total.toLocaleString();

}

function removeItem(index) {

    const cart = getCart();

    cart.splice(index, 1);

    saveCart(cart);

    loadCart();

}

function getCart() {

    const cookie = document.cookie
        .split("; ")
        .find(row => row.startsWith("cart="));

    if (!cookie) {

        return [];

    }

    return JSON.parse(
        decodeURIComponent(cookie.split("=")[1])
    );

}

function saveCart(cart) {

    document.cookie =
        "cart=" +
        encodeURIComponent(JSON.stringify(cart)) +
        ";path=/;max-age=2592000";

}