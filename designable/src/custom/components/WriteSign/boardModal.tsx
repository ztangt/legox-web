import GlobalModal from '@/public/GlobalModal'
import {
  clearHWInk,
  initHWDevice,
  uninitHWDevice,
} from '@/utils/writeHWBoardUtil'
import { onLoad } from '@/utils/writeHW_QL_Socket_BoardUtil'
import {
  clearMTL398SInk,
  initMTL398SDevice,
  uninitMTL398SDevice,
} from '@/utils/writeMTL398SBoardUtil'
import {
  clearMTInk,
  initMTDevice,
  uninitMTDevice,
} from '@/utils/writeMTL500BoardUtil'
import {
  clearMTL500SInk,
  initMTL500SDevice,
  uninitMTL500SDevice,
} from '@/utils/writeMTL500SBoardUtil'
import { Button } from 'antd'
import { useEffect, useRef } from 'react'
import { useModel } from 'umi'
import styles from './index.less'
function Index({ setState, setCommentList, textValue, boardType }) {
  const { targetKey } = useModel('@@qiankunStateFromMaster')
  const boardRef = useRef(null)
  function isCanvasBlank(canvas) {
    //判断画布内容
    console.log('isCanvasBlank', canvas)
    let blank = document.createElement('canvas')
    blank.width = canvas.width
    blank.height = canvas.height
    console.log('isCanvasBlank', blank)
    blank?.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height)
    return canvas.toDataURL('image/png', 1) == blank.toDataURL('image/png', 1)
  }

  useEffect(() => {
    switch (boardType) {
      case 'WINDOWS_HW':
        initHWDevice(onOk)
        break
      case 'WINDOWS_MT':
        initMTDevice(onOk)
        break
      case 'HW_ESP560':
        onLoad(onOk)
        // initHWQLDevice(onOk)
        break
      case 'HW_SP1':
        onLoad(onOk)
        // initHWQLDevice(onOk)
        break
      case 'MT_L370_L398p':
        initMTL398SDevice(onOk)
        break
      case 'MT_L500':
        initMTL500SDevice(onOk)
        break
      default:
        break
    }
  }, [boardType])

  function handelCanel() {
    uninitDevice()
    setState({ boardModal: false })
  }
  function onOk() {
    let boradUrl = ''
    if (boardType == 'HW_ESP560' || boardType == 'HW_SP1') {
      boradUrl = document.getElementById('signimg').src
    } else {
      boradUrl = isCanvasBlank(boardRef?.current)
        ? ''
        : boardRef?.current?.toDataURL('image/png', 1)
    }
    setState({ signUrl: boradUrl })
    setCommentList(textValue, boradUrl)
    uninitDevice()
    setState({
      boardModal: false,
    })
  }

  function uninitDevice() {
    switch (boardType) {
      case 'WINDOWS_HW':
        uninitHWDevice()
        break
      case 'WINDOWS_MT':
        uninitMTDevice()
        break
      case 'HW_ESP560':
        // onUnload();
        break
      case 'HW_SP1':
        // onUnload();
        // uninitHWQLDevice()
        break
      case 'MT_L370_L398p':
        uninitMTL398SDevice()
        break
      case 'MT_L500':
        uninitMTL500SDevice()
        break
      default:
        break
    }
  }

  return (
    <GlobalModal
      open={true}
      title="手写签批"
      mask={false}
      maskClosable={false}
      getContainer={() => {
        return document.getElementById(`formShow_container_${targetKey}`)
      }}
      onCancel={handelCanel.bind(this)}
      widthType={'1'}
      className={styles.borard_modal}
      footer={null}
    >
      <div className={styles.board_container}>
        <div className={styles.board_img_container}>
          {(boardType == 'HW_ESP560' || boardType == 'HW_SP1') && (
            <img
              id="signimg"
              className={styles.board_img}
              width="1000"
              height="600"
            />
          )}
          {boardType != 'HW_ESP560' && boardType != 'HW_SP1' && (
            <canvas
              id="ppCanvas"
              className={styles.board_img}
              ref={boardRef}
              width="1000"
              height="600"
            />
          )}
        </div>
        <div className={styles.board_bt_group}>
          <Button
            key="submit"
            className={styles.bt_confirm}
            onClick={onOk.bind(this)}
          >
            确 认
          </Button>
          <Button
            key="cancel"
            onClick={() => {
              switch (boardType) {
                case 'WINDOWS_HW':
                  clearHWInk()
                  break
                case 'WINDOWS_MT':
                  clearMTInk()
                  break
                case 'HW_ESP560':
                  // if(document?.getElementById("signimg")?.src)
                  // document.getElementById("signimg").src = "";
                  // clearHWQLInk()
                  onLoad(onOk)
                  break
                case 'HW_SP1':
                  // if(document?.getElementById("signimg")?.src)
                  //   document.getElementById("signimg").src = "";
                  // clearHWQLInk()
                  onLoad(onOk)
                  break
                case 'MT_L370_L398p':
                  clearMTL398SInk()
                  break
                case 'MT_L500':
                  clearMTL500SInk()
                  break
                default:
                  break
              }
            }}
          >
            重置
          </Button>
          <Button
            key="reset"
            onClick={() => {
              setState({ boardModal: false })
              setState({ tableListVisible: true })
            }}
          >
            重新选择手写板
          </Button>
        </div>
      </div>
    </GlobalModal>
  )
}

export default Index
