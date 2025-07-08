import { Col, Row } from 'antd';
import { connect } from 'dva';
import styles from '../index.less';
//个人信息首页
const Index = ({ personSalaryBreakdown }) => {
    const { userInfo } = personSalaryBreakdown;

    let list = [
        { title: '职员名称', content: userInfo.userName },
        { title: '所属单位', content: userInfo.orgName },
        { title: '默认工资卡号', content: userInfo.bankAcc },
        { title: '身份证号', content: userInfo.idCard },
    ];
    //分解人员信息列表
    return (
        <div className={styles.boxShadowBox}>
            <Row className={'pl20 pr20 pt10 pb10'}>
                {list.map((item, index) => {
                    return (
                        <Col span={12} key={index} className={'flex mb10'}>
                            <div className={'mr10 te width_25'}>{item.title}：</div>
                            <div className={'gPrimary fb flex_1'}>{item.content}</div>
                        </Col>
                    );
                })}
            </Row>
        </div>
    );
};
export default connect(({ personSalaryBreakdown }) => ({ personSalaryBreakdown }))(Index);
