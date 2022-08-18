import { InputBoxOptions, QuickPickItem, QuickPickOptions, window } from 'vscode'

export function windowShowQuickPickT<T extends QuickPickItem>(params: T[], opt: QuickPickOptions): Promise<T> {
  return new Promise((resolve) => {
    window.showQuickPick(params, opt).then((res) => {
      if (res) {
        resolve(res)
      }
    })
  })
}

export function windowShowQuickPickS(params: string[], opt: QuickPickOptions): Promise<string> {
  return new Promise((resolve) => {
    window.showQuickPick(params, opt).then((res) => {
      if (res) {
        resolve(res)
      }
    })
  })
}

export function windowShowInputBox(params: InputBoxOptions): Promise<string> {
  return new Promise((resolve) => {
    window.showInputBox({...params,validateInput(val){
      if(!val){
        return '咱就是说内容不能为空'
      }
    }}).then((res) => {
      if (res) {
        resolve(res)
      }
    })
  })
}
