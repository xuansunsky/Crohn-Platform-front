const authKeys = ['token', 'roleId', 'userId', 'nickname']

export const clearAuthSession = () => {
  authKeys.forEach(key => {
    localStorage.removeItem(key)
    sessionStorage.removeItem(key)
  })
  localStorage.removeItem('auth_keep_login')
  sessionStorage.removeItem('auth_keep_login')
}

export const saveAuthSession = (data, keepLogin = false) => {
  clearAuthSession()
  const targetStorage = keepLogin ? localStorage : sessionStorage
  const source = {
    token: data?.token,
    roleId: data?.roleId,
    userId: data?.userId,
    nickname: data?.nickname
  }

  Object.entries(source).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      targetStorage.setItem(key, String(value))
    }
  })
  targetStorage.setItem('auth_keep_login', keepLogin ? '1' : '0')
}

export const getAuthItem = (key) => {
  return localStorage.getItem(key) || sessionStorage.getItem(key) || ''
}

const getAuthStorage = () => {
  if (localStorage.getItem('auth_keep_login') === '1' || localStorage.getItem('token')) {
    return localStorage
  }
  if (sessionStorage.getItem('auth_keep_login') !== null || sessionStorage.getItem('token')) {
    return sessionStorage
  }
  return localStorage
}

export const setAuthItem = (key, value) => {
  localStorage.removeItem(key)
  sessionStorage.removeItem(key)

  if (value !== undefined && value !== null && value !== '') {
    getAuthStorage().setItem(key, String(value))
  }
}

const decodeBase64Url = (value) => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized.padEnd(normalized.length + (4 - normalized.length % 4) % 4, '=')
  return decodeURIComponent(
    atob(padded)
      .split('')
      .map(char => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
      .join('')
  )
}

export const parseJwtPayload = (token) => {
  if (!token || typeof token !== 'string') return null
  const parts = token.split('.')
  if (parts.length < 2) return null

  try {
    return JSON.parse(decodeBase64Url(parts[1]))
  } catch (error) {
    return null
  }
}

export const isTokenExpired = (token) => {
  const payload = parseJwtPayload(token)
  if (!payload || !payload.exp) return true
  return Date.now() >= Number(payload.exp) * 1000
}

export const getValidToken = () => {
  const token = getAuthItem('token')
  if (!token) return ''

  if (isTokenExpired(token)) {
    clearAuthSession()
    return ''
  }

  return token
}

export const isAuthExpiredError = (error) => {
  const status = error?.response?.status
  const data = error?.response?.data
  const message = [
    data?.message,
    data?.error,
    data,
    error?.message
  ].filter(Boolean).join(' ')

  if (status === 401) return true
  if (status !== 403) return false

  return /jwt|token|expired|过期|工牌|认证|unauthorized|forbidden/i.test(message)
}
