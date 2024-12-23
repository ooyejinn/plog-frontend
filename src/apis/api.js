import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getCookie, setCookie, eraseCookie } from '../utils/cookieUtils';
import useAuthStore from '../stores/member';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const API = axios.create({
  baseURL: API_BASE_URL,
});

// 토큰 인터셉터
API.interceptors.request.use(
  (config) => {
    const accessToken = getCookie('accessToken');

    if (accessToken) {
      config.headers.Authorization = accessToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// 리프레시 토큰 확인
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 엑세스 토큰 만료시
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 리프레시 토큰 있으면 엑세스 토큰 다시 저장
        const refreshToken = getCookie('refreshToken');
        const refreshTokenResponse = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
        const newAccessToken = refreshTokenResponse.data.split(' : ')[1];
        setCookie('accessToken', newAccessToken, 60); // 새로운 엑세스 토큰 1시간 유효
        originalRequest.headers.Authorization = newAccessToken;
        return axios(originalRequest);
      } catch (refreshError) {
        // 만료됐으면 로그인 페이지로 이동
        eraseCookie('accessToken');
        eraseCookie('refreshToken');
        useAuthStore.getState().clearToken();
        useNavigate()('/login');
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default API;
