/**
 * 废弃文件
 */
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { useSetState } from 'ahooks'
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Image,
  Input,
  Modal,
  Select,
  Tabs,
  Tree,
  message,
} from 'antd'
import moment from 'moment'
import { useCallback, useEffect, useState } from 'react'
import { useModel } from 'umi'
import IUpload from '../../../public/Upload/uploadModal'
import ReSizeLeftRight from '../../../public/reSizeLeftRight/reSizeLeftRight.jsx'
import { dataFormat, dealBigMoney, formatDate } from '../../../utils/utils'
import AddInvoiceModal from './addInvoiceModal'
import styles from './index.less'
import MoveSortModal from './moveSortModal'
import UpdateInvoiceModal from './updateInvoiceModal'
const { Option } = Select
const { confirm } = Modal
const dateFormat = 'YYYY-MM-DD HH:mm:ss'
function invoiceModal({ onCancel, onOkInvoice, value }) {
  const masterProps = useModel('@@qiankunStateFromMaster')
  const { targetKey } = masterProps
  const { TreeNode } = Tree
  const [form] = Form.useForm()
  const {
    getInvoiceTree, //查询票据分类树
    deleteInvoiceTree, //删除票据分类
    getInvoiceList, //查询发票列表
    uploadInvoice, //上传发票
    updateInvoiceList, //修改发票（OCR识别，验真）
    getDetailInvoice, //查询单张发票信息
    deleteInvoiceList, //删除发票
    getDictType,
  } = useModel('invoice')
  interface State {
    treeData?: any
    isShow?: any
    searchWord?: any
    currentPage?: any
    limit?: any
    invoiceList?: any
    isShowUpdate?: any
    isShowMove?: any
    fileExists?: any
    needfilepath?: any
    sortId?: any
    basicInformationData?: any
    singleId?: any
    typeList?: any
    type?: any
    compareData?: any
    returnCount?: any
    allPage?: any
    parentId?: any
    detailData?: any
    invoiceIds?: any
    searchTree?: any
    dropArray?: any
    isSort?: any
    sortTreeData?: any
  }
  const [state, setState] = useSetState<State>({
    treeData: [
      {
        title: '票据分类',
        key: '0',
        classifyName: '票据分类',
        classifyId: '0',
        children: [],
      },
    ],
    isShow: false,
    currentPage: 1,
    limit: 100000,
    searchWord: '',
    invoiceList: [], //发票列表
    isShowUpdate: false,
    isShowMove: false,
    needfilepath: '', //需要的minio路径
    sortId: '',
    basicInformationData: {}, //单条发票信息
    singleId: '', //单条id
    typeList: [], //发票类型（码表）
    type: '',
    compareData: [],
    returnCount: 0,
    allPage: 0,
    parentId: '',
    detailData: {},
    invoiceIds: '',
    searchTree: '',
    dropArray: [],
    isSort: false,
    sortTreeData: [
      {
        title: '票据分类',
        key: '0',
        classifyName: '票据分类',
        classifyId: '0',
        children: [],
      },
    ],
  })
  const {
    treeData,
    isShow,
    searchWord,
    currentPage,
    limit,
    invoiceList,
    isShowUpdate,
    isShowMove,
    sortId,
    basicInformationData,
    singleId,
    typeList,
    compareData,
    parentId,
    detailData,
    dropArray,
    isSort,
    sortTreeData,
  } = state
  const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } }
  const [chooseLabel, setChooseLabel] = useState([]) // 选择的多选标签
  const [initLabels, setInitLabels] = useState([]) // 全部的标签labelKey组成的列表
  const [indeterminate, setIndeterminate] = useState(false)
  const [checkAlls, switchCheckAll] = useState(false) // 全选flag
  const [invoiceCode, setInvoiceCode] = useState('') //发票code
  const [invoiceTime, setInvoiceTime] = useState(0) //开票日期
  const [expandedKeys, setExpandedKeys] = useState(['0'])
  const [sortExpandedKeys, setSortExpandedKeys] = useState(['0'])
  // const [centerVum, setCenterVum] = useState(
  //   document?.getElementById('formShow_container')?.offsetWidth * 0.97 - 526
  // )

  useEffect(() => {
    setInitLabels(invoiceList)
  }, [invoiceList])
  const onResize = useCallback(() => {
    setCenterVum(
      document?.getElementById('formShow_container')?.offsetWidth * 0.97 - 526
    )
  }, [])

  useEffect(() => {
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])
  useEffect(() => {
    setChooseLabel(value || [])
  }, [value])

  // const uploadSuccess = (payload, callback) => {
  //   uploadInvoice(
  //     {
  //       invoiceClassifyId: sortId,
  //       invoiceFilePath: payload.fileurl,
  //     },
  //     () => {
  //       callback && callback()
  //       getInvoiceListFn(sortId, searchWord, currentPage, limit)
  //     }
  //   )
  // }
  const uploadSuccess = (filePath, fileId) => {
    uploadInvoice(
      {
        invoiceClassifyId: sortId,
        invoiceFilePath: filePath,
        fileStorageId: fileId,
      },
      () => {
        getInvoiceListFn(sortId, searchWord, currentPage, limit)
      }
    )
  }

  useEffect(() => {
    form.setFieldsValue({
      useStatus: basicInformationData.useStatus == '1' ? '已使用' : '未使用',
      ocrStatus: basicInformationData?.ocrStatus,
      verificationStatus: basicInformationData?.verificationStatus,
      createTime: dataFormat(
        basicInformationData?.createTime,
        'YYYY-MM-DD HH:mm:ss'
      ),
      createUserName: basicInformationData?.createUserName,
      invoiceType: basicInformationData.invoiceTypeName,
      invoiceDate: basicInformationData.invoiceDate
        ? moment(
            formatDate(basicInformationData.invoiceDate, dateFormat),
            dateFormat
          )
        : null,
      invoiceCode: basicInformationData.invoiceCode,
      invoiceNum: basicInformationData.invoiceNum,
      taxPriceInnums: basicInformationData.taxPriceInnums,
      buyerName: basicInformationData.buyerName,
    })
  }, [basicInformationData])

  // 单选
  useEffect(() => {
    if (chooseLabel?.length <= 0) {
      //未选择数据的初始状态
      setIndeterminate(true)
      switchCheckAll(false)
      return
    }
    let flag = -2
    invoiceList.forEach((item) => {
      //从当前列表中搜索已选择的数据
      if (flag == -1) {
        //存在未找到的数据则还未全部勾选；反之
        return
      }
      flag = chooseLabel.findIndex((c) => {
        return c == item.invoiceId
      })
    })
    setIndeterminate(flag >= 0 ? false : true)
    switchCheckAll(flag >= 0 ? true : false)
  }, [chooseLabel, invoiceList])

  const checkThis = (list) => {
    let arr = chooseLabel
    invoiceList.forEach((element) => {
      //从已选择的id中过滤掉当前列表的id
      arr = arr.filter((c) => {
        return c != element.invoiceId
      })
    })
    arr = list?.concat(arr) //追加当前列表上选中的数据
    setChooseLabel(arr)
    getDetailInvoiceFn(arr?.[arr?.length - 1])
  }
  // 全选
  const onCheckAllChange = (e) => {
    let arr = chooseLabel
    initLabels.forEach((item) => {
      if (item.useStatus == '0') {
        if (!e.target.checked) {
          //取消全选
          arr = arr.filter((a) => {
            return a != item.invoiceId
          }) //从已选择的id中过滤掉当前列表的id
        } else {
          //全选
          arr.push(item.invoiceId) //追加当前列表上所有的数据
        }
      }
    })
    setChooseLabel(arr)
    getDetailInvoiceFn(arr?.[arr?.length - 1])
    setIndeterminate(false)
    switchCheckAll(e.target.checked)
  }
  useEffect(() => {
    getInvoiceTreeFn('', '0')
    getInvoiceType()
    getInvoiceListFn(0, '', 1, limit)
  }, [])
  //数据码表 发票类型
  const getInvoiceType = () => {
    getDictType(
      {
        dictTypeCode: 'FPLX',
        showType: 'ALL',
        searchWord: '',
        isTree: '1',
      },
      (data) => {
        setState({
          typeList: data.data.list,
        })
      }
    )
  }

  const filterKeys = (children, keys) => {
    //过滤子集的expandkey
    children?.forEach((item) => {
      keys = keys.filter((k) => {
        return k != item.classifyId
      })
      if (item?.children?.length > 0) {
        keys = filterKeys(item?.children, keys)
      }
    })
    return keys
  }
  const getInvoiceTreeFn = (
    classifyName?: any,
    classifyId?: any,
    isOperation?: any
  ) => {
    getInvoiceTree(
      {
        classifyName,
        classifyId,
      },
      (data) => {
        let treeDataArray = treeData
        if (isSort) {
          treeDataArray = sortTreeData
        }
        const loopTree = (data, parentId, children?: any) => {
          data.forEach((item, index) => {
            if (isOperation) {
              let keys = expandedKeys.filter((ex) => {
                return ex != item.classifyId
              })
              keys = filterKeys(children, keys)
              setExpandedKeys(keys)
            }
            item.parentId = parentId
            item.title = isSort ? (
              item.classifyName
            ) : (
              <div className={styles.treeNode}>
                <span>
                  {item.classifyName}
                  <span className={styles.button_menu}>
                    <span
                      onClick={(e) => {
                        addInvoiceSort(item)
                      }}
                    >
                      <PlusOutlined title="新增" />
                    </span>
                    <span
                      onClick={(e) => {
                        updateInvoiceSort(item, parentId)
                      }}
                    >
                      <EditOutlined title="修改" />
                    </span>
                    <span>
                      <DeleteOutlined
                        title="删除"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteSort(item.classifyId, parentId)
                        }}
                      />
                    </span>
                  </span>
                </span>
              </div>
            )
            item.key = item.classifyId
            if (item.isHaveChild == '1') {
              item.children = [{ key: '-1' }]
            }
          })
          return data
        }
        if (treeDataArray[0].children.length == 0 || classifyId == 0) {
          treeDataArray[0].children = loopTree(data.data.jsonResult, 0)
          treeDataArray[0].title = isSort ? (
            treeDataArray[0].classifyName
          ) : (
            <div className={styles.treeNode}>
              <span>
                {' '}
                {treeDataArray[0].classifyName}
                <span className={styles.button_menu}>
                  {
                    <span
                      onClick={(e) => {
                        addInvoiceSort(treeDataArray[0])
                      }}
                    >
                      <PlusOutlined />
                    </span>
                  }
                </span>
              </span>
            </div>
          )
        } else {
          setState({
            compareData: loopTree(data.data.jsonResult, classifyId),
          })
          const each = (jsonData) => {
            let isFind = false
            jsonData?.forEach((item) => {
              if (isFind) {
                return
              }
              if (item.classifyId == classifyId) {
                item.children = loopTree(
                  data.data.jsonResult,
                  classifyId,
                  item.children
                )
                isFind = true
                return
              } else {
                if (item?.children?.length != 0) {
                  each(item?.children)
                }
              }
            })
          }
          each(treeDataArray)
        }
        if (isSort) {
          setState({
            sortTreeData: [...treeDataArray],
          })
        } else {
          setState({
            treeData: [...treeDataArray],
          })
        }
      }
    )
  }

  const getInvoiceListFn = (classifyId, searchWord, start, limit) => {
    getInvoiceList(
      {
        classifyId,
        searchWord,
        start,
        limit,
        useStatus: 0,
      },
      (data) => {
        setState({
          returnCount: data.data.returnCount,
          allPage: data.data.allPage,
          currentPage: data.data.currentPage,
          invoiceList: data.data.list,
        })
      }
    )
  }
  const onSelect = (selectedKeys, info) => {
    if (selectedKeys?.length <= 0) {
      return
    }
    getInvoiceListFn(selectedKeys.join(','), '', 1, limit)
    setState({
      sortId: selectedKeys.join(','),
    })
  }
  const addInvoiceSort = (item) => {
    setState({
      isShow: true,
      parentId: item.classifyId,
    })
  }
  const updateInvoiceSort = (val, parentId) => {
    setState({
      isShowUpdate: true,
      detailData: val,
      parentId,
    })
  }
  //展开节点
  const onExpand = (expandedKeys: Array<any>, { expanded, node }) => {
    if (expanded && node.isHaveChild == 1) {
      getInvoiceTreeFn('', node.key)
    }
    if (!expanded) {
      expandedKeys = filterKeys(node?.children, expandedKeys)
    }
    if (isSort) {
      setSortExpandedKeys(expandedKeys)
    } else {
      setExpandedKeys(expandedKeys)
    }
  }

  const onChange = (key) => {
    console.log(key)
  }
  //删除分类
  const deleteSort = (id, parentId) => {
    confirm({
      content: '确认要删除吗？',
      mask: false,
      getContainer: () => {
        return document.getElementById(`formShow_container_${targetKey}`)
      },
      onOk: () => {
        deleteInvoiceTree(
          {
            calssifyIds: id,
          },
          () => {
            getInvoiceTreeFn('', parentId, true)
          }
        )
      },
    })
  }
  const serachValueTree = (value) => {
    setState({
      searchTree: value,
    })
    getInvoiceTreeFn(value, 0)
  }
  //移动分类
  const moveSort = () => {
    setState({
      isShowMove: true,
      isSort: true,
    })
  }
  //删除票据
  const deleteInvoice = (ids) => {
    console.log(ids)
    if (ids.length > 0) {
      confirm({
        content: '确认要删除吗？',
        mask: false,
        getContainer: () => {
          return document.getElementById(`formShow_container_${targetKey}`)
        },
        onOk: () => {
          deleteInvoiceList(
            {
              invoiceIds: ids.join(','),
            },
            () => {
              getInvoiceListFn(sortId, searchWord, currentPage, limit)
            }
          )
        },
      })
    } else {
      message.error('请选择要删除的发票')
    }
  }
  const getDetailInvoiceFn = (invoiceId?: any) => {
    getDetailInvoice(
      {
        invoiceId,
      },
      (data) => {
        setState({
          singleId: invoiceId,
          basicInformationData: data.data,
        })
      }
    )
  }
  //查询单张发票信息
  const getBasicInformation = (item) => {
    getDetailInvoiceFn(item.invoiceId)
    setState({
      singleId: item.invoiceId,
    })
  }
  const saveInvoice = () => {
    const values = form.getFieldsValue()
    updateInvoiceList(
      {
        invoiceId: singleId,
        invoiceTypeCode: invoiceCode
          ? invoiceCode
          : basicInformationData.invoiceCode,
        invoiceTypeName: values.invoiceType,
        invoiceDate: invoiceTime
          ? invoiceTime
          : basicInformationData.invoiceDate,
        invoiceCode: values.invoiceCode,
        invoiceNum: values.invoiceNum,
        taxPriceInnums: values.taxPriceInnums,
        taxPriceInwords: dealBigMoney(values.taxPriceInnums),
        buyerName: values.buyerName,
      },
      () => {
        getDetailInvoiceFn(singleId)
        getInvoiceListFn(sortId, '', 1, 10)
      }
    )
  }
  //存储发票Code
  const changeType = (value, e) => {
    setInvoiceCode(e.key)
  }
  //选择时间
  const changeTime = (value, dateString) => {
    console.log('Formatted Selected Time: ', dateString)
  }
  const onOk = (value) => {
    setInvoiceTime(Math.round(value._d / 1000))
  }
  const searchInvoice = (value) => {
    getInvoiceListFn(sortId, value, 1, limit)
  }

  const leftChildren = (
    <div className={styles.departmentTree}>
      <Input.Search
        className={styles.search}
        placeholder={'请输入分类名称'}
        allowClear
        onSearch={serachValueTree}
      />
      <Tree
        showLine={false}
        showIcon={false}
        onSelect={onSelect}
        onExpand={onExpand}
        treeData={treeData}
        expandedKeys={expandedKeys}
      />
    </div>
  )
  const rightLeftChildren = (
    <div className={styles.image}>
      <p>
        <Checkbox
          indeterminate={indeterminate}
          onChange={(e) => onCheckAllChange(e)}
          checked={checkAlls}
          defaultChecked={false}
        >
          全部选中
        </Checkbox>
      </p>
      <div className={styles.picture_container}>
        <Checkbox.Group
          value={chooseLabel}
          onChange={(e) => checkThis(e)}
          style={{ display: 'flex', flexWrap: 'wrap' }}
        >
          {invoiceList?.map((item, index) => {
            return (
              <div
                key={item.invoiceId}
                className={styles.item}
                onClick={() => {
                  getBasicInformation(item)
                }}
              >
                <Image src={item.invoiceFilePath} style={{ width: '100%' }} />
                <div className={styles.picture_desc}>
                  <div className={styles.picture_t}>
                    <Checkbox
                      value={item.invoiceId}
                      key={item.invoiceId}
                      disabled={item.useStatus == '1' ? true : false}
                      onClick={(e) => {
                        e.stopPropagation()
                      }}
                    >
                      {item.invoiceTypeName}
                    </Checkbox>
                    <p
                      className={
                        item.useStatus == '1'
                          ? styles.picture_s
                          : styles.picture_u
                      }
                    >
                      {item.useStatus == '1' ? '已使用' : '未使用'}
                    </p>
                  </div>
                  <div className={styles.picture_b}>
                    {dataFormat(item.invoiceDate, 'YYYY-MM-DD')}
                  </div>
                </div>
              </div>
            )
          })}
        </Checkbox.Group>
      </div>
    </div>
  )

  const rightRightChildren = (
    <div className={styles.basic_information}>
      <Tabs
        className={styles.tab_container}
        defaultActiveKey="1"
        onChange={onChange}
        items={[
          {
            label: `基础信息`,
            key: '1',
            children: (
              <Form form={form} className={styles.form_container} colon={false}>
                <h4>基础信息</h4>
                <Form.Item
                  label="票据类型"
                  name="invoiceType"
                  {...layout}
                  style={{ marginBottom: '8px!important' }}
                >
                  <Select onChange={changeType} className={styles.form_input}>
                    {typeList.map((item, index) => {
                      return (
                        <Option
                          value={item.dictInfoName}
                          key={item.dictTypeInfoCode}
                        >
                          {item.dictInfoName}
                        </Option>
                      )
                    })}
                  </Select>
                </Form.Item>
                <Form.Item
                  label="上传时间"
                  name="createTime"
                  {...layout}
                  style={{ marginBottom: '8px!important' }}
                >
                  <Input disabled className={styles.form_input} />
                </Form.Item>
                <Form.Item
                  label="创建人"
                  name="createUserName"
                  {...layout}
                  style={{ marginBottom: '8px!important' }}
                >
                  <Input disabled className={styles.form_input} />
                </Form.Item>
                <h4>票据主要信息</h4>
                <Form.Item label="开票日期" name="invoiceDate" {...layout}>
                  <DatePicker
                    showTime
                    onChange={changeTime}
                    onOk={onOk}
                    className={styles.form_input}
                  />
                </Form.Item>
                <Form.Item label="发票代码" name="invoiceCode" {...layout}>
                  <Input className={styles.form_input} />
                </Form.Item>
                <Form.Item label="发票号码" name="invoiceNum" {...layout}>
                  <Input className={styles.form_input} />
                </Form.Item>
                <Form.Item
                  label="价税合计(小写)"
                  name="taxPriceInnums"
                  {...layout}
                >
                  <Input className={styles.form_input} />
                </Form.Item>
                <Form.Item label="购买方-名称" name="buyerName" {...layout}>
                  <Input className={styles.form_input} />
                </Form.Item>
                <h4>票据附加信息</h4>
                <Form.Item label="使用状态" name="useStatus" {...layout}>
                  <Input disabled className={styles.form_input} />
                </Form.Item>
                <Form.Item label="OCR识别状态" name="ocrStatus" {...layout}>
                  <Input disabled className={styles.form_input} />
                </Form.Item>
                <Form.Item
                  label="发票验真状态"
                  name="verificationStatus"
                  {...layout}
                >
                  <Input disabled className={styles.form_input} />
                </Form.Item>
              </Form>
            ),
          },
          {
            label: `OCR识别信息`,
            key: '2',
            children: `OCR识别信息`,
          },
          {
            label: `验真信息`,
            key: '3',
            children: `验真信息`,
          },
        ]}
      />
    </div>
  )

  const rightChildren = (
    <div className={styles.table_warp}>
      <div className={styles.header}>
        <Input.Search
          className={styles.left}
          placeholder="票据类型"
          allowClear
          onSearch={searchInvoice}
        />
        <div className={styles.right}>
          {!sortId || sortId == 0 ? (
            <Button
              className={styles.upload_button}
              onClick={() => {
                message.error('请选择要上传的票据分类!')
              }}
            >
              上传
            </Button>
          ) : (
            <IUpload
              typeName="invoiceManagement"
              requireFileSize={50}
              uploadSuccess={uploadSuccess}
              mustFileType="png,jpg,gif,jpeg"
              buttonContent={
                <Button className={styles.upload_button}>上传</Button>
              }
            />
          )}
          <Button
            onClick={() => {
              saveInvoice()
            }}
          >
            保存
          </Button>
          <Button
            onClick={() => {
              deleteInvoice(chooseLabel)
            }}
          >
            删除
          </Button>
        </div>
      </div>

      <div className={styles.content}>
        <ReSizeLeftRight
          level={2}
          vRigthNumLimit={300}
          style={{ padding: 0 }}
          height={'100%'}
          leftChildren={rightLeftChildren}
          rightChildren={rightRightChildren}
          vNum={centerVum}
          suffix={`invoice_${targetKey}`}
        />
      </div>
    </div>
  )

  return (
    <Modal
      width={'97%'}
      visible={true}
      title={'票据选择'}
      onCancel={onCancel.bind(this)}
      bodyStyle={{ padding: 0 }}
      maskClosable={false}
      mask={false}
      onOk={onOkInvoice.bind(this, chooseLabel)}
      getContainer={() => {
        return document.getElementById(`formShow_container_${targetKey}`)
      }}
    >
      <div className={styles.container}>
        <ReSizeLeftRight
          vNum={204}
          level={1}
          height={'100%'}
          leftChildren={leftChildren}
          rightChildren={rightChildren}
          suffix={`invoice_${targetKey}`}
        />
        {isShow && (
          <AddInvoiceModal
            getInvoiceTreeFn={getInvoiceTreeFn}
            parentId={parentId}
            compareData={compareData}
            setState={setState}
          />
        )}
        {isShowUpdate && (
          <UpdateInvoiceModal
            getInvoiceTreeFn={getInvoiceTreeFn}
            detailData={detailData}
            compareData={compareData}
            parentId={parentId}
            setState={setState}
          />
        )}
        {isShowMove && (
          <MoveSortModal
            onExpand={onExpand}
            expandedKeys={sortExpandedKeys}
            setState={setState}
            dropArray={dropArray}
            treeData={sortTreeData}
            getInvoiceTreeFn={getInvoiceTreeFn}
          />
        )}
      </div>
    </Modal>
  )
}
export default invoiceModal
