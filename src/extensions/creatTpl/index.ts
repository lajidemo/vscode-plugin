import { commands, QuickPickItem, window } from 'vscode'
import * as fs from 'fs-extra'
import { join, resolve, dirname } from 'path'
import { writeTplFileHandle } from './writeTp'
import { MultiStepInput } from '@/utils/formStep'
import {
  LOCAL_ST_TEMPLATES_PATH,
  OUTPUT_TPL_PATH,
  SYSTEM_FILE_EXP,
} from '@/utils/CONST'
import { getUserInfo } from '@/utils/userFn'
import { sourceDataTagType } from '../toggleShape'

let targetFilePath: string = ''
let targetFileDir: (string | undefined)[]

interface State {
  tpl: QuickPickItem
  fileName: string
}
const askTplFile = async (fileList: QuickPickItem[]) => {
  async function collectInputs() {
    const state = {} as Partial<State>
    await MultiStepInput.run((input) => inputName(input, state))
    return state as State
  }
  const title = `页面模板生成（当前形态为 ${getUserInfo('sourceDataTag')}）`
  async function inputName(input: MultiStepInput, state: Partial<State>) {
    state.tpl = await input.showQuickPick({
      title,
      step: 1,
      totalSteps: 2,
      items: fileList,
      placeholder: '请选择页面模板',
      shouldResume: shouldResume,
    })
    return (input: MultiStepInput) => inputPsw(input, state)
  }
  async function inputPsw(input: MultiStepInput, state: Partial<State>) {
    state.fileName = await input.showInputBox({
      title,
      step: 2,
      totalSteps: 2,
      value: '',
      prompt: '文件名称',
      validate: validateNameIsUnique,
      shouldResume: shouldResume,
    })
  }
  function shouldResume() {
    // Could show a notification with the option to resume.
    return new Promise<boolean>((resolve, reject) => {
      // noop
    })
  }
  async function validateNameIsUnique(name: string) {
    if (!name) {
      return '咱就是说文件名称不能为空⛔'
    } else if (/(?:[\u4e00-\u9fa5]+)/g.test(name)) {
      return '不会吧不会吧，你居然用中文命名🈲'
    } else if (targetFileDir.includes(name)) {
      return '文件名撞车了🚨'
    } else if (!SYSTEM_FILE_EXP.test(name)) {
      return '这个文件名怕是不被系统允许噢😏'
    }
  }

  return await collectInputs()
}

async function ask_write_flow(sourceDataPath: string) {
  try {
    const fileList = fs.readdirSync(sourceDataPath).map((e) => ({ label: e }))
    const res = await askTplFile(fileList)
    writeTplFileHandle(
      join(sourceDataPath, res.tpl.label),
      join(targetFilePath),
      res.fileName,
      true
    )
  } catch (error: any) {
    window.showErrorMessage(error.message)
  }
}

export const chooseTpl = commands.registerCommand('xy.chooseTpl', async () => {
  // const strategy = {
  //   ST: join(await LOCAL_ST_TEMPLATES_PATH()),
  //   gitlab: OUTPUT_TPL_PATH,
  // }
  // ask_write_flow(strategy[getUserInfo('sourceDataTag') as sourceDataTagType])
  let path = ''
  switch (getUserInfo('sourceDataTag')) {
    case 'ST':
      path = join(await LOCAL_ST_TEMPLATES_PATH())
      break
    case 'gitlab':
      path = OUTPUT_TPL_PATH
      break
    default:
      break
  }
  ask_write_flow(path)
})

export const creatTpl = commands.registerCommand('xy.creatTpl', (uri) => {
  console.log('uri===', uri)
  const preTargetFilePath = uri.fsPath
  targetFilePath = preTargetFilePath
  const stats = fs.statSync(targetFilePath)
  if (stats.isFile()) {
    targetFilePath = dirname(preTargetFilePath)
  }
  targetFileDir = fs.readdirSync(targetFilePath)
  commands.executeCommand('xy.chooseTpl')
})
