import { connect } from 'dva';
import { Input,Button,message,Modal,Space,Menu, Dropdown} from 'antd';
import styles from '../index.less';
import { dataFormat,getButton,getButtonByUrl } from '../../../util/util.js';
import CTM from '../../../componments/commonRegisterTree';
import { useState,useEffect,useCallback } from 'react';
import { history } from 'umi';
import COMMONSORT from '../../../componments/commonSort'
import {ORDER_WIDTH,BASE_WIDTH} from '../../../util/constant'
import BUSINESS from './businessSet';
import ADD from './addForm';
import Table from '../../../componments/columnDragTable';
const {confirm} = Modal;
function ModuleResource ({location,dispatch,loading,addFormModal,addObj,searchObj,
                      nodeObj,menuList,addModal,setModal,imageUrl,parentIds,
                      expandedKeys,currentNode,treeSearchWord,parentObjs,
                      menuLists,user,ctlgId,selectDesignRows,formUrl,registerTree,designId,leftNum,searchWord
}){
  const { treeData } = registerTree;
  console.log(treeData,'treeData');
  const pathname = '/moduleResourceMg';
  const { key,title} = currentNode
  const { menus,menusUrlList } =  user;
  console.log('formUrl==',formUrl);
  const MENUTYPE = {
    'OWN': "授权能力",
    'APP': "业务应用建模",
    'OUT': "外部链接",
    'DESIGN':'设计发布器',
    'MODULE':'模块管理'
  }
  const ISDATARULETYPE = {
    '0': "否",
    '1': "是",
  }
  const [expandedList,setExpandedList] = useState([])
  const [commonSort,setCommonSort] = useState(false)
  const [columns,setColumns] = useState([])
  const [height,setHeight] = useState(document.documentElement.clientHeight-305)
  const onResize = useCallback(()=>{
    setHeight(document.documentElement.clientHeight-305)
  },[])

  useEffect(()=>{
      window.addEventListener('resize',onResize);
      return (()=>{
          window.removeEventListener('resize',onResize)
      })
  },[])
  console.log(height,'height');
  useEffect(()=>{//只是需要从建模那点击的添加弹框需要默认值
    if(treeData&&treeData.length){
      if(formUrl&&(formUrl.includes('applyModelConfig')||formUrl.includes('cloud/applyConfig'))){
        dispatch({
          type: 'moduleResourceMg/updateStates',
          payload:{
            addModal:true
          }
        })
      }
    }
  },[treeData,formUrl])
  const updateAddModal = (registerId,menuList)=>{
    let newMenuLists = JSON.parse(JSON.stringify(menuList))
    newMenuLists = filter(newMenuLists,registerId)
    newMenuLists = loops(newMenuLists)
    console.log('newMenuLists===',newMenuLists);
    dispatch({
      type: 'moduleResourceMg/updateStates',
      payload:{
        menuLists:newMenuLists,
        addModal:true
      }
    })
  }
  let parentNode = [];
  function onDeploy(values){
    dispatch({
      type: 'moduleResourceMg/deployModel',
      payload: {
        id:values.id
      }
    })
  }

  function onCancel(){
    // historyPush({
    //   pathname: '/moduleResourceMg',
    //   query: {
    //   }
    // });
    dispatch({
      type: 'moduleResourceMg/updateStates',
      payload:{
        setModal:false,
        addModal:false
      }
    })
    setCommonSort(false)
  }

  const tableProps = {
    rowKey: 'id',
    columns: [
      {
        title: '模块资源显示名称',
        dataIndex: 'menuName',
        width:BASE_WIDTH*2.5,
      },
      {
        title: '能力名称',
        dataIndex: 'sourceName',
        width:BASE_WIDTH,
      },
      {
        title: '模块来源',
        dataIndex: 'menuSource',
        width:BASE_WIDTH,
        render:(text,record) => {
          return <div>
            <span>{MENUTYPE[text]}</span>
        </div>
        }
      },
      {
        title: '模块链接',
        dataIndex: 'menuLink',
        width:BASE_WIDTH,
      },
      {
        title: '启用',
        dataIndex: 'isEnable',
        width:ORDER_WIDTH,
        render:(text,record) => {
          return <div>
            <span>{text == '1' ? '是':'否'}</span>
        </div>
        }
      },
      {
        title: '数据授权',
        dataIndex: 'isDatarule',
        width:80,
        render:(text,record) => {
          return <div>
            <span>{ISDATARULETYPE[text]}</span>
        </div>
        }
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width:100,
        fixed:'right',
        render: (text,record)=>{return <div className='table_operation'>
              {(getButtonByUrl(menusUrlList,'update','','/moduleResourceMg')||window.location.href.includes('cloud/applyConfig'))&&<a onClick={onAdd.bind(this,record)}>修改</a>}
              {(getButtonByUrl(menusUrlList,'delete','','/moduleResourceMg')||window.location.href.includes('cloud/applyConfig'))&&<a onClick={onDelete.bind(this,record.id)}>删除</a>}
              {/* {getButton(menus,'upMove')&&<a onClick={onEnumeInfoMoveUp.bind(this,record.id)}><ArrowUpOutlined /></a>}
              {getButton(menus,'downMove')&&<a onClick={onEnumeInfoMoveDown.bind(this,record.id)}><ArrowDownOutlined /></a>} */}
        </div>}
      },
    ],
    dataSource: menuList,
    expandedRowKeys:expandedList,
    rowSelection:{
      selectedRowKeys: parentIds,
      type:'checkbox',
      // selectedRowKeys: ['1410145035789332485'],
      onChange: (selectedRowKeys, selectedRows) => {
        dispatch({
          type:'moduleResourceMg/updateStates',
          payload:{
            parentIds:selectedRowKeys,
            parentObjs:selectedRows
          }
        })
      },
    },
    onExpand:onExpand,
    loading: loading.global,
    pagination:false
  }
  function onExpand(expanded, {key}){
    let newList = expandedList
    if(expanded){
      newList.push(key)
    }else{
      newList = newList.filter(x => x != key)
    }
    setExpandedList(newList)
  }
  let expandedLists = []
  function expandedLoop(array){
    for(let i= 0;i<array.length;i++){
      let item = array[i];
      if(item.children && item.children.length >= 1){
        expandedLists.push(item.id)
      }
      if(item.children&&item.children.length!=0){
        expandedLoop(item.children)
      }
    }
    return expandedLists
  }

  function getMenu(registerId,searchWord,callback){
    dispatch({
      type: 'moduleResourceMg/getMenu',
      payload:{
        searchWord,
        registerId
      },
      callback:function(list){
        if(searchWord){
          let arr = expandedLoop(list)
          setExpandedList(arr)
        }
        callback(registerId,list)
      }
    })
  }
  const rebuildEntityTree = (value, data) => {
    if (!data) {
      return []
    }
    let newArr = [];
    data.forEach(element => {
      if (element.menuName.indexOf(value) > -1) {
        const newData = rebuildEntityTree(value, element.children);
        const obj = newData.length>0?{
          ...element,
          children: newData
        }:{...element}
        newArr.push(obj);
      } else {
        if (element.children && element.children.length > 0) {
          const newData = rebuildEntityTree(value, element.children);
          const obj = {
            ...element,
            children: newData
          };
          if (newData && newData.length > 0) {
            newArr.push(obj);
          }
        }
      }
    });
    return newArr;
  };


  const changeValue=(e)=>{
    dispatch({
      type: 'moduleResourceMg/updateStates',
      payload:{
        searchWord:e.target.value
      }
    })
  }
  function onSearchTable(value){
    if(!currentNode.key){
      message.error('请选择注册系统')
      return
    }
    dispatch({
      type: 'moduleResourceMg/getMenu',
      payload:{
        searchWord:'',
        registerId:key
      },
      callback:function(list){
        let newList =  rebuildEntityTree(value,list)
        setExpandedList([])
        expandedLists = []
        dispatch({
          type: 'layoutG/updateStates',
          payload:{
            searchWord: value,
          }
        })
        if(value){
          let arr = expandedLoop(newList)
          setExpandedList(arr)
        }
        dispatch({
          type: 'moduleResourceMg/updateStates',
          payload:{
            menuList:[...newList]
          }
        })
      }
    })
  }

  //新增 编辑保存回调
  function onAddSubmit(values,text){
    console.log('ctlgId',ctlgId);
    if(currentNode.registerFlag=='PLATFORM_MIC'&&!values.menuParentId&&values.menuLink){
      return message.error('一级菜单只能保存虚拟节点')
    }
    if(text == '新增'){
      dispatch({
        type: 'moduleResourceMg/addMenu',
        payload:{
          ...values,
          ctlgId:ctlgId?ctlgId:designId,
          nodeId:ctlgId?ctlgId:designId,
        },
        callback:function(data){
          console.log('data=',data);
          if(data.isRecover=='true'){
            confirm({
              title: '关联了重复的能力，是否要覆盖?',
              content: '',
              mask:false,
              getContainer:() => {
                return document.getElementById('moduleResourceMg_container')
              },
              onOk() {
                dispatch({
                  type:"moduleResourceMg/recoverMenu",
                  payload:{
                    ...values,
                    ctlgId:ctlgId?ctlgId:designId,
                    nodeId:ctlgId?ctlgId:designId,
                    id:data.menuId
                  }
                })
              },
              onCancel() {
                console.log('Cancel');
              },
            });
          }
          dispatch({
            type: 'moduleResourceMg/updateStates',
            payload:{
              addModal:false,
              selectBusiness:[],
              selectBusinessRows: [],
            }
          })
        }
      })
    }else{
      values['id'] = addObj.id;
      dispatch({
        type: 'moduleResourceMg/updateMenu',
        payload:{
          ...values,
          ctlgId:ctlgId?ctlgId:designId,
          nodeId:ctlgId?ctlgId:designId,
        },
        callback:function(){
          dispatch({
            type: 'moduleResourceMg/updateStates',
            payload:{
              addModal:false
            }
          })
        }
      })
    }
  }

  function loop(tree,nodeKey){
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node['children']) {
        if (node['children'].some(item => item['key'] === nodeKey)) {
          parentNode.push(node.key)
          return node
        } else{
          loop(node.children,nodeKey);
        }
      }
    }
  }
  function loops(array){
    for(let i= 0;i<array.length;i++){
      let item = array[i];
      item.value = item.key;
      if(item.children && item.children.length == 0){
        item.children = null
      }
      if(item.children&&item.children.length!=0){
        loops(item.children)
      }
    }
    return array
  }
  function filter (data,nodeKey) {
    var newData = data.filter(x => !x.menuLink && x['key'] != nodeKey)
    newData.forEach(x => x.children && x.children.length > 0 && (x.children = filter(x.children,nodeKey)))
    return newData
  }
