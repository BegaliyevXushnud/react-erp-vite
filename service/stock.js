import https from "./config";

const stockServise = {
  create: (data) => https.post("/stock/create", data),
  getAll: () => https.get("/stock"),
  getByBrand: (id) => https.get(`/stock/brand/${id}`),
  getById: (id) => https.get(`/stock/${id}`),
  update: (id, data) => https.patch(`/stock/update/${id}`, data),
  delete: (id) => https.delete(`/stock/delete/${id}`)
};

export default stockServise;
