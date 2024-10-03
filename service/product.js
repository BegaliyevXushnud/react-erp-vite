import https from "/service/config.js";

const Product = {
    create: (data) => https.post("/products/create", data),
    // `params` parametrini qo'shish
    get: (params) => https.get("/products/search", { params }), // URL parametrlarini ulash
    update: (id, data) => https.patch(`/products/update/${id}`, data),
    delete: (id) => https.delete(`/products/delete/${id}`),
};

export default Product;
