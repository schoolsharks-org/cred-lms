import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

const userApi = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL + "/users",
  withCredentials: true,
});

// Request interceptor to attach the accessToken from localStorage to the Authorization header
userApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token storage and refresh
userApi.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    // Store the accessToken and refreshToken in localStorage when received
    if (response.data.accessToken && response.data.refreshToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token using the refreshToken stored in localStorage
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token available');

        const { data } = await axios.post<Tokens>(
          `${import.meta.env.VITE_BACKEND_BASE_URL}/users/refresh-token`,
          {},
          { withCredentials: true }
        );

        // Update tokens in localStorage
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);

        // Attach the new accessToken to the original request and retry it
        userApi.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;

        return userApi(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token failed', refreshError);
        // Optionally clear tokens from localStorage if refresh fails
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    }

    return Promise.reject(error);
  }
);

export default userApi;
