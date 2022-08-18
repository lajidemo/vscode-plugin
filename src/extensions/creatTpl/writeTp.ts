import * as fs from 'fs-extra'
import { join } from 'path'
import { window } from 'vscode'

import { transformTpl, transformTplFileName } from './transform'

export const writeTplFileHandle = async (
  tplPath: string,
  targetPath: string,
  inputName: string,
  firstTime?: boolean
) => {
  const tplDir = fs.readdirSync(tplPath)
  const tplDirInfoList = await Promise.all(
    tplDir.map((f) => {
      const filePath = join(tplPath, f)
      const stats = fs.statSync(filePath)
      return {
        fName: f,
        isDir: stats.isDirectory(),
        isTpl: f.endsWith('.tpl'),
      }
    })
  )
  // 解析，写入文件内容
  const fileList = tplDirInfoList.filter((e) => !e.isDir)
  if(firstTime && fileList.length){
    window.showErrorMessage('请确保该模板放在生成文件夹下')
    return
  }
  fileList.map((f) => {
    const fName = f.fName
    const formatTplFilePath = join(tplPath, fName)
    const targetFileName = fName.endsWith('.tpl')
      ? fName.slice(0, fName.length - 4)
      : fName
    const formatTargetFilePath = join(
      targetPath,
      transformTplFileName(targetFileName, inputName)
    )
    if (f.isTpl) {
      const tplCon = fs.readFileSync(formatTplFilePath, 'utf8')
      const fileCon = transformTpl(tplCon, inputName)
      fs.outputFile(formatTargetFilePath, fileCon)
    } else {
      fs.copy(formatTplFilePath, formatTargetFilePath)
    }
  })
  // 文件递归
  const folderList = tplDirInfoList.filter((e) => e.isDir)
  folderList.map((fo) =>
    writeTplFileHandle(
      join(tplPath, fo.fName),
      join(targetPath, transformTplFileName(fo.fName, inputName)),
      inputName
    )
  )
}
