export const DEFAULT_AVATARS = Array.from({ length: 12 }, (_, index) => {
  const number = String(index + 1).padStart(2, '0')
  return `/avatars/defaults/avatar-${number}.svg`
})

const generatedAvatarPatterns = [
  'api.dicebear.com',
  'picsum.photos'
]

const cleanAvatar = (avatar) => String(avatar || '').trim()

const hashSeed = (seed = '') => {
  const text = String(seed || 'crohn-friend')
  let hash = 0
  for (let index = 0; index < text.length; index += 1) {
    hash = ((hash << 5) - hash) + text.charCodeAt(index)
    hash |= 0
  }
  return Math.abs(hash)
}

export const defaultAvatar = (seed) => {
  return DEFAULT_AVATARS[hashSeed(seed) % DEFAULT_AVATARS.length]
}

export const isGeneratedAvatar = (avatar) => {
  const value = cleanAvatar(avatar)
  if (!value) return true
  return generatedAvatarPatterns.some(pattern => value.includes(pattern))
}

export const avatarOf = (source, fallbackSeed = '') => {
  const avatar = typeof source === 'string' ? source : source?.avatar
  const seed = fallbackSeed || source?.userId || source?.id || source?.nickname || source?.name || source?.userName || avatar
  const value = cleanAvatar(avatar)
  return isGeneratedAvatar(value) ? defaultAvatar(seed) : value
}
