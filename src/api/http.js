import axios from 'axios'
import router from '@/router'

const service = axios.create({
  baseURL: '/api',
  timeout: 5000
})

service.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')

    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      router.push('/login2')
    }
    return Promise.reject(error)
  }
)

export default service