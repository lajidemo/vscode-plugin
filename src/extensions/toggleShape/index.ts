import { commands, window } from 'vscode'
import { getUserInfo, setUserInfo } from '@/utils/userFn'

export type sourceDataTagType = 'ST' | 'gitlab'
export interface ISourceDataPickItem {
  label: sourceDataTagType
  description: string
}

export const toggleShape = commands.registerCommand(
  'xy.toggleShape',
  () => {
    const pickItem: ISourceDataPickItem[] = [
      {
        label: 'ST',
        description: '根目录下 .ST 文件夹模板',
      },
      {
        label: 'gitlab',
        description: 'gitlab 项目模板',
      },
    ]
    window
      .showQuickPick(pickItem, {
        title: '选择模板形态',
        placeHolder: `当前为 ${getUserInfo('sourceDataTag')} 形态`,
      })
      .then((res) => {
        if (res && getUserInfo('sourceDataTag') !== res.label) {
          setUserInfo({ sourceDataTag: res.label })

          commands.executeCommand('xy.downSnippets')

          if (res.label === 'gitlab') {
            if (!getUserInfo('cookieStr')) {
              commands.executeCommand('xy.login')
            }else{
              commands.executeCommand('xy.downTpl')
            }
          }
        }
      })
  }
)
