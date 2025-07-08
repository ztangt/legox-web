import { connect } from 'dva';
import React, { useState, useRef, useEffect } from 'react';
import { Modal, Input, Button, message, Form, Row, Col, Switch, Select, TreeSelect, Upload ,Popover} from 'antd';
import styles from '../index.less';
import { history } from 'umi';
import BIZSOL from './selectBizsol'
import { uploadButton, FormOutlined, PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import AbilityModal from './abilityModal';
import IUpload from '../../../componments/Upload/uploadModal';
import iconData from '../../../../public/icon_menuList/iconfont.json';
import IconFont from '../../../../Icon_menuList';
import DesignPublish from './designPublish';
import {getUrlParams} from '../../../util/util';
import { param } from 'jquery';
import { parse } from 'query-string';
import message_icon from '../../../../public/assets/icons/message.svg'
import GlobalModal from '../../../componments/GlobalModal'
import BusinessAppModal from './businessAppModal';
const { TextArea } = Input;
const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
function addForm({ dispatch, loading, addObj, onCancel, setValues, imageUrl, onAddSubmit, menuImgId, searchObj, parentIds, menuList, currentNode, menuLists, sysMenuList,
    selectBizsolModal, selectBusiness, fileExists, md5FileId, fileStorageId, selectBusinessRows,
    isShowAbilityModal, selectAbility, oldAddObj,isShowDesign,selectDesignRows,ctlgId,formUrl,
    designId,needfilepath,treeData,modalMenuList,parentNodeId,isShowBusiness ,moduleRows,mobileTag}) {
    const query = parse(history.location.search);
    const { bizSolId, bizSolName } = query;
    const [imageLoading, setImageLoading] = useState(false);
    const [buttonGroupId, setButtonGroupId] = useState(addObj.buttonGroupId);
    const pathname = '/moduleResourceMg';
    const { key, title, registerCode ,registerFlag} = currentNode;
    const [form] = Form.useForm()
    const [fields, setFields] = useState([
        {
            name: ['menuParentId'],
            value: parentNodeId? parentNodeId : ''
        },
        // {
        //     name: ['bizSolId'],
        //     value: bizSolId ? bizSolId : addObj.bizSolId
        // },
        {
            name: ['bizSolName'],
            value: addObj.sourceName ? addObj.sourceName : ''
        },
        {
            name: ['sourceName'],
            value: addObj.sourceName ? addObj.sourceName : ''
        },
        {
            name: ['menuName'],
            // value: addObj.bizSolName ? addObj.bizSolName : ''
            value: addObj.menuName ? addObj.menuName : ''
        },
        {
            name: ['menuLink'],
            value: addObj.menuLink ? addObj.menuLink : (addObj.menuSource == 'APP' && (addObj.bizSolId || bizSolId) ? `/dynamicPage/${addObj.bizSolId || bizSolId}` : '')
        },
        {
            name: ['menuIcon'],
            value: addObj.menuIcon?addObj.menuIcon:iconData.glyphs[0].font_class,
        },
    ]);
    useEffect(()=>{//只是需要从建模那点击的添加弹框需要默认值
      if(formUrl&&(formUrl.includes('applyModelConfig')||formUrl.includes('cloud/applyConfig'))){
         const targetArr= treeData.filter(item=>item.registerFlag=="PLATFORM_BUSS")
        //获取url参数
        const params = getUrlParams(formUrl);
        dispatch({
          type: 'moduleResourceMg/updateStates',
          payload: {
            imageUrl:'',
            formUrl:'',
            selectBusiness:[params.bizSolId],
            selectBusinessRows:[{bizSolName:decodeURI(params.bizSolName),bizSolId:params.bizSolId}],
            ctlgId: params.ctlgId,
            modalMenuList:[]
          }
        })
        dispatch({
            type: 'moduleResourceMg/getMenu',
            payload:{
              searchWord:'',
              registerId:targetArr&&targetArr[0].id
            },
            isForm:'modal'
          })
          currentNode.key=targetArr&&targetArr[0].id
          currentNode.registerCode=targetArr&&targetArr[0].registerCode
          currentNode.registerFlag=targetArr&&targetArr[0].registerFlag
        selectBizsolCallBack([{
          bizSolId:params.bizSolId,
          bizSolName:decodeURI(params.bizSolName)
        }])
        setFields([
          {
            name: ['registerId'],
            value:targetArr&&targetArr[0].id,
          },
          {
            name: ['menuIcon'],
            value:iconData.glyphs[0].font_class,
          },
          {
            name: ['menuSource'],
            value:'APP',
          },
          {
            name: ['openType'],
            value:'EMB',
          },
          {
            name: ['isEnable'],
            value:true,
          },
          {
            name:['menuParentId'],
            value:''
          }
        ])
      }
    },[formUrl])
    useEffect(() => {
        console.log(fileExists, 'fileExists============');
        // 如果文件存在于minio
        if (fileExists) {
            dispatch({
                type: 'moduleResourceMg/getDownFileUrl',
                payload: {
                    fileStorageId: md5FileId
                },
                callback: () => {
                    dispatch({
                        type: 'moduleResourceMg/updateStates',
                        payload: {
                            fileExists: '',
                            menuImgId: needfilepath?needfilepath:addObj.menuImg
                        }
                    });
                }
            });
        } else if (fileExists === false) {
            // 如果文件不存在于minio
            dispatch({
                type: 'moduleResourceMg/getDownFileUrl',
                payload: {
                    fileStorageId: fileStorageId
                },
                callback: () => {
                    dispatch({
                        type: 'moduleResourceMg/updateStates',
                        payload: {
                            fileExists: '',
                            menuImgId: needfilepath?needfilepath:addObj.menuImg
                        }
                    });
                }
            });
        }
    }, [fileExists])
    // useEffect(() => {
    //     dispatch({
    //         type: 'moduleResourceMg/updateStates',
    //         payload: {
    //             typeName: registerCode
    //         }
    //     })
    // }, [registerCode]);
    // const [UploadForm] = Form.useForm();
    function onFinish(values) {
      debugger;
      values.isEnable = values.isEnable ? '1' : '0';
      values.hidden = values.hidden ? '1' : '0';
      values.isDatarule = values.isDatarule ? '1' : '0';
      // values.isParent = values.isParent? '1' : '0';
      // values.isDatarule = values.menuSource == 'OUT' ? '0' : '1';
      values.menuImg = menuImgId;
      //通过values.registerId获取values.sysPlatType;
      let tmpSysInfo = treeData.filter(i=>i.id==values.registerId);
      values.sysPlatType = tmpSysInfo[0].registerFlag;
      values.menuName = values.menuName ? values.menuName.trim() : '';
      values.menuLink = values.menuLink ? values.menuLink.trim() : '';
      values.buttonGroupId=buttonGroupId
      if(values.menuSource=='MODULE'){//模块管理保存
        values.sysMenuName=values.sourceName
        values.sourceId=addObj.id?moduleRows[0].sourceId:moduleRows[0].id
        values.bizSolId =moduleRows[0].bizSolId
        values.openType='EMB'
      }else if(values.menuSource=='OUT'&&currentNode.registerFlag=='PLATFORM_MIC'){
        values.openType='EMB'
      }else{
        if (values.menuSource == 'OWN') {
            let btnList = [];
            selectAbility.children&&selectAbility.children.map((item) => {//去掉title
                delete (item.title);
                btnList.push(item)
            })
            values['btnList'] = btnList.length ? JSON.stringify(btnList) : '';
            values.menuCode = selectAbility.nodeCode;
            values.sysMenuName = selectAbility.nodeName;
            values.menuMicroService = selectAbility.menuMicroService;
            values.bizSolName = "";
            // values.sourceName = "";
            values.openType=currentNode.registerFlag=='PLATFORM_MIC'?'EMB':values.openType
        } else {
            if(values.menuSource == 'APP'){
                values.bizSolId = selectBusiness && selectBusiness[0] ? selectBusiness[0] : addObj.bizSolId;
            }
            values.bizSolName = selectBusiness && selectBusinessRows[0] ? selectBusinessRows[0].bizSolName :selectDesignRows&&selectDesignRows[0]?selectDesignRows[0].bizFormName: addObj.sourceName;
            values.sourceId = selectBusiness && selectBusiness[0] ? selectBusiness[0] :selectDesignRows&&selectDesignRows[0]?selectDesignRows[0].id: addObj.sourceId;
            values.sourceName = selectBusiness && selectBusinessRows[0] ? selectBusinessRows[0].bizSolName :selectDesignRows&&selectDesignRows[0]?selectDesignRows[0].bizFormName: addObj.sourceName;
            values.sysMenuName=values.sourceName
        }
      }
        if (addObj.id) {
            onAddSubmit(values, '修改')
        } else {
            onAddSubmit(values, '新增')
        }
    }

    const uploadButton = (
        <div style={{ width: '612px', height: '250px', border: '1px solid #f0f0f0' }}>
            <div style={{ marginTop: '120px', textAlign: 'center' }}>
                {imageLoading ? <LoadingOutlined /> : <PlusOutlined />}
                <p>图片预览</p>
            </div>
        </div>
    );

    function beforeUpload(file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('上传的图片不是JPG/PNG格式');
        }
        const isLt2M = file.size / 1024 / 1024 < 5;
        if (!isLt2M) {
            message.error('上传的图片不能大于5MB!');
        }
        return isJpgOrPng && isLt2M;
    }
    const uploadFormData = new FormData();
    //上传头像
    function doImgUpload(options) {
        const { onSuccess, onError, file, onProgress } = options;
        const reader = new FileReader();
        reader.readAsDataURL(file); // 读取图片文件
        reader.onload = (file) => {
            dispatch({
                type: 'moduleResourceMg/updateStates',
                payload: {
                    imageUrl: file.target.result
                }
            })
            setImageLoading(false)
        };
        uploadFormData.append('fileType', 'OTHERS')
        uploadFormData.append('file', file);
        dispatch({
            type: 'userInfoManagement/doImgUploader',
            payload: uploadFormData,
            callback: function (dataId) {
                menuImgId = dataId;
                dispatch({
                    type: 'moduleResourceMg/updateStates',
                    payload: {
                        menuImgId,
                    }
                })
            }
        })
    };


    function onValuesChange(changedValues, allValues) {
        setValues(allValues)
    }
    function onChange(value,node) {
        if(currentNode.registerFlag=="PLATFORM_MIC"&&node.menuParentId!=='0'){
            setFields([
                {
                    name: ['menuParentId'],
                    value: ''
                }
            ])
            return message.error('当前模块不可创建子级')
        }
        setFields([
            {
                name: ['menuParentId'],
                value: value
            }
        ])
    }
    function onChangeIcon(value) {
        setFields([
            {
                name: ['menuIcon'],
                value: value
            }
        ])
    }
    function sysMenuOnSelect(value, node) {
        setFields([
            {
                name: ['menuName'],
                value: node.title
            },
            {
                name: ['menuLink'],
                value: `/dynamicPage/${node.nodeId}`
            }
        ])
    }
    function selectBizsolNameFn(menuSource) {
        if (menuSource == 'APP') {
            dispatch({
                type: 'moduleResourceMg/getCtlgTree',
                payload: {
                    type: 'ALL',
                    hasPermission: '0'
                },
                callback: function () {
                    dispatch({
                        type: 'moduleResourceMg/updateStates',
                        payload: {
                            selectBizsolModal: true,
                            businessList: [],
                        }
                    })
                }
            })
        } else if (menuSource == 'OWN') {
            //获取当前注册系统的树
            dispatch({
                type: "moduleResourceMg/getTenantLicense",
                payload: {
                    isTree: true,
                    registerType: registerFlag,
                    isContainBtn: true
                },
                callback: () => {
                    dispatch({
                        type: "moduleResourceMg/updateStates",
                        payload: {
                            isShowAbilityModal: true
                        }
                    })
                }
            })
        }else if(menuSource == 'DESIGN'){
            dispatch({
                type: 'moduleResourceMg/getSysCtlgTree',
                payload: {
                    hasPermission: '1',
                    type: 'ALL',
                    searchWord: '',
                },
                callback:()=>{
                    dispatch({
                        type:'moduleResourceMg/updateStates',
                        payload:{
                            isShowDesign:true
                        }
                    })
                }
            })
        }else if(currentNode.registerFlag=="PLATFORM_MIC"&&menuSource=='MODULE'){
            dispatch({
                type:'moduleResourceMg/updateStates',
                payload:{
                    isShowBusiness:true,
                }
            })
        }
    }
    function selectBizsolCallBack(value) {
        // dispatch({
        //     type: 'moduleResourceMg/updateStates',
        //     payload:{
        //         ctlgId: ctlgId
        //     }
        // })

        dispatch({
            type: 'moduleResourceMg/formMateData',
            payload: {
                bizSolId: value[0].bizSolId
            },
            callback: function (data) {
                setButtonGroupId(data.buttonGroupId);
                setFields([
                    {
                        name: ['bizSolName'],
                        value: value[0].bizSolName
                    },
                    {
                        name: ['sourceName'],
                        value: value[0].bizSolName
                    },
                    {
                        name: ['menuName'],
                        value: value[0].bizSolName
                    },
                    {
                        name: ['menuLink'],
                        value: `/dynamicPage/${value[0].bizSolId}`
                    },
                    {
                        name: ['metaData'],
                        value: data.mateData
                    },
                ])
            }
        })
    }
    function selectDesignCallBack(value){
        console.log(value,'value');
                setButtonGroupId(value[0].buttonGroupId);
                setFields([
                    {
                        name: ['bizSolName'],
                        value: value[0].bizFormName
                    },
                    {
                        name: ['sourceName'],
                        value: value[0].bizFormName
                    },
                    {
                        name: ['menuName'],
                        value: value[0].bizFormName
                    },
                    {
                        name: ['menuLink'],
                        value:value[0].bizFormType==null?addObj.menuLink: value[0].bizFormType==1||value[0].bizFormType==2?value[0].bizFormUrl:value[0].bizFormType==4?`/dynamicPage/0/${value[0].formId}/0`:''

                    },
                    // {
                    //     name: ['metaData'],
                    //     value: data.mateData
                    // },
                ])
    }
    //模块管理
    function selectModuleCallBack(values){
        setButtonGroupId(values[0].buttonGroupId);
        setFields([
            {
                name: ['sourceName'],
                value: values[0].menuName
            },
            {
                name: ['menuName'],
                value: values[0].menuName
            },
            {
                name: ['menuLink'],
                value:values[0].menuLink

            },
            {
                name: ['metaData'],
                value: values[0].metaData
            },
            {
                name: ['menuIcon'],
                value: values[0].menuIcon,
            },
        ])
    }
    function onBizsolCancel() {
        dispatch({
            type: 'moduleResourceMg/updateStates',
            payload: {
                selectBizsolModal: false
            }
        })
    }
    function onDesignCancel(){
        dispatch({
            type: 'moduleResourceMg/updateStates',
            payload: {
                isShowDesign: false,
                selectDesign:[],
                businessFormTable:[]
            }
        })
    }
    function onChangeSource(value) {

        form.setFieldsValue({
            bizSolName: '',
            menuName: '',
            metaData: '',
            menuLink: '',
            sourceName:'',
        });
        dispatch({
            type: 'moduleResourceMg/updateStates',
            payload:{
              selectDesignRows:[],
              selectDesign:[],
              selectBusiness:[],
              selectBusinessRows: [],
            }
          })
    }
    //改变注册系统，重新获取上级分类目录
    const changeRegister=(value,options)=>{
      form.setFieldsValue({
        menuParentId:''
      });
      currentNode.key=value
      currentNode.registerCode=options.code
      currentNode.registerFlag=options.type
      dispatch({
        type: 'moduleResourceMg/getMenu',
        payload:{
          searchWord:'',
          registerId:value,
        },
        isForm:'modal'
      })
      dispatch({
        type: 'moduleResourceMg/updateStates',
        payload:{
            currentNode
        }
      })
    }
    const content = (
        <div>
          <p>可加参数如：?otherBizSolId=111,222</p>
        </div>
      );
    const deleteMenuWithLink=(menuData,name)=> {
        for (let i = menuData.length - 1; i >= 0; i--) {
          if (menuData[i].menuLink) {
            menuData.splice(i, 1);
          } else if (menuData[i].children) {
            deleteMenuWithLink(menuData[i].children);
            if(menuData[i].children.length==0){
                delete menuData[i].children
            }
          }
        }
      }
      function recursiveDelete(data, targetName) {
        for (let i = data.length - 1; i >= 0; i--) {
            const item = data[i];
            if (item.menuName === targetName) {
                data.splice(i, 1);
            } else if (item.children && item.children.length > 0) {
                recursiveDelete(item.children, targetName);
            }
        }
        return data
    }

    const getMenuTree=()=>{
        const cloneMenuList=JSON.parse(JSON.stringify(menuList))
        const {menuName}= form.getFieldsValue()
        deleteMenuWithLink(cloneMenuList,sourceName)
        const newData=recursiveDelete(cloneMenuList,menuName)
        dispatch({
            type: 'moduleResourceMg/updateStates',
            payload: {
                modalMenuList:newData
            }
        });

    }
    const getMobileTag=()=>{
        dispatch({
            type:'moduleResourceMg/getMobileBillingTag',
            payload:{

            }
        })
    }
    return (
        <GlobalModal
            visible={true}
            widthType={2}
            title={addObj.id ? '修改模块' : '新增模块'}
            onCancel={onCancel}
            className={styles.add_form}
            mask={false}
            bodyStyle={{ overflow: 'auto' }}
            maskClosable={false}
            centered
            getContainer={() => {
                return document.getElementById('moduleResourceMg_container')||false
            }}
            footer={
                [
                        <Button onClick={onCancel}>
                            取消
                        </Button>,
                        <Button type="primary" htmlType="submit" loading={loading.global} onClick={()=>{form.submit()}}>
                            保存
                        </Button>
                ]
            }
        >
            <div style={{ height: "450px" }}>
                <Form
                    form={form}
                    //  form={UploadForm}
                    fields={fields}
                    initialValues={addObj}
                    onFinish={onFinish}
                    onValuesChange={onValuesChange}
                >
                    <Row gutter={0}>
                      <Col span={12}>
                        <Form.Item
                            {...layout}
                            label="注册系统"
                            name="registerId"
                            rules={[
                                { required: true, message: '选择注册系统' },
                            ]}
                            initialValue={key?key:''}
                        >
                          <Select disabled={(addObj.id||currentNode.registerFlag=="PLATFORM_MIC")?true:false} onChange={(value,code)=>{
                            changeRegister(value,code)
                          }}>
                            {treeData.map((item)=>{
                              return <Select.Option value={item.id} code={item.registerCode} type={item.registerFlag}>{item.registerName}</Select.Option>
                            })}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                            {...layout}
                            label="是否启用"
                            name="isEnable"
                            valuePropName="checked"
                        >
                          <Switch />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={0} >
                        <Col span={12}>
                            <Form.Item
                                {...layout}
                                label="模块来源"
                                name="menuSource"
                                rules={[
                                    { required: true, message: '选择模块来源' },
                                ]}
                            >
                                {
                                    currentNode.registerFlag=="PLATFORM_MIC"?<Select
                                    onChange={onChangeSource.bind(this)}
                                    onClick={getMobileTag.bind(this)}
                                    disabled={oldAddObj.id && oldAddObj.menuSource == 'OWN' ? true : false}
                                >
                                    <Select.Option value="OWN">授权能力</Select.Option>
                                    <Select.Option value="OUT">外部链接</Select.Option>
                                    {mobileTag&&<Select.Option value="MODULE">模块管理</Select.Option>}

                                </Select>:
                                    <Select
                                    onChange={onChangeSource.bind(this)}
                                    disabled={oldAddObj.id && oldAddObj.menuSource == 'OWN' ? true : false}
                                >
                                    <Select.Option value="APP">业务应用建模</Select.Option>
                                    <Select.Option value="OUT">外部链接</Select.Option>
                                    <Select.Option value="OWN">授权能力</Select.Option>
                                    <Select.Option value="DESIGN">设计发布器</Select.Option>

                                </Select>}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                noStyle
                                shouldUpdate={(prevValues, currentValues) => prevValues.menuSource !== currentValues.menuSource}
                            >
                                {({ getFieldValue }) =>
                                    <Form.Item
                                        {...layout}
                                        label="能力名称"
                                        name="sourceName"   //bizSolId
                                        rules={[
                                            { required: getFieldValue('menuSource') == 'OUT' ? false : true, message: '选择建模或能力' },
                                        ]}
                                    >
                                        <Select
                                            disabled={ getFieldValue('menuSource') == 'OUT' ? true : false}
                                            onClick={ selectBizsolNameFn.bind(this, getFieldValue('menuSource'))}
                                            autoComplete="off"
                                            open={false}
                                            showArrow={false}
                                        >
                                            <Select.Option value="0"></Select.Option>
                                        </Select>
                                    </Form.Item>
                                }
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={0} >
                        <Col span={12}>
                            <Form.Item
                                {...layout}
                                label="模块资源名称"
                                name="menuName"
                                rules={[
                                    { required: true, message: '请输入模块资源名称' },
                                    { max: 50, message: '最多输入50个字符' }
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                {...layout}
                                label="数据源"
                                name="metaData"
                            >
                                <Input disabled />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={0} >
                        <Col span={23}>
                            <Form.Item
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 20 }}
                                label="模块链接"
                                name="menuLink"
                                rules={[
                                    { max: 200, message: '最多输入200个字符' }
                                ]}
                                className={styles.svg}
                            >
                                {/* 微协同下一级菜单需要限制只支持虚拟节点 一级菜单不能有模块链接*/}
                                <Input style={{width:'95%'}} disabled={addObj.menuSource == 'OWN'? true:false} />

                            </Form.Item>
                        </Col>
                    </Row>
                   { currentNode.registerFlag!=="PLATFORM_MIC"&&<Row gutter={0} >
                      <Col span={23}>
                        <Form.Item
                          labelCol={{ span: 4 }}
                          wrapperCol={{ span: 20 }}
                          label="筛选参数"
                          name="extraParams"
                          rules={[
                            { max: 200, message: '最多输入200个字符' }
                          ]}
                          className={styles.svg}
                        >
                          <Input style={{width:'95%'}}  />

                        </Form.Item>
                      </Col>
                      <Col span={1}>
                      <Form.Item
                        label=''
                        colon={false}
                        >
                        <Popover content={content}  trigger="click"  placement="bottomRight">
                            <p style={{ textAlign:'left' }}> <img  src={message_icon}/></p>
                        </Popover>

                    </Form.Item>
                      </Col>
                    </Row>}
                    <Row gutter={0} >
                        <Col span={12}>
                            <Form.Item
                                {...layout}
                                label="模块图标"
                                name="menuIcon"
                            >
                              <Select onChange={onChangeIcon} >
                                  {
                                    iconData.glyphs.map((item,index) => {
                                        return <Select.Option
                                           key={item+index}
                                           value={item.font_class}
                                        >
                                            {<IconFont type={`icon-${item.font_class}`}/>}
                                        </Select.Option>
                                    })
                                  }
                              </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                {...layout}
                                label='上级节点'
                                name="menuParentId"
                            >
                                <TreeSelect
                                    treeData={modalMenuList}
                                    style={{ width: '100%' }}
                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                    allowClear
                                    onSelect={onChange}
                                    onClick={()=>{getMenuTree()}}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={0} >
                        { currentNode.registerFlag!=="PLATFORM_MIC"&&<Col span={12}>
                            <Form.Item
                                {...layout}
                                label="打开方式"
                                name="openType"
                                rules={[
                                    { required: true, message: '请选择打开方式' },
                                ]}
                            >
                                <Select>
                                    <Select.Option value="EMB">嵌入</Select.Option>
                                    <Select.Option value="POP">新窗口</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>}
                        <Col span={12}>
                        <Form.Item
                                 {...layout}
                                label="是否数据授权"
                                name="isDatarule"
                                valuePropName="checked"
                            >
                                <Switch />
                            </Form.Item>
                        </Col>
                    </Row>
                    { currentNode.registerFlag!=="PLATFORM_MIC"&&<Row gutter={0} >
                        <Col span={12}>
                            <Form.Item
                                {...layout}
                                label="是否隐藏"
                                name="hidden"
                                valuePropName="checked"
                            >
                                 <Switch />
                            </Form.Item>
                        </Col>
                    </Row>}

                    {/* <Form.Item
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 20 }}
                        label="统计sql"
                        name="staSql"
                        rules={[
                            { max: 200, message: '最多输入200个字符' }
                        ]}
                    >
                        <TextArea />
                    </Form.Item> */}
                   { currentNode.registerFlag!=="PLATFORM_MIC"&& <Form.Item
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 20 }}
                        label="模块大图"
                        name="menuImg"
                    >
                        <IUpload
                            typeName={currentNode.registerCode}
                            nameSpace='moduleResourceMg'
                            requireFileSize={5}
                            // mustFileType='jpeg,png,gif,jpg'
                            buttonContent={
                                <>
                                    <p style={{ marginTop: '5px', textAlign: 'center' }}>请选择一张图片</p>
                                    {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '612px', height: '250px' }} /> : uploadButton}
                                </>
                            }
                        />
                        {/* <Upload
                            accept=".jpeg,.png,.gif,.jpg"
                            name="avatar"
                            listType="picture"
                            className={styles.avatarUploader}
                            showUploadList={false}
                            beforeUpload={beforeUpload}
                            customRequest={doImgUpload}
                        >
                            <p style={{ marginTop: '5px', textAlign: 'center' }}>请选择一张图片</p>
                            {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '612px', height: '250px' }} /> : uploadButton}

                        </Upload> */}
                    </Form.Item>}
                    {/* <Row className={styles.bt_group} style={{ width: '150px', margin: '0 auto', paddingBottom: '20px' }} >
                        <Button type="primary" htmlType="submit" loading={loading.global}>
                            保存
                        </Button>
                        <Button onClick={onCancel} style={{ marginLeft: 8 }}>
                            取消
                        </Button>
                    </Row> */}
                </Form>
                {selectBizsolModal && (<BIZSOL  //能力
                    loading={loading.global}
                    onBizsolCancel={onBizsolCancel.bind(this)}
                    selectBizsolCallBack={selectBizsolCallBack.bind(this)}
                />)}
                {isShowAbilityModal && <AbilityModal form={form} />}
                {isShowDesign&&<DesignPublish
                    loading={loading.global}
                    onDesignCancel={onDesignCancel.bind(this)}
                    selectDesignCallBack={selectDesignCallBack.bind(this)}
                />}
                {
                    isShowBusiness&&<BusinessAppModal
                        loading={loading.global}
                        selectModuleCallBack={selectModuleCallBack.bind(this)}
                    />
                }
            </div>

        </GlobalModal>
    )

}



export default (connect(({ moduleResourceMg, layoutG,loading,registerTree }) => ({
    ...moduleResourceMg,
    ...layoutG,
    loading,
    ...registerTree
}))(addForm));
