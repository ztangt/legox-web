import {Radio,Button,Input } from 'antd';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { MenuOutlined } from '@ant-design/icons';
import arrayMove from 'array-move';
import {connect} from 'dva';
import { history } from 'umi'
import Table from '../../../componments/columnDragTable/index';
import { parse } from 'query-string';
import React from 'react';
const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);
const SortableItem = SortableElement(props => <tr {...props} />);
const SortableBody = SortableContainer(props => <tbody {...props} />);
class RuleCheckTable extends React.Component {
  state = {
    dataSource: [],
    columns:[
      {
        title:'序号',
        dataIndex:'index',
        key:'index',
        width:60,
        render:(text,obj,index)=><div>{index+1}</div>
      },
      {
        title:'说明',
        dataIndex:'shows',
        key:'shows',
        render:(text,obj,index)=><Input id={`explain_${index}`} defaultValue={text} onBlur={(e)=>{this.props.onBlur(obj,'shows',e.target.value,'verify',index,e)}}  maxLength={100}/>
      },
      {
        title:'规则设置',
        dataIndex:'ruleJsUrl',
        key:'ruleJsUrl',
        width:100,
        render:(text,obj,index)=><Button type="primary" onClick={this.props.showRuleModal.bind(this,true,index,text,obj)}>规则设置</Button>
      },
      {
        title:'是否管控',
        dataIndex:'isControl',
        key:'isControl',
        width:150,
        render:(text,obj,index)=><Radio.Group onChange={(e)=>{this.props.changeCol(obj,'isControl',e.target.value,'verify',index,e)}} defaultValue={text}>
        <Radio value={1}>是</Radio>
        <Radio value={0}>否</Radio>
      </Radio.Group>
      },
      {
        title:'操作',
        dataIndex:'id',
        key:'id',
        width: 80,
        render:(text,obj,index)=>
        <div>
          <a onClick={()=>{this.props.deleteRule('verify',index)}}>删除</a>
        </div>
      },
      {
        title: '优先级',
        dataIndex: 'sort',
        width: 80,
        render: () => <DragHandle />,
      },
    ]
  };
  componentWillReceiveProps(nextProps){
    const {currentRule}=nextProps.parentState;
    this.setState({dataSource:currentRule.check})
  }
  onSortEnd = ({ oldIndex, newIndex }) => {
    const {currentRule}=this.props.parentState;
    const dataSource = currentRule.check;
    if (oldIndex !== newIndex) {
      const newData = arrayMove([].concat(dataSource), oldIndex, newIndex).filter(
        el => !!el,
      );
      console.log('Sorted items: ', newData);
      //更新数据
      this.props.updateData(newData);
      this.setState({ dataSource: newData });
    }
  };

  DraggableContainer = props => (
    <SortableBody
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={this.onSortEnd}
      {...props}
    />
  );

  DraggableBodyRow = ({ className, style, ...restProps }) => {
    const { dataSource } = this.state;
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = dataSource.findIndex(x => x.id === restProps['data-row-key']);
    restProps.className = `${restProps.className} ${index % 2 === 0 ? 'oddRow' : 'evenRow'}`;
    return <SortableItem index={index} {...restProps} />;
  };

  render() {
    const { dataSource,columns } = this.state;
    console.log('dataSource=',dataSource);
    return (
      <Table
        pagination={false}
        dataSource={_.cloneDeep(dataSource)}
        columns={columns}
        rowKey="id"
        taskType='MONITOR'
        components={{
          body: {
            wrapper: this.DraggableContainer,
            row: this.DraggableBodyRow,
          },
        }}
      />
    );
  }
}
export default connect(({applyModelConfig})=>({applyModelConfig}))(RuleCheckTable);
