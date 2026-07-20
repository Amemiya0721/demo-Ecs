const descriptionArea = document.getElementById("description-area");

document.addEventListener("DOMContentLoaded", () => {

    addSection();

    document
        .getElementById("addSection")
        .addEventListener("click", addSection);

    document
        .getElementById("productForm")
        .addEventListener("submit", submitForm);

});

function addSection() {

    const div = document.createElement("div");

    div.className = "card p-3 mb-3";

    div.innerHTML = `

        <div class="mb-2">

            <label class="form-label">見出し</label>

            <input
                class="form-control heading">

        </div>

        <div class="mb-2">

            <label class="form-label">内容</label>

            <textarea
                rows="4"
                class="form-control body"></textarea>

        </div>

        <button
            type="button"
            class="btn btn-outline-danger remove">

            削除

        </button>

    `;

    div.querySelector(".remove").onclick = () => div.remove();

    descriptionArea.appendChild(div);

}

function submitForm(e) {

    e.preventDefault();

    const descriptions = [];

    document.querySelectorAll("#description-area .card")
        .forEach(card => {

            descriptions.push({

                heading: card.querySelector(".heading").value,

                body: card.querySelector(".body").value

            });

        });

    const product = {

        id: crypto.randomUUID(),

        name: document.getElementById("name").value,

        price: Number(document.getElementById("price").value),

        category: document.getElementById("category").value,

        manufacturer: document.getElementById("manufacturer").value,

        rank: document.getElementById("rank").value,

        status: document.getElementById("status").value,

        description: descriptions,

        thumbnail: "",

        images: [],

        createdAt: new Date().toISOString().slice(0,10),

        updatedAt: new Date().toISOString().slice(0,10)

    };

    console.log(product);

    alert("JSONを生成しました。");

}