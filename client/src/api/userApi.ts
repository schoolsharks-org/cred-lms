import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

const userApi = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL+"/users",
  withCredentials: true,
});

userApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

userApi.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await axios.post<Tokens>(
          `${import.meta.env.VITE_BACKEND_BASE_URL}/users/refresh-token`,
          {},
          { withCredentials: true }
        );

        userApi.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;

        return userApi(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token failed', refreshError);
      }
    }

    return Promise.reject(error);
  }
);


export default userApi