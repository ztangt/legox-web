import { Divider, Modal, Spin } from 'antd'
import { Image, ImageViewer } from 'antd-mobile/es'
import _ from 'lodash'
import { useCallback, useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { MicroAppWithMemoHistory, useModel } from 'umi'
import { dataFormat } from '../../../utils/utils'
import './invoiceModal.less'
function Index({ onCancel, onOkInvoice, type, returnPayload }) {
  const masterProps = useModel('@@qiankunStateFromMaster')
  const { location, targetKey } = masterProps
  const [chooseLabel, setChooseLabeldes] = useState([]) // 选择的多选标签
  const [disabledList, setDisabledList] = useState([]) // 不可选择的列表
  const [invoiceListState, setInvoiceListState] = useState({
    returnCount: 0,
    allPage: 1,
    currentPage: 1,
    invoiceList: [],
  }) // 发票查看列表
  const { returnCount, allPage, currentPage, invoiceList } = invoiceListState
  const [imagevisible, setImagevisible] = useState(false) // 发票查看modal
  const [height, setHeight] = useState(
    document?.getElementById('formShow_container')?.offsetHeight * 0.8 - 87
  )
  const [value, setValue] = useState()
  const { getRefInvoice, getInvoiceListByIds } = useModel('invoice')
  function loadMore() {
    getInvoiceListByIdsFn(Number(currentPage) + 1)
  }
  useEffect(() => {
    getRefInvoice(
      {
        //获取关联票据
        ...returnPayload(),
      },
      (data) => {
        let invoiceIds = ''
        if (data?.data?.isChecked) {
          invoiceIds = data?.data?.ownCheckedInvoiceIds //redis 缓存
        } else {
          invoiceIds = data?.data?.ownUsedInvoiceIds //发票集合
        }
        // if (data?.data?.ownCheckedInvoiceIds) {
        //   invoiceIds = data?.data?.ownCheckedInvoiceIds //redis 缓存
        // }
        // else if (data?.data?.ownUsedInvoiceIds) {
        //   invoiceIds = data?.data?.ownUsedInvoiceIds //发票集合
        // }
        let formInvoics = [] //该表单下发票ID集合，逗号分割
        if (data?.data?.mainInvoiceIds) {
          formInvoics = data?.data?.mainInvoiceIds?.split(',') || []
        }
        if (invoiceIds) {
          let invoiceArr = invoiceIds?.split(',') || []
          setValue(invoiceArr) //初始值
          setChooseLabeldes(invoiceArr) //设置当前选中的标签
          let formInvoicsArr = _.cloneDeep(formInvoics)
          invoiceArr?.length &&
            invoiceArr?.forEach((element) => {
              formInvoicsArr = formInvoicsArr.filter((item) => {
                return item != element
              })
            })
          setDisabledList(formInvoicsArr)
        } else {
          setDisabledList(formInvoics)
        }
      }
    )
  }, [])
  // useEffect(() => {
  //   setChooseLabeldes(value || [])
  // }, [value])
  const onResize = useCallback(() => {
    setHeight(
      Number(
        document?.getElementById('formShow_container')?.offsetHeight * 0.8 - 87
      )
    )
  }, [])

  useEffect(() => {
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])

  useEffect(() => {
    if (window.location.href.includes('mobile') && type == 'view') {
      //查看页面
      //根据表单中发票id集合，获取发票列表
      value && getInvoiceListByIdsFn(1)
    }
  }, [type, value])
  const getInvoiceListByIdsFn = (start) => {
    //根据表单中发票id集合，获取发票列表
    getInvoiceListByIds(
      {
        invoiceIds: value ? value.toString() : '',
        start,
        limit: 12,
      },
      (data) => {
        setInvoiceListState({
          returnCount: data.data.returnCount,
          allPage: data.data.allPage,
          currentPage: data.data.currentPage,
          invoiceList:
            start != 1 ? [...invoiceList, ...data.data.list] : data.data.list,
        })
      }
    )
  }
  if (window.location.href.includes('mobile') && type == 'view') {
    return (
      <Modal
        width={'100%'}
        visible={true}
        title={'票据查看'}
        onCancel={onCancel.bind(this)}
        bodyStyle={{ padding: 0, height: height }}
        maskClosable={false}
        mask={false}
        getContainer={() => {
          return document.getElementById(`formShow_container_${targetKey}`)
        }}
        className="invoice_container"
        footer={null}
      >
        <div className="invoice_list_container" id="scrollableDiv">
          <InfiniteScroll
            dataLength={invoiceList.length}
            next={loadMore}
            hasMore={invoiceList?.length < returnCount}
            loader={<Spin className="spin_div" />}
            endMessage={
              invoiceList?.length == 0 ? (
                ''
              ) : (
                <Divider plain>没有更多啦</Divider>
              )
            }
            scrollableTarget="scrollableDiv"
          >
            <div className="invoice_list">
              {invoiceList?.map((item, index) => {
                return (
                  <div className="image_item_container">
                    <Image
                      className="image_item"
                      src={item.invoiceFilePath}
                      key={index}
                      onClick={() => {
                        ImageViewer.Multi.show({
                          images: invoiceList?.map((item) => {
                            return item.invoiceFilePath
                          }),
                          defaultIndex: index,
                        })
                      }}
                    />
                    <p className="image_item_name">{item.invoiceTypeName}</p>
                    <p className="image_item_date">
                      {item.invoiceDate !== '0' &&
                        dataFormat(item.invoiceDate, 'YYYY-MM-DD HH:mm:ss')}
                    </p>
                  </div>
                )
              })}
            </div>
          </InfiniteScroll>
        </div>
      </Modal>
    )
  }
  return (
    <Modal
      width={'97%'}
      visible={true}
      title={'票据选择'}
      onCancel={onCancel.bind(this)}
      bodyStyle={{ padding: 0, height: height }}
      maskClosable={false}
      mask={false}
      onOk={onOkInvoice.bind(this, chooseLabel)}
      getContainer={() => {
        return document.getElementById(`formShow_container_${targetKey}`)
      }}
      className="invoice_container"
    >
      <MicroAppWithMemoHistory
        name="business_controls"
        url="/invoiceManagement"
        location={location}
        setChooseLabeldes={setChooseLabeldes}
        invoiceValue={value}
        modalType={type}
        disabledList={disabledList}
        containerId={`invoiceManagement_container_${targetKey}`}
      />
    </Modal>
  )
}
export default Index
