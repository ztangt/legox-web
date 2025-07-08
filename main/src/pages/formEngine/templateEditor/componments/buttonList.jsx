import { connect } from 'dva';
import { useState, useEffect } from 'react';
import { Button, Select } from 'antd';
// import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import BeanDataModal from './BeanDataModal';
import APIDataModal from './APIDataModal';
import {
  filterDOM,
  getFromCodeEntries,
  getFromColumnsToMap,
  getBeanList,
  getCodeType,
} from './util';
import styles from './buttonList.less';

function ButtonList({ dispatch, templateEditor }) {
  const {
    deployFormId,
    paperLayout,
    paperSize,
    paperHeight,
    paperWidth,
    topMargin,
    bottomMargin,
    leftMargin,
    rightMargin,
    templatePath,
    isChromatography,
    fromJsonMap,
    selectSectionTableKey,
    previewURL,
    tableList,
    beanTableList,
    BeanModalVisible,
  } = templateEditor;

  const [isAPIModalVisible, setIsAPIModalVisible] = useState(false);
  const [isBeanModalVisible, setIsBeanModalVisible] = useState(false);

  const [fromList, setFromList] = useState([]);

  const [fromMap, setFromMap] = useState({});

  const beanList = getBeanList(beanTableList);
  const fromCodeMap = getFromCodeEntries([...tableList, ...beanList]);

  // 遍历DOM
  const transFormTemplateDOM = async data => {
    return new Promise(async (res, rej) => {
      const templateForStart = '<!-- #parse("static/velocity.vm") -->';

      let parser = new DOMParser();
      let doc = parser.parseFromString(data, 'text/html');

      for (let ele of doc.getElementsByTagName('*')) {
        if (
          ele.localName === 'body' &&
          !ele.innerHTML.includes(templateForStart)
        ) {
          if (paperLayout === 'landscape') {
            ele.setAttribute(
              'style',
              `size: ${paperLayout}; height:${paperHeight}cm; width:${paperWidth}cm; padding: ${topMargin}cm ${rightMargin}cm ${bottomMargin}cm ${leftMargin}cm; margin: 0 auto;`,
            );
          } else {
            ele.setAttribute(
              'style',
              `size: ${paperLayout}; height:${paperWidth}cm; width:${paperHeight}cm;  padding: ${topMargin}cm ${rightMargin}cm ${bottomMargin}cm ${leftMargin}cm; margin: 0 auto;`,
            );
          }

          ele.innerHTML = `${templateForStart}${ele.innerHTML}`;
        }

        if (
          ele.localName === 'table' &&
          Array.from(ele.classList).includes('ck-table-resized')
        ) {
          for (let element of ele.getElementsByTagName('tbody')) {
            console.log('severalseveralseveral', element);
            if (element.localName === 'tbody') {
              let tcList = [];
              let reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g');
              for (
                let i = 0;
                i < element.childNodes[0].childNodes.length;
                i++
              ) {
                let trVal = element.childNodes[0].childNodes[i].innerHTML;
                if (trVal != '&nbsp;' && !reg.test(trVal)) {
                  tcList.push(element.childNodes[0].childNodes[i].innerHTML);
                }
              }
              // let tc = () => {
              //   if (tcList[0]) {
              //     const { code } = getCodeType(tcList[0]);
              //     return code;
              //   }
              //   return '';
              // };
              // console.log(
              //   'tc()',
              //   tc(),
              //   ele,
              //   fromCodeMap,
              //   fromCodeMap.has(tc()),
              // );
              // 主表不能加for, 子表需要加, 如果dataSet 是集合需要加for, 如果不是集合不能加
              // if (fromCodeMap.has(tc())) {
              //   const templateForStart = `<!-- #foreach($item in $${fromCodeMap.get(
              //     tc(),
              //   )}) -->`;
              //   const templateForEnd = '<!-- #end -->';
              //   element.innerHTML = `${templateForStart}${element.innerHTML}${templateForEnd}`;
              // }
            }
          }
        }

        //修改一种添加后端循环字段的方式 以前那个不好使
        //如果tbody有data-foreach属性，就添加给第一个tr前面和最后一个tr后面添加注释
        if( ele.localName === 'tbody'&&ele.hasAttribute('data-foreach')) {
          const dataForeachValue = '$'+ ele.getAttribute('data-foreach');
          const commentStart = `<!-- #foreach($item in ${dataForeachValue}) -->`;
          const commentEnd = `<!-- #end -->`;
          // 获取表格中的所有tr元素
          const trs = ele.querySelectorAll('tr');

          if (trs.length > 0) {
            // 在第一个tr元素之前添加注释
            trs[0].insertAdjacentHTML('beforebegin', commentStart);
            // 在最后一个tr元素之后添加注释
            trs[trs.length - 1].insertAdjacentHTML('afterend', commentEnd);
          }
        }

        if (
          ele.localName === 'td' &&
          ele.innerText.includes('表格行数会根据实际')
        ) {
          ele.parentElement.removeChild(ele);
        }

        if (
          ele.localName === 'img' &&
          ele.src &&
          !ele.src.includes('templateEditor')
        ) {
          const uploadCallBack = (path, fullPath, fileExt) => {
            ele.src = `${fullPath}`;
          };
          await dispatch({
            type: 'templateEditor/getPicToMinio',
            payload: ele.src,
            callback: uploadCallBack,
          });
        }
      }

      res(doc.getElementsByTagName('*')[0].outerHTML);
    });
  };

  // 遍历json
  const transFormJsonData = (templatePath, fromJsonMap) => {
    let parser = new DOMParser();
    let doc = parser.parseFromString(templatePath, 'text/html');

    let newJson = {};

    let text = /^[\u4e00-\u9fa5]+$/;

    for (let ele of doc.getElementsByTagName('*')) {
      //加上标签 因为table里面不只有td，只判断td会有问题
      if (
        ele.localName === 'p'||ele.localName === 'td' &&
        !text.test(ele.innerHTML) &&
        ele.innerHTML != '&nbsp;'
      ) {
        const { code } = getCodeType(ele.innerHTML);

        Object.keys(fromJsonMap).forEach(item => {
          const { formColumnCode, formColumnId, field } = fromJsonMap[item];

          if (
            (formColumnCode || formColumnCode === code || field === code) &&
            fromJsonMap[formColumnId || item]
          ) {
            newJson[formColumnId || item] = fromJsonMap[formColumnId || item];
          }
        });
      }
      // }
    }
    console.log('fromJsonMap3333', newJson);
    return newJson;
  };

  const onSave = async () => {
    let newFromJson = transFormJsonData(templatePath, fromJsonMap);
    console.log('fromJsonMap11', newFromJson);
    const query = {
      id: deployFormId,
      paperLayout,
      paperSize,
      paperHeight,
      paperWidth,
      topMargin,
      bottomMargin,
      leftMargin,
      rightMargin,
      isChromatography,
      filedContextPath: JSON.stringify(newFromJson),
      templatePath,
    };

    await transFormTemplateDOM(templatePath).then(res => {
      // 上传回调
      const uploadCallBack = path => {
        query.templatePath = path;

        const uploadJSONCallBack = path => {
          query.filedContextPath = path;
          console.log('dddddddddd', path);
          // 新建表单
          dispatch({
            type: 'templateEditor/createPrintTemplate',
            payload: query,
          });
        };

        dispatch({
          type: 'templateEditor/getJSONToMinio',
          payload: JSON.stringify(newFromJson),
          callback: uploadJSONCallBack,
        });
      };

      dispatch({
        type: 'templateEditor/getTemplateToMinio',
        payload: res,
        callback: uploadCallBack,
      });
    });
  };

  const goPrintView = async () => {
    if (templatePath) {
      await onSave();
    }
    setTimeout(() => {
      let path = `/support/formEngine/templateEditor/previewPrint?deployFormId=${deployFormId}`;
      window.open(`#${path}`, '_blank');
    }, 1000);
  };

  const handleChange = value => {
    console.log('valllllll', value);

    let modelVisibleMap = {
      API: () => {
        setIsAPIModalVisible(true);
      },
      Bean: () => {
        setIsBeanModalVisible(true);
      },
    };
    modelVisibleMap[value]();

    dispatch({
      type: 'templateEditor/updateStates',
      payload: {
        BeanModalVisible: true,
        eventObj: {},
      },
    });
  };

  useEffect(() => {
    const beanList = getBeanList(beanTableList);
    const { fromMap, fromList } = getFromColumnsToMap([
      ...tableList,
      ...beanList,
    ]);

    setFromList(fromList);
    setFromMap(fromMap);
  }, [tableList, beanTableList]);

  useEffect(() => {
    setIsBeanModalVisible(BeanModalVisible);
  }, [BeanModalVisible]);

  return (
    <div className={styles.btnWarp}>
      <div style={{ marginLeft: '15px' }}>
        <span>数据集管理：</span>
        <Select
          defaultValue=""
          style={{
            width: 120,
          }}
          // onChange={handleChange}
          onSelect={handleChange}
        >
          <Option value="API" disabled>
            API数据集
          </Option>
          <Option value="Bean">JavaBean数据集</Option>
        </Select>
      </div>
      <div>
        <Button className={styles.btn} onClick={onSave}>
          保存
        </Button>

        <Button className={styles.btn} onClick={goPrintView}>
          预览
        </Button>
      </div>

      {isAPIModalVisible && (
        <APIDataModal
          isAPIModalVisible={isAPIModalVisible}
          setIsAPIModalVisible={setIsAPIModalVisible}
        />
      )}

      {isBeanModalVisible && (
        <BeanDataModal
          isBeanModalVisible={isBeanModalVisible}
          setIsBeanModalVisible={setIsBeanModalVisible}
        />
      )}
    </div>
  );
}

export default connect(({ templateEditor }) => ({
  templateEditor,
}))(ButtonList);
