import https from "/service/config.js";

const ProductDetailService = {
    create: (data) => https.post("/product-detail/create", data),
    get: (productId) => https.get(`/product-detail/${productId}`),
    update: (id, data) => https.patch(`/product-detail/update/${id}`, data),
    delete: (id) => https.delete(`/product-detail/delete/${id}`)
};

export default ProductDetailService;
