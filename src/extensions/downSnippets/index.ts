import * as path from 'path'
import * as fs from 'fs-extra'
import { commands, window } from 'vscode'
import { getProjectTree, projectList, TPL_PROJECT_INFO } from '@/api'
import { filterFile } from '@/utils'
import {
  LOCAL_ST_SNIPPETS_PATH,
  OUTPUT_SNIPPETS_PATH,
} from '@/utils/CONST'
import { getUserInfo } from '@/utils/userFn'
import { sourceDataTagType } from '../toggleShape'

async function getGitlabProjectTree() {
  const snippetsData = await getProjectTree({
    id: TPL_PROJECT_INFO.id,
    file_path: TPL_PROJECT_INFO.snippetsFilePath,
  })
  const snippetsList = filterFile(snippetsData.data, 'blob')

  snippetsList.forEach(async (file) => {
    const filePath = TPL_PROJECT_INFO.snippetsFilePath + '/' + file
    const content = await projectList({
      id: TPL_PROJECT_INFO.id,
      file_path: encodeURIComponent(filePath),
    })
    fs.outputJsonSync(path.resolve(OUTPUT_SNIPPETS_PATH, file), content.data)
  })
}

async function getLocalProjectTree() {
  const ST_SNIPPETS_PATH = await LOCAL_ST_SNIPPETS_PATH()
  const snippetsList = fs.readdirSync(ST_SNIPPETS_PATH)
  snippetsList.forEach((file) => {
    const content = fs.readFileSync(path.resolve(ST_SNIPPETS_PATH, file), 'utf8')
    fs.outputFileSync(path.resolve(OUTPUT_SNIPPETS_PATH, file), content)
  })
}

function clearSnippets() {
  const snippetsList = fs.readdirSync(OUTPUT_SNIPPETS_PATH)
  snippetsList.forEach(file=>{
    fs.writeJsonSync(path.resolve(OUTPUT_SNIPPETS_PATH, file), {})
  })
}

const getProjectTreeTrategy = {
  ST: getLocalProjectTree,
  gitlab: getGitlabProjectTree,
}

export const downSnippets = commands.registerCommand(
  'xy.downSnippets',
  async () => {
    try {
      clearSnippets()
      await getProjectTreeTrategy[
        getUserInfo('sourceDataTag') as sourceDataTagType
      ]()
      window.showInformationMessage(
        `${getUserInfo('sourceDataTag')} 形态片段数据同步完成`
      )
    } catch (error: any) {
      window.showErrorMessage(error.message)
      throw error
    }
  }
)
