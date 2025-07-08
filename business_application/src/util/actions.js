// 此action⽂件为定义微应⽤之间全局状态
// 引⼊qiankun的应⽤间通信⽅法initGlobalState
import { initGlobalState } from 'qiankun'
const initialState = {
 params: ''
 // 初始化数据
}
const actions = initGlobalState(initialState) //初始化state
// 监听actions全局公共状态数据的变化
// actions.onGlobalStateChange((state, prevState) => {
//  console.log("主应⽤变更前：", prevState);
//  console.log("主应⽤变更后：", state);
// })

export default actions