import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Checkbox,
  DatePicker,
  Divider,
  Form,
  Image,
  Input,
  Modal,
  Select,
  Spin,
  Table,
  Tabs,
  Tree,
  message,
} from 'antd';
import cls from 'classnames';
import { connect } from 'dva';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useModel } from 'umi';
import searchIcon from '../../../../public/assets/search.svg';
import IUpload from '../../../components/Upload/uploadModal';
import ReSizeLeftRight from '../../../components/reSizeLeftRight/reSizeLeftRight.jsx';
import { dataFormat, dealBigMoney, formatDate } from '../../../util/util';
import styles from '../index.less';
import AddInvoiceModal from './addInvoiceModal';
import MoveSortModal from './moveSortModal';
const { Option } = Select;
const { confirm } = Modal;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
function invoiceManagement({ dispatch, invoiceManagement, loading }) {
  const { TreeNode } = Tree;
  const [form] = Form.useForm();
  const [currentKey, setCurrentKey] = useState('1');
  const [verificationForm] = Form.useForm();
  const {
    treeData,
    isShow,
    type,
    searchWord,
    currentPage,
    limit,
    invoiceList,
    searchTree,
    isShowMove,
    fileExists,
    fileStorageId,
    needfilepath,
    md5FileId,
    getFileMD5Message,
    md5FilePath,
    merageFilepath,
    minioFalseSignature,
    minioTureSignature,
    minioFalsePicture,
    minioTurePicture,
    invoicePath,
    sortId,
    basicInformationData,
    singleId,
    typeList,
    dropArray,
    compareData,
    returnCount,
    wordsResult,
    ocrDataCode,
    verificationCode,
    ocrTypeEnum,
    verificationResultJson,
  } = invoiceManagement;
  const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
  const [chooseLabel, setChooseLabel] = useState([]); // 选择的多选标签
  const [initLabels, setInitLabels] = useState([]); // 全部的标签labelKey组成的列表
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAlls, switchCheckAll] = useState(false); // 全选flag
  const [invoiceCode, setInvoiceCode] = useState(''); //发票code
  const [invoiceTime, setInvoiceTime] = useState(''); //开票日期
  const [expandedKeys, setExpandedKeys] = useState(['pjfl']);
  const [flag, setFlag] = useState(false);
  const {
    setChooseLabeldes,
    invoiceValue,
    modalType,
    disabledList,
    location,
    containerId,
  } = useModel('@@qiankunStateFromMaster');
  console.log(location, 'location');
  const [centerVum, setCenterVum] = useState(500);
  const [btnOcrOnClick, setBtnOcrOnClick] = useState(true);
  const [btnOcrVerifyOnClick, setBtnOcrVerifyOnClick] = useState(true);
  useEffect(() => {
    if (modalType == 'view') {
      //查看页面
      //根据表单中发票id集合，获取发票列表
      invoiceValue && getInvoiceListByIds(1);
    }
  }, [modalType, invoiceValue]);

  const loadMoreData = () => {
    //加载更多
    if (modalType == 'view') {
      //查看页面
      //根据表单中发票id集合，获取发票列表
      getInvoiceListByIds(Number(currentPage) + 1);
    } else {
      getInvoiceList(
        sortId && sortId[0],
        searchWord,
        Number(currentPage) + 1,
        limit,
      ); //获取发票列表
    }
  };
  const getInvoiceListByIds = (start) => {
    console.log('start', start);
    //根据表单中发票id集合，获取发票列表
    dispatch({
      type: 'invoiceManagement/getInvoiceListByIds',
      payload: {
        invoiceIds: invoiceValue ? invoiceValue.toString() : '',
        start,
        limit,
      },
    });
  };
  const onResize = useCallback(() => {
    var offsetWidth = document.getElementById(
      containerId || 'invoiceManagement_container',
    )?.offsetWidth;
    if (offsetWidth && offsetWidth != 0) {
      if (modalType == 'view') {
        setCenterVum(offsetWidth - 335);
      } else {
        setCenterVum(offsetWidth - 560);
      }
    }
  });

  useEffect(() => {
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);
  useEffect(() => {
    var offsetWidth = document.getElementById(
      containerId || 'invoiceManagement_container',
    )?.offsetWidth;
    if (offsetWidth && offsetWidth != 0) {
      if (modalType == 'view') {
        setCenterVum(offsetWidth - 335);
      } else {
        setCenterVum(offsetWidth - 560);
      }
    }
  }, [
    document.getElementById(containerId || 'invoiceManagement_container')
      ?.offsetWidth,
  ]);
  console.log(fileStorageId, 'fileStorageId==');
  useEffect(() => {
    invoiceValue && setChooseLabel(invoiceValue);
  }, [invoiceValue]);
  useEffect(() => {
    console.log(fileExists, 'fileExists============');
    // 如果文件存在于minio
    if (fileExists) {
      message.error('请勿重复上传');
      // dispatch({
      //   type: 'invoiceManagement/getDownFileUrl',
      //   payload: {
      //     fileStorageId: md5FileId,
      //   },
      //   callback: (fileUrl) => {
      //     dispatch({
      //       type: 'invoiceManagement/uploadInvoice',
      //       payload: {
      //         invoiceClassifyId: sortId,
      //         invoiceFilePath: md5FilePath,
      //       },
      //       callback: () => {
      //         getInvoiceList(sortId, searchWord, currentPage, limit);
      //       },
      //     });
      //     dispatch({
      //       type: 'invoiceManagement/updateStates',
      //       payload: {
      //         fileExists: '',
      //         // menuImgId: md5FileId
      //       },
      //     });
      //   },
      // });
    } else if (fileExists === false) {
      // 如果文件不存在于minio
      // dispatch({
      //   type: 'invoiceManagement/getDownFileUrl',
      //   payload: {
      //     fileStorageId: fileStorageId,
      //   },
      //   callback: (fileUrl) => {
      dispatch({
        type: 'invoiceManagement/uploadInvoice',
        payload: {
          invoiceClassifyId: sortId && sortId[0],
          invoiceFilePath: needfilepath,
          fileStorageId,
        },
        callback: () => {
          getInvoiceList(sortId && sortId[0], searchWord, currentPage, limit);
        },
      });
      dispatch({
        type: 'invoiceManagement/updateStates',
        payload: {
          fileExists: '',
          // menuImgId: fileStorageId
        },
      });
      // },
      // });
    }
  }, [fileExists]);
  useEffect(() => {
    setInitLabels(invoiceList);
  }, [invoiceList]);
  useEffect(() => {
    //开票日期设为空
    setInvoiceTime(null);
    let info =
      wordsResult &&
      wordsResult.words_result &&
      wordsResult.words_result[0].result;
    //错误状态
    let ocrErrorResult =
      wordsResult &&
      wordsResult.words_result &&
      wordsResult.words_result[0] &&
      wordsResult.words_result[0]['ocrResult'];
    //发票代码
    let invoiceCodeDesc =
      info && info['InvoiceCode'] && info && info['InvoiceCode'][0];
    let invoiceCodeWord = invoiceCodeDesc && invoiceCodeDesc.word;
    //发票号码
    let invoiceNumDesc =
      info && info['InvoiceNum'] && info && info['InvoiceNum'][0];
    let invoiceNumWord = invoiceNumDesc && invoiceNumDesc.word;
    //价税合计小写
    let amountInFiguersDesc =
      info && info['AmountInFiguers'] && info && info['AmountInFiguers'][0];
    let amountInFiguersWord = amountInFiguersDesc && amountInFiguersDesc.word;
    //购方名称
    let purchaserNameDesc =
      info && info['PurchaserName'] && info && info['PurchaserName'][0];
    let purchaserNameWord = purchaserNameDesc && purchaserNameDesc.word;
    //发票类型
    let invoiceTypeDesc =
      info && info['InvoiceType'] && info && info['InvoiceType'][0];
    let invoiceTypeWord = invoiceTypeDesc && invoiceTypeDesc.word;

    //开票日期
    let invoiceDateDesc =
      info && info['InvoiceDate'] && info && info['InvoiceDate'][0];
    let invoiceDateWord = invoiceDateDesc && invoiceDateDesc.word;

    // 输出时间戳
    let regex = /(\d+)年(\d+)月(\d+)日/;
    let match = invoiceDateWord && invoiceDateWord.match(regex);

    let year = match && match[1];
    let month = match && match[2] - 1; // 月份需要减1，因为月份从0开始计数
    let day = match && match[3];
    let date = new Date(year, month, day);
    let timestamp = String(date.getTime()).slice(0, 10);
    let typeCode = '';

    let verifInfo =
      verificationResultJson && verificationResultJson.words_result;
    //发票代码
    let verifInvoiceCode = verifInfo && verifInfo['InvoiceCode'];
    //错误状态
    let verifErrorResult = verifInfo && verifInfo['verficationResult'];

    typeList.map((item, index) => {
      if (item.dictInfoName == invoiceTypeWord) {
        typeCode = item.dictTypeInfoCode;
      }
    });

    form.setFieldsValue({
      useStatus: basicInformationData.useStatus == '1' ? '已使用' : '未使用',
      ocrStatus:
        basicInformationData?.ocrStatus == '1' || info || ocrDataCode == '200'
          ? '已识别'
          : basicInformationData?.ocrStatus == '2' ||
            (ocrErrorResult && ocrErrorResult == 'false') ||
            (ocrDataCode && ocrDataCode != '200')
          ? '识别失败'
          : '未识别',
      verificationStatus:
        basicInformationData?.verificationStatus == '1' ||
        verifInvoiceCode ||
        verificationCode == '200'
          ? '已验真'
          : basicInformationData?.verificationStatus == '2' ||
            (verifErrorResult && verifErrorResult == 'false') ||
            (verificationCode && verificationCode != '200')
          ? '验真失败'
          : '未验真',
      createTime: dataFormat(
        basicInformationData?.createTime,
        'YYYY-MM-DD HH:mm:ss',
      ),
      createUserName: basicInformationData?.createUserName,
      invoiceTypeCode: basicInformationData.invoiceTypeCode || typeCode,
      invoiceTypeName: basicInformationData.invoiceTypeName || invoiceTypeWord,
      invoiceType: basicInformationData.invoiceTypeName || invoiceTypeWord,
      invoiceDate:
        basicInformationData.invoiceDate &&
        basicInformationData.invoiceDate !== '0'
          ? moment(
              formatDate(basicInformationData.invoiceDate, dateFormat),
              dateFormat,
            )
          : wordsResult && timestamp && timestamp !== 'NaN'
          ? moment(formatDate(timestamp && timestamp, dateFormat), dateFormat)
          : null,
      invoiceCode: basicInformationData.invoiceCode || invoiceCodeWord,
      invoiceNum: basicInformationData.invoiceNum || invoiceNumWord,
      taxPriceInnums:
        basicInformationData.taxPriceInnums || amountInFiguersWord,
      buyerName: basicInformationData.buyerName || purchaserNameWord,
    });
    if (basicInformationData.ocrStatus == '1' || info) {
      //验真按钮设置为显示
      //将验真按钮放开
      setBtnOcrVerifyOnClick(false);
    }
    if (verifErrorResult && verifErrorResult == 'false') {
      form.setFieldsValue({
        verificationStatus: '验真失败',
      });
    }
  }, [
    basicInformationData,
    wordsResult,
    ocrDataCode,
    verificationCode,
    verificationResultJson,
  ]);
  useEffect(() => {
    let verifInfo =
      verificationResultJson && verificationResultJson.words_result;
    //发票代码
    let invoiceCodeDesc = verifInfo && verifInfo['InvoiceCode'];
    //验证日期
    let dateTime = verifInfo && verifInfo['verificationDate'];
    //发起人
    let person = verifInfo && verifInfo['verificationPerson'];
    //错误状态
    let verifErrorResult = verifInfo && verifInfo['verficationResult'];
    //ocr验真form设置
    if (verifErrorResult && verifErrorResult == 'false') {
      verificationForm.setFieldsValue({
        verificationStatus: '验真失败',
        verificationDate: dataFormat(dateTime, 'YYYY-MM-DD HH:mm:ss'),
        verificationPerson: person,
      });
    } else {
      if (verifInfo) {
        verificationForm.setFieldsValue({
          verificationStatus:
            basicInformationData?.verificationStatus == '1' ||
            invoiceCodeDesc ||
            verificationCode == '200'
              ? '已验真'
              : basicInformationData?.verificationStatus == '2' ||
                (verifErrorResult && verifErrorResult == 'false') ||
                (verificationCode && verificationCode != '200')
              ? '验真失败'
              : '未验真',
          verificationDate:
            dataFormat(dateTime, 'YYYY-MM-DD HH:mm:ss') ||
            dataFormat(
              String(new Date().getTime()).slice(0, 10),
              'YYYY-MM-DD HH:mm:ss',
            ),
          verificationPerson:
            (person && person) || window.localStorage.getItem('userName'),
        });
      } else {
        verificationForm.setFieldsValue({
          verificationStatus:
            basicInformationData?.verificationStatus == '1'
              ? '已验真'
              : basicInformationData?.verificationStatus == '2'
              ? '验真失败'
              : '未验真',
          verificationDate: '',
          verificationPerson: '',
        });
      }
    }
  }, [verificationResultJson, verificationCode]);
  useEffect(() => {
    if (location.pathname.includes('/budgetPage')) {
      setIndeterminate(
        !!chooseLabel.length && chooseLabel.length < initLabels.length,
      );
      switchCheckAll(
        chooseLabel.length === initLabels.length && initLabels.length > 0,
      );
    } else {
      if (chooseLabel?.length <= 0) {
        //未选择数据的初始状态
        setIndeterminate(true);
        switchCheckAll(false);
        return;
      }
      var flag = -2;
      invoiceList.forEach((item) => {
        //从当前列表中搜索已选择的数据
        if (flag == -1) {
          //存在未找到的数据则还未全部勾选；反之
          return;
        }
        flag = chooseLabel.findIndex((c) => {
          return c == item.invoiceId;
        });
      });
      setIndeterminate(flag >= 0 ? false : true);
      switchCheckAll(flag >= 0 ? true : false);
    }
  }, [chooseLabel, invoiceList]);
  // 单选
  const checkThis = (idArr) => {
    if (location.pathname.includes('/budgetPage')) {
      setChooseLabel(idArr);
    } else {
      //发票控件
      if (modalType == 'view') {
        setChooseLabel(idArr);
      }
      if (modalType == 'edit' && setChooseLabeldes) {
        var arr = chooseLabel;
        invoiceList.forEach((element) => {
          //从已选择的id中过滤掉当前列表的id
          arr = arr.filter((c) => {
            return c != element.invoiceId;
          });
        });
        arr = idArr?.concat(arr); //追加当前列表上选中的数据
        setChooseLabel(arr);
        setChooseLabeldes && setChooseLabeldes(arr);
      }
    }
  };
  // 全选
  const onCheckAllChange = (e) => {
    setFlag(!flag);
    const arr = [];
    var idArr = chooseLabel; //定义一个集合给发票控件使用，集合多个分类数据
    initLabels.forEach((item) => {
      if (item.useStatus == '0') {
        //未使用
        if (!e.target.checked) {
          //取消全选
          idArr = idArr.filter((a) => {
            return a != item.invoiceId;
          }); //从已选择的id中过滤掉当前列表的id
        } else {
          arr.push(item.invoiceId);
          idArr.push(item.invoiceId);
        }
      }
    });
    if (location.pathname.includes('/budgetPage')) {
      setChooseLabel(!flag ? arr : []);
    } else {
      //发票控件
      if (modalType == 'edit' && setChooseLabeldes) {
        idArr = _.uniq(idArr);
        setChooseLabel(idArr);
        setChooseLabeldes(idArr);
      }
    }
    setIndeterminate(false);
    switchCheckAll(e.target.checked);
    if (!e.target.checked) {
      dispatch({
        type: 'invoiceManagement/updateStates',
        payload: {
          basicInformationData: [],
        },
      });
    }
  };
  useEffect(() => {
    if (modalType == 'view') {
      return;
    }
    getInvoiceTreeFn('', '0');
    getInvoiceType();
  }, []);
  //数据码表 发票类型
  const getInvoiceType = () => {
    dispatch({
      type: 'invoiceManagement/getDictType',
      payload: {
        dictTypeId: 'PJLX',
        showType: 'ALL',
        isTree: '1',
        searchWord: '',
      },
    });
  };
  //ocr识别
  const getOcr = () => {
    //根据发票地址ocr识别
    dispatch({
      type: 'invoiceManagement/getOcrResult',
      payload: {
        fileUrl: basicInformationData.invoiceFilePath,
        invoiceId: basicInformationData.invoiceId,
      },
      callback: (data) => {
        let info =
          data.data &&
          data.data.words_result &&
          data.data.words_result[0].result;
        //发票代码
        let invoiceCodeDesc =
          info && info['InvoiceCode'] && info && info['InvoiceCode'][0];
        let invoiceCodeWord = invoiceCodeDesc && invoiceCodeDesc.word;
        //发票号码
        let invoiceNumDesc =
          info && info['InvoiceNum'] && info && info['InvoiceNum'][0];
        let invoiceNumWord = invoiceNumDesc && invoiceNumDesc.word;
        //价税合计小写
        let amountInFiguersDesc =
          info && info['AmountInFiguers'] && info && info['AmountInFiguers'][0];
        let amountInFiguersWord =
          amountInFiguersDesc && amountInFiguersDesc.word;
        //购方名称
        let purchaserNameDesc =
          info && info['PurchaserName'] && info && info['PurchaserName'][0];
        let purchaserNameWord = purchaserNameDesc && purchaserNameDesc.word;
        //发票类型
        let invoiceTypeDesc =
          info && info['InvoiceType'] && info && info['InvoiceType'][0];
        let invoiceTypeWord = invoiceTypeDesc && invoiceTypeDesc.word;

        let typeCode = '';
        typeList.map((item, index) => {
          if (item.dictInfoName == invoiceTypeWord) {
            typeCode = item.dictTypeInfoCode;
          }
        });
        //开票日期
        let invoiceDateDesc =
          info && info['InvoiceDate'] && info && info['InvoiceDate'][0];
        let invoiceDateWord = invoiceDateDesc && invoiceDateDesc.word;

        // 输出时间戳
        let regex = /(\d+)年(\d+)月(\d+)日/;
        let match = invoiceDateWord && invoiceDateWord.match(regex);

        let year = match && match[1];
        let month = match && match[2] - 1; // 月份需要减1，因为月份从0开始计数
        let day = match && match[3];
        let date = new Date(year, month, day);
        let timestamp = String(date.getTime()).slice(0, 10);
        basicInformationData.invoiceCode = invoiceCodeWord;
        basicInformationData.invoiceNum = invoiceNumWord;
        basicInformationData.taxPriceInnums = amountInFiguersWord;
        basicInformationData.buyerName = purchaserNameWord;
        basicInformationData.invoiceDate = timestamp;
        basicInformationData.invoiceTypeName = invoiceTypeWord;
        basicInformationData.invoiceTypeCode = typeCode;

        //定位到OCR信息
        setCurrentKey('2');
        //将验真按钮放开
        setBtnOcrVerifyOnClick(false);
      },
    });
  };
  //时间转化
  function changTime(str) {
    var regex = /(\d+)年(\d+)月(\d+)日/;
    var match = str.match(regex);
    var year = match[1];
    var month = match[2].padStart(2, '0');
    var day = match[3].padStart(2, '0');
    var result = year + month + day;
    return result;
  }
  //ocr验真
  const getVerification = () => {
    let wordsResultEnd = wordsResult?.words_result;
    let resultOne = wordsResultEnd && wordsResultEnd[0];
    let type = wordsResultEnd[0] && wordsResultEnd[0].type;
    let resultEnd = resultOne?.result;
    let verificationDate = resultEnd && resultEnd['InvoiceDate'][0].word;

    //根据发票地址ocr识别
    dispatch({
      type: 'invoiceManagement/vatInvoiceVerification',
      payload: {
        invoiceCode: resultEnd && resultEnd['InvoiceCode'][0].word,
        invoiceNum: resultEnd && resultEnd['InvoiceNum'][0].word,
        invoiceDate: verificationDate && changTime(verificationDate),
        invoiceType: 'special_' + `${type}`,
        checkCode: resultEnd && resultEnd['CheckCode'][0].word,
        totalAmount: resultEnd && resultEnd['TotalAmount'][0].word,
        invoiceId: basicInformationData.invoiceId,
      },
    });
    setCurrentKey('3');
  };
  const getInvoiceTreeFn = (classifyName, classifyId, isOperation) => {
    dispatch({
      type: 'invoiceManagement/getInvoiceTree',
      payload: {
        classifyName,
        classifyId,
      },
      callback: (data) => {
        const loopTree = (data, parentId, children) => {
          data.forEach((item, index) => {
            if (isOperation) {
              var keys = expandedKeys.filter((ex) => {
                return ex != item.classifyId;
              });
              keys = filterKeys(children, keys);
              setExpandedKeys(keys);
            }
            item.parentId = parentId;
            item.title = (
              <div className={styles.treeNode}>
                <span>
                  {item.classifyName}
                  <span className={styles.button_menu}>
                    <span
                      onClick={(e) => {
                        addInvoiceSort(item);
                      }}
                    >
                      <PlusOutlined title="新增" />
                    </span>
                    <span
                      onClick={(e) => {
                        updateInvoiceSort(item, parentId);
                      }}
                    >
                      <EditOutlined title="修改" />
                    </span>
                    <span>
                      <DeleteOutlined
                        title="删除"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSort(item.classifyId, parentId);
                        }}
                      />
                    </span>
                  </span>
                </span>
              </div>
            );
            item.key = item.classifyId;
            if (item.isHaveChild == '1') {
              item.children = [{ key: '-1' }];
            }
          });
          return data;
        };
        if (treeData[0].children.length == 0 || classifyId == 0) {
          treeData[0].children = loopTree(data.data.jsonResult, 0);
          treeData[0].title = (
            <div className={styles.treeNode}>
              <span>
                {treeData[0].classifyName}
                <span className={styles.button_menu}>
                  {
                    <span
                      onClick={(e) => {
                        addInvoiceSort(treeData[0]);
                      }}
                    >
                      <PlusOutlined />
                    </span>
                  }
                </span>
              </span>
            </div>
          );
        } else {
          dispatch({
            type: 'invoiceManagement/updateStates',
            payload: {
              compareData: loopTree(data.data.jsonResult, classifyId),
            },
          });
          const each = (jsonData) => {
            var isFind = false;
            jsonData?.forEach((item) => {
              if (isFind) {
                return;
              }
              if (item.classifyId == classifyId) {
                item.children = loopTree(
                  data.data.jsonResult,
                  classifyId,
                  item.children,
                );
                isFind = true;
                return;
              } else {
                if (item?.children?.length != 0) {
                  each(item?.children);
                }
              }
            });
          };
          each(treeData);
          // treeData.forEach((item) => {
          //   item.children.forEach((item) => {
          //     if (item.classifyId == classifyId) {
          //       item.children = loopTree(data.data.jsonResult,classifyId)
          //     }else{

          //     }
          //   })
          // })
        }
        if (classifyId == '0') {
          setExpandedKeys(['pjfl']);
        }
        dispatch({
          type: 'invoiceManagement/updateStates',
          payload: {
            treeData: [...treeData],
          },
        });
        console.log([...treeData], 'treeData');
      },
    });
  };
  const getInvoiceList = (classifyId, searchWord, start, limit) => {
    dispatch({
      type: 'invoiceManagement/getInvoiceList',
      payload: {
        classifyId,
        searchWord,
        start,
        limit,
      },
    });
  };
  const onSelect = (selectedKeys, info, e) => {
    console.log(selectedKeys, 'selectedKeys');
    console.log(info, 'info');
    setFlag(false);
    getInvoiceList(info.node.classifyId, '', 1, limit);
    dispatch({
      type: 'invoiceManagement/updateStates',
      payload: {
        sortId: [info.node.key],
        basicInformationData: [],
        wordsResult: '', //ocr识别信息
        ocrTypeEnum: '',
      },
    });
    //ocr识别按钮设为不可用
    setBtnOcrOnClick(true);
    location.pathname.includes('/budgetPage') && setChooseLabel([]);
  };
  const unCheck = (e) => {
    if (e.target.checked) {
      dispatch({
        type: 'invoiceManagement/getDetailInvoice',
        payload: {
          invoiceId: e.target.value,
        },
        callback: (id) => {
          dispatch({
            type: 'invoiceManagement/getOcrInfoMo',
            payload: {
              invoiceId: id,
            },
            callback: (wordsResult, verificationResultJson) => {
              if (JSON.stringify(wordsResult) != '{}') {
                console.log(wordsResult, 'wordsResult');
              } else {
                dispatch({
                  type: 'invoiceManagement/updateStates',
                  payload: {
                    wordsResult: {},
                  },
                });
                //将验真按钮设置为不可用
                setBtnOcrVerifyOnClick(true);
              }
              if (verificationResultJson) {
                console.log(verificationResultJson, 'verificationResultJson');
              } else {
                dispatch({
                  type: 'invoiceManagement/updateStates',
                  payload: {
                    verificationResultJson: {},
                  },
                });
              }
            },
          });
        },
      });
      dispatch({
        type: 'invoiceManagement/updateStates',
        payload: {
          singleId: e.target.value,
        },
      });
      //ocr识别按钮设为可用
      setBtnOcrOnClick(false);
    } else {
      dispatch({
        type: 'invoiceManagement/updateStates',
        payload: {
          basicInformationData: [],
          wordsResult: '', //ocr识别信息
          ocrTypeEnum: '',
          info: '',
          ocrDataCode: '',
          verificationCode: '',
          verificationResultJson: '',
        },
      });

      //ocr识别按钮设为不可用
      setBtnOcrOnClick(true);
      //验真按钮设置为显示
      //将验真按钮设置为不可用
      setBtnOcrVerifyOnClick(true);
    }
  };
  const addInvoiceSort = (item, val) => {
    console.log(item, 'item');
    console.log(val, 'val');
    // getInvoiceTree('', item.classifyId);
    dispatch({
      type: 'invoiceManagement/updateStates',
      payload: {
        isShow: true,
        type: val,
        parentId: item.classifyId,
        parentName: item.classifyName,
      },
    });
  };
  const updateInvoiceSort = async (val, parentId) => {
    await dispatch({
      type: 'invoiceManagement/getDetailInvoiceTree',
      payload: {
        classifyId: val.classifyId,
      },
    });
    await dispatch({
      type: 'invoiceManagement/updateStates',
      payload: {
        isShow: true,
        detailData: val,
        parentId,
      },
    });
  };
  const filterKeys = (children, keys) => {
    //过滤子集的expandkey
    children?.forEach((item) => {
      keys = keys.filter((k) => {
        return k != item.classifyId;
      });
      if (item?.children?.length > 0) {
        keys = filterKeys(item?.children, keys);
      }
    });
    return keys;
  };
  //展开节点
  const onExpand = (expandedKeys, { expanded, node }) => {
    if (expanded && node.isHaveChild == 1) {
      getInvoiceTreeFn('', node.key);
    }
    if (!expanded) {
      expandedKeys = filterKeys(node?.children, expandedKeys);
    }
    setExpandedKeys(expandedKeys);
  };
  //tab切换事件
  const onChange = (key) => {
    setCurrentKey(key);
  };
  //删除分类
  const deleteSort = (id, parentId) => {
    confirm({
      content: '确认要删除吗？',
      mask: false,
      getContainer: () => {
        return document.getElementById(
          containerId || 'invoiceManagement_container',
        );
      },
      onOk: () => {
        dispatch({
          type: 'invoiceManagement/deleteInvoiceTree',
          payload: {
            calssifyIds: id,
          },
          callback: (data) => {
            // getInvoiceTreeFn('', parentId, true);
          },
        });
      },
    });
  };
  const serachValueTree = (value) => {
    console.log(value);
    dispatch({
      type: 'invoiceManagement/updateStates',
      payload: {
        searchTree: value,
      },
    });
    getInvoiceTreeFn(value, 0);
  };
  //移动分类
  const moveSort = () => {
    if (!chooseLabel.length) {
      message.warning('请选择要转移的发票');
    } else {
      dispatch({
        type: 'invoiceManagement/updateStates',
        payload: {
          isShowMove: true,
        },
      });
    }
  };
  //删除票据
  const deleteInvoice = (ids) => {
    console.log(ids);
    if (ids.length > 0) {
      confirm({
        content: '确认要删除吗？',
        mask: false,
        getContainer: () => {
          return document.getElementById(
            containerId || 'invoiceManagement_container',
          );
        },
        onOk: () => {
          dispatch({
            type: 'invoiceManagement/deleteInvoiceList',
            payload: {
              invoiceIds: ids.join(','),
            },
          });
          location.pathname.includes('/budgetPage') && setChooseLabel([]);
        },
      });
    } else {
      message.error('请选择要删除的发票');
    }
  };
  //查询单张发票信息
  const getBasicInformation = async (item, e) => {
    if (e.target.checked) {
      await dispatch({
        type: 'invoiceManagement/updateStates',
        payload: {
          basicInformationData: {},
          ocrTypeEnum: '',
          wordsResult: '',
        },
      });
      await dispatch({
        type: 'invoiceManagement/getDetailInvoice',
        payload: {
          invoiceId: item.invoiceId,
        },
        callback: (id) => {
          dispatch({
            type: 'invoiceManagement/getOcrInfoMo',
            payload: {
              invoiceId: id,
            },
          });
        },
      });
      await dispatch({
        type: 'invoiceManagement/updateStates',
        payload: {
          singleId: item.invoiceId,
        },
      });
      //ocr识别按钮设为可用
      setBtnOcrOnClick(false);
    } else {
      dispatch({
        type: 'invoiceManagement/updateStates',
        payload: {
          basicInformationData: [],
          wordsResult: '', //ocr识别信息
          ocrTypeEnum: '',
        },
      });
      //ocr识别按钮设为可用
      setBtnOcrOnClick(true);
    }
  };
  const saveInvoice = () => {
    let info =
      wordsResult &&
      wordsResult.words_result &&
      wordsResult.words_result[0].result;
    //错误状态
    let ocrErrorResult =
      wordsResult &&
      wordsResult.words_result &&
      wordsResult.words_result[0] &&
      wordsResult.words_result[0]['ocrResult'];
    let verifInfo =
      verificationResultJson && verificationResultJson.words_result;
    //错误状态
    let verifErrorResult = verifInfo && verifInfo['verficationResult'];
    //发票代码
    let verifInvoiceCode = verifInfo && verifInfo['InvoiceCode'];
    const values = form.getFieldsValue();
    let typeCode = '';
    typeList.map((item, index) => {
      if (item.dictInfoName == values.invoiceType) {
        typeCode = item.dictTypeInfoCode;
      }
    });
    dispatch({
      type: 'invoiceManagement/updateInvoiceList',
      payload: {
        invoiceId: singleId,
        invoiceTypeCode: typeCode
          ? typeCode
          : basicInformationData.invoiceTypeCode,
        invoiceTypeName: values.invoiceType,
        invoiceDate:
          (invoiceTime && invoiceTime) || basicInformationData.invoiceDate,
        invoiceCode: values.invoiceCode,
        invoiceNum: values.invoiceNum,
        taxPriceInnums: values.taxPriceInnums,
        taxPriceInwords: values.taxPriceInnums
          ? dealBigMoney(values.taxPriceInnums)
          : '',
        buyerName: values.buyerName,

        ocrStatus:
          basicInformationData?.ocrStatus == '1' || info || ocrDataCode == '200'
            ? '1'
            : basicInformationData?.ocrStatus == '2' ||
              (ocrErrorResult && ocrErrorResult == 'false') ||
              (ocrDataCode && ocrDataCode != '200')
            ? '2'
            : '0',
        verificationStatus:
          basicInformationData?.verificationStatus == '1' ||
          verifInvoiceCode ||
          verificationCode == '200'
            ? '1'
            : basicInformationData?.verificationStatus == '2' ||
              (verifErrorResult && verifErrorResult == 'false') ||
              (verificationCode && verificationCode != '200')
            ? '2'
            : '0',
      },
    });
  };
  //存储票据Code
  const changeType = (value, e) => {
    setInvoiceCode(e.key);
  };
  //选择时间
  const changeTime = (value, dateString) => {
    console.log('Formatted Selected Time: ', dateString);
    setInvoiceTime(value);
  };
  const onOk = (value) => {
    console.log('onOk: ', value);
    console.log('Selected Time:111', value._d.getTime());
    setInvoiceTime(Math.round(value._d / 1000));
  };
  const searchInvoice = (value) => {
    if (modalType == 'view') {
      //查看搜索
      var list = [];
      if (value) {
        list = invoiceList.filter((item) => {
          return item?.invoiceTypeName?.includes(value);
        });
        dispatch({
          type: 'invoiceManagement/updateStates',
          payload: {
            invoiceList: list,
          },
        });
      } else {
        getInvoiceListByIds(1);
      }
    } else {
      if (sortId && sortId[0] !== 'pjfl') {
        getInvoiceList(sortId && sortId[0], value, 1, limit);
      }
    }
  };
  const onDragEnter = (info) => {
    console.log(info, 'info111');
  };
  const onDrop = async (info) => {
    const {
      node,
      dragNode,
      dropPosition,
      dropToGap,
      event,
      dragNodesKeys,
    } = info;
    let res = false;
    await dispatch({
      type: 'invoiceManagement/getInvoiceTree',
      payload: {
        classifyName: '',
        classifyId: node.classifyId,
      },
      callback: (data) => {
        res = data.data.jsonResult.find(
          (item) => item.classifyName == dragNode.classifyName,
        );
      },
    });

    if (res) {
      message.error('同一级别下名称不可重复');
      return;
    }
    // node         代表拖拽终点 的对象
    // dragNode     代表当前拖拽的对象
    // dropPosition 代表drop后的节点位置；不准确
    // dropToGap    代表移动到非最顶级组第一个位置
    const dropKey = node.key;
    const dragKey = dragNode.key;
    const dropPos = node.pos.split('-');
    // trueDropPosition: ( -1 | 0 | 1 ) dropPosition计算前的值，可以查看rc-tree源码;
    // -1 代表移动到最顶级组的第一个位置
    const trueDropPosition = dropPosition - Number(dropPos[dropPos.length - 1]);
    const loop = (data, key, callback) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }

        if (data[i].children) {
          loop(data[i].children, key, callback);
        }
      }
    };

    let dragObj;

    const data = [...treeData];
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });
    if (!dropToGap) {
      // 移动到非最顶级组第一个位置
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        // item.children = item.children || []; // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
      });
    } else if (
      (info.node.children || []).length > 0 &&
      info.node.expanded &&
      trueDropPosition === 1
    ) {
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
      });
    }

    // if (
    //     (info.node.props.children || []).length > 0 && // Has children
    //     info.node.props.expanded && // Is expanded
    //     dropPosition === 1 // On the bottom gap
    //   ) {
    //     loop(data, dropKey, item => {
    //       item.children = item.children || [];
    //       // where to insert 示例添加到头部，可以是随意位置
    //       item.children.unshift(dragObj);
    //       // in previous version, we use item.children.push(dragObj) to insert the
    //       // item to the tail of the children
    //     });
    //   } else
    else {
      // 平级移动、交叉组移动、移动到其他组(非最顶级)非第一个位置

      let ar;
      let i;
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (trueDropPosition === -1) {
        // 移动到最顶级第一个位置
        ar.splice(i, 0, dragObj);
      } else {
        // trueDropPosition:   1 | 0
        ar.splice(i + 1, 0, dragObj);
      }
    }
    dropArray.push({
      classifyId: dragKey,
      targetParentId: dropKey,
    });
    dispatch({
      type: 'invoiceManagement/updateStates',
      payload: {
        dropArray: dropArray,
        treeData: [...data],
      },
    });
    if (dropArray.length > 0) {
      dispatch({
        type: 'invoiceManagement/transferInvoice',
        payload: {
          classifyIdJson: JSON.stringify(dropArray),
        },
      });
    }
  };
  const checkNumRule = (_, value) => {
    let numRule = /^[0-9]*$/;
    if (!numRule.test(value)) {
      return Promise.reject(new Error('只能输入数字'));
    } else {
      return Promise.resolve();
    }
  };
  const leftChildren = (
    <div className={styles.departmentTree}>
      <Input.Search
        className={styles.search}
        placeholder={'请输入分类名称'}
        allowClear
        onSearch={serachValueTree}
        enterButton={
          <img
            src={searchIcon}
            style={{ marginRight: 8, marginTop: -3, marginLeft: 4 }}
          />
        }
      />
      <Tree
        showLine={true}
        showIcon={true}
        onSelect={onSelect}
        // onMouseEnter={onMouseEnter}
        selectedKeys={sortId}
        onExpand={onExpand}
        treeData={treeData}
        expandedKeys={expandedKeys}
        autoExpandParent={true} //是否自动展开父节点
        // draggable
        // blockNode
        // onDragEnter={onDragEnter}
        // onDrop={onDrop}
      />
    </div>
  );
  const returnDisabled = (item) => {
    if (invoiceValue?.toString()?.includes(item?.invoiceId) && modalType) {
      //当前被选中的要支持取消
      return false;
    }
    if (disabledList?.toString()?.includes(item?.invoiceId) && modalType) {
      //发票在其他控件被选中，当前控件不可选
      return true;
    }
    if (item.useStatus == '1' && !location.pathname.includes('/budgetPage')) {
      return true;
    } else {
      return false;
    }
    item.useStatus == '1' ? true : false;
  };
  const returnCheckAll = () => {};
  //ocr识别结果table
  const ocrTableProps = {
    rowKey: 'id',
    columns: [
      {
        title: '序号',
        dataIndex: 'number',
        render: (text, record, index) => <a>{index + 1}</a>,
        // align: 'center',
        width: 60,
      },
      {
        title: '名称',
        dataIndex: 'desc',
        // align: 'center',
        width: 150,
      },
      {
        title: '详情',
        dataIndex: 'detail',
        // align: 'center',
      },
    ],
    pagination: false,
    scroll: { x: 600, y: 'calc(100vh - 294px)' },
    dataSource:
      ocrTypeEnum &&
      ocrTypeEnum.map((item, index) => {
        let info = wordsResult.words_result[0].result;
        let desc = info[item.code] && info[item.code][0];
        let word = desc && desc.word;
        item.detail = word;
        return item;
      }), //列表数据
  };
  //验真结果form
  const ocrVerifyForm = (
    <Form form={verificationForm} disabled={modalType == 'view' ? true : false}>
      <p className={styles.title}>票据验真结果</p>

      <Form.Item
        label="发票验真状态"
        name="verificationStatus"
        {...layout}
        colon={false}
      >
        <Input disabled style={{ width: '200px' }} value={'未验'} />
      </Form.Item>

      <Form.Item
        label="验证时间"
        name="verificationDate"
        {...layout}
        colon={false}
      >
        <Input disabled style={{ width: '200px' }} />
      </Form.Item>
      <Form.Item
        label="发起人"
        name="verificationPerson"
        {...layout}
        colon={false}
      >
        <Input disabled style={{ width: '200px' }} />
      </Form.Item>
    </Form>
  );
  const rightChildren = (
    <div
      className={cls(
        styles.rightChildren,
        modalType == 'view' ? styles.rightChildrenView : '',
      )}
    >
      <div className={styles.header}>
        <div
          className={styles.left}
          style={modalType == 'view' ? { marginLeft: 0 } : {}}
        >
          <Input.Search
            placeholder="票据类型"
            allowClear
            onSearch={searchInvoice}
            style={{ width: '200px' }}
            enterButton={
              <img
                src={searchIcon}
                style={{ marginRight: 8, marginTop: -3, marginLeft: 4 }}
              />
            }
          />
        </div>
        {modalType == 'view' ? (
          ''
        ) : (
          <div className={styles.right}>
            {!sortId[0] || sortId[0] == 'pjfl' ? (
              <Button
                onClick={() => {
                  return message.error('请选择要上传的票据分类！');
                }}
              >
                上传{' '}
              </Button>
            ) : (
              <IUpload
                nameSpace="invoiceManagement"
                requireFileSize={50}
                mustFileType={'png,jpg,gif'}
                buttonContent={
                  <Button type="primary" className={styles.upload_button}>
                    上传{' '}
                  </Button>
                }
              />
            )}

            {location.pathname.includes('/budgetPage') && (
              <Button
                onClick={() => {
                  getOcr();
                }}
                disabled={btnOcrOnClick}
              >
                OCR识别
              </Button>
            )}
            {location.pathname.includes('/budgetPage') && (
              <Button
                onClick={() => {
                  getVerification();
                }}
                disabled={btnOcrVerifyOnClick}
              >
                验真（收费）{' '}
              </Button>
            )}
            {location.pathname.includes('/budgetPage') && (
              <Button
                onClick={() => window.open('https://inv-veri.chinatax.gov.cn/')}
              >
                验真（免费）{' '}
              </Button>
            )}
            <Button
              onClick={() => {
                form.submit();
              }}
            >
              保存{' '}
            </Button>
            {!modalType && (
              <Button
                onClick={() => {
                  deleteInvoice(chooseLabel);
                }}
              >
                删除{' '}
              </Button>
            )}

            {location.pathname.includes('/budgetPage') && (
              <Button
                onClick={() => {
                  moveSort();
                }}
              >
                移动分类
              </Button>
            )}
            {location.pathname.includes('/budgetPage') && (
              <Button>生成单据</Button>
            )}
          </div>
        )}
      </div>
      <ReSizeLeftRight
        level={modalType == 'view' ? 1 : 2}
        vRigthNumLimit={335}
        style={{ padding: 0 }}
        height={'100%'}
        vNum={centerVum}
        setWidth={true}
        leftChildren={
          <div
            className={styles.table_warp}
            style={modalType == 'view' ? { paddingLeft: 0 } : {}}
          >
            {modalType == 'view' ? (
              ''
            ) : (
              <p style={{ marginBottom: 5 }}>
                <Checkbox
                  indeterminate={indeterminate}
                  onChange={(e) => onCheckAllChange(e)}
                  checked={checkAlls}
                  defaultChecked={false}
                >
                  全选
                </Checkbox>
              </p>
            )}

            <div className={styles.content} id={'scrollableDiv'}>
              <div className={styles.image}>
                <InfiniteScroll
                  dataLength={invoiceList.length}
                  next={loadMoreData}
                  hasMore={invoiceList.length < returnCount}
                  loader={<Spin className={styles.spin_div} />}
                  endMessage={
                    invoiceList?.length == 0 ? (
                      ''
                    ) : (
                      <Divider plain>没有更多啦</Divider>
                    )
                  }
                  scrollableTarget="scrollableDiv"
                >
                  <Checkbox.Group
                    value={chooseLabel}
                    onChange={(e) => checkThis(e)}
                    style={{ display: 'flex', flexWrap: 'wrap' }}
                  >
                    <Image.PreviewGroup>
                      {invoiceList?.map((item, index) => {
                        return (
                          <div
                            key={item.invoiceId}
                            className={
                              singleId == item?.invoiceId
                                ? styles.item_selected
                                : styles.item
                            }
                            onClick={(e) => {
                              getBasicInformation(item, e);
                            }}
                            style={{ marginRight: '20px' }}
                          >
                            <Image width={262} src={item.invoiceFilePath} />

                            <div className={styles.picture_desc}>
                              <div className={styles.picture_t}>
                                <Checkbox
                                  className={
                                    modalType == 'view'
                                      ? styles?.view_check
                                      : ''
                                  }
                                  value={item.invoiceId}
                                  key={item.invoiceId}
                                  disabled={returnDisabled(item)}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                  onChange={(e) => {
                                    unCheck(e);
                                  }}
                                >
                                  <a title={item.invoiceTypeName}>
                                    {item.invoiceTypeName}
                                  </a>
                                </Checkbox>
                                <p
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                  className={
                                    item.useStatus == '1'
                                      ? styles.used
                                      : styles.unUsed
                                  }
                                >
                                  {item.useStatus == '1' ? '已使用' : '未使用'}
                                </p>
                              </div>
                              <div
                                className={
                                  modalType == 'view'
                                    ? styles?.picture_b_view
                                    : styles.picture_b
                                }
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                              >
                                <p>
                                  {item.invoiceDate !== '0' &&
                                    dataFormat(
                                      item.invoiceDate,
                                      'YYYY-MM-DD HH:mm:ss',
                                    )}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </Image.PreviewGroup>
                  </Checkbox.Group>
                </InfiniteScroll>
              </div>
            </div>
          </div>
        }
        rightChildren={
          <div className={styles.basic_information}>
            <Tabs
              activeKey={currentKey}
              onChange={onChange}
              items={[
                {
                  label: `基础信息`,
                  key: '1',
                  children: (
                    <Form
                      form={form}
                      disabled={modalType == 'view' ? true : false}
                      onFinish={saveInvoice}
                    >
                      <p className={styles.title}>基础信息</p>
                      <Form.Item
                        label="票据类型"
                        name="invoiceType"
                        {...layout}
                        colon={false}
                      >
                        <Select
                          onChange={changeType}
                          style={{ width: '200px' }}
                        >
                          {typeList.map((item, index) => {
                            return (
                              <Option
                                value={item.dictInfoName}
                                key={item.dictTypeInfoCode}
                              >
                                {item.dictInfoName}
                              </Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                      <Form.Item
                        label="上传时间"
                        name="createTime"
                        {...layout}
                        colon={false}
                      >
                        <Input disabled style={{ width: '200px' }} />
                      </Form.Item>
                      <Form.Item
                        label="创建人"
                        name="createUserName"
                        {...layout}
                        colon={false}
                      >
                        <Input disabled style={{ width: '200px' }} />
                      </Form.Item>
                      <p className={styles.title}>票据主要信息</p>
                      <Form.Item
                        label="开票日期"
                        name="invoiceDate"
                        {...layout}
                        colon={false}
                      >
                        <DatePicker
                          showTime
                          onChange={changeTime}
                          onOk={onOk}
                          style={{ width: '200px' }}
                        />
                      </Form.Item>
                      <Form.Item
                        label="发票代码"
                        name="invoiceCode"
                        {...layout}
                        colon={false}
                        rules={[
                          { max: 50, required: false },
                          { validator: checkNumRule.bind(this) },
                        ]}
                      >
                        <Input style={{ width: '200px' }} />
                      </Form.Item>
                      <Form.Item
                        label="发票号码"
                        name="invoiceNum"
                        {...layout}
                        colon={false}
                        rules={[
                          { max: 50, required: false },
                          { validator: checkNumRule.bind(this) },
                        ]}
                      >
                        <Input style={{ width: '200px' }} />
                      </Form.Item>
                      <Form.Item
                        label="价税合计(小写)"
                        name="taxPriceInnums"
                        {...layout}
                        colon={false}
                        rules={[
                          { max: 50 },
                          {
                            pattern: /^\d*\.?\d+$/,
                            message: '只能输入整数和小数',
                          },
                        ]}
                      >
                        <Input style={{ width: '200px' }} />
                      </Form.Item>
                      <Form.Item
                        label="购买方-名称"
                        name="buyerName"
                        {...layout}
                        colon={false}
                        rules={[
                          { max: 50 },
                          {
                            pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]+$/,
                            message: '只能输入汉字、英文、数字',
                          },
                        ]}
                      >
                        <Input style={{ width: '200px' }} />
                      </Form.Item>
                      <p className={styles.title}>票据附加信息</p>
                      <Form.Item
                        label="使用状态"
                        name="useStatus"
                        {...layout}
                        colon={false}
                      >
                        <Input disabled style={{ width: '200px' }} />
                      </Form.Item>
                      <Form.Item
                        label="OCR识别状态"
                        name="ocrStatus"
                        {...layout}
                        colon={false}
                      >
                        <Input disabled style={{ width: '200px' }} />
                      </Form.Item>
                      <Form.Item
                        label="发票验真状态"
                        name="verificationStatus"
                        {...layout}
                        colon={false}
                      >
                        <Input disabled style={{ width: '200px' }} />
                      </Form.Item>
                    </Form>
                  ),
                },
                {
                  label: `识别信息`,
                  key: '2',
                  children: (
                    <div className={styles.table}>
                      <Table {...ocrTableProps} />
                    </div>
                  ),
                },
                {
                  label: `验真信息`,
                  key: '3',
                  children: { ...ocrVerifyForm },
                },
              ]}
            />
          </div>
        }
        suffix={containerId || 'invoiceManagement_container'}
      />
    </div>
  );
  return (
    <div
      id={containerId || 'invoiceManagement_container'}
      className={styles.container}
      style={{ height: '100%' }}
    >
      {modalType == 'view' ? (
        rightChildren
      ) : (
        <ReSizeLeftRight
          vNum={220}
          level={1}
          height={'100%'}
          leftChildren={leftChildren}
          rightChildren={rightChildren}
          suffix={containerId || 'invoiceManagement_container'}
        />
      )}

      {isShow && (
        <AddInvoiceModal
          getInvoiceTreeFn={getInvoiceTreeFn}
          setExpandedKeys={setExpandedKeys}
          containerId={containerId}
        />
      )}
      {isShowMove && (
        <MoveSortModal
          getInvoiceTreeFn={getInvoiceTreeFn}
          setExpandedKeys={setExpandedKeys}
          expandedKeys={expandedKeys}
          chooseLabel={chooseLabel}
          getInvoiceList={getInvoiceList}
          setChooseLabel={setChooseLabel}
          containerId={containerId}
        />
      )}
    </div>
  );
}
export default connect(({ invoiceManagement, loading }) => ({
  invoiceManagement,
  loading,
}))(invoiceManagement);
