import React, {Component} from 'react';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import { Checkbox } from 'antd';

import arrayMove from 'array-move';
import { connect } from 'dva';
import { UnorderedListOutlined } from '@ant-design/icons'
import styles from './listMoudlePreview.less'
import listMoudlePreview from './listMoudlePreview';
const SortableItem = SortableElement(({value,flag,key,onChange,isCheck,checked}) => <li className={styles.sort_li}><UnorderedListOutlined />{isCheck&&<Checkbox onChange={(e)=>{onChange(flag,e)}} checked={checked}/>}{value}</li>);

const SortableList = SortableContainer(({items,onChange,isCheck}) => {
  return (
    <ul>
      {items.map((item, index) => (
        <SortableItem key={item.colCode} index={index} value={item.colName} onChange={onChange} isCheck={isCheck} flag={index} checked={item.checked}/>
      ))}
    </ul>
  );
});

class SortableComponent extends Component {

  onSortEnd = ({oldIndex, newIndex}) => {
    const { dispatch,tableColumns,sortList, formKey} = this.props

    dispatch({
        type: 'listMoudlePreview/updateStates',
        payload: {
            sortList: arrayMove(sortList, oldIndex, newIndex),
            formKey: formKey+1,

        }
    })
  };

  onChange = (index,e) => {
      const { dispatch,sortList,formKey,listMoudleInfo } = this.props
      sortList[index]['checked'] =  e.target.checked

    dispatch({
        type: 'listMoudlePreview/updateStates',
        payload: {
            listMoudleInfo,
            sortList,
            formKey: formKey+1,
        }
    })

  };
  render() {
    const {tableColumns,sortList} = this.props

    return <SortableList items={sortList} onSortEnd={this.onSortEnd} onChange={this.onChange} isCheck/>;
  }
}
export default connect(({listMoudlePreview})=>({
    ...listMoudlePreview
}))(SortableComponent);