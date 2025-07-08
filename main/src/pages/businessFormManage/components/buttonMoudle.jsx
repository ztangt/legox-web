import { connect } from 'dva';
import React, { useState, useEffect } from 'react';
import { Input,Modal,Table,Button} from 'antd';
import IPagination from '../../../componments/public/iPagination';
import styles from './buttonMoudle.less'
import {useLocation} from 'umi'
import searchIcon from '../../../../public/assets/search_black.svg'
import ColumnDragTable from '../../../componments/columnDragTable/index.jsx';
import {ORDER_WIDTH,BASE_WIDTH} from '../../../util/constant'
import GlobalModal from '../../../componments/GlobalModal';
function buttonMoudle({dispatch,businessFormManage,form}){
  const location  = useLocation();
  const { buttonGroups,buttonLimit,buttonReturnCount,buttonCurrentPage,buttonSearchValue} = businessFormManage
  const [buttonGroupId,setButtonGroupId] = useState(form.getFieldValue('buttonGroupId'))
  const [buttonGroupName,setButtonGroupName] = useState(form.getFieldValue('buttonGroupName'))
  useEffect(()=>{
    getButtonGroups('',1,10)
  },[])
  function getButtonGroups(searchValue,start,limit) {
    dispatch({
      type: `businessFormManage/getButtonGroups`,
      payload: {
        searchValue: searchValue,
        start,
        limit,
        groupType: 'TABLE',
      }
    })
  }
    function onCancel(){
      dispatch({
          type: `businessFormManage/updateStates`,
          payload: {
              buttonModal: false
          }
      })
    }
    function onSave() {
      form.setFieldsValue({
        buttonGroupId: buttonGroupId,
        buttonGroupName: buttonGroupName,
      })
      dispatch({
          type: `businessFormManage/updateStates`,
          payload: {
              buttonModal: false
          }
      })
    }
    const tableProps = {
        rowKey: 'groupId',
        columns: [
          {
            title:'序号',
            render:(text,record,index)=><span>{index+1}</span>,
            width:ORDER_WIDTH,
          },
          {
            title: '按钮方案名称',
            dataIndex: 'groupName',
            width:BASE_WIDTH,
            render: text=><div className={styles.text} title={text}>{text}</div>
          },
          {
            title: '方案编码',
            dataIndex: 'groupCode',
            width:BASE_WIDTH,
            render: text=><div className={styles.text} title={text}>{text}</div>
          },
          {
            title: '方案描述',
            dataIndex: 'groupDesc',
            width:BASE_WIDTH,
            render: text=><div className={styles.text} title={text}>{text}</div>
          },
        ],
        dataSource: buttonGroups,
        pagination: false,
        rowSelection: {
          type: 'radio',
          selectedRowKeys: [buttonGroupId],
          onChange: (selectedRowKeys, selectedRows) => {
            setButtonGroupId(selectedRowKeys.toString());
            setButtonGroupName(selectedRows[0].groupName);
          },
        },
      }
      const changePage=(nextPage,size)=>{
        getButtonGroups(buttonSearchValue,nextPage,size)
        dispatch({
          type:'businessFormManage/updateStates',
          payload:{
            buttonLimit:size
          }
        })
      }
      const changeButtonValue=(e)=>{
        dispatch({
          type:'businessFormManage/updateStates',
          payload:{
            buttonSearchValue:e.target.value
          }
        })
      }
    return(
        <GlobalModal
            visible={true}
            // width={'95%'}
            widthType={1}
            incomingWidth={900}
            incomingHeight={400}
            title={'选择按钮模板'}
            onCancel={onCancel}
            maskClosable={false}
            mask={false}
            className={styles.buttonMoudle}
            centered
            bodyStyle={{height:400,overflow:'hidden',paddingTop:0}}
            getContainer={() =>{
              return document.getElementById(`businessFormManage_container`)||false
            }}
            footer={
              [
                 <Button onClick={onCancel}>
                    取消
                </Button>,
                <Button  type="primary"  onClick={onSave.bind(this)}>
                    保存
                </Button>
               
            ]
            }
        >
          <div style={{height:'100%'}}>
          <Input.Search
                className={styles.search}
                placeholder={'请输入名称、描述'}
                allowClear
                onSearch={(value)=>{getButtonGroups(value,1,buttonLimit)}}
                onChange={changeButtonValue}
                enterButton={<img src={searchIcon} style={{ marginRight: 8,marginTop:-3,marginLeft:2 }}/>}
            />
            <ColumnDragTable {...tableProps} scroll={buttonGroups?{y:'calc(100% - 125px)'}:''}/>
            <div className={styles.footer}>
            <IPagination style={{position:'absolute',bottom:'50px'}} current={buttonCurrentPage} total={buttonReturnCount} onChange={changePage} pageSize={buttonLimit}/>
            {/* <div className={styles.bt_group}  >
                <Button  type="primary" onClick={onSave.bind(this)}>
                    保存
                </Button>
                <Button onClick={onCancel} style={{marginLeft: 8}}>
                    取消
                </Button>
            </div> */}
            </div>
          </div>

        </GlobalModal>
    )
}

export default connect(({ businessFormManage }) => ({
  businessFormManage,
}))(buttonMoudle);
