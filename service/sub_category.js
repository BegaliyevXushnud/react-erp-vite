import https from "./config";

const Sub_categoryServise = {
  create: (data) => https.post("/sub-category/create", data),
  get: (parent_id, params) => https.get(`/sub-category/search/${parent_id}`, { params }),  
  update: (id, data) => https.patch(`/sub-category/update/${id}`, data),
  delete: (id) => https.delete(`/sub-category/delete/${id}`)
};

export default Sub_categoryServise;
