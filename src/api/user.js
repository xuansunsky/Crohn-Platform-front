import http from './http'

export function registerUser(payload) {
  return http.post('/users/register', payload)
}

export function loginUser(payload) {
  return http.post('/users/login', payload)
}

export function getAllUsers() {
  return http.get('/users/all')
}

export function updaterole(payload) {
  return http.post('/users/updateRole', payload)
}