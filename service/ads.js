import https from './config'; // Config faylingizni import qiling

const adsService = {
    create: (data) => https.post('/ads/create', data), // Yangi e'lon yaratish
    getAll: () => https.get('/ads'), // Barcha e'lonlarni olish
    getById: (id) => https.get(`/ads/${id}`), // E'lonni ID bo'yicha olish
    update: (id, data) => https.put(`/ads/update/${id}`, data), // E'lonni yangilash
    delete: (id) => https.delete(`/ads/delete/${id}`), // E'lonni o'chirish
};

export default adsService;
