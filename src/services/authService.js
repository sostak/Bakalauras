import axios from 'axios';

const API_URL = 'http://localhost:5084/api/auth';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Create a separate instance for auth endpoints that don't need token
const authApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor for CORS and auth token
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.refreshToken) {
          const response = await api.post('/refresh', {
            refreshToken: user.refreshToken
          });

          if (response.data?.accessToken) {
            const newUserData = {
              token: response.data.accessToken,
              refreshToken: response.data.refreshToken
            };
            localStorage.setItem('user', JSON.stringify(newUserData));
            originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        // If refresh token fails, logout user
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

const authService = {
  login: async (email, password) => {
    try {
      console.log('Attempting login with:', { email });
      
      // Clear any existing user data
      localStorage.removeItem('user');
      
      const response = await authApi.post('/login', {
        email,
        password
      });
      
      console.log('Login response:', response.data);
      
      if (response.data && response.data.accessToken) {
        const userData = {
          token: response.data.accessToken,
          refreshToken: response.data.refreshToken
        };
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
      }
      
      throw new Error('Invalid response format from server');
    } catch (error) {
      console.error('Login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
        config: error.config
      });
      
      if (error.response?.status === 401) {
        throw new Error('Invalid email or password');
      }
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Network error. Please check if the backend server is running.');
      }
      throw new Error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  },

  register: async (userData) => {
    try {
      console.log('Attempting registration with:', { 
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email 
      });
      
      const response = await authApi.post('/register', {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password
      });
      
      console.log('Registration response:', response.data);
      
      if (response.data && response.data.accessToken) {
        const userData = {
          token: response.data.accessToken,
          refreshToken: response.data.refreshToken
        };
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
      }
      
      throw new Error('Invalid response format from server');
    } catch (error) {
      console.error('Registration error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (error.response?.status === 400) {
        throw new Error(error.response.data.message || 'Invalid registration data');
      }
      throw new Error(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  },

  getCurrentUserInfo: async () => {
    try {
      const response = await api.get('/current-user');
      return response.data;
    } catch (error) {
      console.error('Get user info error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to get user info');
    }
  },

  updateUser: async (userId, updateData) => {
    try {
      const response = await api.put(`/users/${userId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Update user error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to update user');
    }
  },

  // Admin only endpoints
  getAllUsers: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      console.error('Get all users error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to get users');
    }
  },

  getAllCustomers: async () => {
    try {
      const response = await api.get('/customers');
      return response.data;
    } catch (error) {
      console.error('Error getting customers:', error);
      throw new Error(error.response?.data?.message || 'Failed to get customers');
    }
  },

  getAllMechanics: async () => {
    try {
      const response = await api.get('/mechanics');
      return response.data;
    } catch (error) {
      console.error('Error getting mechanics:', error);
      throw new Error(error.response?.data?.message || 'Failed to get mechanics');
    }
  },

  getCustomerById: async (userId) => {
    try {
      const response = await api.get(`/customers/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Get customer error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to get customer');
    }
  },

  getMechanicById: async (userId) => {
    try {
      const response = await api.get(`/mechanics/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Get mechanic error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to get mechanic');
    }
  },

  changeUserRole: async (userId, newRole, additionalData = {}) => {
    try {
      const response = await api.post(`/change-role/${userId}`, {
        role: newRole,
        mechanicDetails: {
          specialization: additionalData.specialization,
          experienceLevel: additionalData.experienceLevel
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error changing user role:', error);
      throw new Error(error.response?.data?.message || 'Failed to change user role');
    }
  },

  updateMechanic: async (mechanicId, updateData) => {
    try {
      const response = await api.put(`/mechanics/${mechanicId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating mechanic:', error);
      throw new Error(error.response?.data?.message || 'Failed to update mechanic');
    }
  }
};

export default authService; 