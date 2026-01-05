import { ref } from 'vue'

// 这个函数就是专门用来查户口的
export function useAuth() {

    // 1. 定义数据 (还是从 localStorage 拿)
    const currentUserId = ref(null)
    const isAdmin = ref(false)

    // 2. 初始化逻辑：去硬盘里读取身份
    const initAuth = () => {
        const storedId = localStorage.getItem('userId')
        const storedRole = localStorage.getItem('roleId')

        if (storedId) {
            currentUserId.value = Number(storedId)
        }
        // 假设 1 是管理员
        if (storedRole === '1') {
            isAdmin.value = true
        }
    }

    // 3. 核心功能：鉴定有没有权限
    // 传入卡片作者的ID，返回 true/false
    const checkPermission = (authorId) => {
        // 如果是管理员，直接通过
        if (isAdmin.value) return true
        // 如果作者ID等于我的ID，通过
        if (currentUserId.value === Number(authorId)) return true
        // 否则没门
        return false
    }

    // 4. 自动运行初始化
    initAuth()

    // 把这两个只要用的东西扔出去
    return {
        currentUserId,
        isAdmin,
        checkPermission
    }
}