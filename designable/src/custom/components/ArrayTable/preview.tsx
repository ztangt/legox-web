import { LoadTemplate } from '@/designable/antd/common/LoadTemplate'
import { createArrayColumnSchema } from '@/designable/antd/components/Field'
import { useDropTemplate } from '@/designable/antd/hooks'
import {
  createEnsureTypeItemsNode,
  findNodeByComponentPath,
  hasNodeByComponentPath,
  queryNodesByComponentPath,
} from '@/designable/antd/shared'
import { TreeNode, createBehavior, createResource } from '@/designable/core'
import {
  DnFC,
  DroppableWidget,
  TreeNodeWidget,
  useNodeIdProps,
  useTreeNode,
} from '@/designable/react'
import { ImportOutlined } from '@ant-design/icons'
import { observer } from '@formily/react'
import { Table, TableProps } from 'antd'
import cls from 'classnames'
import React from 'react'
import { AllLocales } from '../../locales'
import { AllSchemas } from '../../schemas'
import { createArrayBehavior } from '../ArrayBase'
import { ArrayBase } from '../array-base'
import './styles.less'
const ensureObjectItemsNode = createEnsureTypeItemsNode('object')

const HeaderCell: React.FC = (props: any) => {
  //表头列渲染
  return (
    <th
      {...props}
      data-designer-node-id={props.className.match(/data-id\:([^\s]+)/)?.[1]}
    >
      {props.children}
    </th>
  )
}

const BodyCell: React.FC = (props: any) => {
  //表体列渲染
  return (
    <td
      {...props}
      data-designer-node-id={props.className.match(/data-id\:([^\s]+)/)?.[1]}
    >
      {props.children}
    </td>
  )
}

