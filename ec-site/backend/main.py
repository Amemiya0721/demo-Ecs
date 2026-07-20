from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from datetime import date

from database import load_products, save_products

import json
import os
import re
import shutil

app = FastAPI()

# ======================================
# CORS
# ======================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ======================================
# 保存先
# ======================================

BASE_DIR = os.path.dirname(__file__)

IMAGE_ROOT = os.path.abspath(
    os.path.join(
        BASE_DIR,
        "../frontend/assets/products"
    )
)

# ======================================
# フォルダ名を安全にする
# ======================================

def sanitize_folder_name(name: str):

    name = re.sub(r'[\\/:*?"<>|]', "", name)
    name = re.sub(r"\s+", "_", name.strip())

    return name

# ======================================
# 商品一覧
# ======================================

@app.get("/api/products")
def get_products():

    return load_products()

# ======================================
# 商品詳細
# ======================================

@app.get("/api/products/{product_id}")
def get_product(product_id: int):

    products = load_products()

    for product in products:

        if product["id"] == product_id:
            return product

    return {
        "message": "商品が見つかりません"
    }

# ======================================
# 商品追加
# ======================================

@app.post("/api/products")
async def create_product(

    product: str = Form(...),

    images: list[UploadFile] = File([])

):

    products = load_products()

    data = json.loads(product)

    # ------------------------
    # ID採番
    # ------------------------

    next_id = max(
        (p["id"] for p in products),
        default=0
    ) + 1

    today = str(date.today())

    # ------------------------
    # 商品フォルダ
    # ------------------------

    folder_name = (
        f"{next_id:06d}_"
        f"{sanitize_folder_name(data['name'])}"
    )

    product_folder = os.path.join(
        IMAGE_ROOT,
        folder_name
    )

    os.makedirs(
        product_folder,
        exist_ok=True
    )

    # ------------------------
    # 画像保存
    # ------------------------

    image_paths = []

    for index, image in enumerate(images, start=1):

        ext = os.path.splitext(
            image.filename
        )[1]

        filename = f"{index}{ext}"

        save_path = os.path.join(
            product_folder,
            filename
        )

        with open(save_path, "wb") as buffer:

            shutil.copyfileobj(
                image.file,
                buffer
            )

        image_paths.append(
            f"assets/products/{folder_name}/{filename}"
        )

    # ------------------------
    # 商品データ
    # ------------------------

    new_product = {

        "id": next_id,

        "name": data["name"],

        "category": data["category"],

        "manufacturer": data["manufacturer"],

        "year": data.get("year", ""),

        "price": int(data["price"]),

        "condition": {

            "rank": data.get("rank", "B"),

            "junk": data.get("junk", False),

            "text": data.get(
                "conditionText",
                ""
            ),

            "notes": []

        },

        "spec": {

            "weight": "",

            "speed": "",

            "material": ""

        },

        "description": [

            {

                "heading": "商品状態",

                "body": ""

            }

        ],

        "status": "available",

        "bundleEligible": True,

        "shippingSize": "small",

        "images": image_paths,

        "favoriteCount": 0,

        "createdAt": today,

        "updatedAt": today

    }

    products.append(new_product)

    save_products(products)

    return {

        "message": "登録しました",

        "product": new_product

    }