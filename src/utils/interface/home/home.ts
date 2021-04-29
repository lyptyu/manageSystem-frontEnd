interface menuList {
  data: Array<{ id: number, authName: string, path: string, children?: menuList, order?: number | null }>;
  meta: { msg: string, status: number }
}

interface homeAsideDate {
  menuList: Array<menuList>;
  iconsObj: object;
  activePath:string
}
interface homeDate{
  //是否折叠
  isCollapse: boolean
}
export {
  homeAsideDate,
  homeDate
};

