import { useModel } from '@umijs/max';
import { Form } from 'antd';
import { connect } from 'dva';
import ReSizeOnDown from '../../components/public/reSizeOnDown';
import ReSizeLeftRight from '../../components/reSizeLeftRight/reSizeLeftRight';
import { getUrlParams } from '../../util/util';
import BudgetPreparation from './componments/budgetPreparation';
import List from './componments/list';
import OrgTree from './componments/orgTree';
import styles from './index.less';
const otherBudgetStages = ['2', '3', '4'];
const Index = ({ dispatch, projectRefinement }) => {
  const {
    usedYear,
    projectTree,
    limit,
    currentNode,
    currentOrgNode,
  } = projectRefinement;
  const [projectForm] = Form.useForm();
  const { location } = useModel('@@qiankunStateFromMaster');
  const params = getUrlParams(location.query.url);
  const budgetStage = params['budgetStage'] || location.query.budgetStage;

  //组织单位(上)
  const onRender = () => {
    return (
      <div className={styles.org_warp}>
        <OrgTree
          isShowSearch={true}
          getData={getData.bind(this)}
          plst={'请输入单位名称'}
          usedYear={usedYear}
          budgetStage={budgetStage}
        />
      </div>
    );
  };
  //获取项目信息
  const getData = (currentNode) => {
    if (otherBudgetStages.includes(budgetStage)) {
      //获取列表的值
      if (currentNode.id) {
        getBudPreProjectList('', {}, 0, limit, currentNode.id);
      }
    } else {
      //获取项目树(写在了组件中)
      dispatch({
        type: 'projectRefinement/getBudPreProjectTree',
        payload: {
          budgetStage: budgetStage,
          searchWord: '',
          parentId: '',
          usedYear: usedYear,
          orgId: currentNode.id || '',
        },
      });
    }
    //清空搜索条件和列表
    dispatch({
      type: 'projectRefinement/updateStates',
      payload: {
        projectTreeSearchWord: '',
        currentNode: {},
        projectList: [],
        currentOrgNode: currentNode,
      },
    });
    projectForm.resetFields();
  };
  const getBudPreProjectList = (
    searchWord,
    currentNode,
    start,
    limit,
    orgId,
  ) => {
    //获取列表
    dispatch({
      type: 'projectRefinement/getBudPreProjectList',
      payload: {
        budgetStage: budgetStage,
        searchWord,
        parentId: currentNode.nodeId || '',
        treeType: currentNode.treeType || '',
        orgId: orgId ? orgId : currentOrgNode.id,
        usedYear: usedYear,
        start,
        limit,
      },
    });
  };
  //项目（下）
  const downRender = () => {
    return (
      <BudgetPreparation
        isShowSearch={true}
        getData={(currentNode) => {
          projectForm.resetFields();
          getBudPreProjectList('', currentNode, 0, limit);
        }}
        plst={'请输入项目信息查询'}
        treeData={projectTree}
        currentOrgNode={currentOrgNode}
        usedYear={usedYear}
        currentNode={currentNode}
        budgetStage={budgetStage}
      />
    );
  };
  const leftChildrenRender = () => {
    if (otherBudgetStages.includes(budgetStage)) {
      return <>{onRender()}</>;
    } else {
      return (
        <ReSizeOnDown
          hOnNumLimit={100}
          hDownNumLimit={100}
          onRender={onRender()}
          downRender={downRender()}
          hNum={200}
        />
      );
    }
  };
  const rightChildrenRender = () => {
    return <List projectForm={projectForm} budgetStage={budgetStage} />;
  };
  return (
    <div className={styles.pro_refi_warp} id="projectRefinement">
      <ReSizeLeftRight
        paddingNum={0}
        leftChildren={leftChildrenRender()}
        rightChildren={rightChildrenRender()}
        vLeftNumLimit={220}
        vRigthNumLimit={240}
        vNum={240}
        suffix={'pro_refine'}
      />
    </div>
  );
};
export default connect(({ projectRefinement }) => ({
  projectRefinement,
}))(Index);
