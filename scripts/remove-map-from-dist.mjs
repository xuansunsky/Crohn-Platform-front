import { rm } from 'node:fs/promises'
import { resolve } from 'node:path'

const mapDirectory = resolve('dist/map')

await rm(mapDirectory, { recursive: true, force: true })
console.log('已从网页上传包中排除 dist/map，服务器现有地图文件不会重复上传。')