//点击列表上新增  或者 修改
  function onAdd(obj){
    dispatch({
      type: 'moduleResourceMg/updateStates',
      payload:{
        ctlgId:'',
        designId:''
      }
    })
    if(key){
      if(parentIds.length == 1 || parentIds.length == 0){

        let newMenuLists = JSON.parse(JSON.stringify(menuList))
        newMenuLists = filter(newMenuLists,obj.key)
        newMenuLists = loops(newMenuLists)
        dispatch({
          type: 'moduleResourceMg/updateStates',
          payload:{
            menuLists:newMenuLists
          }
        })
      //  setMenuLists(newMenuLists)
      if(parentObjs.length == 1&&!obj.id){
        if(parentObjs[0].menuLink){
          message.error('当前模块不能创建子级节点')
          return
        }
        //微协同系统只有两级
        if(currentNode.registerFlag=="PLATFORM_MIC"&&parentObjs[0].menuParentId!=='0'){
          return message.error('当前模块不可创建子级节点')
        }
      }
        if(obj.id){

          parentNode = [];
          loop(menuList,obj.key);
          if(currentNode.registerFlag=="PLATFORM_MIC"){
            dispatch({
              type:'moduleResourceMg/updateStates',
              payload:{
                moduleRows:[obj]
              }
            })
          }
          dispatch({
            type: 'moduleResourceMg/updateStates',
            payload:{
              parentNodeId:obj.menuParentId!=='0'?obj.menuParentId:'',
              selectBusiness:[],
            }
          })
          obj = JSON.parse(JSON.stringify(obj))
          obj.isEnable = obj.isEnable == 1 ? true : false //是否启用
          obj.isDatarule=obj.isDatarule==1? true : false
          obj.hidden=obj.hidden==1? true : false
        }else{
          obj.isEnable = true //新增默认启用
          dispatch({
            type: 'moduleResourceMg/updateStates',
            payload:{
              selectDesignRows:[],
              selectDesign:[],
              selectBusiness:[],
              selectBusinessRows: [],
               parentNodeId:parentIds[0],
            }
          })
        }
        // obj = JSON.parse(JSON.stringify(obj))
        
        if(currentNode.registerFlag=="PLATFORM_MIC"){
          obj.menuSource = obj.id ? obj.menuSource : 'OWN'
        }else{
          obj.menuSource = obj.id ? obj.menuSource : 'APP'
          obj.openType = obj.id ? obj.openType : 'EMB'
        }
        if(obj.menuImg){
          // dispatch({
          //   type: 'userInfoManagement/getDownFileUrl',
          //   payload:{
          //     fileStorageId:obj.menuImg
          //   },
          //   callback:function(datUrl){
              dispatch({
                  type: 'moduleResourceMg/updateStates',
                  payload:{
                    imageUrl:obj.menuImgUrl,
                    menuImgId:obj.menuImg
                  }
              })
          //   }
          // })
        }else{
          dispatch({
            type: 'moduleResourceMg/updateStates',
            payload:{
              imageUrl:''
            }
          })
        }
        // dispatch({
        //   type:'moduleResourceMg/getBizSolTree',
        //   payload:{

        //   }
        // })
        dispatch({
          type: 'moduleResourceMg/getMenu',
          payload:{
            searchWord:'',
            registerId:key
          },
          isForm:'modal',
          callback:()=>{
            dispatch({
              type: 'moduleResourceMg/updateStates',
              payload:{
                addObj:obj,
                oldAddObj:obj,
                ctlgId:  obj.id?obj.nodeId:'',
                addModal:true,
                selectBusiness: obj.id?[obj.bizSolId]:'',
              }
            })
            if(obj.menuSource=='OWN'){
              dispatch({
                type:"moduleResourceMg/updateStates",
                payload:{
                  selectAbility:obj.id?{nodeCode:obj.menuCode,nodeName:obj.sysMenuName,menuMicroService:obj.menuMicroService,children:[]}:{}
                }
              })
            }
          }
        })
      }else{
        message.error('新增或编辑只可选择一条数据')
        return
      }
    }else{
      message.error('请选择注册系统')
    }

  }
  //点击业务域设置
  function onSet(obj){
    dispatch({
      type: 'moduleResourceMg/updateStates',
      payload:{
        setModal:true
      }
    })
  }
  function getTextByJs(arr) {
    var str = "";
    for (var i = 0; i < arr.length; i++) {
        str += arr[i]+ ",";
    }
    if (str.length > 0) {
        str = str.substr(0, str.length - 1);
    }
    return str;
  }
  //删除
  function onDelete(id){
    let ids = '';
    if(id){
      ids = id;
    }else{
      if(parentIds.length == 0){
        message.error('请最少选择一条数据');
        return
      }else{
        ids = getTextByJs(JSON.parse(JSON.stringify(parentIds)))
      }
    }
    Modal.confirm({
      title: '确认删除吗?',
      okText: '删除',
      cancelText: '取消',
      mask:false,
      getContainer:() => {
        return document.getElementById('moduleResourceMg_container')
    },
      onOk() {
        const registerId=treeData&&treeData.find(item=>item.registerFlag=="PLATFORM_MIC").registerId
        dispatch({
          type:'moduleResourceMg/getMicMenuIds',
          payload:{
            registerId:registerId,
            menuIds:ids
          },
          callback:(data)=>{
            if(data.length){
              Modal.confirm({
                title: '当前模块已被移动端使用，是否同步删除?',
                okText: '删除',
                cancelText: '取消',
                mask:false,
                getContainer:() => {
                  return document.getElementById('moduleResourceMg_container')
                },
                onOk:()=>{
                  dispatch({
                    type: 'moduleResourceMg/deleteMenu',
                    payload:{
                      menuIds:ids.split(',').concat(data).join(',')
                    },
                    callback:function(){
                      dispatch({
                        type: 'moduleResourceMg/updateStates',
                        payload:{
                          parentIds:[]
                        }
                      })
                    }
                  })
                }
              })
            }else{
              dispatch({
                type: 'moduleResourceMg/deleteMenu',
                payload:{
                  menuIds:ids
                },
                callback:function(){
                  dispatch({
                    type: 'moduleResourceMg/updateStates',
                    payload:{
                      parentIds:[]
                    }
                  })
                }
              })
            }
          }
        })
      }
    });
  }
  //排序
  function onCommonSort(){
    if(key){
      setColumns([{
        title: '模块资源显示名称',
        dataIndex: 'menuName',
        width:'80%'
      }])
      setCommonSort(true)
    }else{
      message.error('请选择注册系统')
    }
  }
  function saveCallBack(list){
    let arr = [];
    var reg = /^\d{1,9}$|^\d{1,9}[.]\d{1,6}$/;
    const flag= list.every(item=>reg.test(item.sort))
    if(!flag){
      message.error('最大支持9位整数，6位小数')
    }else{
      list.forEach(function(item,i){
        let obj = {
          sort:item.sort,
          id:item.id
        }
        arr.push(obj)
      })
      dispatch({
        type: 'moduleResourceMg/menuSort',
        payload:{
          sortList:arr.length==0?'':JSON.stringify(arr)
        },
        callback:function(){
          getMenu(key,'')
          setCommonSort(false)
        }
      })
    }
  }
  //上移时获取当前选中 是否是 最后一条或第一条 和 相邻item
  let isStatus = null;
  let adjacentMenuInfo = [];
  let currentMenuInfo = [];
  function moveLoop(array,moduleId,ele){
      for(var i=0;i<array.length;i++){
          if(array[i].id == moduleId){
              if(ele == 'shiftUp'){
                  if(i != 0){
                      adjacentMenuInfo.push(array[i - 1])
                      currentMenuInfo.push(array[i])
                      isStatus = true;
                  }else{
                      isStatus = false;
                  }
              }else{
                  if(i+1 != array.length){
                      adjacentMenuInfo.push(array[i + 1])
                      currentMenuInfo.push(array[i])
                      isStatus = true;
                  }else{
                      isStatus = false;
                  }
              }
          }
          if(array[i].children&&array[i].children.length > 0){
            moveLoop(array[i].children,moduleId,ele)
          }
      }
  }
  //模块上移
  function onEnumeInfoMoveUp(moduleId){
    adjacentMenuInfo = [];
    currentMenuInfo = [];
    isStatus = null;
    moveLoop(menuList,moduleId,'shiftUp')
    if (isStatus) {
      if(currentMenuInfo[0].sort == adjacentMenuInfo[0].sort){
        message.info('当前sort值一样，请先手动修改sort值')
      }else{
        menuMoveFn(adjacentMenuInfo,currentMenuInfo)
      }
    } else {
        message.info('已经是第一条了')
    }
  }
  //模块下移
  function onEnumeInfoMoveDown(moduleId){
    adjacentMenuInfo = [];
    currentMenuInfo = [];
    isStatus = null;
    moveLoop(menuList,moduleId,'shiftDown')
    if (isStatus) {
      if(currentMenuInfo[0].sort == adjacentMenuInfo[0].sort){
        message.info('当前sort值一样，请先手动修改sort值')
      }else{
        menuMoveFn(adjacentMenuInfo,currentMenuInfo)
      }
    } else {
        message.info('已经是最后一条了')
    }
  }
  function menuMoveFn(adjacentMenuInfo,currentMenuInfo){
    dispatch({
      type: 'moduleResourceMg/menuMove',
      payload: {
        currentMenuId: currentMenuInfo[0].id,
        currentSort: currentMenuInfo[0].sort,
        adjacentMenuId:adjacentMenuInfo[0].id,
        adjacentSort:adjacentMenuInfo[0].sort
      },
      callback:function(){
        getMenu(key,'')
      }
    })
  }

  function onBack(){
    historyPush({
      pathname: '/applyModelConfig',
      query: {}
    });
  }
    return (
      <div style={{height:'100%',borderRadius:'4px'}}>

        <CTM
            leftRightSuffix="moduleResourceMg"
            treeData={treeData}
            expandedKeys={expandedKeys}
            treeSearchWord={treeSearchWord}
            currentNode={currentNode}
            plst={'输入系统名称'}
            leftNum={leftNum}
            getData={(node)=>{
              dispatch({
                type: 'moduleResourceMg/updateStates',
                payload:{
                  parentIds:[],
                  parentObjs:[],
                  searchWord:''
                }
              })
              dispatch({
                type: 'layoutG/updateStates',
                payload:{
                  currentPage: 1,
                }
              })
              parentIds
              getMenu(node.key,'')
            }}
          >
            <div className={styles.other}>
              <Input.Search
                className={styles.search}
                placeholder={'请输入模块名称'}
                allowClear
                value={searchWord}
                onChange={changeValue.bind(this)}
                onSearch={(value)=>{onSearchTable(value)}}
              />
                <Space>
                  {(window.location.href.includes('cloud/applyConfig'))&&<Button type='primary' onClick={onBack.bind(this,{})} className={styles.fontSize7}>返回至应用配置</Button>}
                  {(getButtonByUrl(menusUrlList,'add','','/moduleResourceMg')||window.location.href.includes('cloud/applyConfig'))&&<Button type='primary' onClick={onAdd.bind(this,{})} className={styles.fontSize7}>新增</Button>}
                  {(getButtonByUrl(menusUrlList,'delete','','/moduleResourceMg')||window.location.href.includes('cloud/applyConfig'))&&<Button onClick={onDelete.bind(this,'')} className={styles.fontSize7}>删除</Button>}
                  {(getButtonByUrl(menusUrlList,'sort','','/moduleResourceMg')||window.location.href.includes('cloud/applyConfig'))&&<Button className={styles.fontSize7} onClick={onCommonSort}>模块排序</Button>}
                    {/* <Button className={styles.fontSize7}>模块排序</Button>
                    <Button onClick={onSet.bind(this,{})} className={styles.fontSize7}>业务域设置</Button>   */}
                </Space>
            </div>
            <div style={{height:'calc(100% - 56px'}}>
              <Table {...tableProps} key={loading} scroll={{y:'calc(100% - 40px)'}}/>
            </div>
        </CTM>


        {addModal && (<ADD  //新增
          addObj = {addObj}
          menuLists={menuLists}
          setValues={(values)=>{
            dispatch({
              type: 'moduleResourceMg/updateStates',
              payload:{
                addObj: {...addObj,...values}
              }
            })
           }

          }
          loading={loading.global}
          onCancel={onCancel.bind(this)}
          onAddSubmit = {onAddSubmit}
        />)}
        {setModal && (<BUSINESS
            // addObj = {addObj}
            setValues={(values)=>{
              dispatch({
                type: 'moduleResourceMg/updateStates',
                payload:{
                  addObj: {...addObj,...values}
                }
              }) }
            }
            loading={loading.global}
            onCancel={onCancel.bind(this)}
            //  onAddSubmit = {onAddSubmit.bind(this)}
        />)}
        {commonSort && <COMMONSORT loading={loading.global} name='moduleResourceMg' onCancel={onCancel.bind(this)} tableList={menuList} columns={columns} saveCallBack={saveCallBack}/>}
      </div>
    )
  }
export default connect(({moduleResourceMg,departmentTree,layoutG,user,loading,registerTree})=>({
  ...moduleResourceMg,
  ...departmentTree,
  layoutG,
  user,
  registerTree,
  loading
}))(ModuleResource);
