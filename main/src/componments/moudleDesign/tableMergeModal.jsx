import React, { useState, useEffect } from 'react';
import { Input, Popover, Table, Button } from 'antd';
import styles from './index.less'
import { useDispatch } from 'umi'
// import JSONEditor from '../JsonEditor';
import ReactJson from 'react-json-view';
import GlobalModal from '../../componments/GlobalModal';
import {isJSON} from '../../util/util';


const { TextArea } = Input;

function Index({ namespace, stateInfo, containerId, dataName, tableColumnName }) {
  const dispatch = useDispatch();

  const [json, setJson] = useState('');

  useEffect(() => {
    if (stateInfo[dataName]['mergeFlag'] && stateInfo[dataName]['mergeJson'] != undefined  && isJSON(stateInfo[dataName]['mergeJson'])) {
      setJson(JSON.stringify(briefJson(JSON.parse(stateInfo[dataName]['mergeJson']))))
    } else {
      setJson(JSON.stringify(briefJson(stateInfo[dataName][tableColumnName])))
    }
  }, []);

  function onCancel() {
    dispatch({
      type: `${namespace}/updateStates`,
      payload: {
        isShowTableMerge: false
      }
    })
  }

  function onOK() {
    if (json) {
      stateInfo[dataName]['mergeJson'] = JSON.stringify(combJson(JSON.parse(json), stateInfo[dataName][tableColumnName]))
    } else {
      stateInfo[dataName]['mergeJson'] = ''
    }
    dispatch({
      type: `${namespace}/updateStates`,
      payload: {
        [dataName]: {
          ...stateInfo[dataName],
        },
        isShowTableMerge: false
      },
    });
  }

  const handleJsonChange = (e) => {
    setJson(e.target.value)
  }

  //简化JSON
  const briefJson = (json) => {
    let resJson = []
    for (let i = 0; i < json.length; i++) {
      const ele = json[i]
      if (ele.children) {
        resJson.push({
          title: ele.title,
          children: [],
          align: 'center'
        })
        resJson[i].children = briefJson(ele.children, resJson[i].children)
      } else {
        resJson.push({
          columnCode: ele.columnCode,
          columnName: ele.columnName,
        })
      }
    }
    return resJson;
  }

  //JSON合并
  const combJson = (A, B) => {
    A.forEach(elementA => {
      if (elementA.children) {
        combJson(elementA.children, B)
      } else {
        const elementB = B.find(item => item.columnCode == elementA.columnCode);
        if (elementB) {
          Object.assign(elementA, elementB);
        }
      }
    });
    return A;
  }

  const tmp = '[{"title":"一级标题1","children":[{"columnCode":"A","columnName":"二级标题1"},{"title":"二级标题0","children":[{"columnCode":"A","columnName":"三级标题1"},{"columnCode":"B","columnName":"三级标题2"}]},{"columnCode":"B","columnName":"二级标题2"}]},{"columnCode":"C","columnName":"一级标题2"}]'

  const content = (
    <TextArea style={{width: 360}} value={tmp} readOnly autoSize={{
      minRows: 3,
      maxRows: 10,
    }}/>
  );

  const text = <span>多表头JSON示例</span>;

  let mockJson = {};

  try {
      mockJson = JSON.parse(json);
  } catch (error) {
      console.error('解析出错：' + error.message);
  }
  
  return (
    <GlobalModal
      visible={true}
      // width={820}
      widthType={2}
      title={'表头分组'}
      onCancel={onCancel}
      maskClosable={false}
      mask={false}
      centered
      bodyStyle={{ padding: '0px' }}
      getContainer={() => {
        return document.getElementById(containerId) || false
      }}
      footer={[
        <Button onClick={onCancel.bind(this)}>取消</Button>,
        <Button type="primary" onClick={onOK.bind(this)}>保存</Button>,
      ]}
    >
      <div style={{ padding: 5 }}>
        <Popover placement="bottom" title={text} content={content} trigger="hover">
          <Button style={{ marginBottom: 5 }}>查看示例</Button>
        </Popover>
        <p style={{ color: 'red', marginBottom: 5 }}>
            注:设置过表头合并后，列排序会失效，统一根据JSON展示顺序。
          </p>
        <TextArea rows={6} value={json} onChange={handleJsonChange} />
        <p style={{ margin: 5 }}>
            JSON数据格式化展示
          </p>
        <ReactJson src={mockJson} theme="apathy" name={false} displayDataTypes={false} enableClipboard={false}/>
      </div>
    </GlobalModal>
  )
}

export default Index
