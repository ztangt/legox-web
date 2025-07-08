import { Input,Button,Tree,Table,Spin,message} from 'antd';
import React from "react";
import styles from './commonTreeMg.less';
import PropTypes from 'prop-types';
import '../global.less'
import { CarryOutOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import _ from "lodash";
import { history } from 'umi'
import ReSizeLeftRight from './public/reSizeLeftRight'
import TRE from './Tree'


class TreeMg extends React.Component { 

    render(){
          const {plst,onSearchTable,getData,nodeType,onEditTree,treeData,currentNode,expandedKeys,treeSearchWord,moudleName,onDeleteTree,onAdd,isShowAdd,leftNum,dispatch} = this.props
          console.log('treeData==',treeData,getData);
          
          return(
            <div className={styles.container}>
              <ReSizeLeftRight
                suffix={moudleName}
                vLeftNumLimit={220}
                vNum={leftNum}
                leftChildren={
                  <TRE
                    isShowAdd={isShowAdd}
                    onAdd={onAdd}
                    plst={plst}
                    onSearchTable={onSearchTable}
                    getData={getData}
                    nodeType={nodeType}
                    onEditTree={onEditTree}
                    onDeleteTree={onDeleteTree}
                    treeData={treeData}
                    currentNode={currentNode}
                    expandedKeys={expandedKeys}
                    treeSearchWord={treeSearchWord}
                    moudleName={moudleName}
                  />
                }
                rightChildren={
                  <div className={styles.table} style={this.props.tableStyle?{...this.props.tableStyle}:{}}>
                  {this.props.children}
                  </div>
                }
              />
          </div>
        );
    }
}

export default connect(({tree,loading,layoutG})=>({
  tree,
  loading,
  ...layoutG
}))(TreeMg);