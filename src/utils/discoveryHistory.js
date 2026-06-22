const todayText = () => {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

const keyOf = (myId, mode, type) => {
  return `discovery_${type}_${myId}_${mode}_${todayText()}`
}

const persistentSeenKeyOf = (myId, mode) => {
  return `discovery_seen_${myId}_${mode}_all`
}

const readJson = (key, fallback = []) => {
  try {
    const value = JSON.parse(localStorage.getItem(key) || 'null')
    return Array.isArray(value) ? value : fallback
  } catch (e) {
    return fallback
  }
}

const writeJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

export const readDiscoveryGreets = (myId, mode) => {
  return readJson(keyOf(myId, mode, 'greet'))
}

export const recordDiscoveryGreet = (myId, mode, targetId) => {
  const key = keyOf(myId, mode, 'greet')
  const greets = readJson(key)
  const idText = String(targetId)
  if (!greets.map(String).includes(idText)) {
    greets.push(idText)
    writeJson(key, greets)
  }
  return greets
}

const normalizeSeenRecord = (item) => {
  if (item && typeof item === 'object') return item
  const idText = String(item)
  return {
    id: idText,
    name: `编号 ${idText}`,
    sign: '看过的朋友',
    distance: '',
    tags: [],
    avatar: '',
    requested: false,
    isFriend: false,
    seenAt: 0
  }
}

const mergeSeenRecords = (records) => {
  const merged = new Map()
  records
    .map(normalizeSeenRecord)
    .filter(item => item.id !== undefined && item.id !== null)
    .forEach(item => {
      const idText = String(item.id)
      const existing = merged.get(idText)
      if (!existing || (item.seenAt || 0) >= (existing.seenAt || 0)) {
        merged.set(idText, { ...existing, ...item, id: idText })
      }
    })
  return Array.from(merged.values())
}

export const readDiscoverySeenRecords = (myId, mode) => {
  const persistentKey = persistentSeenKeyOf(myId, mode)
  const legacyDailyKey = keyOf(myId, mode, 'seen')
  const records = mergeSeenRecords([
    ...readJson(persistentKey),
    ...readJson(legacyDailyKey)
  ])
  if (records.length) {
    writeJson(persistentKey, records)
  }
  return records
}

export const readDiscoverySeenIds = (myId, mode) => {
  return readDiscoverySeenRecords(myId, mode).map(item => String(item.id))
}

export const recordDiscoverySeen = (myId, mode, pickOrId) => {
  const key = persistentSeenKeyOf(myId, mode)
  const records = readDiscoverySeenRecords(myId, mode)
  const id = pickOrId && typeof pickOrId === 'object' ? pickOrId.id : pickOrId
  const idText = String(id)
  if (!idText || idText === 'undefined' || idText === 'null') return records

  const nextRecord = pickOrId && typeof pickOrId === 'object'
    ? {
        id: idText,
        name: pickOrId.name || `编号 ${idText}`,
        sign: pickOrId.sign || '',
        distance: pickOrId.distance || '',
        tags: Array.isArray(pickOrId.tags) ? pickOrId.tags.slice(0, 3) : [],
        avatar: pickOrId.avatar || '',
        requested: !!pickOrId.requested,
        isFriend: !!pickOrId.isFriend,
        seenAt: Date.now()
      }
    : {
        id: idText,
        name: `编号 ${idText}`,
        sign: '',
        distance: '',
        tags: [],
        avatar: '',
        requested: false,
        isFriend: false,
        seenAt: Date.now()
      }

  const existingIndex = records.findIndex(item => String(item.id) === idText)
  if (existingIndex >= 0) {
    records.splice(existingIndex, 1, { ...records[existingIndex], ...nextRecord })
  } else {
    records.push(nextRecord)
  }
  writeJson(key, records)
  return records
}
