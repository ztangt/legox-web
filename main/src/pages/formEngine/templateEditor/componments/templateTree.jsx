import {connect} from 'dva';
import {useState, useEffect} from 'react';
import {Tree, Modal,message} from 'antd';
import {getBeanList, getFromColumnsToMap} from './util';
import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
import styles from './templateTree.less';
import Clipboard from 'clipboard';

const {DirectoryTree} = Tree;

function TemplateTree({dispatch, templateEditor}) {
  const {tableList, fromJsonMap, beanTableList} = templateEditor;
  console.log('fromJsonMap', fromJsonMap);
  const [fromList, setFromList] = useState([]);

  const [fromMap, setFromMap] = useState({});

  const onSelect = (keys, info) => {
    const scope = fromMap[keys[0]].tableScope;
    console.log('onSelect', keys, fromMap[keys[0]]);
    const sel = fromMap[keys[0]];
    if (scope != 'SUB' && scope != 'MAIN' && scope != 'DATASET') {
      dispatch({
        type: 'templateEditor/updateStates',
        payload: {
          selectSectionTableKey: keys[0],
          isChangeTree: true,
          fromJsonMap: {
            ...fromJsonMap,
            [keys[0]]: {
              field: sel.formColumnCode,
              source: sel.parent.formTableCode,
              sourceType: sel.parent.tableScope,
              type: sel.formColumnControlCode,
            },
          },
        },
      });
    }
  };

  const onEditChange = (e, nodeData) => {
    e.stopPropagation();
    console.log('nodeData', nodeData);

    dispatch({
      type: 'templateEditor/getBeanResult',
      payload: {
        datasetId: nodeData.key,
      },
    });
  };

  const onDeleteChange = (e, nodeData) => {
    e.stopPropagation();
    Modal.confirm({
      title: '提示',
      content: '确定删除这条数据吗？',
      onOk() {
        dispatch({
          type: 'templateEditor/deleteDataset',
          payload: {
            datasetld: nodeData.key,
          },
        });
      },
      onCancel() {
      },
      mask: true,
    });
  };

  const onCopy = (e, code) => {
    const copy = new Clipboard('.copyBtn');
    copy.on('success', function (e) {
      message.success('复制成功');
      copy.destroy();
    });
    copy.on('error', function (e) {
      message.error('复制失败');
      copy.destroy();
    });
  }
  const titleRender = nodeData => {
    if (nodeData.tableScope === 'DATASET') {
      return (
        <div className={styles.gorup_tree_title}>
          <span>{nodeData.title}</span>
          {
            nodeData.formTableCode ?
              <span data-clipboard-text={nodeData.formTableCode}
                    onClick={(e) => onCopy(e, nodeData.formTableCode)}
                    style={{color: '#1890ff'}}
                    className={'copyBtn'}>
                (复制表名)</span> : null
          }

          <span className={styles.hover_opration}>
            <span
              onClick={e => onEditChange(e, nodeData)}
              style={{marginLeft: '5px'}}
            >
              <EditOutlined/>
            </span>
            <span
              onClick={e => onDeleteChange(e, nodeData)}
              style={{marginLeft: '5px'}}
            >
              <DeleteOutlined/>
            </span>
          </span>
        </div>
      );
    } else {
      return (
        <span className={styles.gorup_tree_title}>
          <span>{nodeData.title}</span>
          {
            nodeData.formTableCode ?
              <span
                data-clipboard-text={nodeData.formTableCode}
                onClick={(e) => onCopy(e, nodeData.formTableCode)}
                style={{color: '#1890ff'}}
                className={'copyBtn'}>(复制表名)</span> : null
          }
        </span>
      );
    }
  };

  useEffect(() => {
    const beanList = getBeanList(beanTableList);
    const {fromMap, fromList} = getFromColumnsToMap([
      ...tableList,
      ...beanList,
    ]);

    setFromList(fromList);
    setFromMap(fromMap);
    console.log('beanTableList', beanTableList);
  }, [tableList, beanTableList]);

  return (
    <div className={styles.treeWarp}>
      <div className={styles.departmentTree}>
        <DirectoryTree
          defaultExpandAll
          onSelect={onSelect}
          treeData={fromList}
          titleRender={titleRender}
        />
      </div>
    </div>
  );
}

export default connect(({templateEditor}) => ({
  templateEditor,
}))(TemplateTree);
