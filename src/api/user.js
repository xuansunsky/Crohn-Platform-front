// src/api/user.js
import http from './http'

// 注册
export function registerUser(payload) {
    return http.post('/users/register', payload)
}

// 登录（你后面要做的话可以预留）
export function loginUser(payload) {
    return http.post('/users/login', payload)
}
// 🔍 巡视名册 (ADMIN 专用)
export function getAllUsers() {
    return http.get('/users/all') // 这里的 http 就是你那个带拦截器的 service
}

// ⚒️ 授予/剥夺勋章
export function updaterole(payload) {
    return http.post('/users/updateRole', payload)
}