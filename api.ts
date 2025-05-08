import axios from "axios";
import { jwtDecode } from "jwt-decode";

// Kiểm tra accessToken có hết hạn không
export const URL_IMAGE = "http://localhost:8081/uploads/";
const checkExpiredToken = (token: string | null): boolean => {
  if (!token) return false;
  const decoded: any = jwtDecode(token);
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

// Tạo instance axios
const instance = axios.create({
  baseURL: "http://localhost:8081/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});
instance.interceptors.request.use(
  async (config) => {
    const url = config.url || "";

    // Chỉ kiểm tra token nếu URL KHÔNG chứa 'auth'
    if (!url.includes("auth")) {
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return Promise.reject(new Error("No token available"));
      }

      if (checkExpiredToken(token)) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return Promise.reject(new Error("Token expired"));
      }

      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
