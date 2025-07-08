import GlobalModal from '@/public/GlobalModal'
import { Button, Form, Input, Modal, message } from 'antd'
import { useEffect, useState } from 'react'
import { useModel } from 'umi'
import styles from './writeSign.less'

function Index({ setState, popularList, getList, bizSolId }) {
  const { targetKey } = useModel('@@qiankunStateFromMaster')
  const [form] = Form.useForm()
  const [signText, setSignText] = useState('')
  const [selectedItem, setSelectedItem] = useState({})
  const [selectedIndex, setSelectedIndex] = useState(-0.1)
  const { deletePopular, changeSort, addPopularList } = useModel('sign')
  useEffect(() => {
    if (selectedItem?.id) {
      let index = popularList.findIndex((item) => {
        return item.id == selectedItem?.id
      })
      if (index != -1 && index != selectedIndex) {
        setSelectedIndex(index)
      }
    }
  }, [popularList])
  const handelCanel = () => {
    setState({ popularManageModal: false })
  }
  //操作成功后的回掉
  const callback = (type) => {
    getList()
    if (type != 'sort') {
      setSelectedItem({})
      setSelectedIndex(-0.1)
    }
  }
  //删除
  const onDelete = () => {
    if (!selectedItem?.id) {
      message.error('请选择常用语')
      return
    }
    Modal.confirm({
      content: '确认要删除吗？',
      getContainer: () => {
        return document.getElementById(`formShow_container_${targetKey}`)
      },
      mask: false,
      maskClosable: false,
      onOk() {
        deletePopular({ ids: selectedItem?.id }, () => {
          message.success('删除成功')
          callback()
        })
      },
      onCancel() {},
    })
  }
  //排序
  const onSort = (index) => {
    if (!selectedItem?.id) {
      message.error('请选择常用语')
      return
    }
    var sort = 0
    if (index == 0) {
      //移动至第一个
      sort = popularList?.[0]?.sort - 0.0001
    } else if (index == popularList.length - 1) {
      //移动至最后一个
      sort = popularList?.[popularList.length - 1]?.sort + 0.0001
    } else if (index < selectedIndex) {
      //上移
      sort = (popularList?.[index]?.sort + popularList?.[index - 1]?.sort) / 2
    } else if (index > selectedIndex) {
      //下移
      sort = (popularList?.[index]?.sort + popularList?.[index + 1]?.sort) / 2
    }
    changeSort({ id: selectedItem?.id, sort }, () => {
      callback('sort')
    })
  }
  //添加
  const onAdd = () => {
    if (!signText.trim()) {
      message.error('请输入常用语！')
      return
    }
    addPopularList({ bizSolId, signText }, () => {
      getList()
      setSignText('')
    })
  }

  const onChangeValue = (e) => {
    if (e.target.value?.length > 250) {
      message.error('最多输入250个字符')
      return
    }
    setSignText(e.target.value)
  }

  //选择
  const onSelect = (item, index) => {
    setSelectedItem(item)
    setSelectedIndex(index)
  }

  return (
    <GlobalModal
      open={true}
      title="常用语管理"
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
      <table border={1} className={styles.popular_table}>
        <tr>
          <td rowSpan={5}>
            {popularList?.map((item, index) => (
              <li
                key={index}
                onClick={onSelect.bind(this, item, index)}
                style={{ color: selectedItem.id == item.id ? 'red' : '' }}
              >
                {item.signText}
              </li>
            ))}
          </td>
          <td>
            <Button
              onClick={onSort.bind(this, 0)}
              disabled={selectedIndex == 0}
            >
              置顶
            </Button>
          </td>
        </tr>
        <tr>
          <td>
            <Button
              onClick={onSort.bind(this, selectedIndex - 1)}
              disabled={selectedIndex == 0}
            >
              上移
            </Button>
          </td>
        </tr>
        <tr>
          <td>
            <Button onClick={onDelete}>删除</Button>
          </td>
        </tr>
        <tr>
          <td>
            <Button
              onClick={onSort.bind(this, selectedIndex + 1)}
              disabled={selectedIndex == popularList.length - 1}
            >
              下移
            </Button>
          </td>
        </tr>
        <tr>
          <td>
            <Button
              onClick={onSort.bind(this, popularList.length - 1)}
              disabled={selectedIndex == popularList.length - 1}
            >
              置底
            </Button>
          </td>
        </tr>
        <tr>
          <td>
            <Input.TextArea onChange={onChangeValue} value={signText} />
          </td>
          <td>
            <Button
              onClick={onAdd.bind(this)}
              disabled={popularList.length >= 20}
            >
              添加
            </Button>
          </td>
        </tr>
      </table>
    </GlobalModal>
  )
}

export default Index
