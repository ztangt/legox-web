import React,{useEffect,useState} from 'react'
import { connect } from 'dva'
import { Modal, Button, message, Spin,  } from 'antd'
import ITree from '../../../componments/public/iTree';
import IPagination from '../../../componments/public/iPagination';
import { dataFormat } from '../../../util/util';
import GlobalModal from '../../../componments/GlobalModal';
import Table from '../../../componments/columnDragTable';
import styles from './selectBizsol.less';
import ReSizeLeftRight from '../../../componments/public/reSizeLeftRight';
function designPublish({ dispatch,loading, onDesignCancel, businessFormTree,start, limit,businessFormTable,businessCurrentPage,businessReturnCount ,designId,selectDesign,selectDesignRows,selectDesignCallBack,addObj}) {
    const [selectedRow,setSelectedRows] = useState([])
    // useEffect(() => {
    //     getBusinessForm(designId,'',start,limit)
    //     setSelectedRows(selectDesignRows)
    //   }, [designId]);
    useEffect(()=>{
        if(addObj.id&&addObj.ctlgId){
            dispatch({
                type: 'moduleResourceMg/updateStates',
                payload: {
                  selectDesign: [addObj.sourceId],
                  designId:addObj.ctlgId
                }
            })
            getBusinessForm(addObj.ctlgId,'',start,limit)
        }else if(designId){
          getBusinessForm(designId,'',start,limit)
        }

    },[])
    console.log(businessFormTable,'businessFormTable');
    function onConfirm(){
        if(selectDesign.length<=0){
          message.error('请选择应用模型')
          return
        }
        if(selectedRow.length==0){
          const newData=[{
            bizSolId:addObj.sourceId,
            bizFormName:addObj.sourceName,
            buttonGroupId:addObj.buttonGroupId,
            bizFormType:null
          }]
          selectDesignCallBack(newData)
        }else{
          selectDesignCallBack(selectedRow)
        }
        dispatch({
          type: 'moduleResourceMg/updateStates',
          payload:{
            isShowDesign:false,
            selectDesign:[],
            businessFormTable:[],

          }
        })
      }
    const selectDesignFn = (key) => {
        console.log(key,'key--');
        dispatch({
            type:'moduleResourceMg/updateStates',
            payload:{
              designId: key[0]
            }
        })
        getBusinessForm(key[0],'',start, limit)
    }
    //获取列表
    const getBusinessForm = (ctlgId, searchWord, start, limit) => {
        dispatch({
            type: 'moduleResourceMg/getBusinessForm',
            payload: {
                ctlgId,
                searchWord,
                start,
                limit
            }
        })
    }
    const changePage = (page, size) => {
        dispatch({
          type: 'moduleResourceMg/updateStates',
          payload:{
            businessCurrentPage: page,
            limit: size
          }
        })
        getBusinessForm(designId,'',page, size)
    }
    const tableProps = {
        rowKey: 'id',
        size:'small',
        scroll: { y: `calc(100% - 40px)` },
        columns: [
          {
            title:'序号',
            render:(text,record,index)=><span>{index+1}</span>,
            width:60
          },
            {
              title: '名称',
              dataIndex: 'bizFormName',
              key: 'bizFormName',
            },
            {
              title: '标识',
              dataIndex: 'bizFormCode',
              key: 'bizFormCode',
            },
            {
                title: '类型',
                dataIndex: 'bizFormType',
                render: text => {
                    switch (text) {
                        case 1: return '超链接表单';
                        case 2: return '超链接列表';
                        case 3: return '表单建模';
                        case 4: return '列表建模';
                    }
                }
            },
            {
              title: '创建时间',
              dataIndex: 'createTime',
              key: 'createTime',
              render:(text)=><div>{dataFormat(text,'YYYY-MM-DD')}</div>
            }
          ],
        dataSource: businessFormTable,
        pagination:false,
        rowSelection: {
          type:'radio',
          selectedRowKeys: selectDesign,
          onChange: (selectedRowKeys, selectedRows) => {
            console.log('selectedRowKeys',selectedRowKeys);
            console.log(selectedRows,'selectedRows---');
            dispatch({
              type: 'moduleResourceMg/updateStates',
              payload: {
                selectDesign: selectedRowKeys,
                selectDesignRows: selectedRows,
              }
            })
            setSelectedRows(selectedRows)
            // selectBizsolCallBack(selectedRows)
          },
        },
    }
    const clickRow=(record)=>{
      return {
        onClick:()=>{
          dispatch({
            type: 'moduleResourceMg/updateStates',
            payload: {
              selectDesign: [record.id],
              selectDesignRows: [record],
            }
          })
          setSelectedRows([record])
        }
      }
    }
    return (
        <GlobalModal
            visible={true}
            // width={800}
            widthType={2}
            incomingWidth={850}
            title='选择设计发布器'
            onCancel={onDesignCancel}
            className={styles.design}
            mask={false}
            centered
            bodyStyle={{ overflow: 'hidden', padding: '0'}}
            maskClosable={false}
            getContainer={() => {
                return document.getElementById('moduleResourceMg_container')||false
            }}
            footer={[
                <Button key="cancel" onClick={onDesignCancel}>取消</Button>,
                <Button type="primary" key="submit" onClick={onConfirm}>确定</Button>
            ]}
        >
            <ReSizeLeftRight
              paddingNum={0}
              height={"inherit"}
              vRigthNumLimit={560}
              suffix={"moduleResourceMg_design"}
              leftChildren={
                <>
                <p className={styles.left_title}>业务应用类别</p>
                <ITree
                    treeData={businessFormTree}
                    onSelect={selectDesignFn}
                    selectedKeys={designId}
                    isSearch={false}
                    defaultExpandAll={true}
                    style={{height:'calc(100% - 33px)',paddingBottom:"8px"}}
                />
                </>
              }
              rightChildren={
                <>
                  <p className={styles.right_title}>应用模型</p>
                    <div style={{height:'calc(100% - 85px)'}}>
                    <Table {...tableProps} key={loading.global} onRow={clickRow}/>
                    </div>
                    <IPagination
                        current={Number(businessCurrentPage)}
                        pageSize={limit}
                        onChange={changePage.bind(this)}
                        total={Number(businessReturnCount)}
                    />
                </>
              }
            />
        </GlobalModal>
    )
}
export default (connect(({ moduleResourceMg, layoutG, loading }) => ({
    ...moduleResourceMg,
    ...layoutG,
    loading
}))(designPublish));
