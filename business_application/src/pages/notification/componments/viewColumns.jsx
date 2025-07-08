import {dataFormat} from '../../../util/util'
export const tableProps = {
  rowKey: 'noticeId',
  columns: [
    {
      title: '序号',
      dataIndex: 'number',
      render:(text,record,index)=><span>{index+1}</span>
    },
    {
      title: '阅读人员',
      dataIndex: 'viewUserName',
    },
    {
      title: '所属部门',
      dataIndex: 'viewDeptName',
    },
    {
      title: '所属单位',
      dataIndex: 'viewOrgName',
    },
    {
      title: '是否已读',
      dataIndex: 'viewState',
      render: (text, record) => (
        <span>{text == 0 ? '未读' : '已读'}</span>
      )
    },
    {
      title: '阅读时间',
      dataIndex: 'viewTime',
      render: (text, record) => (
        <span>{record.viewState == 1 ? dataFormat(text, 'YYYY-MM-DD HH:mm:ss') : ""}</span>
      )
    },
  ],
}