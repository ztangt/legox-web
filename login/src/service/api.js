/**
 * api定义，规则为：method apiname
 */
export default {
  login: 'POST auth/login', //登录
  logout: 'GET auth/logout', //登出
  getTentant: 'GET sys/tenant/mark', //通过访问地址获取租户
  getLoginConfig: 'GET sys/tenant/config/login', //获取登录方案配置
  getSystemBaseset: 'GET sys/tenant/baseset/system', //获取系统基础配置
  getUserMenus: 'GET sys/user/menu/tree', //根据当前切换的身份获取菜单及按钮
  getPlugList: 'GET public/plug/list', //查询插件列表-下载列表
  getDownFileUrl: 'POST public/fileStorage/getDownFileUrl', //上传后的下载
  getPasswordPolicy: 'GET sys/tenant/password', //获取密码管理
  getPlugTypeList: 'GET public/plugType/list', //查询插件类型列表
  updatePassword: 'PUT sys/user/password', //修改密码
  getRegisterByCode: 'GET sys/register/getRegisterByCode', //通过注册系统code获取系统信息
  getBaseset: 'GET sys/tenant/baseset/system', //查询支撑平台、业务平台、微协同基础设置
  getLogo: 'GET sys/tenant/logo', //获取LOGO
  getCurrentUserInfo: 'GET sys/user/info', //获取当前登录用户信息
  downloadFile: 'POST public/fileStorage/downFile', //文件下载接口
  getDictInfoName: 'GET sys/dictInfo/name', //获取全部枚举详细信息的中文名称
  getTenants: 'GET sys/tenants/user', //根据用户账号获取可登录租户集合
  getRegisters: 'GET sys/user/register/notoken',//获取注册系统
};

