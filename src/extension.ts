import { commands, ExtensionContext, window } from 'vscode';
import {getUserInfo} from './utils/userFn';
import { creatTpl } from './extensions/creatTpl';
import { login } from './extensions/login';
import { downTpl } from './extensions/downTpl';
import { downSnippets } from './extensions/downSnippets';
import { toggleShape } from './extensions/toggleShape';


export function activate (ctx: ExtensionContext) {
  console.log('showtime🚀')
  if(!getUserInfo('sourceDataTag')){
    commands.executeCommand('xy.toggleShape')
  }
  ctx.subscriptions.push(login)
  ctx.subscriptions.push(creatTpl)
  ctx.subscriptions.push(downTpl)
  ctx.subscriptions.push(downSnippets)
  ctx.subscriptions.push(toggleShape)
}
export function deactivate() {
  console.log('downline')
}
