import '@wangeditor/editor/dist/css/style.css' // 引入 css
import React, { useState, useEffect, useRef } from 'react'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { IDomEditor, IEditorConfig, IToolbarConfig, SlateEditor,Boot,ISelectMenu } from '@wangeditor/editor'
import { DomEditor } from '@wangeditor/editor'
import IUpload from '../../Upload/uploadModal';
import { Button, message } from 'antd'
import { connect } from 'dva'
import { CHUNK_SIZE } from '../../../service/constant'
import { dataFormat } from '../../../util/util';
import SparkMD5 from 'spark-md5';
import './index.css'
import '../font.less'
function MyEditor({ dispatch, location, setNoticeText, text }) {
    const uploadRef = useRef(null)
    // editor 实例
    const [editor, setEditor] = useState(null)
    // 编辑器内容
    const [html, setHtml] = useState('<p></p>')
    const [textLength,setTextLength]=useState(0)
    const [name, setname] = useState('')
    //存储上传图片
    const [fileList, setFileList] = useState()
    // toolbarConfig.insertKeys = {
    //     index: 0, // 插入的位置，基于当前的 toolbarKeys
    //     keys: ['menu1']
    // }
    useEffect(() => {
        setTimeout(()=>{
            setHtml(text)
        },50)
    }, [text])
    const menu1Conf = {
        key: "wordSpace", // 定义 menu key ：要保证唯一、不重复（重要）
        factory() {
          return new MyButtonMenu();
        },
      };
    
      const handleCreated = (editor) => {
        // editorRef.value = editor; // 记录 editor 实例，重要！
        setEditor(editor)
        // if (!editor.getAllMenuKeys()?.includes("wordSpace")) {
        //   //判断如果已经插入进去，不在二次插入
        //   Boot.registerMenu(menu1Conf);
        // }
      };
    
      class MyButtonMenu {
        constructor() {
          this.title = name // 自定义菜单标题
          this.tag = 'select'
        }
        // 下拉框的选项
    
        getOptions(editor) {            // JS 语法
          let options =[
            { value: 'shanghai', text: '字间距', },
            { value: '1px', text: '1px' },
            { value: '2px', text: '2px' },
            { value: '3px', text: '3px' },
            { value: '4px', text: '4px' },
        ]
        return options
      }
      // 获取菜单执行时的 value ，用不到则返回空 字符串或 false
  
      getValue(editor) {    
                         // JS 语法
        return 'shanghai'// 匹配 options 其中一个 value
      }
      // 菜单是否需要激活（如选中加粗文本，“加粗”菜单会激活），用不到则返回 false
      isActive(editor) {                      // JS 语法
        return true
      }
  
      // 菜单是否需要禁用（如选中 H1 ，“引用”菜单被禁用），用不到则返回 false
      isDisabled(editor) {                     // JS 语法
        return false
      }
  
      // 点击菜单时触发的函数
      exec(editor, val) {   
          // // 获取选中的文本范围
          // console.log(selection,'21212');
          const selection = window.getSelection();
           const range = selection.getRangeAt(0);
          // console.log(range);
          // // 创建一个 span 元素用于包裹选中的文本，并设置样式
          const span = document.createElement('span');
          span.style.color = 'red'; // 例如，将文本颜色设置为红色
          span.style.fontWeight = 'bold'; // 将文本设置为粗体
          let text = editor.getSelectionText()
          
          span.innerHTML = text
          // console.log(span);
          // // 将 span 插入到选区开始的位置
          range.insertNode(span);
          // document.execCommand('insertHTML', false, span.toString());
          // const newText=editor.getHtml().replace(text,`<span style="letter-spacing:10px;color:red">${text}</span>`)
          // text.splice(editor.getHtml())
          // span.appendChild(range.extractContents());
          //  = span
          // // // 替换选中的文本范围为 span 元素
          // range.deleteContents();
          // range.insertNode(span);
      
          // 将 span 元素的文本内容设置为选中的文本
      //    span.textContent = range.toString();
        setHtml(editor.getHtml())
       // editor.dangerouslyInsertHtml(newText)
       
    // }
       }
    
    }
    // 工具栏配置
    const toolbarConfig = {
        // insertKeys: {
        //     index: 30, // 自定义插入的位置
        //     keys: ["wordSpace"], //
        //   },
        //你不要的
        excludeKeys: [
            'group-video', //视频
        ],
        //你要的
        toolbarKeys: [
            "headerSelect",
            // "blockquote",
            "|",
            "bold",
            "underline",
            "italic",
            {
                "key": "group-more-style",
                "title": "更多",
                "iconSvg": "<svg viewBox=\"0 0 1024 1024\"><path d=\"M204.8 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z\"></path><path d=\"M505.6 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z\"></path><path d=\"M806.4 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z\"></path></svg>",
                "menuKeys": [
                    "through",
                    // "code",
                    "sup",
                    "sub",
                    "clearStyle"
                ]
            },
            "color",
            "bgColor",
            "|",
            "fontSize",
            "fontFamily",
            "lineHeight",
            "|",
            "bulletedList",
            "numberedList",
            // "todo",
            {
                "key": "group-justify",
                "title": "对齐",
                "iconSvg": "<svg viewBox=\"0 0 1024 1024\"><path d=\"M768 793.6v102.4H51.2v-102.4h716.8z m204.8-230.4v102.4H51.2v-102.4h921.6z m-204.8-230.4v102.4H51.2v-102.4h716.8zM972.8 102.4v102.4H51.2V102.4h921.6z\"></path></svg>",
                "menuKeys": [
                    "justifyLeft",
                    "justifyRight",
                    "justifyCenter",
                    "justifyJustify"
                ]
            },
            {
                "key": "group-indent",
                "title": "缩进",
                "iconSvg": "<svg viewBox=\"0 0 1024 1024\"><path d=\"M0 64h1024v128H0z m384 192h640v128H384z m0 192h640v128H384z m0 192h640v128H384zM0 832h1024v128H0z m0-128V320l256 192z\"></path></svg>",
                "menuKeys": [
                    "indent",
                    "delIndent"
                ]
            },
            "|",
            // "emotion",
            "insertLink",
            {
                "key": "group-image",
                "title": "图片",
                "iconSvg": "<svg viewBox=\"0 0 1024 1024\"><path d=\"M959.877 128l0.123 0.123v767.775l-0.123 0.122H64.102l-0.122-0.122V128.123l0.122-0.123h895.775zM960 64H64C28.795 64 0 92.795 0 128v768c0 35.205 28.795 64 64 64h896c35.205 0 64-28.795 64-64V128c0-35.205-28.795-64-64-64zM832 288.01c0 53.023-42.988 96.01-96.01 96.01s-96.01-42.987-96.01-96.01S682.967 192 735.99 192 832 234.988 832 288.01zM896 832H128V704l224.01-384 256 320h64l224.01-192z\"></path></svg>",
                "menuKeys": [
                    "insertImage",
                    "uploadImage"
                ]
            },
            // {
            //     "key": "group-video",
            //     "title": "视频",
            //     "iconSvg": "<svg viewBox=\"0 0 1024 1024\"><path d=\"M981.184 160.096C837.568 139.456 678.848 128 512 128S186.432 139.456 42.816 160.096C15.296 267.808 0 386.848 0 512s15.264 244.16 42.816 351.904C186.464 884.544 345.152 896 512 896s325.568-11.456 469.184-32.096C1008.704 756.192 1024 637.152 1024 512s-15.264-244.16-42.816-351.904zM384 704V320l320 192-320 192z\"></path></svg>",
            //     "menuKeys": [
            //         "insertVideo",
            //         "uploadVideo"
            //     ]
            // },
            "insertTable",
            // "codeBlock",
            "divider",
            "|",
            "undo",
            "redo",
            "|",
            // "fullScreen"
        ],
    }
    // 自定义插入图片
    const handleUpload = async (file, insertFn) => {
        console.log(file, 'filekj');
        const typeName = ''
        const fileReader = new FileReader();
        fileReader.readAsBinaryString(file);
        fileReader.onload = (e) => {
            const md5 = SparkMD5.hashBinary(e.target.result);
            if (md5.length != 0) {
                dispatch({
                    type: `wangeditor/updateStates`,
                    payload: {
                        md5: md5,
                        fileExists: '',
                        importLoading: true,
                        importData: {}
                    },
                });
                dispatch({
                    type: 'uploadfile/getFileMD5',
                    payload: {
                        namespace: 'wangeditor',
                        isPresigned: file.size < CHUNK_SIZE ? 1 : 0,
                        fileEncryption: md5,
                        filePath: `${location.pathname.slice(1)}/${dataFormat(
                            String(new Date().getTime()).slice(0, 10),
                            'YYYY-MM-DD',
                        )}${typeName == '' ? '' : '/' + typeName}/${file.name+Date.now()}`,
                        file: file,
                    },
                    uploadSuccess: (filePath, fileId,file,url,fileUrl) => {
                        insertFn(fileUrl)
                    },
                    hisLocation: location,
                });
            }
        };
        const fileName = file.name;
        const fileNames = file.name.split('.')[0];
        const typeNames = file.name.split('.')[1];
        const optionFile = file;
        const fileSize = file.size;
        let newArr = [];
        // 文件分片
        for (let i = 0; i < optionFile.size; i = i + CHUNK_SIZE) {
            const tmp = optionFile.slice(
                i,
                Math.min(i + CHUNK_SIZE, optionFile.size),
            );
            newArr.push(tmp);
        }
        dispatch({
            type: 'wangeditor/updateStates',
            payload: {
                index: 0,
                fileChunkedList: newArr,
                fileName: fileName,
                fileNames: fileNames,
                typeNames: typeNames,
                optionFile: optionFile,
                fileSize: fileSize,
            },
        });
    }
    

    // 编辑器配置
    const editorConfig = {
        MENU_CONF: {
            fontFamily:{
                fontFamilyList:[
                    { name: '黑体', value: 'hanyangheiti'},
                    { name: '楷体', value: '方正粗楷简体'},
                    { name: '仿宋', value: '仿宋_GB2312'},
                    { name: '宋体', value: '方正小标宋简体'},
                    { name: '微软雅黑', value: 'MSYH'},
                    '华文仿宋',
                    '华文楷体',
                    'Arial',
                    'Tahoma',
                    'Verdana',
                    'Times New Roman',
                    'Courier New'
                ],
            },

            uploadImgShowBase64: true,
            
            uploadImage: {
                customUpload: handleUpload,
                uploadImgMaxLength: 1,
            },

        },
        hoverbarKeys:{
            'table': {
                // 如有 match 函数，则优先根据 match 判断，而忽略 element type
                menuKeys: [
                    "enter",
                    "tableHeader",
                    "insertTableRow",
                    "deleteTableRow",
                    "insertTableCol",
                    "deleteTableCol",
                    "deleteTable"
                ], // 定义你想要的 menu keys
            }
        }

    }
    console.log(editor?.getConfig().hoverbarKeys, 'editor.getConfig().hoverbarKeys');
    editorConfig.placeholder = '请输入内容...'
    // 编辑器配置
    // const editorConfig = { 
    //     placeholder: '请输入内容...',
    // }
    // 及时销毁 editor ，重要！
    useEffect(() => {
        return () => {
            if (editor == null) return
            editor.destroy()
            setEditor(null)
        }
    }, [editor])
    const changeHtml = (editor) => {
        let article=editor.getHtml()
        article = article.replace(/<table /g,'<table style="width: 100%;"'); 
        article = article.replace(/<td /g,'<td style="border: solid 1px #333;height:28px;padding:3px 5px;text-align: center;"'); 
        article = article.replace(/<th /g,'<th style="border: solid 1px #333;height:28px;padding:3px 5px;background-color:#f5f2f0;"'); 
        setHtml(editor.getHtml())
        setNoticeText(article) 
        const text=editor.getText()
        setTextLength(text.length)
    }
    return (
        <>
            <div style={{ border: '1px solid #ccc', zIndex: 100 }} id='editor_container'>
                <Toolbar
                    editor={editor}
                    defaultConfig={toolbarConfig}
                    mode="default"
                    style={{ borderBottom: '1px solid #ccc' }}
                />
                <Editor
                    defaultConfig={editorConfig}
                    value={html}
                    onCreated={handleCreated}
                    // onChange={editor => setHtml(editor.getHtml())}
                    onChange={changeHtml}
                    mode="default"
                    style={{ height: '500px', overflowY: 'hidden' }}
                />
                <p style={{textAlign:'right',paddingRight:'8px'}}>统计字数：{textLength}</p>
            </div>
        </>
    )
}
export default connect(({  }) => ({  }))(MyEditor) 