export const ArrayTable: DnFC<TableProps<any>> = observer((props) => {
  const node = useTreeNode()
  const nodeId = useNodeIdProps()

  useDropTemplate('ArrayTable', (source) => {
    const sortHandleNode = new TreeNode({
      componentName: 'Field',
      props: {
        type: 'void',
        'x-component': 'ArrayTable.Column',
        'x-component-props': {
          title: `排序`,
        },
      },
      children: [
        {
          componentName: 'Field',
          props: {
            type: 'void',
            'x-component': 'ArrayTable.SortHandle',
          },
        },
      ],
    })
    const indexNode = new TreeNode({
      componentName: 'Field',
      props: {
        type: 'void',
        'x-component': 'ArrayTable.Column',
        'x-component-props': {
          title: `序号`,
        },
      },
      children: [
        {
          componentName: 'Field',
          props: {
            type: 'void',
            'x-component': 'ArrayTable.Index',
          },
        },
      ],
    })
    const columnNode = new TreeNode({
      componentName: 'Field',
      props: {
        type: 'void',
        'x-component': 'ArrayTable.Column',
        'x-component-props': {
          title: `Title`,
        },
      },
      children: source.map((node) => {
        node.props.title = undefined
        return node
      }),
    })

    const operationNode = new TreeNode({
      componentName: 'Field',
      props: {
        type: 'void',
        'x-component': 'ArrayTable.Column',
        'x-component-props': {
          title: `操作`,
        },
      },
      children: [
        {
          componentName: 'Field',
          props: {
            type: 'void',
            'x-component': 'ArrayTable.Edit',
            'x-reactions': {
              dependencies: [
                {
                  property: 'value',
                  type: 'any',
                },
              ],
              fulfill: {
                run:
                  "    // try{\n    //   $props({\n    //   /**\n    //    * index 点击行的索引\n    //    */\n    //   onClick(index){\n    //     $self.query('CGJH_CGPMFDB').take((field)=>{//打开弹窗  SUB为自定义子表CODE\n    //       field.setValue({...$values['CGJHFDB'][index]})\n    //       field.setDecorator('ModalContainer',{//定义对象容器的弹窗属性\n    //         title:'编辑',//弹窗标题\n    //         visible: true,//弹窗显示状态\n    //         onCancel(){//弹窗取消按钮事件\n    //           field.setDecoratorProps({visible: false})//关闭对象容器弹窗\n    //         },\n    //         onOk(){//弹窗确定按钮事件\n    //           field.setDecoratorProps({visible: false})//关闭对象容器弹窗\n    //           $values['CGJHFDB'][index] = field.value//赋值到子表\n    //         }\n    //       })\n    //     })\n    //   }\n    // })\n    // }catch(e){\n    //   console.log('e',e)\n    // }\n    ",
              },
            },
          },
        },
        // {
        //   componentName: 'Field',
        //   props: {
        //     type: 'void',
        //     'x-component': 'ArrayTable.view',
        //     'x-reactions': {
        //       dependencies: [
        //         {
        //           property: 'value',
        //           type: 'any',
        //         },
        //       ],
        //       fulfill: {
        //         run:
        //           "    // try{\n    //   $props({\n    //   /**\n    //    * index 点击行的索引\n    //    */\n    //   onClick(index){\n    //     $self.query('CGJH_CGPMFDB').take((field)=>{//打开弹窗  SUB为自定义子表CODE\n    //       field.setDecorator('ModalContainer',{//定义对象容器的弹窗属性\n    //         title:'查看',//弹窗标题\n    //         visible: true,//弹窗显示状态\n    //         onCancel(){//弹窗取消按钮事件\n    //           field.setDecoratorProps({visible: false})//关闭对象容器弹窗\n    //           $form.setFieldState(`CGJH_CGPMFDB.*`, (state) => {//取消不可编辑（可能会导致编辑状态情况下，不可编辑的字段也设为可编辑）\n    //             state['editable'] = true\n    //           })\n    //         },\n    //         onOk(){//弹窗确定按钮事件\n    //           field.setDecoratorProps({visible: false})//关闭对象容器弹窗\n    //         }\n    //       })\n    //       field.setValue({...$values['CGJHFDB'][index]})\n    //     })\n    //     $form.setFieldState(`CGJH_CGPMFDB.*`, (state) => {\n    //       state['editable'] = false //设置对象容器字段为不可编辑\n    //     })\n    //   }\n    // })\n    // }catch(e){\n    //   console.log('e',e)\n    // }\n    ",
        //       },
        //     },
        //   },
        // },
        {
          componentName: 'Field',
          props: {
            type: 'void',
            'x-component': 'ArrayTable.Remove',
          },
        },
        {
          componentName: 'Field',
          props: {
            type: 'void',
            'x-component': 'ArrayTable.Copy',
          },
        },
        {
          componentName: 'Field',
          props: {
            type: 'void',
            'x-component': 'ArrayTable.MoveDown',
          },
        },
        {
          componentName: 'Field',
          props: {
            type: 'void',
            'x-component': 'ArrayTable.MoveUp',
          },
        },
      ],
    })
    const objectNode = new TreeNode({
      componentName: 'Field',
      props: {
        type: 'object',
      },
      children: [sortHandleNode, indexNode, columnNode, operationNode],
    })
    const additionNode = new TreeNode({
      componentName: 'Field',
      props: {
        type: 'void',
        title: '添加行',
        'x-component': 'ArrayTable.Addition',
        'x-reactions': {
          dependencies: [
            {
              property: 'value',
              type: 'any',
            },
          ],
          fulfill: {
            run:
              "try {\n  $props({\n    onClick(){//后置点击事件\n      try {\n      //自己逻辑\n      } catch (e) {\n        console.log('e=', e)\n      }\n    },\n    onPreClick(){//前置点击事件\n      try {\n        //自己的前置逻辑\n        return true//可继续往下进行（添加行内容）返回true 否则返回false\n      } catch (e) {\n        console.log('e=', e)\n      }\n    }\n  })\n} catch (e) {\n  console.log('e=', e)\n}",
          },
        },
      },
    })
    const importNode = new TreeNode({
      componentName: 'Field',
      props: {
        type: 'void',
        title: '导入',
        'x-component': 'ArrayTable.Importition',
        'x-reactions': {
          dependencies: [
            {
              property: 'value',
              type: 'any',
            },
          ],
          fulfill: {
            run:
              "\ntry {\n  // $props({\n  //   /**\n  //    * value 导入表单的值\n  //    */\n  //   onSufImportClick(value){\n  //     //修改相关值域\n  //     value[0]['WWW'] = 0\n  //     //子表赋值\n  //     $self.parent.setValue(value)\n  //   },\n  //   onPreExportClick(value){\n  //     value[0]['WWW'] =3333\n  //     return value\n  //   }\n  // })\n} catch (e) {\n  console.log('e=', e)\n}",
          },
        },
      },
    })
    // const exportNode = new TreeNode({
    //   componentName: 'Field',
    //   props: {
    //     type: 'void',
    //     title: '导出',
    //     'x-component': 'ArrayTable.Exportition',
    //   },
    // })
    return [objectNode, importNode, additionNode]
  })
  const columns = queryNodesByComponentPath(node, [
    //列节点
    'ArrayTable',
    '*',
    'ArrayTable.Column',
  ])
  const additions = queryNodesByComponentPath(node, [
    //添加行按钮节点
    'ArrayTable',
    'ArrayTable.Addition',
  ])
  const importitions = queryNodesByComponentPath(node, [
    //导入导出 按钮节点
    'ArrayTable',
    'ArrayTable.Importition',
  ])

  const defaultRowKey = () => {
    //默认rowkey值
    return node.id
  }

  const renderTable = () => {
    //表格渲染
    if (node.children.length === 0) return <DroppableWidget /> //无子节点 显示可拖拽容器
    return (
      <ArrayBase disabled>
        {importitions.map((child) => {
          return <TreeNodeWidget node={child} key={child.id} />
        })}
        <Table
          bordered
          {...props}
          scroll={{ y: 'calc(100% - 100px)' }}
          className={cls('ant-formily-array-table', props.className)}
          style={{ marginBottom: 10, ...props.style }}
          rowKey={defaultRowKey}
          dataSource={[{ id: '1' }]}
          pagination={false}
          components={{
            header: {
              cell: HeaderCell,
            },
            body: {
              cell: BodyCell,
            },
          }}
        >
          {columns.map((node) => {
            const children = node.children.map((child) => {
              if (!child?.props?.['x-decorator-props']) {
                //无装饰器节点属性
                //添加默认值
                child.props['x-decorator-props'] = {
                  colon: false,
                  labelWidth: '0px',
                  bordered: false,
                }
              }
              if (child?.props?.['x-decorator-props']) {
                //添加默认值
                child.props['x-decorator-props'].bordered = false //无边框
                child.props['x-decorator-props'].labelWidth = '0px' //无label
              }
              if (child?.props?.['x-component-props']?.style) {
                //添加默认值 继承父体颜色
                child.props['x-component-props'].style['backgroundColor'] =
                  'inherit'
                child.props['x-component-props'].style['borderStyle'] = 'none'
                child.props['x-component-props'].style['height'] = '32px'
              }

              return <TreeNodeWidget node={child} key={child.id} />
            })
            const props = node.props['x-component-props'] //列节点 props
            return (
              <Table.Column
                {...props}
                width={
                  node?.children[0]?.props?.title == '排序' ||
                  props.title == '排序' ||
                  node?.children[0]?.props?.title == '序号' ||
                  props.title == '序号'
                    ? 50
                    : node?.children[0]?.props?.title == '操作' ||
                      props.title == '操作'
                    ? 160
                    : props.width
                    ? props.width
                    : 100
                }
                title={
                  <div data-content-editable="x-component-props.title">
                    {(props.title == 'Title' || !props.title) &&
                    node?.children[0]?.props?.title
                      ? node?.children[0]?.props?.title
                      : props.title}
                  </div>
                }
                dataIndex={node.id}
                className={
                  props.title == '操作' ||
                  props.title == '序号' ||
                  props.title == '排序'
                    ? cls(`data-id:${node.id}`, 'operation')
                    : `data-id:${node.id}`
                }
                key={node.id}
                fixed={
                  node?.children[0]?.props?.title == '操作' ||
                  props.title == '操作'
                    ? 'right'
                    : node?.children[0]?.props?.title == '排序' ||
                      props.title == '排序' ||
                      node?.children[0]?.props?.title == '序号' ||
                      props.title == '序号'
                    ? 'left'
                    : false
                }
                render={(value, record, key) => {
                  return (
                    <ArrayBase.Item key={key} index={key} record={null}>
                      {children.length > 0 ? (
                        children
                      ) : (
                        <span style={{ marginLeft: 8 }}>Droppable</span>
                      )}
                    </ArrayBase.Item>
                  )
                }}
              />
            )
          })}
          {columns.length === 0 && (
            <Table.Column render={() => <DroppableWidget />} />
          )}
        </Table>
        {additions.map((child) => {
          return <TreeNodeWidget node={child} key={child.id} />
        })}
      </ArrayBase>
    )
  }
  //表格列拖拽模版
  useDropTemplate('ArrayTable.Column', (source) => {
    return source.map((node) => {
      node.props.title = undefined
      return node
    })
  })

  return (
    <div {...nodeId} className="dn-array-table">
      {renderTable()}
      <LoadTemplate
        actions={[
          {
            title: node.getMessage('addSortHandle'), //添加排序操作
            icon: 'AddSort',
            onClick: () => {
              if (
                hasNodeByComponentPath(node, [
                  'ArrayTable',
                  '*',
                  'ArrayTable.Column',
                  'ArrayTable.SortHandle',
                ])
              )
                return
              const tableColumn = new TreeNode({
                //排序列节点
                componentName: 'Field',
                props: {
                  type: 'void',
                  'x-component': 'ArrayTable.Column',
                  'x-component-props': {
                    title: `排序`,
                  },
                },
                children: [
                  {
                    componentName: 'Field',
                    props: {
                      type: 'void',
                      'x-component': 'ArrayTable.SortHandle',
                    },
                  },
                ],
              })
              ensureObjectItemsNode(node).prepend(tableColumn) //追加于节点之前
            },
          },
          {
            title: node.getMessage('addIndex'), //添加索引操作
            icon: 'AddIndex',
            onClick: () => {
              if (
                hasNodeByComponentPath(node, [
                  'ArrayTable',
                  '*',
                  'ArrayTable.Column',
                  'ArrayTable.Index',
                ])
              )
                return
              const tableColumn = new TreeNode({
                //索引列节点
                componentName: 'Field',
                props: {
                  type: 'void',
                  'x-component': 'ArrayTable.Column',
                  'x-component-props': {
                    title: `序号`,
                  },
                },
                children: [
                  {
                    componentName: 'Field',
                    props: {
                      type: 'void',
                      'x-component': 'ArrayTable.Index',
                    },
                  },
                ],
              })
              const sortNode = findNodeByComponentPath(node, [
                'ArrayTable',
                '*',
                'ArrayTable.Column',
                'ArrayTable.SortHandle',
              ]) //排序列节点
              if (sortNode) {
                sortNode.parent.insertAfter(tableColumn) //追加于排序列节点之后
              } else {
                ensureObjectItemsNode(node).prepend(tableColumn) //追加于节点之前
              }
            },
          },
          {
            title: node.getMessage('addColumn'), //添加列操作
            icon: 'AddColumn',
            onClick: () => {
              //操作列节点
              const operationNode = findNodeByComponentPath(node, [
                'ArrayTable',
                '*',
                'ArrayTable.Column',
                (name) => {
                  return (
                    name === 'ArrayTable.Remove' ||
                    name === 'ArrayTable.Copy' ||
                    name === 'ArrayTable.MoveDown' ||
                    name === 'ArrayTable.MoveUp' ||
                    // name === 'ArrayTable.View' ||
                    name === 'ArrayTable.Edit'
                  )
                },
              ])
              //新增列节点
              const tableColumn = new TreeNode({
                componentName: 'Field',
                props: {
                  type: 'void',
                  'x-component': 'ArrayTable.Column',
                  'x-component-props': {
                    title: `Title`,
                  },
                },
              })
              if (operationNode) {
                operationNode.parent.insertBefore(tableColumn) //追加于操作列之前
              } else {
                ensureObjectItemsNode(node).append(tableColumn) //追加于节点
              }
            },
          },
          {
            title: node.getMessage('addOperation'), //添加操作列
            icon: 'AddOperation',
            onClick: () => {
              //操作列节点
              const oldOperationNode = findNodeByComponentPath(node, [
                'ArrayTable',
                '*',
                'ArrayTable.Column',
                (name) => {
                  return (
                    name === 'ArrayTable.Remove' ||
                    name === 'ArrayTable.Copy' ||
                    name === 'ArrayTable.MoveDown' ||
                    name === 'ArrayTable.MoveUp' ||
                    // name === 'ArrayTable.View'||
                    name === 'ArrayTable.Edit'
                  )
                },
              ])
              //添加行节点
              const oldAdditionNode = findNodeByComponentPath(node, [
                'ArrayTable',
                'ArrayTable.Addition',
              ])
              if (!oldOperationNode) {
                const operationNode = new TreeNode({
                  //新增操作列节点
                  componentName: 'Field',
                  props: {
                    type: 'void',
                    'x-component': 'ArrayTable.Column',
                    'x-component-props': {
                      title: `操作`,
                    },
                  },
                  children: [
                    {
                      componentName: 'Field',
                      props: {
                        type: 'void',
                        'x-component': 'ArrayTable.Edit',
                        'x-reactions': {
                          dependencies: [
                            {
                              property: 'value',
                              type: 'any',
                            },
                          ],
                          fulfill: {
                            run:
                              "    // try{\n    //   $props({\n    //   /**\n    //    * index 点击行的索引\n    //    */\n    //   onClick(index){\n    //     $self.query('CGJH_CGPMFDB').take((field)=>{//打开弹窗  SUB为自定义子表CODE\n    //       field.setValue({...$values['CGJHFDB'][index]})\n    //       field.setDecorator('ModalContainer',{//定义对象容器的弹窗属性\n    //         title:'编辑',//弹窗标题\n    //         visible: true,//弹窗显示状态\n    //         onCancel(){//弹窗取消按钮事件\n    //           field.setDecoratorProps({visible: false})//关闭对象容器弹窗\n    //         },\n    //         onOk(){//弹窗确定按钮事件\n    //           field.setDecoratorProps({visible: false})//关闭对象容器弹窗\n    //           $values['CGJHFDB'][index] = field.value//赋值到子表\n    //         }\n    //       })\n    //     })\n    //   }\n    // })\n    // }catch(e){\n    //   console.log('e',e)\n    // }\n    ",
                          },
                        },
                      },
                    },
                    // {
                    //   componentName: 'Field',
                    //   props: {
                    //     type: 'void',
                    //     'x-component': 'ArrayTable.View',
                    //     'x-reactions': {
                    //       dependencies: [
                    //         {
                    //           property: 'value',
                    //           type: 'any',
                    //         },
                    //       ],
                    //       fulfill: {
                    //         run:
                    //           "    // try{\n    //   $props({\n    //   /**\n    //    * index 点击行的索引\n    //    */\n    //   onClick(index){\n    //     $self.query('CGJH_CGPMFDB').take((field)=>{//打开弹窗  SUB为自定义子表CODE\n    //       field.setDecorator('ModalContainer',{//定义对象容器的弹窗属性\n    //         title:'查看',//弹窗标题\n    //         visible: true,//弹窗显示状态\n    //         onCancel(){//弹窗取消按钮事件\n    //           field.setDecoratorProps({visible: false})//关闭对象容器弹窗\n    //           $form.setFieldState(`CGJH_CGPMFDB.*`, (state) => {//取消不可编辑（可能会导致编辑状态情况下，不可编辑的字段也设为可编辑）\n    //             state['editable'] = true\n    //           })\n    //         },\n    //         onOk(){//弹窗确定按钮事件\n    //           field.setDecoratorProps({visible: false})//关闭对象容器弹窗\n    //         }\n    //       })\n    //       field.setValue({...$values['CGJHFDB'][index]})\n    //     })\n    //     $form.setFieldState(`CGJH_CGPMFDB.*`, (state) => {\n    //       state['editable'] = false //设置对象容器字段为不可编辑\n    //     })\n    //   }\n    // })\n    // }catch(e){\n    //   console.log('e',e)\n    // }\n    ",
                    //       },
                    //     },
                    //   },
                    // },
                    {
                      componentName: 'Field',
                      props: {
                        type: 'void',
                        'x-component': 'ArrayTable.Remove',
                      },
                    },
                    {
                      componentName: 'Field',
                      props: {
                        type: 'void',
                        'x-component': 'ArrayTable.Copy',
                        'x-reactions': {
                          dependencies: [
                            {
                              property: 'value',
                              type: 'any',
                            },
                          ],
                          fulfill: {
                            run:
                              "\ntry {\n  // $props({\n  //   /**\n  //    * value 复制行的值\n  //    * index 当前复制行的索引\n  //    */\n  //   onCopyClick(value,index){\n  //     //修改相关值域\n  //     value['WWW'] = 0\n  //     //子表赋值\n  //     $self.parent?.insert(index + 1, value)\n  //   }\n  // })\n} catch (e) {\n  console.log('e=', e)\n}",
                          },
                        },
                      },
                    },
                    {
                      componentName: 'Field',
                      props: {
                        type: 'void',
                        'x-component': 'ArrayTable.MoveDown',
                      },
                    },
                    {
                      componentName: 'Field',
                      props: {
                        type: 'void',
                        'x-component': 'ArrayTable.MoveUp',
                      },
                    },
                  ],
                })
                ensureObjectItemsNode(node).append(operationNode) //追加操作列
              }
              if (!oldAdditionNode) {
                const additionNode = new TreeNode({
                  componentName: 'Field',
                  props: {
                    type: 'void',
                    title: '添加行',
                    'x-component': 'ArrayTable.Addition',
                    'x-reactions': {
                      dependencies: [
                        {
                          property: 'value',
                          type: 'any',
                        },
                      ],
                      fulfill: {
                        run:
                          "try {\n  $props({\n    onClick(){//后置点击事件\n      try {\n      //自己逻辑\n      } catch (e) {\n        console.log('e=', e)\n      }\n    },\n    onPreClick(){//前置点击事件\n      try {\n        //自己的前置逻辑\n        return true//可继续往下进行（添加行内容）返回true 否则返回false\n      } catch (e) {\n        console.log('e=', e)\n      }\n    }\n  })\n} catch (e) {\n  console.log('e=', e)\n}",
                      },
                    },
                  },
                })
                ensureObjectItemsNode(node).insertAfter(additionNode) //追加添加行节点
              }
            },
          },
          {
            title: node.getMessage('addImport'),
            icon: <ImportOutlined />,
            onClick: () => {
              const oldAdditionNode = findNodeByComponentPath(node, [
                'ArrayTable',
                'ArrayTable.Importition',
              ])
              console.log('oldAdditionNode', oldAdditionNode)

              if (!oldAdditionNode) {
                const additionNode = new TreeNode({
                  componentName: 'Field',
                  props: {
                    type: 'void',
                    title: '导入/导出',
                    'x-component': 'ArrayTable.Importition',
                    'x-reactions': {
                      dependencies: [
                        {
                          property: 'value',
                          type: 'any',
                        },
                      ],
                      fulfill: {
                        run:
                          "\ntry {\n  // $props({\n  //   /**\n  //    * value 导入表单的值\n  //    */\n  //   onSufImportClick(value){\n  //     //修改相关值域\n  //     value[0]['WWW'] = 0\n  //     //子表赋值\n  //     $self.parent.setValue(value)\n  //   },\n  //   onPreExportClick(value){\n  //     value[0]['WWW'] =3333\n  //     return value\n  //   }\n  // })\n} catch (e) {\n  console.log('e=', e)\n}",
                      },
                    },
                  },
                })
                ensureObjectItemsNode(node).insertAfter(additionNode)
              }
            },
          },
        ]}
      />
    </div>
  )
})

