import { DoubleRightOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { connect } from 'dva';
import { useState } from 'react';
import ButtonList from './buttonList';
import { BIZASSOCLIGIC } from './contant';
import styles from './listSearch.less';
import OrgModal from './orgModal';
import ProjectModal from './projectModal';
const Index = ({
  formHigh,
  projectRefinement,
  formExtra,
  dispatch,
  budgetStage,
  buttonList,
  buttonFn,
  buttonDisable,
}) => {
  const [isShowHighSearch, setIsShowHighSearch] = useState(false);
  const [modalInfo, setModalInfo] = useState({ type: '', name: '' });
  const {
    currentNode,
    currentOrgNode,
    limit,
    usedYear,
    listSearchWord,
    selectedRowKeys,
    selectedRows,
  } = projectRefinement;
  const renderHighSearch = () => {
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span
          className={styles.high_level}
          onClick={() => {
            formHigh.resetFields();
            setIsShowHighSearch(!isShowHighSearch);
          }}
        >
          高级
        </span>
        <DoubleRightOutlined
          onClick={() => {
            formHigh.resetFields();
            setIsShowHighSearch(!isShowHighSearch);
          }}
          rotate={90}
          style={{ fontSize: '12px' }}
        />
      </div>
    );
  };
  //高级搜索
  const onFinishSearch = (values) => {
    console.log('values====', values);
    //获取列表
    dispatch({
      type: 'projectRefinement/getBudPreProjectList',
      payload: {
        ...values,
        searchWord: listSearchWord,
        budgetStage: budgetStage,
        parentId: currentNode.nodeId,
        treeType: currentNode.treeType,
        orgId: currentOrgNode.id,
        usedYear: usedYear,
        start: 0,
        limit,
      },
    });
  };
  //基础搜索
  const onListSearchWordSearch = () => {
    //获取列表
    dispatch({
      type: 'projectRefinement/getBudPreProjectList',
      payload: {
        searchWord: listSearchWord,
        budgetStage: budgetStage,
        parentId: currentNode.nodeId,
        treeType: currentNode.treeType,
        orgId: currentOrgNode.id,
        usedYear: usedYear,
        start: 0,
        limit,
      },
    });
  };
  //显示搜索项中的某个弹框
  const showModalFn = (type, name) => {
    setModalInfo({ type, name });
  };
  //取消弹框
  const cancelModal = () => {
    setModalInfo({ type: '', name: '' });
  };
  //改变年则改变项目(列表和树)
  const onPressEnter = (value) => {
    //请求树和列表的接口（列表的接口需要判断是否选择了单位和左侧的项目树）
    // dispatch({
    //   type:'projectRefinement/updateStates',
    //   payload:{
    //     usedYear:value
    //   }
    // })
  };
  //更新搜索项的数值
  const updateForm = (selectedRowKeys, selectedRows, modalInfo) => {
    debugger;
    if (selectedRowKeys.length) {
      if (modalInfo.name == 'projectOrgName') {
        formHigh.setFieldValue([modalInfo.type], selectedRowKeys[0]);
        formHigh.setFieldValue(
          [modalInfo.name],
          selectedRows?.[0]?.nodeName || '',
        );
      } else {
        formHigh.setFieldValue([modalInfo.type], selectedRowKeys[0]);
        formHigh.setFieldValue(
          [modalInfo.name],
          selectedRows?.[0]?.OBJ_NAME || '',
        );
      }
    }
    cancelModal();
  };
  //清空表单值
  const allowClearValue = (type, name, e) => {
    if (!e.target.value) {
      formHigh.setFieldValue([type], '');
      formHigh.setFieldValue([name], '');
    }
  };
  const changeYear = (value) => {
    //年份改变数据改变并取消选中状态
    if (/^\d{4}$/.test(value)) {
      dispatch({
        type: 'projectRefinement/updateStates',
        payload: {
          usedYear: value,
          currentNode: {},
          projectList: [],
          currentOrgNode: {},
          projectTreeSearchWord: '',
        },
      });
      //获取全部的项目树信息
      dispatch({
        type: 'projectRefinement/getBudPreProjectTree',
        payload: {
          budgetStage: budgetStage,
          searchWord: '',
          parentId: '',
          usedYear: value,
          orgId: '',
          treeType: '',
        },
      });
    }
  };
  const onListSearchWordChange = (e) => {
    dispatch({
      type: 'projectRefinement/updateStates',
      payload: {
        listSearchWord: e.target.value,
      },
    });
  };
  return (
    <div className={styles.search}>
      <div className={styles.three_area} style={{ marginBottom: 0 }}>
        <div className={styles.top}>
          <div className={styles.left}>
            <InputNumber
              min={1000}
              max={9999}
              style={{ width: 80 }}
              defaultValue={usedYear}
              onChange={changeYear}
              // onStep={changeYear}
              // onPressEnter={onPressEnter}
            />
          </div>
          <div className={styles.right} style={{ paddingLeft: 8 }}>
            <Form
              form={formExtra}
              // onFieldsChange={onExtraFieldsChange}
              colon={false}
              labelAlign="right"
              // layout="inline"
              initialValues={{ currentYear: usedYear }}
            >
              <Row>
                <Col span={8} key="sw">
                  <div
                    style={{
                      display: 'flex',
                    }}
                  >
                    <Input
                      placeholder={'请输入项目名称'}
                      // value={listSearchWord}
                      onChange={onListSearchWordChange}
                      style={{ width: 200 }}
                    />
                    <Button
                      type="primary"
                      style={{ margin: '0 8px' }}
                      onClick={onListSearchWordSearch}
                    >
                      查询
                    </Button>
                    {budgetStage && budgetStage != '0'
                      ? renderHighSearch()
                      : null}
                  </div>
                </Col>
                <div className={styles.right_button}>
                  <ButtonList
                    selectedRowKeys={selectedRowKeys}
                    selectedRows={selectedRows}
                    usedYear={usedYear}
                    currentOrgNode={currentOrgNode}
                    currentNode={currentNode}
                    budgetStage={budgetStage}
                    formHigh={formHigh}
                    listSearchWord={listSearchWord}
                    limit={limit}
                    dispatch={dispatch}
                    buttonDisable={buttonDisable}
                    buttonList={buttonList}
                    buttonFn={buttonFn}
                  />
                </div>
              </Row>
            </Form>
          </div>
        </div>
      </div>
      <div className={styles.high_search}>
        {isShowHighSearch && (
          <>
            <Form
              form={formHigh}
              // onFieldsChange={onHighFieldsChange}
              onFinish={onFinishSearch}
              className={styles.high_form}
              layout="inline"
              labelAlign="right"
              colon={false}
            >
              <Col span={8}>
                <Form.Item
                  name={'projectName'}
                  label={'项目名称'}
                  style={{ marginBottom: '8px', marginLeft: '8px' }}
                >
                  <Input style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name={'projectCategoryCode'}
                  label={'项目类别'}
                  style={{ display: 'none' }}
                >
                  <Input style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                  name={'projectCategoryName'}
                  label={'项目类别'}
                  style={{ marginBottom: '8px', marginLeft: '8px' }}
                >
                  <Input
                    style={{ width: '100%' }}
                    allowClear
                    onClick={showModalFn.bind(
                      this,
                      'projectCategoryCode',
                      'projectCategoryName',
                    )}
                    onChange={allowClearValue.bind(
                      this,
                      'projectCategoryCode',
                      'projectCategoryName',
                    )}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name={'projectTypeCode'}
                  label={'项目类型'}
                  style={{ display: 'none' }}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name={'projectTypeName'}
                  label={'项目类型'}
                  style={{ marginBottom: '8px', marginLeft: '8px' }}
                >
                  <Input
                    style={{ width: '100%' }}
                    onClick={showModalFn.bind(
                      this,
                      'projectTypeCode',
                      'projectTypeName',
                    )}
                    allowClear
                    onChange={allowClearValue.bind(
                      this,
                      'projectTypeCode',
                      'projectTypeName',
                    )}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name={'projectOrgId'}
                  label={'项目单位'}
                  style={{ display: 'none' }}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name={'projectOrgName'}
                  label={'项目单位'}
                  style={{ marginBottom: '8px', marginLeft: '8px' }}
                >
                  <Input
                    style={{ width: '100%' }}
                    onClick={showModalFn.bind(
                      this,
                      'projectOrgId',
                      'projectOrgName',
                    )}
                    allowClear
                    onChange={allowClearValue.bind(
                      this,
                      'projectOrgId',
                      'projectOrgName',
                    )}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name={'funcSubjectCode'}
                  label={'功能科目'}
                  style={{ display: 'none' }}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name={'funcSubjectName'}
                  label={'功能科目'}
                  style={{ marginBottom: '8px', marginLeft: '8px' }}
                >
                  <Input
                    style={{ width: '100%' }}
                    onClick={showModalFn.bind(
                      this,
                      'funcSubjectCode',
                      'funcSubjectName',
                    )}
                    allowClear
                    onChange={allowClearValue.bind(
                      this,
                      'projectOrgId',
                      'projectOrgName',
                    )}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name={'isBasic'}
                  label={'是否基建'}
                  style={{ marginBottom: '8px', marginLeft: '8px' }}
                >
                  <Select
                    showSearch
                    style={{
                      width: '100%',
                    }}
                    placeholder=""
                    allowClear
                    options={[
                      {
                        label: '请选择',
                        value: null,
                      },
                      {
                        label: '是',
                        value: 1,
                      },
                      {
                        label: '否',
                        value: 0,
                      },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Form>
            <div className={styles.f_opration} id="set_opration">
              <Button
                type="primary"
                onClick={() => {
                  formHigh.submit();
                }}
              >
                查询
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  formHigh.resetFields();
                  formExtra.resetFields();
                }}
              >
                重置
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  formHigh.resetFields();
                  setIsShowHighSearch(false);
                }}
              >
                收起
              </Button>
            </div>
          </>
        )}
      </div>
      {modalInfo.type == 'projectCategoryCode' ||
      modalInfo.type == 'projectTypeCode' ||
      modalInfo.type == 'funcSubjectCode' ? (
        <ProjectModal
          onOk={updateForm.bind(this)}
          onCancel={cancelModal.bind(this)}
          logicCode={BIZASSOCLIGIC[modalInfo.type]}
          modalInfo={modalInfo}
        />
      ) : null}
      {modalInfo.type == 'projectOrgId' ? (
        <OrgModal
          onOk={updateForm.bind(this)}
          onCancel={cancelModal.bind(this)}
          modalInfo={modalInfo}
        />
      ) : null}
    </div>
  );
};
export default connect(({ projectRefinement }) => ({
  projectRefinement,
}))(Index);
