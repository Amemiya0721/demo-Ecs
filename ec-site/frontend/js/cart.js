document.addEventListener("DOMContentLoaded", loadCart);

async function loadCart() {

    const cart = getCart();

    const res = await fetch("./data/products.json");
    const products = await res.json();

    const area = document.getElementById("cart-items");

    let total = 0;

    if (cart.length === 0) {

        area.innerHTML = `
            <div class="alert alert-secondary">
                カートは空です。
            </div>
        `;

        return;
    }

    area.innerHTML = "";

    cart.forEach(item => {

        const product = products.find(p => p.id === item.id);

        if (!product) return;

        const subtotal = product.price * item.qty;

        total += subtotal;

        area.innerHTML += `

        <div class="card mb-3">

            <div class="row g-0">

                <div class="col-md-3">

                    <img
                        src="${product.thumbnail}"
                        class="img-fluid rounded-start">

                </div>

                <div class="col-md-9">

                    <div class="card-body">

                        <h5>${product.name}</h5>

                        <p>数量：${item.qty}</p>

                        <p>価格：¥${product.price.toLocaleString()}</p>

                        <h5 class="text-danger">
                            ¥${subtotal.toLocaleString()}
                        </h5>

                    </div>

                </div>

            </div>

        </div>

        `;

    });

    document.getElementById("cart-total").innerText =
        "¥" + total.toLocaleString();

}

// Cookie取得
function getCart() {

    const cookie = document.cookie
        .split("; ")
        .find(row => row.startsWith("cart="));

    if (!cookie) {
        return [];
    }

    return JSON.parse(decodeURIComponent(cookie.split("=")[1]));

}