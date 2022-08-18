import * as fs from 'fs-extra'
import * as path from 'path'

const userInfoPath = path.resolve(__dirname, '../userInfo/index.json')

export const getUserInfo = (key?: string) => {
  const userInfo = JSON.parse(fs.readFileSync(userInfoPath, 'utf8'))
  return key? userInfo[key] : userInfo 
}

type ExtraUserInfo = string | boolean | string[]
export function setUserInfo<T extends ExtraUserInfo>(params: { [key: string]: T }):void {
  const userInfo = getUserInfo()
  fs.writeFileSync(
    userInfoPath,
    JSON.stringify({ ...userInfo, ...params }),
    'utf8',
  )
}
