import {connect} from 'umi';
import ReSizeLeftRight from "../../../componments/public/reSizeLeftRight";
import {useState,useEffect,useCallback} from 'react';
import {Tree,Input,Button,Spin,Space} from 'antd';
import styles from './list.less';
import {ORDER_WIDTH,BASE_WIDTH} from '../../../util/constant'
import Table from '../../../componments/columnDragTable';
import search_black from '../../../../public/assets/search_black.svg'
function ListIndex({dispatch,accreditLook,loading}){
  const {registerList,leftNum}=accreditLook;
  const [currentNodeKey,setCurrentNodeKey] = useState('');
  const [searchWord,setSearchWord] = useState('');
  const [expandedRowKeys,setExpandedRowKeys] = useState([]);
  const [dataSource,setDataSource]=useState([]);
  // const [height,setHeight] = useState(document.documentElement.clientHeight-250)
  // const onResize = useCallback(()=>{
  //   setHeight(document.documentElement.clientHeight-250)
  // },[])

  // useEffect(()=>{
  //     window.addEventListener('resize',onResize);
  //     return (()=>{
  //         window.removeEventListener('resize',onResize)
  //     })
  // },[])
  const columns=[
    {
      title: '能力组',
      dataIndex: 'nodeGroupName',
      render:(text,obj)=><div>{renderName(text)}</div>,
      width:BASE_WIDTH,
    },
    {
      title: '能力名称',
      dataIndex: 'nodeName',
      render:(text,obj)=><div>{renderName(text)}</div>,
      width:BASE_WIDTH*1.5,
    },
    {
      title: '编码',
      dataIndex: 'nodeCode',
      width:BASE_WIDTH,
    },
    {
      title: '能力链接',
      dataIndex: 'menuLink',
      width:BASE_WIDTH,
    },
  ]
  useEffect(()=>{//默认全部展开
    dispatch({
      type:'accreditLook/updateStates',
      payload:{
        limit:10
      }
    })
    dispatch({
      type:'accreditLook/getRegister',
      payload:{
        searchWord:'',
        start:1,
        limit:100
      },
      callback:(list)=>{
        if(list.length){
          //当前选中节点
          setCurrentNodeKey(list[0].registerFlag)
          dispatch({
            type: 'accreditLook/getTenantLicense',
            payload:{
              registerType:list[0].registerFlag,
              isContainBtn:false,
              isTree:true
            },
            callback:(menus)=>{
              let dataSource = loopTable(menus);
              setDataSource(dataSource);
              let expandedRowKeys = getExpendNode('',dataSource,[],[]);
              console.log('expandedRowKeys1111=',expandedRowKeys);
              setExpandedRowKeys(expandedRowKeys);
            }
          })
        }
      }
    })
  },[])
  console.log('expandedRowKeys123=',expandedRowKeys);
  //把能力组名称重新命名
  const loopTable=(menus)=>{
    let newMenus = _.cloneDeep(menus);
    newMenus.map((item)=>{
      if(item.nodeType=='ABILITYGROUP'){
        item.nodeGroupName = item.nodeName;
        item.nodeName = '';
      }
      if(item.children&&item.children.length){
        item.children = loopTable(item.children)
      }else{
        item.children=null
      }
      return item;
    })
    return newMenus
  }
  const onSelect=(selectedKeys, info)=>{
    setSearchWord('');
    if(selectedKeys.length){
      dispatch({
        type: 'accreditLook/getTenantLicense',
        payload:{
          registerType:selectedKeys[0],
          isContainBtn:false,
          isTree:true
        },
        callback:(menus)=>{
          let dataSource = loopTable(menus);
          setDataSource(dataSource);
          let expandedRowKeys = getExpendNode('',dataSource,[],[]);
          setExpandedRowKeys(expandedRowKeys);
        }
      })
      //当前选中节点
      setCurrentNodeKey(selectedKeys[0])
    }
  }
  const loop=(registerList)=>{
    registerList.map((item)=>{
      item['title'] = item.registerName
      item['key'] = item.registerFlag
      item['value'] = item.registerFlag
    })
    return registerList
  }
  //获取展开的节点ID
  const getExpendNode = (searchWord,data,expandedRowKeys,parentIds)=>{
    data.map((item)=>{
      expandedRowKeys.push(item.nodeCode);
      if(item.children&&item.children.length){
        getExpendNode (searchWord,item.children,expandedRowKeys,parentIds)
      }
    })
    return expandedRowKeys;
  }
  const onSearchTable=(value)=>{
    setSearchWord(value);
    dispatch({
      type: 'accreditLook/getTenantLicense',
      payload:{
        registerType:currentNodeKey,
        isContainBtn:false,
        isTree:true,
        searchWord:value
      },
      callback:(menus)=>{
        let dataSource = loopTable(menus);
        setDataSource(dataSource);
        let expandedRowKeys = getExpendNode(value,dataSource,[],[]);
        setExpandedRowKeys(expandedRowKeys);
      }
    })
  }
  const renderName=(text)=>{
    if(text&&searchWord){
      let inputNode = '';
      let index = text.indexOf(searchWord);
      if(index>-1){
        let beforeStr = text.substr(0, index);
        let afterStr = text.substr(index + searchWord.length);
        inputNode =(<span>
          {beforeStr}
          <span style={{background:"rgba(255, 235, 117)"}}>{searchWord}</span>
          {afterStr}
        </span>)
      }else{
        inputNode = text
      }
      return inputNode;
    }else{
      return text;
    }
  }
  //上传文件
  const onChangeFile=(e)=>{
    const file = e.target.files[0];
    const isLt = file.size / 1024 / 1024 < 2;
    if (!isLt) {
      message.error(`文件大小不符，必须小于2MB`, 5);
      return false;
    }
    dispatch({
      type:'accreditLook/updateLicense',
      payload:{
        file:file
      }
    })
  }
  const mergedColumns = columns.map((col) => {
    return {
      ...col,
      onCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
      }),
    };
  });
  const changeSearchWord=(e)=>{
    setSearchWord(e.target.value);
  }
  return (
    <div className={styles.ac_list_warp}>
    <ReSizeLeftRight
      vNum={leftNum}
      vLeftNumLimit={100}
      suffix={"accreditLook"}
      leftChildren={
        <div className={styles.registerTree}>
          <p style={{fontSize:'16px',fontWeight:'900'}}>注册系统</p>
          <Tree
              key={"id"}
              className={styles.tree_list}
              onSelect={onSelect.bind(this)}
              treeData={loop(registerList)}
              selectedKeys={[currentNodeKey]}
              defaultExpandAll
              showLine={false}
              />
        </div>
      }
      rightChildren={
        <div className={styles.table} >
          <div className={styles.other}>
            <Input.Search
              className={styles.search}
              placeholder={'请输入能力名称'}
              allowClear
              onSearch={(value)=>{onSearchTable(value)}}
              value={searchWord}
              onChange={changeSearchWord.bind(this)}
              enterButton={<img src={search_black} style={{ marginRight: 8, marginTop: -3, marginLeft: 4 }} />}
            />
              <Space>
              <Button type="primary" className={styles.upload_button}>
                授权更新
                <input type="file" onChange={onChangeFile}/>
              </Button>
              </Space>
          </div>
          <div style={{height:'calc(100% - 48px)'}}>
            <Table
              rowKey='nodeCode'
              columns={mergedColumns}
              dataSource={dataSource}
              pagination={false}
              scroll={dataSource.length?{y:'calc(100% - 40px'}:{}}
              expandable={{
                defaultExpandAllRows:true,
                expandedRowKeys:expandedRowKeys,
                onExpandedRowsChange:(expandedRows)=>{
                  console.log('expandedRows=',expandedRows);
                  setExpandedRowKeys(expandedRows)
                }
              }}
            />
          </div>
        </div>

      }
    />
    </div>
  )
}
export default  connect(({accreditLook,loading})=>{return {accreditLook,loading}})(ListIndex)
