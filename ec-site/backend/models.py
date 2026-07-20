from pydantic import BaseModel


class Condition(BaseModel):
    rank: str
    junk: bool
    text: str
    notes: list[str]


class Spec(BaseModel):
    weight: str
    speed: str
    material: str


class Description(BaseModel):
    heading: str
    body: str


class Product(BaseModel):
    id: int
    name: str
    category: str
    manufacturer: str
    year: str
    price: int

    condition: Condition
    spec: Spec
    description: list[Description]

    status: str
    bundleEligible: bool
    shippingSize: str

    images: list[str]

    favoriteCount: int

    createdAt: str
    updatedAt: str