import axios from 'axios';

// const PROVINCES_BASE_URL = 'https://provinces.open-api.vn/api/';

const BACKEND_BASE_URL = 'https://e-learming-be.onrender.com/';

export const host = BACKEND_BASE_URL;

// Tạo một instance Axios với cấu hình mặc định
const api = axios.create({
  baseURL: BACKEND_BASE_URL,
  timeout: 10000, // Thời gian chờ tối đa cho mỗi yêu cầu là 10 giây
  headers: {
    'Content-Type': 'application/json',
    // Các headers khác nếu cần
  }
});

// Hàm interceptor để xử lý các lỗi hoặc các yêu cầu trước khi gửi đi
api.interceptors.request.use(
  (config) => {
    // Thực hiện bất kỳ xử lý nào trước khi gửi yêu cầu
    return config;
  },
  (error) => {
    // Xử lý lỗi nếu có
    return Promise.reject(error);
  }
);

// Hàm interceptor để xử lý các phản hồi từ server
api.interceptors.response.use(
  (response) => {
    // Xử lý dữ liệu phản hồi trước khi trả về cho caller
    return response;
  },
  (error) => {
    // Xử lý lỗi từ server
    return Promise.reject(error);
  }
);

export default api;
