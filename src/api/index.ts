import { SNIPPETS, TEMPLATES } from "@/utils/CONST";
import { servers } from "../utils/request";
import { IGetProjectTree, ILoginApi, IProjectList } from './index.d'

export const TPL_PROJECT_INFO = {
  id: 1229,
  tplFilePath: TEMPLATES,
  snippetsFilePath: SNIPPETS,
}

/* 登录 */
export async function loginApi (params: ILoginApi){
  return servers.post('/auth/login', params)
}

/* 获取文件内容 */
export async function projectList(params: IProjectList){
  return servers.post('/repository/project/files', params)
}

/* 获取项目树 */
export async function getProjectTree(params: IGetProjectTree){
  return servers.post('/repository/project/tree', params)
}
