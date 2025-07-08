
export const qiankun = {
  // 应用加载之前
  async bootstrap(props) {
    console.log('app1 bootstrap', props);
  },
  // 应用 render 之前触发
  async mount(props) {
    console.log('app1 mount', props);
  },
  // 应用卸载之后触发
  async unmount(props) {
    console.log('app1 unmount', props);
  },
};
// import { RunTimeLayoutConfig } from '@umijs/max';

// export const layout: RunTimeLayoutConfig = (initialState) => {
//   return {
//     // 常用属性
//     // title: 'Ant Design',
//     // logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',

//     // 默认布局调整
//     rightContentRender: undefined,
//     footerRender: undefined,
//     menuHeaderRender: undefined,

//     // 其他属性见：https://procomponents.ant.design/components/layout#prolayout
//   };
// };