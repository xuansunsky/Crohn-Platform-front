import { ref } from 'vue'
import { getAuthItem } from '@/utils/authToken'

export function useAuth() {
  const currentUserId = ref(null)
  const isAdmin = ref(false)

  const initAuth = () => {
    const storedId = getAuthItem('userId')
    const storedRole = getAuthItem('roleId')

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
