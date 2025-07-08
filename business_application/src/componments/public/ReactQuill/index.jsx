import { connect } from 'dva';
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useImperativeHandle,
} from 'react';
import { observer } from 'mobx-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import container from './containerConfig';
import { CHUNK_SIZE } from '../../../service/constant';
import { message } from 'antd';
import { history } from 'umi';
import SparkMD5 from 'spark-md5';
import { dataFormat,throttle } from '../../../util/util';
import './index.css';

const Index = observer(
  ({ dispatch, text, onRef, editflag, informationModal, setNoticeText,location }) => {
    const { fileUrlQull, urlQuillSwitch } = informationModal;

    const reactQuillRef = useRef(null);
    const [value, setValue] = useState('<p></p>');
    const [edit_flag, setFlag] = useState('');
    const modules = useMemo(
      () => ({
        toolbar: {
          container,
          handlers: {
            // image: imageHandler,
          },
        },
      }),
      [],
    );
    useImperativeHandle(onRef, () => {
      return {
        emptyValue: emptyValue,
      };
    });
    function emptyValue() {
      setValue('');
    }

    useEffect(() => {
      setValue(text);
      setFlag(editflag);
    }, [text, editflag]);

    function changValue(value) {
      setValue(value);
      setNoticeText(value);
      // if (location.query.title === '新增'&&location.pathname!="/noticePage") {
      //   throttle(()=>{
      //     dispatch({
      //       type: 'informationModal/updateStates',
      //       payload: {
      //         informationTexts: value,
      //       },
      //     });
      //   },0)
      // }
    }

    useEffect(() => {
      if (urlQuillSwitch) {
        let quill = reactQuillRef.current.getEditor(); //获取到编辑器本身
        console.log(quill, 'quill');
        if (quill.getSelection()) {
          const cursorPosition = quill.getSelection()?.index; //获取当前光标位置
          console.log(cursorPosition, 'cursorPosition');
          quill.insertEmbed(cursorPosition, 'image', fileUrlQull); //插入图片
          quill.setSelection(cursorPosition + 1); //光标位置加1
          console.log(fileUrlQull, 'fileUrlQull');
        }
      }
    }, [fileUrlQull]);

    function imageHandler() {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');
      input.click();
      input.onchange = async () => {
        const file = input.files[0];
        console.log(file, 'file');
        const fileReader = new FileReader();
        const formData = new FormData();
        formData.append('image', file);
        console.log(file);
        const isJpgOrPng =
          file.type === 'image/jpeg' || file.type === 'image/png';
        if (file.size / 1024 / 1024 > 100) {
          message.error('图片不能大于100MB！');
        }
        if (!isJpgOrPng) {
          message.error('图片格式必须为PNG/JPG！');
        }

        const fileName = file.name;
        const fileNames = file.name.split('.')[0];
        const typeNames = file.name.split('.')[1];
        const optionFile = file;
        const fileSize = file.size;
        // const CHUNK_SIZE = 1024 * 1024 * 8;//单片文件大小
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
          type: 'informationModal/updateStates',
          payload: {
            fileChunkedList: newArr,
            fileName: fileName,
            fileNames: fileNames,
            typeNames: typeNames,
            optionFile: optionFile,
            file: file,
            fileSize: fileSize,
          },
        });

        fileReader.readAsBinaryString(file);
        fileReader.onload = (e) => {
          const md5 = SparkMD5.hashBinary(e.target.result);
          if (md5.length != 0) {
            dispatch({
              type: 'informationModal/getFileMD5_Quill',
              payload: {
                isPresigned: fileSize < CHUNK_SIZE ? 1 : 0,
                fileEncryption: md5,
                filePath: `${location.pathname.slice(1)}/${dataFormat(
                  String(new Date().getTime()).slice(0, 10),
                  'YYYY-MM-DD',
                )}/${fileName}`,
              },
              callback: () => {
                dispatch({
                  type: 'informationModal/updateStates',
                  payload: {
                    md5: md5,
                  },
                });
              },
            });
          }
        };
      };
    }

    return (
      <>
        <ReactQuill
          ref={reactQuillRef}
          theme="snow"
          modules={modules}
          value={value}
          onChange={changValue}
          readOnly={edit_flag}
        />
      </>
    );
  },
);
export default connect(({ informationModal }) => ({
  informationModal,
}))(Index);
