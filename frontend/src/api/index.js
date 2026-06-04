import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sat_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('sat_token')
      localStorage.removeItem('sat_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const authApi = {
  login:    (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
}

export const userApi = {
  me:            ()     => api.get('/user/me'),
  progress:      ()     => api.get('/user/progress'),
  updateProfile: (data) => api.put('/user/profile', data),
}

export const examApi = {
  questions: (subject) => api.get(`/exam/questions/${subject}`),
  submit:    (data)    => api.post('/exam/submit', data),
}

export const aiApi = {
  chat:         (message) => api.post('/ai/chat', { message }),
  history:      ()        => api.get('/ai/history'),
  clearHistory: ()        => api.delete('/ai/history'),
}

export const uniApi = {
  list: () => api.get('/universities'),
}

export default api
