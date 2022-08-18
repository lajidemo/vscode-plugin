export const filterFile = (list: any[], type: string)=>{
  return list.filter((e: any) => e.type === type).map((e: any) => e.name)
}