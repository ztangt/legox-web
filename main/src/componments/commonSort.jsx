import { connect } from 'dva';
import React, { useState,Component,useRef,useEffect,useCallback} from 'react';
import { Modal, Input,Button,message,Form} from 'antd';
import { history } from 'umi';
import styles from './commonSort.less'
import GlobalModal from './GlobalModal';
import Table from './columnDragTable';
const EditableContext = React.createContext(null);
class EditableRow extends Component {
  returnForm = React.createRef();
  render() {
    return (
      <Form ref={this.returnForm} component={false}>
        <EditableContext.Provider value={this.returnForm}>
          <tr {...this.props} />
        </EditableContext.Provider>
      </Form>
    );
  }
}

class EditableCell extends Component {
  state = {
      editing: false
  };

  toggleEdit = (e) => {
      e.stopPropagation();
      const editing = !this.state.editing;
      this.setState({ editing }, () => {
          if (editing) {
              this.input.focus();
          }
      });
  };

  save = (e) => {
      e.stopPropagation();
      const { record, handleSave } = this.props;
      // if(reg.test(values.sort)){
        this.toggleEdit(e);
        let values = this.form.current.getFieldsValue();
        // var reg = /^\d{1,9}$|^\d{1,9}[.]\d{1,6}$/;
        // if(!reg.test(values.sort)){
        //   message.error('最大支持9位整数，6位小数')
        //   this.form.current.resetFields();
        //   values['sort'] = record.sort
        // }

        handleSave({ ...record, ...values })


      // }else{

      // }
  };

