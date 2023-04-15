export interface ProductType {
    id: string;
    name: string;
    brand: string;
    price: number;
    expirationDate: string;
    description: string;
}

export interface CartType {
    id: string;
    finalPrice: number;
    userId: string;
    createdAt: string;
    updatedAt?: string;
    status: "P" | "B" | "E";
    addedProducts: ProductType[];
}