import axios from "axios";

const axiosClient = axios.create({
    baseURL: `${import.meta.env.VITE_BASE_API_URL}/api`,
    headers: {
        "Content-Type": "application/json",
    },
});
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    config.headers.Authorization = `Bearer ${token}`;
    return config; 
})
axiosClient.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        window.location.href = "/Login";
      }
    } else {
      console.error("Network or CORS error", error);
    }
    return Promise.reject(error);
});

export default axiosClient;