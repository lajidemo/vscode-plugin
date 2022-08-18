import { commands, window } from 'vscode'
import { getUserInfo, setUserInfo } from '@/utils/userFn'
import { loginApi } from '@/api'
import { MultiStepInput } from '@/utils/formStep'

interface State {
  userName: string;
  userPsw: string;
}

export const askUserMsg = async () => {
	async function collectInputs() {
		const state = {} as Partial<State>;
		await MultiStepInput.run(input => inputName(input, state));
		return state as State;
	}
	const title = '登录 - 输入用户名和密码';

	async function inputName(input: MultiStepInput, state: Partial<State>) {
		state.userName = await input.showInputBox({
			title,
			step: 1,
			totalSteps: 2,
			value: state.userName || '',
			prompt: '用户名',
			validate: validateNameIsUnique,
			shouldResume: shouldResume
		});
		return (input: MultiStepInput) => inputPsw(input, state);
	}
	async function inputPsw(input: MultiStepInput, state: Partial<State>) {
		state.userPsw = await input.showInputBox({
			title,
			step: 2,
			totalSteps: 2,
			value: '',
      password: true,
			prompt: '密码',
			validate: validateNameIsUnique,
			shouldResume: shouldResume
		});
	}

	function shouldResume() {
		// Could show a notification with the option to resume.
		return new Promise<boolean>((resolve, reject) => {
			// noop
		});
	}

	async function validateNameIsUnique(name: string) {
		return !name.trim() ? '咋是个空值呢' : undefined;
	}

	return await collectInputs();
}

export const loginFlow = async () => {
  const userMsg = await askUserMsg()
  // const userMsg = getUserInfo()
  console.log('userMsg===',userMsg)
  const token = await loginApi({
    username: userMsg.userName,
    password: userMsg.userPsw,
  })
  // 登录成功
  const cookieStr = (token.headers['set-cookie']?.[0] as string).split(';')[0]
  setUserInfo({ ...userMsg, cookieStr })
	
	// 同步片段数据
	commands.executeCommand('xy.downSnippets')

  if (!getUserInfo('syncTplName')) {
    commands.executeCommand('xy.downTpl')
  }
}

export const login = commands.registerCommand('xy.login', ()=>{
	window.showWarningMessage('只有登录强者才能享受的体验', '马上成为强者').then((res)=>{
		if(res){
			loginFlow()
		}
	})
})
