import GlobalModal from '@/public/GlobalModal'
import { useField, useFieldSchema, useForm } from '@formily/react'
import { useSetState } from 'ahooks'
import { Button, Input, Popover, message } from 'antd'
import cls from 'classnames'
import _ from 'lodash'
import { useEffect, useRef, useState } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import { useModel } from 'umi'
import { dataFormat } from '../../../utils'
import BoardModal from './boardModal'
import BoardTypeModal from './boardTypeModal'
import PopularModal from './popularModal'
import styles from './writeSign.less'
const WriteSignCn = (props) => {
  const fieldScme: any = useFieldSchema()
  const columnCode: string = fieldScme?.columnCode || ''
  const columnName: string = fieldScme?.columnName || ''

  const form = useForm()
  const field = useField()

  const masterProps = useModel('@@qiankunStateFromMaster')
  const {
    location,
    isPreview,
    bizInfo,
    redCol,
    signConfig,
    tableColumCodes,
    commentJson,
    targetKey,
  } = masterProps
  const [height, setHeight] = useState(
    document.getElementById(`formShow_container_${targetKey}`)?.offsetHeight -
      87
  )
  const [width, setWidth] = useState(
    document.getElementById(`formShow_container_${targetKey}`)?.offsetWidth + 10
  )
  // const { bizTaskId, bizInfoId } = location.query
  const baseAdice = {
    REJECT: '驳回',
    READING: '圈阅',
    AGREE: '同意',
    NONE: '',
  }
  interface State {
    // signConfig?: any
    userInfo?: any
    // tableColumCodes?: any
    signVisible?: any
    signUrl?: any
    textValue?: any
    isImport?: any
    tableListVisible?: any
    boardType?: any
    boardModal?: any
    popularModal?: any
    popularList?: any
    popularManageModal?: any
    isFirstValue?: any
  }
  const [state, setState] = useSetState<State>({
    // signConfig: JSON.parse(localStorage.getItem('signConfig')||'{}'),
    userInfo: {},
    // tableColumCodes: JSON.parse(localStorage.getItem('tableColumCodes')||'[]'),
    signVisible: false,
    signUrl: '',
    textValue: '',
    isImport: false,
    tableListVisible: false,
    boardType: localStorage.getItem('boardType'),
    boardModal: false,
    popularModal: false,
    popularManageModal: false,
    popularList: [],
    isFirstValue: false,
  })
  const {
    // signConfig,
    // userInfo,
    // tableColumCodes,
    signVisible,
    signUrl,
    textValue,
    isImport,
    tableListVisible,
    boardType,
    boardModal,
    popularModal,
    popularManageModal,
    popularList,
    isFirstValue,
  } = state
  const {
    getSignConfig,
    getCurrentUserInfo,
    getSignList,
    getTemporarySignList,
  } = useModel('preview')
  const signRef = useRef(null)
  const returnPosition = (position) => {
    let cPosition = 'left'
    if (position == 'RIGHT') {
      cPosition = 'right'
    } else if (position == 'MIDDLE') {
      cPosition = 'center'
    }
    // let cPosition = 'flex-start'
    // if (position == 'RIGHT') {
    //   cPosition = 'flex-end'
    // } else if (position == 'MIDDLE') {
    //   cPosition = 'center'
    // }

    return cPosition
  }
  const returnImgPosition = (position) => {
    let cPosition = 'flex-start'
    if (position == 'RIGHT') {
      cPosition = 'flex-end'
    } else if (position == 'MIDDLE') {
      cPosition = 'center'
    }
    return cPosition
  }
  useEffect(() => {
    commentJson && form.setValuesIn('commentJson', commentJson)
  }, [commentJson])
  useEffect(() => {
    let obj = _.find(commentJson, { tableColCode: columnCode })
    if (form?.values[columnCode] && !isFirstValue && !obj) {
      //第一次赋值，且无暂存的数据，且有默认值,且为新增
      setCommentJson(form?.values[columnCode], '')
    }
  }, [form?.values[columnCode]])
  useEffect(() => {
    if (form?.values?.commentJson?.length != 0) {
      let obj = _.find(form?.values?.commentJson, { tableColCode: columnCode })
      if (obj) {
        setState({
          isFirstValue: true,
        })
      }
      if (obj?.messageImgUrl != signUrl || obj?.messageText != textValue) {
        setState({
          signUrl: obj?.messageImgUrl,
          textValue: obj?.messageText,
        })
      }
    }
  }, [form?.values?.commentJson])

  useEffect(() => {
    if (signUrl) {
      field.setValue('手写签批') //防止为表单校验时取不到该字段值
      field.validate()
    } else {
      if (textValue) {
        field.setValue(textValue)
      } else {
        field.setValue('')
      }
    }
  }, [signUrl, textValue])

  // useEffect(() => {
  //   if (!isPreview) {
  //     if (Object.keys(signConfig)?.length == 0) {
  //       getSignConfig({}, (data) => {
  //         //获取意见签批配置
  //         setState({ signConfig: data.data })
  //         data.data &&
  //           localStorage.setItem('signConfig', JSON.stringify(data.data))
  //       })
  //     }
  //     // if (Object.keys(userInfo)?.length == 0) {
  //     //   getCurrentUserInfo({}, (data) => {
  //     //     //获取用户信息
  //     //     setState({ userInfo: data.data })
  //     //     data.data &&
  //     //       localStorage.setItem('signUserInfo', JSON.stringify(data.data))
  //     //   })
  //     // }
  //   }
  // }, [isPreview])
  // useEffect(() => {
  //   if (!isPreview && bizInfo?.bizInfoId && !redCol?.length) {
  //     if (
  //       localStorage.getItem('isGetTableColumCodes') != '1' &&
  //       tableColumCodes?.length == 0
  //     ) {
  //       //获取意见签批列表
  //       getSignList({ bizInfoId: bizInfo?.bizInfoId }, (data) => {
  //         setState({ tableColumCodes: data.data.tableColumCodes })
  //         if (data.data.tableColumCodes) {
  //           localStorage.setItem(
  //             'tableColumCodes',
  //             JSON.stringify(data.data.tableColumCodes)
  //           )
  //         } else {
  //           localStorage.setItem('isGetTableColumCodes', '1')
  //         }
  //       })
  //     }

  //     if (!form.values?.commentJson) {
  //       let commentJson = localStorage.getItem('commentJson')

  //       if(commentJson&&commentJson!='undefined'){
  //         form.setValues({ commentJson: JSON.parse(commentJson) })
  //         return
  //       }
  //       //获取意见签批列表
  //       getTemporarySignList({ bizInfoId: bizInfo?.bizInfoId }, (data) => {
  //         form.setValues({ commentJson: data?.data?.tableColumCodes })
  //         localStorage.setItem('commentJson',data?.data?.tableColumCodes)
  //       })
  //     }
  //   }
  // }, [isPreview])

  const clear = () => {
    if (
      props?.readOnly ||
      props?.disabled ||
      !(props?.pattern == 'editable' || !props?.pattern)
    ) {
      return
    }
    //清除
    if (signRef.current) {
      signRef.current.clear()
    }
    setState({ signUrl: '', isImport: false })
    setCommentJson(textValue, '')
  }

  const onSignture = () => {
    if (
      props?.readOnly ||
      props?.disabled ||
      !(props?.pattern == 'editable' || !props?.pattern)
    ) {
      return
    }
    //意见签批
    setState({ signVisible: true })
    setTimeout(() => {
      //由于初次加载加载不到ref 做延迟操作
      // if (signRef.current && isImport) {
      //   //引入签名时需要修改签批地址
      //   signRef.current.fromDataURL(signUrl)
      // }
      if (signRef.current) {
        signRef.current.clear()
      }
    })
  }
  const onTable = () => {
    if (
      props?.readOnly ||
      props?.disabled ||
      !(props?.pattern == 'editable' || !props?.pattern)
    ) {
      return
    }
    if (
      localStorage.getItem('boardTypes') &&
      JSON.parse(localStorage.getItem('boardTypes') || '[]')?.length
    ) {
      setState({ boardModal: true })
    } else {
      setState({ tableListVisible: true })
    }
  }

  const returnPostOrg = (item) => {
    let deptName =
      item.signDeptName == null || !item.signDeptName ? '' : item.signDeptName
    let postName =
      item.signPostName == null || !item.signPostName ? '' : item.signPostName
    //所属机构类型 ORG_POST部门/岗位 POST_ORG岗位/部门 ORG部门 POST岗位
    switch (signConfig.orgType) {
      case 'ORG_POST':
        return deptName && postName
          ? `${deptName}/${postName}`
          : postName || deptName
        break
      case 'POST_ORG':
        return postName && deptName
          ? `${postName}/${deptName}`
          : deptName || postName
        break
      case 'ORG':
        return `${deptName}`

        break
      case 'POST':
        return `${postName}`
        break
      default:
        break
    }
  }

  const returnPersonName = (item) => {
    //signConfig.personNameType   人名格式类型SYS_TEXT系统文字  SIGN_TEXT签名+文字 SIGN签名(获取上传的签名，无签名显示文字)
    switch (signConfig.personNameType) {
      case 'SYS_TEXT':
        return `${item.signUserName}`
        break
      case 'SIGN_TEXT':
        return (
          <>
            {`${item.signUserName}`}
            {item.signedImgUrl ? (
              <img
                src={item.signedImgUrl}
                style={{ height: `${signConfig?.signedFontSize + 10}px` }}
              />
            ) : (
              ''
            )}
          </>
        )
        break
      case 'SIGN':
        if (item.signedImgUrl) {
          return (
            <img
              src={item.signedImgUrl}
              style={{ height: `${signConfig?.signedFontSize + 10}px` }}
            />
          )
        } else {
          return `${item.signUserName}`
        }
        break
      default:
        break
    }
  }
  const returnSign = (item) => {
    //时间格式
    let timeFormat = 'YYYY年MM月DD日'
    if (signConfig.timeFormat == 'YMD_TMS') {
      timeFormat = 'YYYY年MM月DD日 HH:mm:ss'
    }
    let array = []
    array[signConfig.orgOrder] = returnPostOrg(item)
    array[signConfig.personNameOrder] = returnPersonName(item)
    array[signConfig.timeFormatOrder] =
      signConfig.timeEnable == 1 ? dataFormat(item.signTime, timeFormat) : ''
    array.splice(0, 1) //删除index为0的
    return array.map((item, index) => (
      <span key={index} style={{ marginLeft: 5 }}>
        {item}
      </span>
    ))
  }

  const suggestCustomStyle = {
    color: signConfig?.suggestColor,
    fontSize: signConfig?.suggestFontSize,
    textDecoration: signConfig?.suggestIsUnderline == 1 ? 'underline' : '',
    fontStyle: signConfig?.suggestIsSlope == 1 ? 'italic' : '',
    fontWeight: signConfig?.suggestIsBold == 1 ? 'bold' : '',
  }
  const suggestStyle = {
    ...suggestCustomStyle,
    minHeight: '18px',
    lineHeight: `${signConfig?.suggestFontSize + 4}px`,
    margin: '4px 0px',
  }
  const signedStyle = {
    color: signConfig?.signedColor,
    fontSize: signConfig?.signedFontSize,
    textDecoration: signConfig?.signedIsUnderline == 1 ? 'underline' : '',
    fontStyle: signConfig?.signedIsSlope == 1 ? 'italic' : '',
    fontWeight: signConfig?.signedIsBold == 1 ? 'bold' : '',
    minHeight: '18px',
    lineHeight: `${signConfig?.signedFontSize + 8}px`,
    margin: '4px 0px',
  }

  const returnConnectSign = (item, index) => {
    return (
      <span key={index}>
        {/**意见区域 */}
        {/* {signConfig?.textEnable == 1 && ( */}
        {item.messageText && (
          <span style={suggestStyle}>{item.messageText}</span>
        )}
        {/* )} */}
        {/**签名区域 */}
        {item.messageImgUrl ? (
          <img
            src={item.messageImgUrl}
            style={{
              height: `${signConfig?.suggestFontSize + 10}px`,
              // width: '120px',
              objectFit: 'contain',
            }}
          />
        ) : (
          ''
        )}
        {signConfig?.signedEnable == 1 && (
          <span style={signedStyle}>{returnSign(item)}</span>
        )}
      </span>
    )
  }
  const returnUnConnectSign = (item, index) => {
    return (
      <li key={index}>
        <div
          className={styles.advice}
          style={{
            flexDirection: signConfig?.signLine == 1 ? 'column' : 'row',
          }}
        >
          {/**意见区域 */}
          {/* {signConfig?.textEnable == 1 && ( */}
          {item.messageText && (
            <div
              style={{
                flex: 1,
                // display: 'flex',
                textAlign: returnPosition(signConfig?.textPosition),
                ...suggestStyle,
              }}
            >
              {item.messageText}
            </div>
          )}
          {/* )} */}
          {/**签名区域 */}
          {item.messageImgUrl && (
            <div
              style={{
                flex: 1,
                display: 'flex',
                justifyContent: returnImgPosition(signConfig?.signPosition),
              }}
            >
              {item.messageImgUrl ? (
                <img
                  src={item.messageImgUrl}
                  style={{
                    height: `${signConfig?.suggestFontSize + 10}px`,
                    // height: '40px',
                    // width: '120px',
                    objectFit: 'contain',
                  }}
                />
              ) : (
                ''
              )}
            </div>
          )}
        </div>
        {/**落款区域 */}
        {signConfig?.signedEnable == 1 && (
          <div
            style={{
              // display: 'flex',
              // justifyContent: returnPosition(
              //   signConfig?.signedPosition
              // ),
              textAlign: returnPosition(signConfig?.signedPosition),
              ...signedStyle,
            }}
          >
            {returnSign(item)}
          </div>
        )}
      </li>
    )
  }

  //引入签名  转换签名为base64地址
  const importSign = () => {
    if (
      props?.readOnly ||
      props?.disabled ||
      !(props?.pattern == 'editable' || !props?.pattern)
    ) {
      return
    }
    // if (Object.keys(userInfo)?.length == 0) {
    getCurrentUserInfo({}, (data) => {
      //获取用户信息
      setState({ userInfo: data.data })
      if (!data?.data?.signaturePath) {
        message.error('暂无签名！')
        return
      }
      window.URL = window.URL || window.webkitURL
      let xhr = new XMLHttpRequest()
      xhr.open('get', data?.data?.signaturePath, true)
      //使用xhr请求图片,并设置返回的文件类型为Blob对象
      xhr.responseType = 'blob'
      xhr.onload = function () {
        if (this.status == 200) {
          //得到一个blob对象
          let blob = this.response
          let oFileReader = new FileReader()
          oFileReader.onloadend = function (e) {
            // base64的图片了
            let base64 = e.target.result
            setState({ signUrl: base64 })
            setCommentJson(textValue, base64)
          }
          //使用FileReader 对象接收blob
          oFileReader.readAsDataURL(blob)
        }
      }
      xhr.send()
      setState({
        isImport: true,
      })
    })
    // }
  }
  //保存签批
  const onSaveSign = () => {
    setState({
      signUrl: signRef.current.getTrimmedCanvas().toDataURL('image/png', 1),
      signVisible: false,
    })
    setCommentJson(
      textValue,
      signRef.current.getTrimmedCanvas().toDataURL('image/png', 1)
    )
  }

  const onReset = () => {
    if (signRef.current) {
      signRef.current.clear()
    }
  }

  //设置签批json
  const setCommentJson = (messageText, messageImgUrl) => {
    if (!isFirstValue) {
      setState({
        isFirstValue: true,
      })
    }
    const commentJson = form?.values?.['commentJson'] || []
    const flag = commentJson?.findIndex((item) => {
      return item.tableColCode == columnCode
    })
    if (flag != -1) {
      //修改
      commentJson[flag].messageText = messageText
      commentJson[flag].messageImgUrl = messageImgUrl
    } else {
      //新增
      commentJson.push({
        tableColCode: columnCode,
        tableColName: columnName,
        messageText,
        messageImgUrl,
        bizTaskId: location?.query?.bizTaskId,
        bizInfoId: bizInfo?.bizInfoId,
      })
    }
    form.setValuesIn('commentJson', commentJson)
  }

  //修改文本框值
  const onChangeValue = (e) => {
    if (e.target.value.length >= Number(props?.maxLength)) {
      //校验文本框最大长度
      message.error(`最多输入${props?.maxLength}个字符`)
      return
    }
    setState({
      textValue: e.target.value,
    })
    // setCommentJson(e.target.value, signUrl)
  }

  const onBlur = (e) => {
    setCommentJson(e.target.value, signUrl)
  }

  function compare(property) {
    return function (a, b) {
      let value1 = a[property]
      let value2 = b[property]
      if (property == 'signTime') {
        return value2 - value1
      }
      return value1 - value2
    }
  }
  const liProps = {
    className: cls(
      props?.readOnly ||
        props?.disabled ||
        !(props?.pattern == 'editable' || !props?.pattern)
        ? (styles.box_disabled, styles.li_display)
        : ''
    ),
  }
  const style = () => {
    let style = {
      width: '100%',
      height: '100%',
      overflow: 'auto',
      ...props.style,
    }
    if (
      props?.readOnly ||
      props?.disabled ||
      !(props?.pattern == 'editable' || !props?.pattern)
    ) {
      style = {
        ...style,
        'background-color': '#f5f5f5',
        cursor: 'not-allowed',
      }
    }
    return style
  }
  return (
    <div {...props} style={{ ...style() }}>
      {tableListVisible && <BoardTypeModal setState={setState} />}
      {popularModal && (
        <PopularModal
          setState={setState}
          setCommentList={setCommentJson}
          signUrl={signUrl}
          popularList={popularList}
          popularManageModal={popularManageModal}
        />
      )}
      {boardModal && (
        <BoardModal
          setState={setState}
          setCommentList={setCommentJson}
          textValue={textValue}
          boardType={boardType}
        />
      )}
      <div
        className={styles.advice}
        style={{
          height:
            props?.optionType == 'TEXTAREA' &&
            (!tableColumCodes?.[columnCode] ||
              tableColumCodes?.[columnCode]?.length == 0)
              ? '100%'
              : '',
          display:
            props?.readOnly ||
            props?.disabled ||
            !(props?.pattern == 'editable' || !props?.pattern)
              ? 'none'
              : 'flex',
        }}
      >
        {
          <p
            className={styles.advice_area}
            style={{
              marginTop: props?.optionType != 'TEXTAREA' ? '8px' : '0px',
            }}
          >
            {/* {
              //意见富文本没有常用语
              signConfig?.textEnable == 1 && props?.optionType != 'TEXTAREA' && (
                <Popover
                  content={
                    props?.readOnly ||
                    props?.disabled ||
                    !(props?.pattern == 'editable' || !props?.pattern) ? (
                      ''
                    ) : (
                      <ul>
                        {baseAdvices.map((item, index) => (
                          <li
                            onClick={() => {
                              if (
                                props?.readOnly ||
                                props?.disabled ||
                                !(
                                  props?.pattern == 'editable' ||
                                  !props?.pattern
                                )
                              ) {
                                return
                              }
                              setState({
                                textValue: item,
                              })
                              setCommentJson(item, signUrl)
                            }}
                            key={index}
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    )
                  }
                >
                  <a
                    {...liProps}
                    style={{ marginLeft: '8px', lineHeight: '14px' }}
                  >
                    常用语
                  </a>
                </Popover>
              )
            } */}
            {
              //意见富文本没有常用语
              signConfig?.textEnable == 1 && props?.optionType != 'TEXTAREA' && (
                <a
                  {...liProps}
                  style={{ marginLeft: '8px', lineHeight: '14px' }}
                  onClick={() => {
                    setState({ popularModal: true })
                  }}
                >
                  常用语
                </a>
              )
            }
            {
              //意见类型为意见签批时展示意见签批组件
              props && props.optionType == 'PICTURE' && (
                <div className={styles.advice_sing}>
                  <ul className={styles.operation}>
                    <li>
                      <GlobalModal
                        widthType={'1'}
                        incomingWidth={500}
                        className="ant-modal-with-footer"
                        visible={signVisible}
                        width={500}
                        title="手写签批"
                        bodyStyle={{
                          height: '200px',
                          padding: '0',
                          overflow: 'unset',
                        }}
                        onCancel={() => {
                          setState({ signVisible: false })
                        }}
                        mask={false}
                        maskClosable={false}
                        getContainer={() => {
                          return document.getElementById(
                            `formShow_container_${targetKey}`
                          )
                        }}
                        footer={[
                          <Button key="cancel" onClick={onReset}>
                            重置
                          </Button>,
                          <Button
                            key="submit"
                            type="primary"
                            onClick={onSaveSign}
                          >
                            确定
                          </Button>,
                        ]}
                      >
                        <SignatureCanvas
                          penColor="black"
                          canvasProps={
                            window.location.href.includes('mobile')
                              ? {
                                  height,
                                  width,
                                  className: 'sigCanvas',
                                }
                              : {
                                  width: '500px',
                                  className: 'sigCanvas',
                                  height: '200vh',
                                }
                          }
                          ref={signRef}
                        />
                      </GlobalModal>
                      {signConfig?.handSignEnable == 1 && (
                        <a onClick={onSignture} {...liProps}>
                          手写签批
                        </a>
                      )}
                    </li>
                    <li onClick={clear}>
                      <a {...liProps}>清除</a>
                    </li>
                    {signConfig?.pullSignEnable == 1 && (
                      <li onClick={importSign}>
                        <a {...liProps}>引入签名</a>
                      </li>
                    )}
                    {/* {signConfig?.tabletEnable == 1 && (
                      <Popover
                        content={
                          props?.readOnly ||
                          props?.disabled ||
                          !(props?.pattern == 'editable' || !props?.pattern)
                            ? ''
                            : '研发中。。。'
                        }
                      >
                        <li>
                          <a {...liProps}>手写板</a>
                        </li>
                      </Popover>
                    )} */}
                    {signConfig?.tabletEnable == 1 &&
                      !window.location.href.includes('mobile') && (
                        <li onClick={onTable}>
                          <a {...liProps}>手写板</a>
                        </li>
                      )}
                    {signConfig?.affectFlowable == 'YES' && (
                      <Popover
                        content={
                          props?.readOnly ||
                          props?.disabled ||
                          !(props?.pattern == 'editable' || !props?.pattern)
                            ? ''
                            : '研发中。。。'
                        }
                      >
                        <li>
                          <a {...liProps}>同意</a>
                        </li>
                      </Popover>
                    )}
                    {signConfig?.affectFlowable == 'YES' && (
                      <Popover
                        content={
                          props?.readOnly ||
                          props?.disabled ||
                          !(props?.pattern == 'editable' || !props?.pattern)
                            ? ''
                            : '研发中。。。'
                        }
                      >
                        <li>
                          <a {...liProps}>不同意</a>
                        </li>
                      </Popover>
                    )}
                  </ul>
                </div>
              )
            }
            <div
              className={styles.advice}
              style={{
                height:
                  props?.optionType == 'TEXTAREA' &&
                  (!tableColumCodes?.[columnCode] ||
                    tableColumCodes?.[columnCode]?.length == 0)
                    ? '100%'
                    : '',
              }}
              // style={{
              //   flexDirection: signConfig?.signLine == 1 ? 'column' : 'row',
              // }}
            >
              {signConfig?.textEnable == 1 && (
                <Input.TextArea
                  className={styles.text_area}
                  placeholder={props.disabled ? '' : props.placeholder}
                  value={textValue}
                  onChange={onChangeValue}
                  onBlur={onBlur}
                  disabled={props?.disabled}
                  style={{
                    flex: 1,
                    border: 'none',
                    background: 'none',
                    height: '100%',
                    padding: '0px',
                    boxShadow: 'unset',
                    ...suggestCustomStyle,
                  }}
                />
              )}
              {props &&
                props.optionType == 'PICTURE' &&
                (signConfig?.handSignEnable == 1 ||
                  signConfig?.pullSignEnable == 1 ||
                  signConfig?.tabletEnable == 1) && (
                  <div
                    style={{
                      textAlign: returnPosition(signConfig?.signPosition),
                      display: 'flex',
                      flex: 1,
                      minHeight: 30,
                    }}
                  >
                    {signUrl && (
                      <img
                        src={signUrl}
                        style={{
                          height: '150px',
                          width: '150px',
                          objectFit: 'contain',
                        }}
                      />
                    )}
                  </div>
                )}
            </div>
          </p>
        }
      </div>

      {/**历史数据 */}
      {tableColumCodes?.[columnCode]?.length != 0 && (
        <ul className={styles.history_content}>
          {tableColumCodes?.[columnCode]
            ?.sort(
              compare(
                signConfig?.peoplesSignOrder == 'time'
                  ? 'signTime'
                  : 'signUserSort'
              )
            )
            ?.map((item, index) => (
              <>
                {signConfig?.signedPosition != 'CONNECT' &&
                  returnUnConnectSign(item, index)}

                {signConfig?.signedPosition == 'CONNECT' &&
                  returnConnectSign(item, index)}
                <br />
              </>
            ))}
        </ul>
      )}
    </div>
  )
}
export default WriteSignCn
