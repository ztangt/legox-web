/**
 * 废弃文件
 */
import React, { useEffect } from 'react'
import { connect } from 'dva'
import { Modal, Tree, Button } from 'antd'
import { useModel } from 'umi'
function moveSortModal({
  treeData,
  dropArray,
  setState,
  onExpand,
  expandedKeys,
  getInvoiceTreeFn,
}) {
  const masterProps = useModel('@@qiankunStateFromMaster')
  let { targetKey } = masterProps
  const {
    transferInvoice, //转移票据分类
  } = useModel('invoice')
  useEffect(() => {
    getInvoiceTreeFn('', '0')()
  }, [])
  const handelCanel = () => {
    setState({
      isShowMove: false,
      isSort: false,
    })
  }
  const onDragEnter = (info) => {
    console.log(info, 'info111')
  }

  const onDrop = (info) => {
    console.log(info, 'info222')
    const {
      node,
      dragNode,
      dropPosition,
      dropToGap,
      event,
      dragNodesKeys,
    } = info
    // node         代表拖拽终点 的对象
    // dragNode     代表当前拖拽的对象
    // dropPosition 代表drop后的节点位置；不准确
    // dropToGap    代表移动到非最顶级组第一个位置
    const dropKey = node.key
    const dragKey = dragNode.key
    const dropPos = node.pos.split('-')

    // trueDropPosition: ( -1 | 0 | 1 ) dropPosition计算前的值，可以查看rc-tree源码;
    // -1 代表移动到最顶级组的第一个位置
    const trueDropPosition = dropPosition - Number(dropPos[dropPos.length - 1])

    const loop = (data, key, callback) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data)
        }
        if (data[i].children) {
          loop(data[i].children, key, callback)
        }
      }
    }

    let dragObj

    const data = [...treeData]
    //   if (node.pos.length === dragNode.pos.length) {
    //       return
    //   }
    //   console.log
    //   if (dragNode.pos.length - node.pos.length >= 2) {
    //       return
    //   }
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1)
      dragObj = item
    })
    if (!dropToGap) {
      // 移动到非最顶级组第一个位置
      loop(data, dropKey, (item) => {
        item.children = item.children || []
        // where to insert 示例添加到头部，可以是随意位置
        // item.children = item.children || []; // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj)
      })
    }
    // if (
    //     (info.node.props.children || []).length > 0 && // Has children
    //     info.node.props.expanded && // Is expanded
    //     dropPosition === 1 // On the bottom gap
    //   ) {
    //     loop(data, dropKey, item => {
    //       item.children = item.children || [];
    //       // where to insert 示例添加到头部，可以是随意位置
    //       item.children.unshift(dragObj);
    //       // in previous version, we use item.children.push(dragObj) to insert the
    //       // item to the tail of the children
    //     });
    //   } else
    else {
      // 平级移动、交叉组移动、移动到其他组(非最顶级)非第一个位置

      let ar
      let i
      loop(data, dropKey, (item, index, arr) => {
        ar = arr
        i = index
      })
      if (trueDropPosition === -1) {
        // 移动到最顶级第一个位置
        ar.splice(i, 0, dragObj)
      } else {
        // trueDropPosition:   1 | 0
        ar.splice(i + 1, 0, dragObj)
      }
    }
    setState({
      sortTreeData: [...data],
    })
    dropArray.push({
      classifyId: dragKey,
      targetParentId: dropKey,
    })
    setState({
      dropArray: dropArray,
    })
  }
  //保存
  const saveSort = () => {
    transferInvoice(
      {
        classifyIdJson: JSON.stringify(dropArray),
      },
      () => {
        handelCanel()
        getInvoiceTreeFn('', 0)
      }
    )
  }
  return (
    <Modal
      title={'移动分类'}
      visible={true}
      getContainer={() => {
        return document.getElementById(`formShow_container_${targetKey}`)
      }}
      mask={false}
      maskClosable={false}
      centered
      width={400}
      onCancel={handelCanel}
      footer={[
        <Button key="cancel" onClick={handelCanel}>
          取消
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => {
            saveSort()
          }}
        >
          保存
        </Button>,
      ]}
    >
      <Tree
        showLine={false}
        draggable
        blockNode
        onDragEnter={onDragEnter}
        onDrop={onDrop}
        showIcon={false}
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        //   onSelect={onSelect}
        // onMouseEnter={onMouseEnter}
        // selectedKeys={[dictTypeId]}
        //   onExpand={onExpand}
        treeData={treeData}
      ></Tree>
    </Modal>
  )
}
export default moveSortModal
