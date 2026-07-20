// =====================================
// OVERHAUL
// product-new.js
// =====================================

const API_BASE = "http://127.0.0.1:8000";

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("productForm");

    form.addEventListener("submit", submitProduct);

});

async function submitProduct(e) {

    e.preventDefault();

    // 商品データ
    const product = {

        name: document.getElementById("name").value.trim(),

        category: document.getElementById("category").value,

        manufacturer: document.getElementById("manufacturer").value.trim(),

        year: document.getElementById("year").value.trim(),

        price: Number(
            document.getElementById("price").value
        ),

        rank: document.getElementById("rank").value,

        junk: document.getElementById("junk").checked,

        conditionText:
            document.getElementById("conditionText").value

    };

    // FormData作成
    const formData = new FormData();

    formData.append(
        "product",
        JSON.stringify(product)
    );

    // 画像（複数）
    const files =
        document.getElementById("images")?.files;

    if (files) {

        for (const file of files) {

            formData.append(
                "images",
                file
            );

        }

    }

    try {

        const res = await fetch(
            `${API_BASE}/api/products`,
            {
                method: "POST",
                body: formData
            }
        );

        if (!res.ok) {

            throw new Error("登録失敗");

        }

        const data = await res.json();

        alert("商品を登録しました。");

        console.log(data);

        location.href = "admin.html";

    } catch (err) {

        console.error(err);

        alert("登録に失敗しました。");

    }

}