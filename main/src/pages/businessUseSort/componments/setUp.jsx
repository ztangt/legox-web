// import { Input,Button,Tree,Table,Spin,Tabs} from 'antd';
import { Modal, Input,Button,Form,Row,Col,Checkbox,Space,TreeSelect,Spin} from 'antd';
import React from "react";
import styles from '../index.less'

import { CarryOutOutlined,SearchOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import _ from "lodash";
const { SHOW_PARENT } = TreeSelect;
class addBusinessUseSort extends React.Component { 
  state = {
    isStatus:false
  };
    componentDidMount(){
        const {dispatch,nodeType} = this.props
        dispatch({
        type: 'tree/updateStates',
        payload:{
            treeData:[
            ],
            expandId: '',
            expandedKeys: [],
            currentNodeId:''
        }
        })
        dispatch({
        type: 'tree/getOrgChildren',
        payload:{
            nodeType,
            start:1,
            limit:200
        }
        
        })
    }
    genTreeNode = (parentId, isLeaf = false) => {
      const random = Math.random().toString(36).substring(2, 6);
      return {
        id: random,
        value: random,
        title: isLeaf ? 'Tree Node' : 'Expand to load',
        isLeaf,
      };
    };

    onSearch(values){
      const {dispatch,nodeType,businessUseSort,tree} = this.props;
      const { treeData } = tree ;
      dispatch({
        type: 'tree/getSearchTree',
        payload:{
          searchWord: values,
          type: nodeType
        },
        callback:function(){
          dispatch({
            type: 'tree/updateStates',
            payload:{
              treeData: Array.from(new Set(treeData))
            }
          })
        }
      })
    }

   

    onLoadData = treeNode =>
      new Promise(resolve => {
        const { tree,loading,dispatch} = this.props
        const {expandedKeys, treeData } = tree ;
        console.log('treeNode',treeNode)
          if(treeNode.isParent==1){ 
            dispatch({
              type: 'tree/getOrgChildren',
              payload:{
                  nodeId: treeNode.key,
                  nodeType:treeNode.nodeType,
                  start:1,
                  limit:200
              },
              callback:function(){
                dispatch({
                  type: 'tree/updateStates',
                  payload:{
                    treeData: Array.from(new Set(treeData))
                  }
                })
                console.log('treeData成功后',treeData)
               
              }
            })
          }
           resolve();
    });

    onFinish(values){
        const {onSetUpSubmit} = this.props;
        values.orgs = values.orgs? values.orgs : [];
        console.log('values.orgs.length',values.orgs.length)
        if(values.orgs.length > 0){
          values.orgs.forEach(function(item,i){
            item['orgId'] = item.value
            item['orgName'] = item.label
            delete item.value
            delete item.label
          })
        }
        onSetUpSubmit(values)
    }

    
    render(){
        const { tree, plst,loading,onCancel,businessUseSort} = this.props
        const {expandedKeys, treeData, currentNodeId } = tree ;
        let titleStyle = {fontSize:'16px',fontWeight:'600',color:'#333',lineHeight:'22px'};
        let promptStyle ={fontSize:'12px',lineHeight:'24px'};
        return(
          <Spin  spinning={loading.global}  >
            <Modal
            visible={true}
            footer={false}
            width={600}
            title={'授权设置'}
            onCancel={onCancel}
            className={styles.add_form}
            mask={false}
            centered
            maskClosable={false}
            getContainer={() =>{
                return document.getElementById('dom_container')
            }}
            >
          
            <Form  onFinish={this.onFinish.bind(this)}>
                <p style={titleStyle}>分类权限设置</p>
                <Row gutter={0} style={{marginTop:'24px'}}>
                    <Col span={16}>
                      <Form.Item 
                          label="单位"
                          name="orgs" 
                      >   
                          <TreeSelect 
                                // key={loading.global}
                                style={{width:'80%'}}
                                // showSearch={false}
                                treeData={treeData}
                                treeNodeFilterProp='title'
                                placeholder="单位选择树(多选)"
                                allowClear
                                showCheckedStrategy={SHOW_PARENT}
                                treeCheckStrictly={true}
                                onSearch={this.onSearch.bind(this)}
                                loadData={this.onLoadData}
                            />
                      </Form.Item>
                    </Col>
                </Row>
                <p style={titleStyle}>分类下权限设置(表单、流程、业务应用建模)</p>
                <Form.Item name="permissionTypes" label="" style={{marginTop:'18px'}}>
                    <Checkbox.Group>
                        <Row>
                            <Col span={6}>
                                <Checkbox value="READ" style={{ lineHeight: '32px' }}>
                                    阅读权限
                                </Checkbox>  
                            </Col>
                            <Col span={6}>
                                <Checkbox value="UPDATE" style={{ lineHeight: '32px' }}>
                                    修改权限
                                </Checkbox>
                            </Col>
                            <Col span={6}>
                                <Checkbox value="ADD" style={{ lineHeight: '32px' }}>
                                    添加权限
                                </Checkbox>
                            </Col>
                            <Col span={6}>
                                <Checkbox value="DELETE" style={{ lineHeight: '32px' }}>
                                    删除权限
                                </Checkbox>
                            </Col>
                        </Row>
                    </Checkbox.Group>
                </Form.Item>
                <p style={{...promptStyle,color:'#d81b19'}}>注释：</p>
                <p style={{...promptStyle,color:'#666'}}>1、租户管理员分类授权单位后,多级管理员可在授权分类下创建下级分类为自己单位专属分类,租户管理员可查看全部</p>
                <p style={{...promptStyle,color:'#666'}}>2、租户管理员可授权分类下表单的修改、添加、删除权限。如果此分类被多单位公用时,也是同步修改调整</p>
                <Row style={{width:'150px',margin:'0 auto'}}>
                    <Space> 
                        <Button  type="primary" htmlType="submit">
                            保存
                        </Button>
                        <Button onClick={onCancel}>
                            取消
                        </Button>
                    </Space>
                </Row>
            </Form>
          
            
        </Modal>
        </Spin>
        );
    }
}
export default connect(({tree,loading,businessUseSort})=>({
  tree,
  loading,
  businessUseSort
}))(addBusinessUseSort);