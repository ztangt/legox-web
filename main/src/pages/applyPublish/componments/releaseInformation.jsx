import React, { useEffect } from 'react'
import { connect } from 'dva'
import { Modal, Button, Input,message} from 'antd'
import GlobalModal from '../../../componments/GlobalModal';
import Table from '../../../componments/columnDragTable';
import { ORDER_WIDTH, BASE_WIDTH } from '../../../util/constant'
function ReleaseInformation({ dispatch, applyPublish,getTreeData }) {
    const { selectedRows, selectedKeys, releaseBizList,selectedRowKeys,selectRegisterId ,currentPage,limit,platType} = applyPublish
    console.log(selectedRows,'selectedRowskml');
    useEffect(() => {
//menuParentId 是0 说明是父级 先从数组中取出menuParentId 是0 记为arr1 剩下的数据记为arr2 如果跟arr2中menuParentId与arr1中id相等存进arr1 该项的children里，没有找到父级单独为一组
//勾选过来的数据转化为树结构
    function organizeMenuItems(menuItems) {
        debugger
        const map = {};
        const roots = [];
        menuItems.forEach(item => {
            map[item.id] = { ...item,sysPlatType:platType, children: [],menuNewName:item.menuName };
        });
        menuItems.forEach(item => {
            if (item.menuParentId == 0) {
                roots.push(map[item.id]);
            } else {
                if (map[item.menuParentId]) {
                    map[item.menuParentId].children.push(map[item.id]);
                } else {
                    roots.push(map[item.id]);
                }
            }
        });
        return roots;
    }
    const organizedMenu = organizeMenuItems(selectedRows);
    //children为空删除该字段
    const delChildren=(data)=>{
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            if(element.children.length==0){
                delete element.children
            }else if(element.children.length>0){
                delChildren(element.children)
            }
            
        }
        return data
    }
        dispatch({
            type: 'applyPublish/updateStates',
            payload: {
                releaseBizList: delChildren(organizedMenu)
            }
        })
    }, [])
    const handelCanel = () => {
        dispatch({
            type: 'applyPublish/updateStates',
            payload: {
                isShowAbilityRelease: false,
                releaseBizList:[]
            }
        })
    }
    const changeValue = (index,record, e) => {
        const newData = releaseBizList.map(item => {
            if (item.id === record.id) {
              return { ...item, menuNewName: e.target.value };
            } else if (item.children) {
              return { ...item, children: updateChildren(item.children, record.id, e.target.value) };
            }
            return item;
          });
        dispatch({
            type: 'applyPublish/updateStates',
            payload: {
                releaseBizList:newData,
            }
        })
    }
    const updateChildren = (children, id, value) => {
        return children.map(child => {
          if (child.id === id) {
            return { ...child, menuNewName: value };
          } else if (child.children) {
            return { ...child, children: updateChildren(child.children, id, value) };
          }
          return child;
        });
      };
    const saveAbility=()=>{
        const result=releaseBizList.map(({bizSolName,...item})=>item)
        dispatch({
            type:'applyPublish/releaseBizToAbility',
            payload:{
                bizReleaseJson:JSON.stringify(result),
                agId:selectedKeys[0]
            },
            callback:()=>{
                setTimeout(()=>{
                    dispatch({
                      type:'applyPublish/getAbilityList',
                      payload:{
                        agId:selectedKeys[0],
                        menuIds:selectedRowKeys.join(','),
                        abilityName:'',
                        start:1,
                        limit:10,
                        registerType:platType
                      },
                      callback:()=>{
                        message.success('已发布')
                        setTimeout(()=>{
                            // dispatch({
                            //     type: 'applyPublish/getPublishList',
                            //     payload: {
                            //         ctlgId:selectRegisterId,
                            //         searchWord:'',
                            //         start:currentPage,
                            //         limit:limit
                            //     }
                            // })
                            dispatch({
                                type: 'applyPublish/getMenu',
                                payload:{
                                  searchWord:'',
                                  registerId:selectRegisterId
                                },
                                callback:function(list){
                                }
                              })
                              getTreeData()
                        },500)
                      }
                    })
                  },1800)
            }
        })
        handelCanel()
    }
    const tableProps = {
        columns: [
            {
                title: '序号',
                render: (text, record, index) => <span>{index + 1}</span>,
                width: ORDER_WIDTH
            },
            {
                title: '应用名称',
                dataIndex: 'name',
                width: BASE_WIDTH
            },
            {
                title: '能力发布名称',
                dataIndex: 'menuNewName',
                render: (text, record, index) => <Input defaultValue={record.menuName} onChange={changeValue.bind(this, index,record)} />,
                width: BASE_WIDTH
            },
            {
                title: '能力类型',
                dataIndex: 'abilityType',
                render: (text,record) => <span>{record.menuSource=='APP'?'业务应用建模':record.menuSource=='OUT'?'外部链接':record.menuSource=='DESIGN'?'设计发布器':''}</span>,
                width: BASE_WIDTH
            }
        ],
        dataSource: releaseBizList,
        scroll:{y:'calc(100% - 45px)'}
    }
    return (
        <div>
            <GlobalModal
                visible={true}
                widthType={2}
                title={'新增发布信息'}
                onCancel={handelCanel}
                maskClosable={false}
                mask={false}
                centered
                getContainer={() => {
                    return document.getElementById('apply_container') || false
                }}
                bodyStyle={{ padding: '0 8px' }}
                footer={[
                    <Button key="cancel" onClick={handelCanel}>取消</Button>,
                    <Button key="submit" type="primary" onClick={saveAbility} >
                        保存
                    </Button>
                ]}
            >
                <div style={{height:'calc(100% - 45px)'}}>
                    <Table {...tableProps} />
                </div>
            </GlobalModal>
        </div>
    )
}
export default connect(({ applyPublish }) => ({ applyPublish }))(ReleaseInformation)
