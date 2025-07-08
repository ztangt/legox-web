import GlobalModal from '@/public/GlobalModal'
import { useSetState } from 'ahooks'
import { Button, Form, InputNumber, Select, message } from 'antd'
import { useEffect, useState } from 'react'
import { useModel } from 'umi'
interface State {
  list?: Array<any>
  currentPage: string
  allPage: string
  returnCount: string
  currentNo: number //当前选择的为改变之前的文号
  docNoId: string //当前的文号id
  fixPreview: string //预览的固定部分
  currentSelectInfo: object //当前的文号信息
  fillNo: string //可补充的号
}
const ModalDocNOList = ({ showModal, field, onOk }) => {
  const masterProps = useModel('@@qiankunStateFromMaster')
  const { location, bizInfo, targetKey, cutomHeaders } = masterProps
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [state, setState] = useSetState<State>({
    list: [],
    currentPage: '1',
    allPage: '0',
    returnCount: '0',
    currentNo: '',
    docNoId: '',
    fixPreview: '',
    currentSelectInfo: {},
    fillNo: '',
  })
  const {
    list,
    currentPage,
    allPage,
    returnCount,
    currentNo,
    docNoId,
    fixPreview,
    currentSelectInfo,
    fillNo,
  } = state
  const { getGenerateDocNOList, generateDocNO, getFillNo } = useModel('docNo')
  useEffect(() => {
    //获取数据
    getGenerateDocNOList(
      {
        mainTableId: cutomHeaders?.mainTableId,
        bizSolId: location.query.bizSolId,
        deployFormId: bizInfo?.formDeployId,
      },
      (data: any) => {
        debugger
        if (data?.list?.length) {
          let tmpCurrentInfo = data.list[0]
          if (data.docNoId) {
            //回显
            let infos = data.list.filter((i) => i.id == data.docNoId)
            if (infos && infos.length) {
              tmpCurrentInfo = infos?.[0]
            }
          }
          let fixPreview = getPreview(
            tmpCurrentInfo,
            tmpCurrentInfo?.currentNo,
            ''
          )
          let inputNo = data.docNoValue || tmpCurrentInfo.currentNo
          let selectId = tmpCurrentInfo.id
          setState({
            ...data,
            fixPreview,
            docNoId: selectId,
            currentNo: inputNo,
            currentSelectInfo: tmpCurrentInfo,
          })
        }
      }
    )
  }, [])
  //更新
  const generateDocNOFn = () => {
    let docNoValue = fixPreview + currentNo + '号'
    generateDocNO(
      {
        mainTableId: cutomHeaders?.mainTableId,
        bizSolId: location.query.bizSolId,
        deployFormId: bizInfo?.formDeployId,
        currentNo,
        docNoId,
        docNoValue,
      },
      (maxNo: any, isSuccess: boolean) => {
        if (isSuccess) {
          //调用响应器做一些操作
          onOk(currentSelectInfo)
          //带入到输入框并关闭
          let tmpDocNoValue = getPreview(
            currentSelectInfo,
            currentNo,
            currentSelectInfo.docTypeName
          )
          field.setValue(tmpDocNoValue + currentNo + '号')
          showModal(false)
        } else {
          setState({
            currentNo: maxNo,
          })
        }
      }
    )
  }
  //改变文号
  const changeInputNo = (value) => {
    setState({
      currentNo: value,
      fixPreview: getPreview(currentSelectInfo, value, ''),
    })
  }
  //预览拼接
  const getPreview = (currentInfo: any, currentNo: number, docType: any) => {
    let tmpPreview = currentInfo.noWord
    if (docType) {
      tmpPreview =
        tmpPreview +
        '(' +
        docType +
        ')' +
        currentInfo.yearPrefix +
        currentYear +
        currentInfo.yearSuffix
    } else {
      tmpPreview =
        tmpPreview +
        currentInfo.yearPrefix +
        currentYear +
        currentInfo.yearSuffix
    }
    if (currentInfo.fillFlag == 1 && currentInfo.fillLength) {
      let tmpStr = ''
      let currentNoLength = currentNo.toString().length
      //需要补位
      for (let i = 0; i < currentInfo.fillLength - currentNoLength; i++) {
        tmpStr = tmpStr + '0'
      }
      tmpPreview = tmpPreview + tmpStr
    }
    tmpPreview = tmpPreview
    return tmpPreview
  }
  //选择文号
  const selectDocNo = (value: string, option: any) => {
    //生成预览
    setState({
      currentNo: option.currentNo,
      docNoId: value,
      fixPreview: getPreview(option, option.currentNo, ''),
      currentSelectInfo: option,
    })
  }
  //获取可补充的号
  const getFillNoFn = () => {
    getFillNo(
      {
        docNoId: docNoId,
      },
      (data: any) => {
        if (!data || !data.length) {
          message.error('没有可补的号')
          return
        }
        setState({
          fillNo: data.join('、'),
        })
      }
    )
  }
  return (
    <GlobalModal
      open={true}
      onOk={generateDocNOFn.bind(this)}
      onCancel={showModal.bind(this, false)}
      maskClosable={false}
      mask={window.location.href?.includes('formDesigner') ? true : false}
      getContainer={() => {
        return (
          document.getElementById(`formShow_container_${targetKey}`) ||
          document.getElementById(`root-master`)
        )
      }}
      bodyStyle={{ height: '200px', padding: '60px 20px' }}
      widthType={1}
      containerId={
        window.location.href?.includes('formDesigner')
          ? 'root-master'
          : `formShow_container_${targetKey}`
      }
    >
      <Form name="select_doc_no">
        <Form.Item label="文号类型">
          <Select
            options={list}
            fieldNames={{ label: 'noTypeName', value: 'id' }}
            onChange={selectDocNo}
            value={docNoId}
            showSearch={true}
          ></Select>
        </Form.Item>
        <Form.Item label="文号预览">
          <span>{fixPreview}</span>
          <InputNumber value={currentNo} onChange={changeInputNo.bind(this)} />
          <span>号</span>
          <Button
            onClick={getFillNoFn.bind(this)}
            style={{ marginLeft: '16px' }}
          >
            补号
          </Button>
        </Form.Item>
        <Form.Item label="可补号">
          <span>{fillNo}</span>
        </Form.Item>
      </Form>
    </GlobalModal>
  )
}
export default ModalDocNOList