ArrayBase.mixin(ArrayTable)

ArrayTable.Behavior = createBehavior(createArrayBehavior('ArrayTable'), {
  //创建表格列行为
  name: 'ArrayTable.Column',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'ArrayTable.Column',
  designerProps: {
    draggable: false,
    cloneable: false,
    droppable: true,
    allowDrop: (node) =>
      node.props['type'] === 'object' &&
      node.parent?.props?.['x-component'] === 'ArrayTable',
    allowAppend: (
      target,
      source //只可添加一个控件且不可再嵌套自增表格、手写签批、附件上传、关联文档组件
    ) =>
      target.children.length === 0 &&
      source.every(
        (node) =>
          node.props['x-component'] != 'ArrayTable' &&
          node.props['x-component'] != 'WriteSign' &&
          node.props['x-component'] != 'UploadFile' &&
          node.props['x-component'] != 'AttachmentBiz'
      ),
    propsSchema: createArrayColumnSchema(AllSchemas.ArrayTable.Column),
  },
  designerLocales: AllLocales.ArrayTableColumn,
})

ArrayTable.Resource = createResource({
  //创建表格资源
  icon: 'ArrayTableSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'array',
        'x-decorator': 'FormItem',
        'x-component-props': {
          isModal: false,
          isVisible: false,
        },
        'x-component': 'ArrayTable',
        'x-decorator-props': {
          labelWidth: '0px',
          labelStyle: {
            display: 'none',
          },
        },
        'x-reactions': {
          dependencies: [
            {
              property: 'value',
              type: 'any',
            },
          ],
          fulfill: {
            run:
              'try {\n  // const state = $observable({\n  //   selectedRows:[],\n  //   selectedRowKeys: []\n  // })\n  // $props({\n  //   /**\n  //    * 保存当前行数据\n  //    * record 当前操作行的value值\n  //    * index 当前操作行的索引\n  //    */\n  //   onSaveRecord(record, index){\n  //   },\n  //   designColumns:[//自定义列展示，配置此选项后（注：1.子表只展示该配置中的列，已设计过的列，未在此配置中不会展示 2.在此配置中存在，但未设计过的列会展示，但无内容匹配\n  //     {//需要序号列添加该配置\n  //       "title": "序号",\n  //       "dataIndex": "序号",\n  //       "key": "序号"\n  //     },\n  //     {\n  //       "title": "Other",//列头显示文字\n  //       "algin": "center",//设置列的对齐方式\t\n  //       "children": [\n  //         {//最后一层展示层的列设置会取设计的右侧配置\n  //           "title": "AGE",//列头显示文字\n  //           "dataIndex": "AGE",//列数据在数据项中对应的路径,以添加的列中取在此展示的字段\n  //           "key": "AGE"//一般与dataIndex一致,如果已经设置了唯一的 dataIndex，可以忽略这个属性\n  //         },\n  //         {\n  //           "title": "Address",\n  //           "children": [\n  //             {\n  //               "title": "STREET",\n  //               "dataIndex": "STREET",\n  //               "key": "STREET"\n  //             },\n  //             {\n  //               "title": "Block",\n  //               "children": [\n  //                 {\n  //                   "title": "BUILDING",\n  //                   "dataIndex": "BUILDING",\n  //                   "key": "BUILDING"\n  //                 },\n  //                 {\n  //                   "title": "Door No.",\n  //                   "dataIndex": "NUMBER",\n  //                   "key": "NUMBER"\n  //                 }\n  //               ]\n  //             }\n  //           ]\n  //         }\n  //       ]\n  //     },\n  //     {//需要操作列添加该配置\n  //       "title": "操作",\n  //       "dataIndex": "操作",\n  //       "key": "操作"\n  //     }\n  //   ],\n  //   rowSelection:{\n  //     selectedRowKeys: state.selectedRowKeys,\n  //     type: \'checkbox\',//radio单选  checkbox多选\n  //     onChange: (selectedRowKeys, selectedRows) => {\n  //       state.selectedRowKeys = selectedRowKeys\n  //       state.selectedRows = selectedRows\n  //     }\n  //   },\n  // })\n} catch (e) {\n  console.log(\'e=\', e)\n}',
          },
        },
      },
    },
  ],
})
