import MyIcon from '@/Icon'
import { AllLocales } from '@/custom/locales'
import { AllSchemas } from '@/custom/schemas'
import { createFieldSchema } from '@/designable/antd/components/Field'
import { createBehavior, createResource } from '@/designable/core'
import { DnFC } from '@/designable/react'
import { loopDataSource, reGetDataSource } from '@/utils/tableTree'
import { PlusSquareOutlined } from '@ant-design/icons'
import { observer, useField } from '@formily/react'
import { useModel } from '@umijs/max'
import { useRequest } from 'ahooks'
import { Input, TreeSelect, message } from 'antd'
import { TreeSelectProps } from 'antd/lib/tree-select'
import classnames from 'classnames'
import copy from 'copy-to-clipboard'
import { cloneDeep } from 'lodash'
import { useEffect, useState } from 'react'
import { initStyle } from '../../../service/constant'
import './index.less'
import styles from './index.less'
import Look from './look'
import TabelModal from './tabelModal'
const defaultKey = 'ID'
//组件的属性，可以用antd组件的属性，也可以自定义属性
interface ExtraProps extends TreeSelectProps {
  onOk?: any //弹框确认信息
  searchPlaceholder: '' //搜索框的空文本提示
  onSearch?: any //搜索框
  columns?: any //table列
  dataSource?: any //table数据源
  checkStrictly?: any //是否末级管控
  selectionType?: any //是否单选多选
  getDataSource?: any //获取table的dataSource
  onExpand?: any //展开的请求接口
  getSelectRows?: any //获取回显的数据
  getYear?: any //获取参数年
  getDetailInfo?: any //查看功能
  showLook?: boolean //是否显示查看
  searchWordFn?: any //输入搜索
  deleteData?: any //删除tabel数据
  isMutliple?: any //查看功能多条
  getState?: any //给响应器中的state赋值
  advancedSearch?: any //高级搜索
  rowKey?: any //弹框tabel的key
  lookDetailFn?: any //查看详情
}
const width = document.documentElement.clientWidth
const height = document.documentElement.clientHeight
export const TreeTable: DnFC<ExtraProps> = observer((props) => {
  const {
    getDetailInfo,
    showLook,
    getDataSource,
    selectionType,
    columns,
    isMutliple,
    lookDetailFn,
  } = props
  console.log('props.noDisabledLevel==', props)
  const id = props?.rowKey || defaultKey
  const field = useField()
  const [childFun, setChildFun] = useState()
  const [isRemoveLister, setIsRemoveLister] = useState(false)
  //const childRef = useRef()
  const childRef = (ref: any) => {
    setChildFun(ref)
  }
  const [isShowModal, setIsShowModal] = useState<boolean>(false) //是否显示弹框
  const [dataSource, setDataSource] = useState<any>([]) //tabel数据
  const [isShowLookModal, setIsShowLookModal] = useState<any>(false) //查看
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([])
  const [selectedRows, setSelectedRows] = useState<any>([])
  const [expandedRowKeys, setExpandedRowKeys] = useState<any>([]) //展开节点
  const [expandedRows, setExpandedRows] = useState<any>([]) //展开节点
  const [searchWord, setSearchWord] = useState<string>('') //下拉的搜索词
  const masterProps = useModel('@@qiankunStateFromMaster')
  let { targetKey } = masterProps
  useEffect(() => {
    if (field.data) {
      setDataSource(cloneDeep(loopDataSource(field.data.data)))
    }
  }, [field.data])
  useEffect(() => {
    setIsShowModal(props.isShowModal)
  }, [props.isShowModal])
  // useEffect(() => {
  //   if (!isShowModal) {
  //     //取消弹窗时取消激活状态
  //     field.onBlur()
  //   }
  // }, [isShowModal])
  const TabelRender = () => {
    if (isShowModal) {
      return (
        <TabelModal
          setDataSource={setDataSource}
          dataSource={dataSource}
          props={props}
          setIsShowModal={setIsShowModal}
          field={field}
          loopDataSource={loopDataSource}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          id={id}
          tabelRef={childRef}
          expandedRowKeys={expandedRowKeys}
          setExpandedRowKeys={setExpandedRowKeys}
          onExpand={onExpand}
        />
      )
    } else {
      return ''
    }
  }
  //查看
  const showLookFn = () => {
    // if (dd.env.platform !== 'notInDingTalk') {
    //   dd.ready(function () {
    //     dd.device.screen.rotateView({
    //       showStatusBar: true, // 否显示statusbar
    //       clockwise: true, // 是否顺时针方向
    //       onSuccess: function (result) {},
    //       onFail: function (err) {},
    //     })
    //   })
    // }
    if (window.location.href.includes('mobile')) {
      document.documentElement.style.transform = 'rotate(90deg)'
      document.documentElement.style.width = `${height}px`
      document.documentElement.style.overflow = 'hidden'
      document.documentElement.style.position = `relative`
      document.getElementById(
        `formShow_container_${targetKey}`
      ).style.position = 'static' //IOS safari浏览器中出现的z-index不生效的层级问题
    }

    if ((lookDetailFn && lookDetailFn()) || !lookDetailFn) {
      setIsShowLookModal(true)
    }
  }
  const searchWordFn = async (search: any) => {
    if (props.showSearch && !search) {
      return
    }
    await props?.getYear?.()
    await props?.getState?.()
    await props.getDataSource?.(1, 1000, { searchWord: search })
  }
  // //搜索
  const { data, loading, run } = useRequest(searchWordFn, {
    debounceWait: 1000,
    manual: true,
  })
  //树下拉的选择
  const changeSelect = (value: any, label: any, extra: any) => {
    console.log('value===', value)
    let values = value
    if (props.selectionType == 'radio') {
      values = [value]
    }
    let tmpKeys = []
    let tmpSelectRows = []
    let tmpLabel = []
    if (value && values.length) {
      values.map((item: any) => {
        if (!item.label) {
          item.label = item.value
        }
        tmpLabel.push(item.value)
        tmpKeys.push(item['value'])
        let tmpRow = dataSource.filter((i) => i[id] == item['value'])
        tmpSelectRows.push(tmpRow?.[0])
      })
      if (props.selectionType == 'radio') {
        //单选的话是选中就执行onok
        if (!isShowModal) {
          setDataSource([])
          setTimeout(() => {
            try {
              props?.onOk?.(tmpSelectRows)
            } catch {
              console.log('响应器配置错误')
            }
          }, 1)
          setSelectedRows([])
          setSelectedRowKeys([])
        }
      } else {
        //多选的时候是onblur在执行
        field.setValue(tmpKeys)
        setSelectedRowKeys(tmpKeys)
        setSelectedRows(tmpSelectRows)
      }
    } else {
      //清空
      try {
        props?.onOk?.([])
      } catch {
        console.log('响应器代码错误')
      }
    }
  }
  //循环数据获取node
  const loopNodeByData = (dataSource: any, currentKey: any) => {
    let node = ''
    dataSource.map((item: any) => {
      if (item[id] == currentKey) {
        console.log('item=====', item)
        node = item
        return
      } else if (item.children && item.children.length) {
        loopNodeByData(item.children, currentKey)
      }
    })
    return node
  }

  //树形列表的展开
  const onExpand = (start: number, expanded: any, record: any) => {
    const callback = (list: any, data: any, limit: number) => {
      debugger
      list &&
        list.map((item: any, index: number) => {
          if (record.allParentInfos) {
            let tmpallParentInfos = _.cloneDeep(record.allParentInfos)
            tmpallParentInfos.push(record)
            item.allParentInfos = tmpallParentInfos
          } else {
            item.allParentInfos = [record]
          }
        })
      let newDataSource = reGetDataSource(
        start,
        columns,
        id,
        record,
        dataSource,
        list,
        data?.currentPage || 0,
        data?.returnCount || 0,
        limit
      )
      setDataSource(cloneDeep(newDataSource))
      if (expanded) {
        if (start == 1) {
          //只有第一次展开的时候才记录展开的key,点击更多不做操作
          const tmp = cloneDeep(expandedRowKeys)
          const tmpInfo = cloneDeep(expandedRows)
          tmp.push(record[id])
          tmpInfo.push(record)
          setExpandedRows(tmpInfo)
          setExpandedRowKeys(tmp)
        }
      }
    }
    if (expanded) {
      props?.onExpand?.(expanded, record, callback, start)
    } else {
      //删除本级及下级节点
      let deleteIds = []
      const loopRecord = (data: Array<any>, deleteIds: any) => {
        data &&
          data.map((item: any) => {
            deleteIds.push(item[id])
            if (item.children && item.children.length) {
              deleteIds = loopRecord(item.children, deleteIds)
            }
          })
        return deleteIds
      }
      deleteIds.push(record[id])
      deleteIds = loopRecord(record.children, deleteIds)
      console.log('indexs =', deleteIds)
      const newExpandedRowKeys = expandedRowKeys.filter(
        (i: any) => !deleteIds.includes(i)
      )
      const newExpandedRows = expandedRows.filter(
        (i: any) => !deleteIds.includes(i[id])
      )
      setExpandedRows(newExpandedRows)
      setExpandedRowKeys(newExpandedRowKeys)
    }
  }
  //展开收起
  const onTreeExpand = (expandedKeys) => {
    //取差集
    if (expandedKeys.length > expandedRowKeys.length) {
      //新增一个展开
      let currentKeys = expandedKeys.filter((i) => !expandedRowKeys.includes(i))
      let currentKey = currentKeys?.[0]
      console.log('currentKey==', currentKey)
      //通过currentKey获取当前选中的node
      let node = loopNodeByData(dataSource, currentKey)
      onExpand(1, true, node)
    }
    setExpandedRowKeys(expandedKeys)
  }
  //复制文本
  const copyText = (e: any) => {
    if (field.editable || window.location.href?.includes('formDesigner')) {
      // 获取元素内容
      let text = ''
      debugger
      if (props.selectionType != 'radio') {
        text = document
          .getElementById(
            `tree_table_${targetKey}_${field.path.segments.join('_')}`
          )
          ?.getElementsByClassName('ant-select-selection-item-content')[0]
          ?.innerHTML
      } else {
        text = document
          .getElementById(
            `tree_table_${targetKey}_${field.path.segments.join('_')}`
          )
          ?.getElementsByClassName('ant-select-selection-item')[0]?.innerHTML
      }
      // 执行复制命令
      if (text) {
        copy(text)
        // document
        // .getElementById(
        //   `tree_table_${targetKey}_${field.path.segments.join('_')}`
        // )
        // ?.getElementsByClassName('ant-select-selection-item')[0]
        // .setAttribute('style', 'color: #ffffff;background: #448EF7;')
        // // 鼠标点击事件
        // setTimeout(()=>{
        //   document.addEventListener('click', listenerFn)
        // },2)
        message.success('复制成功')
      } else {
        message.error('暂无数据')
      }
    } else {
      //查看页面
      // 获取元素内容
      // const text =document.getElementById(`tree_table_${targetKey}_${field.path.segments.join('_')}`)?.getElementsByClassName('ant-input')[0]?.value;
      // // 执行复制命令
      // navigator.clipboard.writeText(text).then(function() {
      //   document.getElementById(`tree_table_${targetKey}_${field.path.segments.join('_')}`)?.getElementsByClassName('ant-input')[0].setAttribute("style", "color: #ffffff;background: #448EF7;");
      //   // 鼠标点击事件
      //   // document.addEventListener('click',listenerFn);
      //   message.success('复制成功');
      // }).catch(function(error) {
      //   console.log('复制失败',error);
      // });
    }
  }
  // function listenerFn() {
  //   if (isRemoveLister) {
  //     setIsRemoveLister(false)
  //   } else {
  //     if (field.editable || window.location.href?.includes('formDesigner')) {
  //       document
  //         .getElementById(
  //           `tree_table_${targetKey}_${field.path.segments.join('_')}`
  //         )
  //         ?.getElementsByClassName('ant-select-selection-item')[0]
  //         .setAttribute('style', 'color: #333333;background:initial;')
  //     } else {
  //       document
  //         .getElementById(
  //           `tree_table_${targetKey}_${field.path.segments.join('_')}`
  //         )
  //         ?.getElementsByClassName('ant-input')[0]
  //         .setAttribute('style', 'color: #333333;background:initial;')
  //     }
  //     setIsRemoveLister(true)
  //   }
  // }
  // useEffect(() => {
  //   //点击一次click就取消监听
  //   if (isRemoveLister) {
  //     // 在这里移除监听器
  //     document.removeEventListener('click', listenerFn)
  //   }
  // }, [isRemoveLister])
  return (
    <>
      <div
        className={classnames(styles.tree_tabel_warp, props.redClassName)}
        onBlur={() => {
          if (props.selectionType != 'radio') {
            //多选且有搜索词的时候才需要触发onblur
            if (
              !isShowModal &&
              props.showSearch &&
              selectedRows.length &&
              searchWord
            ) {
              setDataSource([])
              try {
                props?.onOk?.(selectedRows)
              } catch {
                console.log('响应器配置错误')
              }
              setSelectedRows([])
              setSelectedRowKeys([])
              setSearchWord('')
            }
          }
        }}
        style={
          field.editable || window.location.href?.includes('formDesigner')
            ? { ...props?.style }
            : { ...props?.style, background: '#f5f5f5' }
        }
        id={`tree_table_${targetKey}_${field.path.segments.join('_')}`}
      >
        {field.editable || window.location.href?.includes('formDesigner') ? (
          <TreeSelect
            {...props}
            placeholder={props.disabled ? '' : props.placeholder}
            className={
              showLook
                ? classnames(styles.tree_select_warp, styles.t_w)
                : classnames(styles.tree_select_warp)
            }
            style={{ overflow: 'hidden' }}
            allowClear={field.value ? true : false}
            value={
              field.authType != 'NONE' && field.value
                ? field.value
                : props.selectionType == 'radio'
                ? ''
                : []
            }
            onSearch={(newValue) => {
              let tmpSearchWord = searchWord
              setSearchWord(newValue)
              if (!newValue && props.searchOfValue) {
                props.searchOfValue?.(tmpSearchWord)
              } else {
                if (props.selectionType == 'radio') {
                  field.setValue('')
                } else {
                  field.setValue([])
                }
              }
              props.showSearch && run(newValue)
            }}
            searchValue={searchWord}
            dropdownStyle={
              !props.showSearch || isShowModal || !searchWord
                ? { display: 'none' }
                : { display: 'block' }
            }
            showSearch
            loading={loading}
            fieldNames={{
              label: props?.columns?.()?.['fieldNames']?.['label'],
              value: id,
              children: 'children',
            }}
            onTreeExpand={onTreeExpand}
            multiple={props.selectionType == 'radio' ? false : true}
            showArrow={true}
            treeCheckable={props.selectionType == 'radio' ? false : true}
            treeCheckStrictly={props.selectionType == 'radio' ? false : true}
            labelInValue={true}
            treeNodeLabelProp={'label'}
            suffixIcon={
              <>
                <MyIcon
                  className={styles.copy_text_icon}
                  type="icon-fuzhi"
                  onClick={copyText.bind(this)}
                  style={{ color: '#333333' }}
                />
                <MyIcon
                  type="icon-tongyong"
                  onClick={
                    !props.disabled
                      ? async () => {
                          setIsShowModal(true)
                        }
                      : () => {}
                  }
                  style={
                    !props.disabled
                      ? { color: '#333333' }
                      : { color: '#D9D9D9' }
                  }
                />
                {showLook && (
                  <MyIcon
                    type="icon-chakan"
                    onClick={!props.disabled ? showLookFn : () => {}}
                    style={
                      !props.disabled
                        ? { color: '#333333' }
                        : { color: '#D9D9D9' }
                    }
                  />
                )}
              </>
            }
            filterTreeNode={false}
            treeData={dataSource}
            onChange={changeSelect.bind(this)}
          />
        ) : (
          <Input
            {...props}
            placeholder={props.disabled ? '' : props.placeholder}
            style={{}}
            allowClear={false}
            value={field.authType != 'NONE' && field.value ? field.value : ''}
            className={styles.input_disable}
            title={field.authType != 'NONE' && field.value ? field.value : ''}
            addonAfter={
              <>
                {/* <MyIcon
                  type="icon-fuzhi"
                  onClick={copyText.bind(this)}
                  style={{ color: '#333333' }}
                /> */}
                <MyIcon
                  type="icon-tongyong"
                  onClick={
                    !props.disabled
                      ? async () => {
                          setIsShowModal(true)
                        }
                      : () => {}
                  }
                  style={
                    !props.disabled
                      ? { color: '#333333' }
                      : { color: '#D9D9D9' }
                  }
                />
                {showLook && (
                  <MyIcon
                    type="icon-chakan"
                    onClick={showLookFn}
                    style={
                      !props.disabled
                        ? { color: '#333333' }
                        : { color: '#D9D9D9' }
                    }
                  />
                )}
              </>
            }
          />
        )}
        {isShowLookModal && (
          <Look
            setIsShowLookModal={setIsShowLookModal}
            getDetailInfo={getDetailInfo}
            isMultiple={isMutliple}
            columns={columns}
            title={props.lookTitle}
            docWidth={width}
          />
        )}
      </div>
      {TabelRender()}
    </>
  )
})

TreeTable.Behavior = createBehavior({
  name: 'TreeTable',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'TreeTable',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.TreeTable),
  },
  designerLocales: AllLocales.TreeTable,
})

TreeTable.Resource = createResource({
  icon: <PlusSquareOutlined className="custom-icon" />,
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'string',
        title: 'TreeTable',
        'x-decorator': 'FormItem',
        'x-component': 'TreeTable',
        'x-component-props': {
          checkStrictly: false,
          selectionType: 'radio',
          showSearch: true,
          isShowModal: false,
          style: {
            ...initStyle?.style,
          },
        },
        'x-decorator-props': {
          labelStyle: {
            ...initStyle?.labelStyle,
          },
        },
      },
    },
  ],
})
