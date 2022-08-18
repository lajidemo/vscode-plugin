import * as fs from 'fs-extra'
import * as path from 'path'
import { window } from 'vscode'
import { getProjectTree, projectList, TPL_PROJECT_INFO } from '@/api'
import { filterFile } from '@/utils'

export const donwFile = (
  tplName: string[],
  filePath: string,
  OUTPUT_TPL_PATH: string
) => {
  tplName.forEach(async (name) => {
    const output_file_path = path.resolve(OUTPUT_TPL_PATH, name)
    fs.ensureDirSync(output_file_path)
    const file_path = filePath + '/' + name
    const data = await getProjectTree({
      id: TPL_PROJECT_INFO.id,
      file_path: file_path,
    })
    const treeList = data.data

    const folderList: string[] = filterFile(treeList, 'tree')
    const fileList: string[] = filterFile(treeList, 'blob')

    if (folderList.length) {
      donwFile(folderList, file_path, output_file_path)
    }
    if (fileList.length) {
      fileList.forEach(async (file) => {
        const filePath = file_path + '/' + file
        const content = await projectList({
          id: TPL_PROJECT_INFO.id,
          file_path: encodeURIComponent(filePath),
        })
        fs.outputFileSync(
          path.resolve(__dirname, '..', filePath),
          file.endsWith('.json') ? JSON.stringify(content.data) : content.data,
        )
      })
    }
  })
  window.showInformationMessage('模板数据同步完成')
}
