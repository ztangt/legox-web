import { message } from 'antd';
import apis from 'api';
import { REQUEST_SUCCESS } from '../../service/constant';

export default {
  namespace: 'invoiceManagement',
  state: {
    oldData: [],
    treeData: [
      {
        title: '票据分类',
        key: 'pjfl',
        classifyName: '票据分类',
        classifyId: '0',
        children: [],
      },
    ],
    isShow: false,
    type: '',
    parentId: '', //父id
    returnCount: 0,
    allPage: 1,
    currentPage: 1,
    limit: 12,
    searchWord: '',
    invoiceList: [], //发票列表
    detailData: {},
    compareData: [],
    searchTree: '',
    isShowMove: false,
    sortId: '',
    dropArray: [],
    basicInformationData: {}, //单条发票信息
    singleId: '', //单条id
    typeList: [], //发票类型（码表）

    uploadFlag: true, //上传暂停器
    nowMessage: '', //提示上传进度的信息
    md5: '', //文件的md5值，用来和minio文件进行比较
    fileChunkedList: [], //文件分片完成之后的数组
    fileName: '', //文件名字
    fileNames: '', //文件前半部分名字
    fileStorageId: '', //存储文件信息到数据库接口返回的id
    typeNames: '', //文件后缀名
    optionFile: {}, //文件信息
    fileSize: '', //文件大小，单位是字节
    getFileMD5Message: {}, //md5返回的文件信息
    success: '', //判断上传路径是否存在
    v: 1, //计数器
    needfilepath: '', //需要的minio路径
    isStop: true, //暂停按钮的禁用
    isContinue: false, //继续按钮的禁用
    isCancel: false, //取消按钮的禁用
    index: 0, //fileChunkedList的下标，可用于计算上传进度
    merageFilepath: '', //合并后的文件路径
    typeName: '', //层级
    fileExists: '', //判断文件是否存在于minio服务器中，相关modal中监听判断fileExists状态进行后续分别操作
    fileExistsFu: '', // 判断富文本是否存在于minio服务器中（）
    md5FileId: '', //md5查询到的文件返回的id
    md5FilePath: '', //md5查询到的文件返回的pathname,
    invoicePath: '',

    transferId: '',
    parentName: '', //上级名称
    selectData: [
      {
        title: '票据分类',
        key: 'pjfl',
        classifyName: '票据分类',
        classifyId: '0',
        children: [{ key: '-1' }],
      },
    ],
    detailInvoice: {},
    moveTree: [
      {
        title: '票据分类',
        key: 'pjfl',
        classifyName: '票据分类',
        classifyId: '0',
        children: [{ key: '-1' }],
      },
    ],
    wordsResult: '', //ocr识别信息
    ocrTypeEnum: '', //OCR识别后获取票据显示枚举信息
    ocrType: '', //ocr类型,
    ocrDataCode: '', //OCR识别结果
    verificationCode: '', //验真识别结果
    isVerification: false,
  },
  subscriptions: {},
  effects: {
    //查询票据分类树
    *getInvoiceTree({ payload, callback }, { call, put, select }) {
      // const loopTree = (data) => {
      //   data.forEach((item, index) => {
      //     item.title = item.classifyName;
      //     item.key = item.classifyId;
      //     if (item.isHaveChild == '1') {
      //       item.children = [{ key: '-1' }];
      //     }
      //     if (item.children) {
      //       loopTree(item.children);
      //     }
      //   });
      //   return data;
      // };
      try {
        const { data } = yield call(
          apis.getInvoiceTree,
          payload,
          '',
          'invoiceManagement',
        );
        if (data.code == REQUEST_SUCCESS) {
          const { treeData } = yield select((state) => state.invoiceManagement);
          callback && callback(data);
          // console.log(data.data.jsonResult, 'data');

          // if (treeData[0].children.length == 0) {
          //   treeData[0].children = loopTree(data.data.jsonResult);
          //   console.log(treeData, 'treeData');
          // } else {
          //   yield put({
          //     type: 'updateStates',
          //     payload: {
          //       compareData: loopTree(data.data.jsonResult),
          //     },
          //   });
          //   console.log(data.data.jsonResult, '111000');
          //   treeData.forEach((item) => {
          //     item.children.forEach((item) => {
          //       if (item.classifyId == payload.classifyId) {
          //         item.children = loopTree(data.data.jsonResult);
          //       }
          //     });
          //   });
          // }
          // yield put({
          //   type: 'updateStates',
          //   payload: {
          //     treeData: [...treeData],
          //   },
          // });
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
        console.log(e);
      } finally {
      }
    },
    *addInvoiceTree({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(
          apis.addInvoiceTree,
          payload,
          '',
          'invoiceManagement',
        );
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'updateStates',
            payload: {
              isShow: false,
            },
          });
          callback && callback(data);
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
        console.log(e);
      } finally {
      }
    },
    *updateInvoiceTree({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(
          apis.updateInvoiceTree,
          payload,
          '',
          'invoiceManagement',
        );
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'updateStates',
            payload: {
              isShow: false,
            },
          });
          callback && callback(data);
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
        console.log(e);
      } finally {
      }
    },
    //发票列表
    *getInvoiceList({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(
          apis.getInvoiceList,
          payload,
          '',
          'invoiceManagement',
        );
        const { invoiceList } = yield select(
          (state) => state.invoiceManagement,
        );
        console.log(data.data.list, 'data==');
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'updateStates',
            payload: {
              returnCount: data.data.returnCount,
              allPage: data.data.allPage,
              currentPage: data.data.currentPage,
              invoiceList:
                payload.start != 1
                  ? [...invoiceList, ...data.data.list]
                  : data.data.list,
            },
          });
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
        console.log(e);
      } finally {
      }
    },
    //删除分类树
    *deleteInvoiceTree({ payload, callback }, { call, put, select }) {
      function del(data, id) {
        data.forEach((element, index) => {
          if (element.classifyId == id) {
            data.splice(index, 1);
          }
          if (element.children) {
            del(element.children, id);
          }
        });
        return data;
      }
      try {
        const { data } = yield call(
          apis.deleteInvoiceTree,
          payload,
          '',
          'invoiceManagement',
        );
        if (data.code == REQUEST_SUCCESS) {
          const { treeData } = yield select((state) => state.invoiceManagement);
          let res = del(treeData, payload.calssifyIds);
          yield put({
            type: 'updateStates',
            payload: {
              treeData: [...res],
            },
          });
          callback && callback(data);
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
        console.log(e);
      } finally {
      }
    },
    //删除发票
    *deleteInvoiceList({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(
          apis.deleteInvoiceList,
          payload,
          '',
          'invoiceManagement',
        );
        if (data.code == REQUEST_SUCCESS) {
          const { invoiceList, searchWord, sortId } = yield select(
            (state) => state.invoiceManagement,
          );
          // payload.invoiceIds.split(',').forEach((item, index) => {
          //   invoiceList.splice(
          //     invoiceList.findIndex((val) => val.invoiceId == item),
          //     1,
          //   );
          // });
          yield put({
            type: 'getInvoiceList',
            payload: {
              classifyId: sortId && sortId[0],
              searchWord,
              start: 1,
              limit: 10,
            },
          });
          console.log(invoiceList, 'invoiceList=====');
          message.success(data.msg);
          // yield put({
          //   type: 'updateStates',
          //   payload: {
          //     invoiceList: invoiceList,
          //   },
          // });
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
        console.log(e);
      } finally {
      }
    },
    //获取下载地址url
    *getDownFileUrl({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(
          apis.getDownFileUrl,
          payload,
          '',
          'invoiceManagement',
        );
        if (data.code == REQUEST_SUCCESS) {
          callback && callback(data.data.fileUrl);
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
        console.log(e);
      } finally {
      }
    },
    //上传
    *uploadInvoice({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(
          apis.uploadInvoice,
          payload,
          '',
          'invoiceManagement',
        );
        if (data.code == REQUEST_SUCCESS) {
          callback && callback();
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
        console.log(e);
      } finally {
      }
    },
    //转移分类
    *transferInvoice({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(
          apis.transferInvoice,
          payload,
          '',
          'invoiceManagement',
        );
        if (data.code == REQUEST_SUCCESS) {
          callback && callback();
          yield put({
            type: 'updateStates',
            payload: {
              dropArray: [],
            },
          });
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
        console.log(e);
      } finally {
      }
    },
    //查询单张发票信息
    *getDetailInvoice({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(
          apis.getDetailInvoice,
          payload,
          '',
          'invoiceManagement',
        );
        if (data.code == REQUEST_SUCCESS) {
          // yield put({
          //   type: 'getOcrInfoMo',
          //   payload: {
          //     invoiceId: data.data.invoiceId,
          //   },
          // });
          yield put({
            type: 'updateStates',
            payload: {
              basicInformationData: data.data,
            },
          });
          callback && callback(data.data.invoiceId);
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
        console.log(e);
      } finally {
      }
    },
    *updateInvoiceList({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(
          apis.updateInvoiceList,
          payload,
          '',
          'invoiceManagement',
        );
        if (data.code == REQUEST_SUCCESS) {
          const { sortId, currentPage } = yield select(
            (state) => state.invoiceManagement,
          );
          message.success('修改成功');
          yield put({
            type: 'getDetailInvoice',
            payload: {
              invoiceId: payload.invoiceId,
            },
          });
          yield put({
            type: 'getInvoiceList',
            payload: {
              classifyId: sortId && sortId[0],
              searchWord: '',
              start: currentPage,
              limit: 12,
            },
          });
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
        console.log(e);
      } finally {
      }
    },
    //获取发票类型
    *getDictType({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(
          apis.getDictType,
          payload,
          '',
          'invoiceManagement',
        );
        console.log(data.data.list, 'dictInfos');
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'updateStates',
            payload: {
              typeList: data.data.list,
            },
          });
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
        console.log(e);
      } finally {
      }
    },
    //转移票据
    *moveInvoice({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(
          apis.moveInvoice,
          payload,
          '',
          'invoiceManagement',
        );
        if (data.code == REQUEST_SUCCESS) {
          callback && callback();
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
        console.log(e);
      } finally {
      }
    },
    //查询单个票据分类信息
    *getDetailInvoiceTree({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(
          apis.getDetailInvoiceTree,
          payload,
          '',
          'invoiceManagement',
        );
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'updateStates',
            payload: {
              detailInvoice: data.data,
            },
          });
          callback && callback();
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
        console.log(e);
      } finally {
      }
    },
    //发票列表
    *getInvoiceListByIds({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(
          apis.getInvoiceListByIds,
          payload,
          '',
          'invoiceManagement',
        );
        console.log(data.data.list, 'data==');
        const { invoiceList } = yield select(
          (state) => state.invoiceManagement,
        );
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'updateStates',
            payload: {
              returnCount: data.data.returnCount,
              allPage: data.data.allPage,
              currentPage: data.data.currentPage,
              invoiceList:
                payload.start != 1
                  ? [...invoiceList, ...data.data.list]
                  : data.data.list,
            },
          });
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
        console.log(e);
      } finally {
      }
    },
    //ocr识别信息
    *getOcrResult({ payload, callback }, { call, put, select }) {
      try {
        const { data } = yield call(
          apis.getOcrResult,
          payload,
          '',
          'invoiceManagement',
        );
        console.log(data.data, 'data==');
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'getOcrEnum',
            payload: {
              ocrType: data.data.words_result[0].type,
              invoiceId: payload.invoiceId,
            },
          });
          yield put({
            type: 'updateStates',
            payload: {
              wordsResult: data.data,
              ocrDataCode: data.code,
            },
          });
          callback && callback(data);
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          yield put({
            type: 'updateStates',
            payload: {
              ocrDataCode: data.code,
            },
          });
          message.error(data.msg);
        }
      } catch (e) {
        console.log(e);
      } finally {
      }
    },
    //OCR识别后获取票据显示枚举信息
    *getOcrEnum({ payload, callback }, { call, put }) {
      try {
        const { data } = yield call(
          apis.getOcrEnum,
          payload,
          '',
          'invoiceManagement',
        );
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'updateStates',
            payload: {
              ocrTypeEnum: JSON.parse(data.data),
            },
          });
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
        console.log(e);
      } finally {
      }
    },
    //发票验真
    *vatInvoiceVerification({ payload, callback }, { call, put }) {
      try {
        // let data =
        //   '{"words_result":{"TaxControlNum":"","CommodityEndDate":[],"ESVATURL":"","VehicleTonnage":"","CommodityVehicleType":[],"CommodityStartDate":[],"SellerAddress":"","CommodityPrice":[],"TransportCargoInformation":"","NoteDrawer":"","CommodityNum":[],"SellerRegisterNum":"","SellerBank":"","Remarks":"","TotalTax":"","CommodityTaxRate":[],"CommodityExpenseItem":[],"ZeroTaxRateIndicator":"","Carrier":"","SenderCode":"","PurchaserRegisterNum":"","ReceiverCode":"","AmountInFiguers":"","PurchaserBank":"","Checker":"","TollSign":"","VehicleTypeNum":"","DepartureViaArrival":"","Receiver":"","Recipient":"","TotalAmount":"189.84","CommodityAmount":[],"PurchaserName":"","CommodityType":[],"Sender":"","ListLabel":"","PurchaserAddress":"","CommodityTax":[],"CarrierCode":"","CommodityPlateNum":[],"CommodityUnit":[],"Payee":"","RecipientCode":"","CommodityName":[],"SellerName":""},"log_id":1681629025449528316,"VerifyFrequency":"","words_result_num":45,"VerifyMessage":"查询发票不规范","InvalidSign":"","InvoiceType":"增值税专用发票","MachineCode":"","CheckCode":"17897460375370056258","InvoiceCode":"011002200511","InvoiceDate":"20221221","VerifyResult":"1005","InvoiceNum":"56112938"}';
        // let data ='{"words_result":{"InvoiceCode":"011002100711","verificationDate":1689834848,"verificationPerson":"c0007hao"}}';
        // let data ='{"words_result":{"InvoiceCode":"011002100711"}}';
        // yield put({
        //   type: 'updateStates',
        //   payload: {
        //     verificationResultJson: JSON.parse(data),
        //     verificationCode: '200',
        //   },
        // });
        const { data } = yield call(
          apis.vatInvoiceVerification,
          payload,
          '',
          'invoiceManagement',
        );
        if (data.code == REQUEST_SUCCESS) {
          let result = JSON.parse(data.data);
          if (result.error_msg) {
            message.error(result.error_msg);
          } else {
            yield put({
              type: 'updateStates',
              payload: {
                verificationResultJson: JSON.parse(data.data),
                verificationCode: data.code,
              },
            });
          }
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          yield put({
            type: 'getOcrInfoMo',
            payload: {
              invoiceId: payload.invoiceId,
            },
          });
          yield put({
            type: 'updateStates',
            payload: {
              verificationCode: data.code,
            },
          });
          message.error(data.msg);
        }
      } catch (e) {
        console.log(e);
      } finally {
      }
    },
    //minio获取ocr信息
    *getOcrInfoMo({ payload, callback }, { call, put }) {
      try {
        const { data } = yield call(
          apis.getOcrInfoMo,
          payload,
          '',
          'invoiceManagement',
        );
        if (data.code == REQUEST_SUCCESS) {
          yield put({
            type: 'updateStates',
            payload: {
              ocrTypeEnum: data.data.ocrTypeEnum
                ? JSON.parse(data.data.ocrTypeEnum)
                : [],
              wordsResult: data.data.wordsResult || {},
              verificationResultJson: data.data.verificationResultJson
                ? JSON.parse(data.data.verificationResultJson)
                : [],
            },
          });
          callback &&
            callback(
              data.data.wordsResult || {},
              data.data.verificationResultJson || {},
            );
        } else if (data.code != 401 && data.code != 419 && data.code != 403) {
          message.error(data.msg);
        }
      } catch (e) {
        console.log(e);
      } finally {
      }
    },
  },
  reducers: {
    updateStates(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
