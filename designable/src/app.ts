let isSubApp = false
export function modifyClientRenderOpts(memo) {
  return {
    ...memo,
    rootElement: isSubApp ? 'root-slave' : memo.rootElement,
  }
}

// 由于qiankun重复加载多个子应用时，只会在第一个子应用的qiankun-head中加入style link标签，当关闭第一个子应用时，其他子应用的样式会丢失
// 故这样处理一下，当加载当前的子应用时，将当前的子应用的样式表添加到子应用的qiankun-head中
function addExternalStyleSheets(container): void {
  // 需要等待一下子应用加载完成，否则拿不到links
  setTimeout(() => {
    const designableDiv = document.querySelector(
      'div[data-name^="designable_"]'
    )
    if (designableDiv) {
      const qiankunHead = designableDiv.querySelectorAll('qiankun-head')
      const links = qiankunHead[0].getElementsByTagName('link')
      const containerFirstChild = container.firstChild

      Array.from(links).forEach((link) => {
        // 防止重复加载
        if (
          !containerFirstChild.querySelector(
            `link[href="${link.getAttribute('href')}"]`
          )
        ) {
          containerFirstChild.appendChild(link.cloneNode(true))
        }
      })
    }
  }, 500)
}

export const qiankun = {
  // 应用加载之前
  async bootstrap(props) {
    console.log('designable app1 bootstrap', props)
  },
  // 应用 render 之前触发
  async mount(props) {
    const { container } = props
    console.log('designable app1 mount', props)
    addExternalStyleSheets(container)
  },
  // 应用卸载之后触发
  async unmount(props) {
    console.log('designable app1 unmount', props)
  },
}