  renderCell = (form) => {
    // console.log('form',form);
      this.form = form;
      const { children, dataIndex, record, title } = this.props;
      const { editing } = this.state;
      let formParams = {
          one: {
          name: dataIndex,
          // rules: [
          //   {
          //     pattern:  /^\d{1,9}$|^\d{1,9}[.]\d{1,6}$/ ,
          //     message: '最大支持9位整数，6位小数'
          //   },
          // ],
          initialValue: record[dataIndex]
          }
    };
    return editing ? (
      <Form.Item {...formParams.one} style={{ margin: 0 }}>
        <Input
        className={styles.sort_input}
          ref={(node) => (this.input = node)}
          // onPressEnter={this.save}
          onBlur={this.save}
        />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        onClick={this.toggleEdit}
      >
        {children}
      </div>
    );
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}
const components = {
    body: {
      row: EditableRow,
      cell: EditableCell
    }
}
/*
    name 是各模块名称
    tableList 是数据源列表list
    columns 是需要展示的 列表字段名称   sort不用传 自带固定值
    saveCallBack 保存后回调
*/
function VirtualTable ({dispatch,loading,name,onCancel,tableList,columns,saveCallBack, onExpand,expandable}){
    let newColumns = [...columns,{
        title: '排序',
        dataIndex: 'sort',
        width:'20%',
        onCell: (record) => ({
          record,
          editable: true,
          dataIndex: 'sort',
          title: '排序',
          handleSave: handleSave.bind(this)
        }),
        render: text => (
          <div style={{height:'28px',border:'1px solid #ccc',lineHeight:'28px', borderRadius:'4px',width:'150px'}}>
            &nbsp;&nbsp;{text}
          </div>
        ),
    }];
    const [newArr,setNewArr] = useState([])
    const [newTableList,setNewTableList] = useState(tableList)
    const scrollRef = useRef(null)
    const [visibleItems, setVisibleItems] = useState(50);
    const [scrollTopNumber,setScrollTopNumber] = useState(0)
    const tableProps = {
      rowKey: 'id',
      columns: newColumns,
      dataSource: name=='moduleResourceMg'?newTableList:newTableList&&newTableList.slice(0, visibleItems),
      rowSelection:false,
      loading: loading.global,
      pagination:false
    }
  // 加载更多数据
  const loadMore = useCallback(() => {
    setVisibleItems((prevVisibleItems) => prevVisibleItems + 50);
  }, []);
    function duplicateRemoval(arr){
      arr.reverse()
      var result = [];
      var obj = {};
      for(var i =0; i<arr.length; i++){
        if(!obj[arr[i].id]){
          result.push(arr[i]);
          obj[arr[i].id] = true;
        }
      }
      return result
    }

    function loop(array,id,sort){
      if(name == 'userInfo'){
        for(let i = 0; i < array.length;i++){
          if(array[i].identityId == id){
            array[i].sort = sort
          }else if(array[i].children && array[i].children.length>0){
            loop(array[i].children,id,sort)
          }
        }
      }else{
        for(let i = 0; i < array.length;i++){
          if(array[i].id == id){
            array[i].sort = sort
          }else if(array[i].children && array[i].children.length>0){
            loop(array[i].children,id,sort)
          }
        }
      }
      return array
    }
    function handleSave(record){
      // var reg = /^\d{1,9}$|^\d{1,9}[.]\d{1,6}$/;
      // if(!reg.test(record.sort)){
      //   message.error('最大支持9位整数，6位小数')
      //   return
      // }
      let newData = JSON.parse(JSON.stringify(newTableList))
      let sortList = name == 'userInfo' ? loop(newData,record.identityId,record.sort) : loop(newData,record.id,record.sort)
      setNewTableList(sortList)
      let arr = JSON.parse(JSON.stringify(newArr));
      arr.push(record)
      arr = duplicateRemoval(arr)
      setNewArr(arr)
    }
    function saves(){
        saveCallBack(newArr)
    }
    function onScrollEvent() {
      if(name != 'moduleResourceMg'){
        let num = JSON.parse(JSON.stringify(scrollTopNumber))

        if (scrollRef.current.scrollTop + scrollRef.current.clientHeight ===scrollRef.current.scrollHeight) {
          num++;
          let list = tableList.slice(num * 49,(num + 1) * 49)
          if(list.length != 0){
            if(list.length < 49){
              list = tableList.slice((num - 1)*49,num * 49 + list.length)
              scrollRef.current.scrollTo(0,2730);
            }else{
              scrollRef.current.scrollTo(0,55);
            }
            setNewTableList(list)
            setScrollTopNumber(num)
          }
        }else if(scrollRef.current.scrollTop == 0){
          num--;
          let list = tableList.slice(num*49,(num + 1)*49)
          if(list.length != 0){
            scrollRef.current.scrollTo(0,2730);
            setNewTableList(list)
            setScrollTopNumber(num)
          }
        }
      }
    }
    useEffect(()=>{
      document.getElementById(`${name}_scrollRef`).addEventListener('scroll',onScroll,true)
    },[])
    const onScroll=(e)=>{
        const clientHeight=document.getElementById(`${name}_scrollRef`).clientHeight
        const scrollTop=e.target.scrollTop
        const scrollHeight=e.target.scrollHeight
        if(name != 'moduleResourceMg'){
          if (Math.ceil(clientHeight+scrollTop-40)==scrollHeight) {
            loadMore();
          }
          if(scrollTop == 0){
            setVisibleItems(50)
          }
        }
    }
    return (
        <GlobalModal
            visible={true}
            widthType={1}
            incomingWidth={800}
            incomingHeight={400}
            title='排序'
            onCancel={onCancel}
            mask={false}
            centered
            bodyStyle={{padding:0}}
            className={styles.sort_modal}
            maskClosable={false}
            getContainer={() =>{
                return document.getElementById(`${name}_container`)||false
            }}
            footer={[
              <Button key="cancel" onClick={onCancel}>
                  取消
                </Button>,
              <Button
              key="submit"
              type="primary"
              loading={loading.global}
              htmlType={'submit'}
              onClick={saves}
            >
              保存
            </Button>,
            ]}
        >
            <div id={`${name}_scrollRef`}
                // onScroll={() => onScrollEvent()}
                onScroll={onScroll}
                style={{height:'100%'}}
                >
                  {
                    name=='moduleResourceMg'?
                    <Table
                      scroll={newTableList?{y:'calc(100% - 40px)'}:{}}
                      {...tableProps}
                      key={loading}
                      components={components}
                      taskType={'CATEGORY'}
                    />:
                    <Table
                      scroll={newTableList?{y:'calc(100% - 40px)'}:{}} {...tableProps}
                      key={loading}
                      components={components}
                      onExpand={onExpand}
                      expandable={expandable}
                      rowKey={record => record.id}
                      ref={(c) => { scrollRef.current = c }}
                      taskType={'CATEGORY'}
                    />
                  }

            </div>
    </GlobalModal>
    )
}

export default (connect(({moduleResourceMg,layoutG})=>({
    ...moduleResourceMg,
    ...layoutG
  }))(VirtualTable));
