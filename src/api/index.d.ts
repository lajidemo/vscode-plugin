export interface ILoginApi {
  username: string,
  password: string,
}

export interface IProjectList {
  id: number
  file_path: string
}

export interface IGetProjectTree {
  id: number
  file_path: string
}
