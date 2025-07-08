import React, {Component} from 'react';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import { Checkbox } from 'antd';

import arrayMove from 'array-move';
import { connect } from 'dva';
import { UnorderedListOutlined } from '@ant-design/icons'
import styles from './index.less'
const SortableItem = SortableElement(({value,index,onChange,isCheck}) => <li className={styles.sort_li}><UnorderedListOutlined />{isCheck&&<Checkbox onChange={(e)=>{onChange(index,e)}}/>}{value}</li>);

const SortableList = SortableContainer(({items,onChange,isCheck}) => {
  return (
    <ul>
      {items.map((item, index) => (
        <SortableItem key={item.colCode} index={index} value={item.colName} onChange={onChange} isCheck={isCheck}/>
      ))}
    </ul>
  );
});

class SortableComponent extends Component {

  onSortEnd = ({oldIndex, newIndex}) => {
    const { dispatch,tableColumns,sortList } = this.props

    dispatch({
        type: 'dataDriven/updateStates',
        payload: {
            sortList: arrayMove(sortList, oldIndex, newIndex),
        }
    })
  };

  onChange = (index,e) => {
      const { dispatch,tableColumns,sortList } = this.props
      sortList[index].checked =  e.target.checked
      // if(!e.target.checked){
      //   sortList.splice(index,1)
      // }
    dispatch({
        type: 'dataDriven/updateStates',
        payload: {
            sortList
        }
    })

  };
  render() {
    const {tableColumns,sortList} = this.props

    return <SortableList items={sortList} onSortEnd={this.onSortEnd} onChange={this.onChange} isCheck/>;
  }
}
export default connect(({dataDriven})=>({
    ...dataDriven
}))(SortableComponent);