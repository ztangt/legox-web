import { connect } from 'dva';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { message } from 'antd';
import MyEditor from 'ckeditor5-custom-build/build/ckeditor'; // 用户自定义的编辑器
import TableWalker from '@ckeditor/ckeditor5-table/src/tablewalker';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
  filterDOM,
  getFromCodeEntries,
  getFromColumnsToMap,
  getBeanList,
  getCodeType,
} from './util';
import './editor.css';

function Editor({ dispatch, templateEditor }) {
  const {
    fromJsonMap,
    templateFullPath,
    tableList,
    moneyFormat,
    dateFormat,
    selectSectionTableKey,
    isChangeTree,
    beanTableList,
  } = templateEditor;

  const beanList = getBeanList(beanTableList);
  // const fromCodeMap = getFromCodeEntries([...tableList, ...beanList]);
  const { fromMap } = getFromColumnsToMap([...tableList, ...beanList]);

  // 编辑器内容
  const [html, setHtml] = useState('');
  // 编辑器实例
  const [editor, setEditor] = useState(null);

  const maxWidthRef = useRef(0);
  // 'BulletedList', 'NumberedList',
  const editorConfiguration = {
    language: 'zh-cn',
    table: {
      // defaultHeadings: { rows: 1, columns: 0 },
    },
    fontFamily: {
      options: [
        'default',
        'Blackoak Std',
        '宋体,SimSun',
        '新宋体,NSimSun',
        '仿宋,FangSong',
        '仿宋_GB2312,FangSong_GB2312',
        '黑体,SimHei',
        '微软雅黑,Microsoft YaHei',
        '楷体_GB2312,KaiTi_GB2312',
        '隶书,LiSu',
        '幼园,YouYuan',
        '华文细黑,STXihei',
        '细明体,MingLiU',
        '新细明体,PMingLiU',
      ],
    },
    fontSize:{
      options: [
        'tiny',
        'small',
        'default',
        'big',
        'huge',
        {
          title:'初号',
          model:'56px'
        },
        {
          title:'小初',
          model:'48px'
        },
        {
          title:'一号',
          model:'34.7px'
        },
        {
          title:'小一',
          model:'32px'
        },
        {
          title:'二号',
          model:'29.3px'
        },
        {
          title:'小二',
          model:'24px'
        },
        {
          title:'三号',
          model:'21.3px'
        },
        {
          title:'小三',
          model:'20px'
        },
        {
          title:'四号',
          model:'18.7px'
        },
        {
          title:'小四',
          model:'16px'
        },
        {
          title:'五号',
          model:'14px'
        },
        {
          title:'小五',
          model:'12px'
        },
        {
          title:'六号',
          model:'10px'
        },
        {
          title:'小六',
          model:'8.7px'
        },
      ],
    },
    removePlugins: ['Title', 'List', 'Outdent', 'Indent',],
    allowedContent: true,
  };

  const setDynamicTableClass = (writer, root) => {
    const range = writer.createRangeIn(root);

    for (const value of range.getWalker({ ignoreElementEnd: true })) {
      const node = value.item;

      if (node.name === 'table') {
        if (node._attrs.has('headingRows')) {
          node._attrs.set('class', 'dynamicTable');
        }
      }
    }
  };

  const setFormControlCode = ({
    isDynamicTable,
    value,
    formColumnControlCode,
    isArray,
    DaformTableCode,
    tableScope,
  }) => {
    let formControlMap = {
      DATE: `#dateFormat('${dateFormat}', `,
      MONEY: `#moneyFormat('${moneyFormat}', `,
      OPINION: `#signature(`,
    };

    let controVal = formControlMap[formColumnControlCode];

    // 主表不能加for, 子表需要加, 如果dataSet 是集合需要加for, 如果不是集合不能加
    if (tableScope === 'DATASET') {
      if (isArray) {
        if (isDynamicTable) {
          // 子表
          if (controVal) {
            return `${controVal}$!item.${value})`;
          } else {
            return `$!item.${value}`;
          }
        } else {
          // 主表
          if (controVal) {
            return `${controVal}$!${DaformTableCode}[0].${value})`;
          } else {
            return `$!${DaformTableCode}[0].${value}`;
          }
        }
      } else {
        if (controVal) {
          return `${controVal}$!${DaformTableCode}.${value})`;
        } else {
          return `$!${DaformTableCode}.${value}`;
        }
      }
    }

    if (tableScope === 'MAIN') {
      if (controVal) {
        return `${controVal}$!${value})`;
      } else {
        return `$!${value}`;
      }
    }

    if (tableScope === 'SUB') {
      if (controVal) {
        return `${controVal}$!item.${value})`;
      } else {
        return `$!item.${value}`;
      }
    }
    return `$!${value}`;
  };

  const handleInsertModel = (
    title,
    value,
    formColumnControlCode,
    parTableScope,
  ) => {
    // 获取工具
    const table = editor.plugins.get('TableUtils');
    // 获取选中表格
    const selectedTableCells = table.getTableCellsContainingSelection(
      editor.model.document.selection,
    );

    if (selectedTableCells.length > 0) {
      editor.model.change(writer => {
        // 获取选中表格列数
        const columnObj = table.getColumnIndexes(selectedTableCells);

        const rowObj = table.getRowIndexes(selectedTableCells);

        // 设置动态表格类名
        setDynamicTableClass(writer, editor.model.document.getRoot());

        let isDynamicTable =
          selectedTableCells[0].parent.parent._attrs.get('class') ===
          'dynamicTable';

        if (
          isDynamicTable &&
          fromMap[selectSectionTableKey].parent.tableScope === 'MAIN'
        ) {
          return message.error('主表字段不可插入动态表格');
        }

        if (
          !isDynamicTable &&
          fromMap[selectSectionTableKey].parent.tableScope === 'SUB'
        ) {
          return message.error('子表字段不可插入主表中');
        }

        if (
          isDynamicTable &&
          fromMap[selectSectionTableKey].parent.tableScope === 'DATASET' &&
          !fromMap[selectSectionTableKey].parent.isArray
        ) {
          return message.error('非集合数据不可插入动态表格');
        }

        if (
          !isDynamicTable &&
          fromMap[selectSectionTableKey].parent.tableScope === 'DATASET' &&
          fromMap[selectSectionTableKey].parent.isArray
        ) {
          return message.error('集合数据不可插入主表中');
        }

        // 获取选中实例
        const tableWalker = new TableWalker(
          selectedTableCells[0].parent.parent,
          isDynamicTable
            ? {
                startRow: rowObj.first + 1,
                startColumn: columnObj.first,
                endColumn: columnObj.last,
                endRow: 1,
              }
            : {
                startRow: rowObj.first,
                startColumn: columnObj.first + 1,
                endColumn: columnObj.last + 1,
                endRow: rowObj.last,
              },
        );

        let isArray =
          fromMap[selectSectionTableKey].parent.tableScope === 'DATASET' &&
          fromMap[selectSectionTableKey].parent.isArray;

        const newValue = setFormControlCode({
          isDynamicTable,
          value,
          formColumnControlCode,
          isArray: fromMap[selectSectionTableKey].parent.isArray,
          DaformTableCode: fromMap[selectSectionTableKey].parent.formTableCode,
          tableScope: fromMap[selectSectionTableKey].parent.tableScope,
        });

        // 写入
        editor.model.insertContent(writer.createText(title));

        // 遍历插入
        for (const tableSlot of tableWalker) {
          const selection = writer.createSelection(tableSlot.cell, 'in');
          // 主表不能加for, 子表需要加, 如果dataSet 是集合需要加for, 如果不是集合不能加
          // if (isArray || parTableScope === 'SUB') {
          editor.model.insertContent(writer.createText(newValue), selection);
          //   tableSlot.cell._children._nodes[0]._attrs.set('id', 'SUB');
          // } else {
          //   editor.model.insertContent(writer.createText(newValue), selection);
          // }
          writer.setSelection(selection);
        }
      });
    } else {
      editor.model.change(writer => {
        editor.model.insertContent(writer.createText(title));
        const newValue = setFormControlCode({
          isDynamicTable: false,
          value,
          formColumnControlCode,
        });

        editor.model.insertContent(writer.createText(newValue));
      });
    }

    dispatch({
      type: 'templateEditor/updateStates',
      payload: {
        isChangeTree: false,
      },
    });
  };

  const handleEditorChange = ({ event, editor, data }) => {
    try {
      let parser = new DOMParser();
      let doc = parser.parseFromString(data, 'text/html');

      // for (let ele of doc.getElementsByTagName('*')) {
      //   if (ele.localName === 'tbody') {
      //     let tcList = [];
      //     let reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g');

      //     for (let i = 0; i < ele.childNodes[0].childNodes.length; i++) {
      //       let trVal = ele.childNodes[0].childNodes[i].innerHTML;
      //       if (trVal != '&nbsp;' && !reg.test(trVal)) {
      //         // const p = ele.childNodes[0].childNodes[i].getElementsByTagName(
      //         //   'p',
      //         // );
      //         // if (p.length > 0) {
      //         //   tcList.push(p[0].innerHTML);
      //         // }
      //         tcList.push(ele.childNodes[0].childNodes[i].innerHTML);
      //       }
      //     }

      //     let tc = () => {
      //       if (tcList[0]) {
      //         const { code } = getCodeType(tcList[0]);
      //         return code;
      //       }
      //       return '';
      //     };
      //     console.log('tc()', tc(), ele, fromCodeMap, fromCodeMap.has(tc()));
      //     // 主表不能加for, 子表需要加, 如果dataSet 是集合需要加for, 如果不是集合不能加
      //     if (fromCodeMap.has(tc())) {
      //       const templateForStart = `<!-- #foreach($item in $${fromCodeMap.get(
      //         tc(),
      //       )}) -->`;
      //       const templateForEnd = '<!-- #end -->';
      //       ele.innerHTML = `${templateForStart}${ele.innerHTML}${templateForEnd}`;
      //     }
      //   }
      // }
      dispatch({
        type: 'templateEditor/updateStates',
        payload: {
          templatePath: doc.getElementsByTagName('*')[0].outerHTML,
        },
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleEditorFocus = (event, editor) => {
    setTimeout(() => {
      // 获取工具
      const table = editor.plugins.get('TableUtils');
      // 获取选中表格
      const selectedTableCells = table.getTableCellsContainingSelection(
        editor.model.document.selection,
      );

      if (selectedTableCells.length > 0) {
        let selectData = document.getSelection().focusNode.data;
        console.log('selectData', selectData);
        try {
          if (selectData && selectData != 'undefined') {
            let selectID = '';

            const { code, type } = getCodeType(selectData);

            console.log('code&type', code, type);

            Object.keys(fromMap).forEach(item => {
              let {
                formColumnCode,
                formColumnControlCode,
                formColumnId,
              } = fromMap[item];

              if (type) {
                if (type === formColumnControlCode && code === formColumnCode) {
                  selectID = formColumnId;
                }
              } else {
                if (code === formColumnCode) {
                  selectID = formColumnId;
                }
              }
            });

            console.log('selectID', selectID, fromMap[selectID]);

            dispatch({
              type: 'templateEditor/updateStates',
              payload: {
                selectSectionTableKey: selectID,
              },
            });
          }
        } catch (e) {
          console.log(e);
        }
      }
    }, 500);
  };

  const handleChangeFormat = (format, formColumnControlCode) => {
    // 获取工具
    const table = editor.plugins.get('TableUtils');
    // 获取选中表格
    const selectedTableCells = table.getTableCellsContainingSelection(
      editor.model.document.selection,
    );

    if (selectedTableCells.length > 0) {
      editor.model.change(writer => {
        let isDynamicTable =
          selectedTableCells[0].parent.parent._attrs.get('class') ===
          'dynamicTable';

        const newValue = setFormControlCode({
          isDynamicTable,
          value: format,
          formColumnControlCode,
          isArray: fromMap[selectSectionTableKey].parent.isArray,
          DaformTableCode: fromMap[selectSectionTableKey].parent.formTableCode,
          tableScope: fromMap[selectSectionTableKey].parent.tableScope,
        });

        const selection = writer.createSelection(selectedTableCells[0], 'in');
        // 写入
        editor.model.insertContent(writer.createText(newValue), selection);

        writer.setSelection(selection);
      });
    }
  };

  useEffect(() => {
    if (Object.keys(fromJsonMap).length > 0 && editor) {
      let sel = fromMap[selectSectionTableKey] || {};

      if (Object.keys(sel).length > 0 && isChangeTree) {
        handleInsertModel(
          sel.formColumnName,
          sel.formColumnCode,
          sel.formColumnControlCode,
          sel.parent.tableScope,
        );
      }
    }
  }, [fromJsonMap]);

  useEffect(() => {
    if (editor) {
      let sel = fromMap[selectSectionTableKey] || {};
      handleChangeFormat(sel.formColumnCode, sel.formColumnControlCode);
    }
  }, [moneyFormat]);

  useEffect(() => {
    if (editor) {
      let sel = fromMap[selectSectionTableKey] || {};
      handleChangeFormat(sel.formColumnCode, sel.formColumnControlCode);
    }
  }, [dateFormat]);

  useEffect(() => {
    if (templateFullPath) {
      const getHTMLRes = async () => {
        let HTMLStr = await filterDOM(templateFullPath);

        setHtml(HTMLStr);
      };
      getHTMLRes();
    }
  }, [templateFullPath]);

  useEffect(() => {
    if (window.screen.width > 1500) {
      maxWidthRef.current = 960;
    } else {
      maxWidthRef.current = 740;
    }
  }, []);

  const addEvent=()=>{
    var domList = document.getElementsByClassName('ck-source-editing-button')
    let domBtn = domList[0];
    domBtn.addEventListener('click', function () {
      var dom = document.getElementsByClassName('ckeditor-dynamic-table-button')[0];//获取动态表格按钮
      if(dom.className.includes('ck-disabled')){
        dom.classList.remove('ck-disabled');
        dom.disabled=false
      }else {
        dom.classList.add('ck-disabled');
        dom.disabled=true
      }
    })
  }
  return (
    <div style={{ maxWidth: maxWidthRef.current,padding:'0 20px'}}>
      <CKEditor
        editor={MyEditor}
        data={html}
        config={editorConfiguration}
        onReady={editor => {
          setEditor(editor);
          setTimeout(() => {
            addEvent()
          }, 1000);
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          handleEditorChange({ event, editor, data });
        }}
        // onBlur={(event, editor) => {}}
        onFocus={(event, editor) => {
          handleEditorFocus(event, editor);
        }}
        onError={(error, { willEditorRestart }) => {
          console.log('error', error);
        }}
      />
    </div>
  );
}

export default connect(({ templateEditor }) => ({
  templateEditor,
}))(Editor);
