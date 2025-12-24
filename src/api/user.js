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
