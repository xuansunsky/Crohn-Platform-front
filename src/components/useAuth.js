import { ref } from 'vue'

export function useAuth() {
  const currentUserId = ref(null)
  const isAdmin = ref(false)

  const initAuth = () => {
    const storedId = localStorage.getItem('userId')
    const storedRole = localStorage.getItem('roleId')

    if (storedId) {
      currentUserId.value = Number(storedId)
    }
    if (storedRole === '1') {
      isAdmin.value = true
    }
  }

  const checkPermission = (authorId) => {
    if (isAdmin.value) return true
    if (currentUserId.value === Number(authorId)) return true
    return false
  }

  initAuth()

  return {
    currentUserId,
    isAdmin,
    checkPermission
  }
}