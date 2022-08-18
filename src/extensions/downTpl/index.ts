import { window, commands, QuickPickItem } from 'vscode'
import * as fs from 'fs-extra'
import * as path from 'path'
import { getProjectTree, TPL_PROJECT_INFO } from '@/api'
import { getUserInfo, setUserInfo } from '@/utils/userFn'
import { donwFile } from './downFile'
import { filterFile } from '@/utils'
import { OUTPUT_TPL_PATH } from '@/utils/CONST'

export const assembleTplList = async () => {
  const syncTplName = getUserInfo('syncTplName')
  const tplTrees = await getProjectTree({
    id: TPL_PROJECT_INFO.id,
    file_path: TPL_PROJECT_INFO.tplFilePath,
  })
  const treeList = tplTrees.data
  
  const preTplName: string[] = filterFile(treeList,'tree')
  let tplNameList: QuickPickItem[] = []
  preTplName.forEach((i) => {
    const tpl = {
      label: i,
      picked: syncTplName?.includes(i),
    }
    tplNameList.push(tpl)
  })
  return tplNameList
}

export const askTplName = async (tpllist: QuickPickItem[]) => {
  const tplName = await window.showQuickPick(tpllist, {
    title: '模板名称',
    placeHolder: '键盘请使用空格键选择，回车即确定',
    canPickMany: true,
  })
  console.log('tplName===', tplName)
  if (tplName?.length) {
    setUserInfo({ syncTplName: tplName.map((i) => i.label) })
    const tplNameList = tplName.map((name) => name.label)
    
    /* 
      前置操作：在 templates 文件下遍历所选的模板，逐个删除，以防远端删除某个文件后，本地未删除
    */
    tplNameList.forEach(name=>{
      fs.removeSync(path.resolve(OUTPUT_TPL_PATH, name))
    })

    /* 
    同步模板数据操作
      1. 遍历选择的每个模板名称，在path.resolve(__dirname, '../templates')下创建文件夹
      2. gitlab项目 目标路径，获取tree
        2.1 如果是文件，则获取文件内容，写入
        2.2 如果是文件夹，创建文件夹，递归第二步
    */
    donwFile(
      tplNameList,
      TPL_PROJECT_INFO.tplFilePath,
      OUTPUT_TPL_PATH
    )
  } else {
    window
      .showWarningMessage(
        '检测到你并没有选择模板，是因为你已经强出天际了吗?',
        '再选一次'
      )
      .then((res) => {
        if (res) {
          commands.executeCommand('xy.downTpl')
        }
      })
  }
}

export const downTpl = commands.registerCommand('xy.downTpl', async () => {
  try {
    const tplNameList = await assembleTplList()
    askTplName(tplNameList)
  } catch (error) {}
})
