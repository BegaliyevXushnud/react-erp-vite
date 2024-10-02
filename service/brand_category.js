import https from "./config";

const BrandCategoryService = {
    create: (data) => https.post("/brand-category/create", data),
    get: (params) => https.get("/brand-category/search", { params }),
    update: (id, data) => https.patch(`/brand-category/update/${id}`, data),
    delete: (id) => https.delete(`/brand-category/delete/${id}`)
};

export default BrandCategoryService; // Ensure you're exporting the correct object
