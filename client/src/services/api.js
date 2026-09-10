import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Needed to send and receive HttpOnly cookies
});

// Interceptor to attach JWT token to admin requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Response interceptor to handle 401 Unauthorized errors via refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If it's a 401, not a retry, and not the login or refresh endpoint itself
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/admin/refresh') && !originalRequest.url.includes('/admin/login')) {
      originalRequest._retry = true;
      
      try {
        const refreshRes = await api.post('/admin/refresh');
        
        if (refreshRes.data.success) {
          const newToken = refreshRes.data.data.access_token;
          localStorage.setItem('token', newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed (e.g. refresh token expired or revoked)
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/admin'; // Redirect to login
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// ----------------- AUTH -----------------
export const loginApi = async (email, password) => {
  const response = await api.post('/admin/login', { email, password });
  return response.data;
};

export const getProfileApi = async () => {
  const response = await api.get('/admin/me');
  return response.data;
};

// ----------------- PORTFOLIO (NO IMAGE) -----------------
export const getPortfolioApi = async (category = '') => {
  const response = await api.get('/portfolio', { params: { category } });
  return response.data;
};

export const createPortfolioApi = async (data) => {
  const response = await api.post('/admin/portfolio', data);
  return response.data;
};

export const updatePortfolioApi = async (id, data) => {
  const response = await api.put(`/admin/portfolio/${id}`, data);
  return response.data;
};

export const deletePortfolioApi = async (id) => {
  const response = await api.delete(`/admin/portfolio/${id}`);
  return response.data;
};

// ----------------- TEAM (WITH CLOUDINARY) -----------------
export const getTeamApi = async () => {
  const response = await api.get('/team');
  return response.data;
};

export const createTeamApi = async (data) => {
  const response = await api.post('/admin/team', data);
  return response.data;
};

export const updateTeamApi = async (id, data) => {
  const response = await api.put(`/admin/team/${id}`, data);
  return response.data;
};

export const deleteTeamApi = async (id) => {
  const response = await api.delete(`/admin/team/${id}`);
  return response.data;
};

// ----------------- TESTIMONIALS -----------------
export const getPublishedTestimonialsApi = async () => {
  const response = await api.get('/testimonials');
  return response.data;
};

export const submitTestimonialApi = async (data) => {
  const response = await api.post('/testimonials/submit', data);
  return response.data;
};

export const getAllTestimonialsAdminApi = async (status = '') => {
  const response = await api.get('/admin/testimonials/admin', { params: { status } });
  return response.data;
};

export const togglePublishTestimonialApi = async (id, status, isPublished) => {
  const response = await api.patch(`/admin/testimonials/${id}/publish`, {
    status,
    is_published: isPublished,
  });
  return response.data;
};

export const deleteTestimonialApi = async (id) => {
  const response = await api.delete(`/admin/testimonials/${id}`);
  return response.data;
};

// ----------------- BLOG / NEWS -----------------
export const getPublishedBlogsApi = async () => {
  const response = await api.get('/blog-news');
  return response.data;
};

export const getBlogBySlugApi = async (slug) => {
  const response = await api.get(`/blog-news/${slug}`);
  return response.data;
};

export const getAllBlogsAdminApi = async () => {
  const response = await api.get('/admin/blog-news');
  return response.data;
};

export const createBlogApi = async (data) => {
  const response = await api.post('/admin/blog-news', data);
  return response.data;
};

export const updateBlogApi = async (id, data) => {
  const response = await api.put(`/admin/blog-news/${id}`, data);
  return response.data;
};

export const deleteBlogApi = async (id) => {
  const response = await api.delete(`/admin/blog-news/${id}`);
  return response.data;
};

export const togglePublishBlogApi = async (id) => {
  const response = await api.patch(`/admin/blog-news/${id}/publish`);
  return response.data;
};

// ----------------- AI KNOWLEDGE BASE -----------------
export const getAIKnowledgeApi = async () => {
  const response = await api.get('/admin/ai-knowledge');
  return response.data;
};

export const updateAIKnowledgeApi = async (content) => {
  const response = await api.put('/admin/ai-knowledge', { content });
  return response.data;
};

// ----------------- CONTACT -----------------
export const submitContactApi = async (data) => {
  const response = await api.post('/contacts', data);
  return response.data;
};

// ----------------- AI CHATBOT -----------------
export const askChatbotApi = async (message, history = []) => {
  const response = await api.post('/chat', { message, history });
  return response.data;
};

// ----------------- CLOUDINARY UPLOAD -----------------
export const uploadImageApi = async (file, entityType = 'general', entityId = '') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('entity_type', entityType);
  if (entityId) formData.append('entity_id', entityId);

  const response = await api.post('/admin/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 3000, // 3-second timeout to prevent hanging
  });
  return response.data;
};

export default api;
