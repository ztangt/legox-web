import { Button, message, Modal, Spin } from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import BasicsTable from '../../../components/basicsTable';
import { tableDetailColumns } from './config.jsx';

function FileDetailModel({
  detailModelVis,
  setDetailModelVis,
  dispatch,
  contractFiles,
  loading,
}) {
  // fileList
  const { contractId, detailSelectedRows } = contractFiles;

  const { openEvent } = useModel('@@qiankunStateFromMaster');

  const openFormDetail = (...rest) => {
    //查看
    openEvent && openEvent(rest[0], rest[1], rest[2], rest[3], rest[4]);
  };

  const [fileList, setFileList] = useState([]);

  const getDetailList = () => {
    dispatch({
      type: 'contractFiles/getContractFileFjList',
      payload: {
        contractId,
      },
      callback: (list) => {
        setFileList(list);
      },
    });
  };

  const handleDownload = ({ filePaths, zipName }) => {
    dispatch({
      type: 'contractFiles/getFileStorageZip',
      payload: {
        filePaths: JSON.stringify(filePaths),
        zipName,
      },
      callback: (url) => {
        let link = document.createElement('a');
        link.href = url;
        link.download = zipName;
        if (url.indexOf('?') === -1) {
          url += '?download';
        }
        link.click();
        link.remove();
      },
    });
  };

  const getFileList = (fileList) => {
    let str = '';

    const filePaths = (fileList || []).reduce((pre, cur) => {
      const { fjName, contractName, bizTitle } = cur;
      str = contractName;

      const fjNList = (fjName || []).reduce((fjPre, fjCur) => {
        const fjL = (fjCur.list || []).reduce((fjLPre, fjLCur) => {
          fjLPre.push({
            filePath: fjLCur.filePath,
          });
          return fjLPre;
        }, []);

        fjPre.push({
          label: fjCur.label,
          list: fjL,
        });

        return fjPre;
      }, []);

      pre.push({
        bizTitle: bizTitle,
        fjName: fjNList,
      });

      return pre;
    }, []);
    return { filePaths, zipName: str };
  };

  useEffect(() => {
    getDetailList();
  }, []);

  return (
    <Modal
      visible={detailModelVis}
      footer={false}
      width={900}
      title={'附件详情'}
      onCancel={() => {
        setDetailModelVis(false);
      }}
      mask={false}
      maskClosable={false}
      centered
      getContainer={() => {
        return document.getElementById('contractFiles') || false;
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '10px',
        }}
      >
        <div></div>
        <div>
          <Button
            onClick={() => {
              if (detailSelectedRows.length > 0) {
                const { filePaths, zipName } = getFileList(detailSelectedRows);
                handleDownload({
                  filePaths,
                  zipName,
                });
              } else {
                message.error('请选择需要下载的数据！');
              }
            }}
          >
            下载
          </Button>
        </div>
      </div>
      {/* <Table
        {...tableDetailColumns({ handleDownload, getFileList })}
        dataSource={fileList}
        rowSelection={{
          onChange: (selectedRowKeys, selectedRows) => {
            dispatch({
              type: 'contractFiles/updateStates',
              payload: {
                detailSelectedRowKeys: selectedRowKeys,
                detailSelectedRows: selectedRows,
              },
            });
          },
          type: 'checkbox',
        }}
      /> */}
      <Spin spinning={loading.global}>
        <BasicsTable
          // listHead="list_head"
          // container="dom_container"
          {...tableDetailColumns({
            handleDownload,
            getFileList,
            openFormDetail,
          })}
          dataSource={fileList}
          dispatch={dispatch}
          bordered
          rowSelection={{
            onChange: (selectedRowKeys, selectedRows) => {
              dispatch({
                type: 'contractFiles/updateStates',
                payload: {
                  detailSelectedRowKeys: selectedRowKeys,
                  detailSelectedRows: selectedRows,
                },
              });
            },
            type: 'checkbox',
          }}
          pagination={false}
        />
      </Spin>

      {/* <div
        style={{
          position: 'absolute',
          width: '800px',
          height: '52px',
          bottom: '13px',
          right: 0,
        }}
      >
        <IPagination
          current={detailStart}
          total={detailReturnCount}
          onChange={(page, size) => {
            dispatch({
              type: 'contractLedger/updateStates',
              payload: {
                detailStart: page,
                detailLimit: size,
              },
            });
          }}
          pageSize={detailLimit}
          isRefresh={true}
          refreshDataFn={() => {}}
        />
      </div> */}
    </Modal>
  );
}

export default connect(({ contractFiles, loading }) => ({
  contractFiles,
  loading,
}))(FileDetailModel);
