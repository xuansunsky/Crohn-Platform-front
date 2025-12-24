import axios from 'axios'
import router from '@/router' // 确保路径对

// 1. 创建一个 axios 实例
const service = axios.create({
    baseURL: '/api', // 你的后端接口前缀
    timeout: 5000    // 请求超时时间
})

// 2. 【请求拦截器】：这里就是自动带 Token 的地方！
service.interceptors.request.use(
    config => {
        // 从浏览器缓存里拿 Token
        const token = localStorage.getItem('token')

        if (token) {
            // 如果有 Token，就把它塞进请求头里
            // 注意：后端写的是 "Bearer " (有个空格)，前端这里要拼对
            config.headers['Authorization'] = 'Bearer ' + token
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

// 3. 【响应拦截器】：处理后端返回的 401 等错误
service.interceptors.response.use(
    response => {
        // 如果后端返回 200，直接把数据剥一层皮返回，方便使用
        return response.data
    },
    error => {
        // 如果后端返回 401 (未授权)，说明 Token 过期或假的
        if (error.response && error.response.status === 401) {
            // 清掉脏 Token
            localStorage.removeItem('token')
            // 踢回登录页
            router.push('/login2')
        }
        return Promise.reject(error)
    }
)

export default service