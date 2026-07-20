import json
import os

DATA_FILE = "data/products.json"


# 商品一覧読み込み
def load_products():

    if not os.path.exists(DATA_FILE):
        return []

    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


# 商品一覧保存
def save_products(products):

    os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)

    with open(DATA_FILE, "w", encoding="utf-8") as f:

        json.dump(
            products,
            f,
            ensure_ascii=False,
            indent=4
        )