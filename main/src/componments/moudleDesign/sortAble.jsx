import React, {Component} from 'react';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import { Checkbox } from 'antd';

import arrayMove from 'array-move';
import { connect } from 'dva';
import { UnorderedListOutlined } from '@ant-design/icons'
import styles from './index.less'
import {useLocation} from 'umi'

const SortableItem = SortableElement(({value,flag,key,onChange,isCheck,checked}) => <li className={styles.sort_li}><UnorderedListOutlined />{/*isCheck&&<Checkbox onChange={(e)=>{onChange(flag,e)}} checked={checked}/>*/}{value}</li>);

const SortableList = SortableContainer(({items,onChange,isCheck}) => {
  return (
    <ul>
      {items.map((item, index) => (
        <SortableItem key={item.columnCode} index={index} value={item.columnName} onChange={onChange} isCheck={isCheck} flag={index} checked={item.checked}/>
      ))}
    </ul>
  );
});

class SortableComponent extends Component {

  onSortEnd = ({oldIndex, newIndex}) => {
    const { dispatch,stateInfo,namespace,} = this.props
    const {sortList, formKey} = stateInfo

    dispatch({
        type: `${namespace}/updateStates`,
        payload: {
            sortList: arrayMove(sortList, oldIndex, newIndex),
            formKey: formKey+1,
            // selectedIndex: oldIndex==selectedIndex?newIndex:selectedIndex
        }
    })
  };

  onChange = (index,e) => {
      const { dispatch,namespace,stateInfo,dataName } = this.props
      const { sortList,formKey } = stateInfo
      sortList[index]['checked'] =  e.target.checked


    dispatch({
        type: `${namespace}/updateStates`,
        payload: {
            [dataName]:stateInfo[dataName],
            sortList,
            formKey: formKey+1,
        }
    })

  };
  render() {
    const {sortList} = this.props.stateInfo

    return <SortableList items={sortList} onSortEnd={this.onSortEnd} onChange={this.onChange} isCheck/>;
  }
}

export default SortableComponent