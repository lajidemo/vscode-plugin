import { window, workspace } from 'vscode'
import { join, resolve } from 'path'
import { readdirSync } from 'fs-extra'

export const TEMPLATES = 'templates'
export const SNIPPETS = 'snippets'
export const SYSTEM_FILE_EXP = /(?!((^(con)$)|^(con)\..*|(^(prn)$)|^(prn)\..*|(^(aux)$)|^(aux)\..*|(^(nul)$)|^(nul)\..*|(^(com)[1-9]$)|^(com)[1-9]\..*|(^(lpt)[1-9]$)|^(lpt)[1-9]\..*)|^\s+|.*\s$)(^[^\/\/\:\*\?\"\<\>\|]{1,255}$)/

export const OUTPUT_TPL_PATH = resolve(__dirname, '..', TEMPLATES)

export const OUTPUT_SNIPPETS_PATH = resolve(__dirname, '..', SNIPPETS)

function LOCAL_ST_PATH() {
  const ST_path_index = workspace.workspaceFolders?.findIndex((folder) => {
    const dirs = readdirSync(folder.uri.fsPath)
    console.log('dirs===', dirs)
    return dirs.includes('.ST')
  })
  return new Promise<string>((resolve, reject) => {
    if (ST_path_index !== -1) {
      resolve(
        join(
          workspace.workspaceFolders![ST_path_index as number].uri.fsPath,
          '.ST'
        )
      )
    } else {
      window.showErrorMessage('未找到含有 .ST 文件夹的目录')
      reject('未找到含有 .ST 文件夹的目录')
    }
  })
}

export const LOCAL_ST_SNIPPETS_PATH = async ()=>{
  const ST_PATH = await LOCAL_ST_PATH()
  return join(ST_PATH, SNIPPETS)
}
export const LOCAL_ST_TEMPLATES_PATH = async ()=>{
  const ST_PATH = await LOCAL_ST_PATH()
  return join(ST_PATH, TEMPLATES)
}