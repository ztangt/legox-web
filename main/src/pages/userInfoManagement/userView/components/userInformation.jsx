import React,{useState} from 'react';
import { connect } from 'dva';
import styles from './userInformation.less';
import { Row, Col,Spin,Empty } from 'antd';
import { dataFormat } from '../../../../util/util.js'
import { EDUCATION,SEX, DEGREE, IDEN_TYPE, POLITICAL, CUSTOM_TYPE,PERSON_TYPE} from '../../../../service/constant'

function userInformation({loading,imageUrl,signImageUrl,query,parentState}){
    const [imageError, setImageError] = useState(false);
    const [signatureError, setSignatureError] = useState(false);
    const {user,curRecord}=parentState
    const handleImageError = () => {
      setImageError(true);
    };
    const handleSignatureError = () => {
        setSignatureError(true);
      };
    return (
        <div className={styles.wrap}>
           <div className={styles.top}>
               <div className={styles.img}>
                   {imageError ? 
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={<span>图片路径有误</span>} />
                    : <img onError={handleImageError} src={user&&user.picturePath? user.picturePath : require('../../../../../public/assets/signImageUrl.png')}  alt="头像"/>}
                  
                </div>
               <div className={styles.sign}>
                    {signatureError ? 
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={<span>图片路径有误</span>} />
                    :user&&user.signaturePath ? <img onError={handleSignatureError} src={user.signaturePath}  alt="签名"/> : <div style={{lineHeight:'100px',textAlign:'center'}}>未上传签名</div>}
                   {/* {user&&user.signaturePath ? <img src={user.signaturePath}  alt="签名"/> : <div style={{lineHeight:'100px',textAlign:'center'}}>未上传签名</div>} */}
                </div>
           </div>
           <div className={styles.userInformation}>
               <p>基础信息</p>
               {
                   user?<Spin spinning={loading.global} >
                   <Row>
                       <Col span={8}><span className={styles.color666}>所属单位：</span><span>{user.orgName}</span></Col>
                       <Col span={8}><span className={styles.color666}>所属部门：</span><span>{user.deptName}</span></Col>
                       <Col span={8}><span className={styles.color666}>登录账号：</span><span>{user.userAccount}</span></Col>
                   </Row>
                   <Row>
                       <Col span={8}><span className={styles.color666}>姓名：</span><span>{user.userName}</span></Col>
                       <Col span={8}><span className={styles.color666}>性别：</span><span>{SEX[user.sex]}</span></Col>
                       <Col span={8}><span className={styles.color666}>所属岗位：</span><span>{user.postName}</span></Col>
                   </Row>
                   <Row>
                       <Col span={8}><span className={styles.color666}>姓名简称：</span><span>{user.userShortName}</span></Col>
                       {/* <Col span={8}><span className={styles.color666}>账号状态：</span><span>{user.isEnable==1?'是':'否'}</span></Col> */}
                       <Col span={8}><span className={styles.color666}>启动移动端登录：</span><span>{user.isAppEnable==1?'是':'否'}</span></Col>
                   </Row>
                   <Row>
                       <Col span={8}><span className={styles.color666}>用户类型：</span><span>{CUSTOM_TYPE[user.customType]}</span></Col>
                       <Col span={8}><span className={styles.color666}>出生日期：</span><span>{user.birthday&&user.birthday.format('YYYY-MM-DD')}</span></Col>
                   </Row> 
              </Spin>:''
               }
               <p>拓展信息</p>
               {
                   user? <Spin spinning={loading.global} >
                            <Row>
                                <Col span={8}><span className={styles.color666}>证件类型：</span><span>{IDEN_TYPE[user.idenType]}</span></Col>
                                <Col span={8}><span className={styles.color666}>证件号码：</span><span>{user.idenNumber}</span></Col>
                                <Col span={8}><span className={styles.color666}>学历：</span><span>{EDUCATION[user.education]}</span></Col>
                            </Row>
                            <Row>
                                <Col span={8}><span className={styles.color666}>学位：</span><span>{DEGREE[user.degree]}</span></Col>
                                <Col span={8}><span className={styles.color666}>政治面貌：</span><span>{POLITICAL[user.political]}</span></Col>
                                <Col span={8}><span className={styles.color666}>电子邮箱：</span><span>{user.email}</span></Col>
                            </Row>
                            <Row>
                                <Col span={8}><span className={styles.color666}>手机号：</span><span>{user.phone}</span></Col>
                                <Col span={8}><span className={styles.color666}>籍贯：</span><span>{user.address}</span></Col>
                                <Col span={8}><span className={styles.color666}>入党时间：</span><span>{user.joinTime&&user.joinTime.format('YYYY-MM-DD')}</span></Col>
                            </Row>
                            <Row>
                                <Col span={8}><span className={styles.color666}>人员类型：</span><span>{PERSON_TYPE[user.personType]}</span></Col>
                                <Col span={8}><span className={styles.color666}>参加工作时间：</span><span>{user.workTime&&user.workTime.format('YYYY-MM-DD')}</span></Col>
                                <Col span={8}><span className={styles.color666}>工资卡信息：</span><span>{user.salaryCard}</span></Col>
                            </Row>
                            <Row>
                                <Col span={8}><span className={styles.color666}>公务卡信息：</span><span>{user.officialCard}</span></Col>
                                <Col span={8}><span className={styles.color666}>工龄：</span><span>{user.workYears}</span></Col>
                                <Col span={8}><span className={styles.color666}>调入时间：</span><span>{user.entryTime&&user.entryTime.format('YYYY-MM-DD')}</span></Col>
                            </Row>
                            <Row>
                                <Col span={8}><span className={styles.color666}>清除mac地址：</span><span>{user.clearMacAddress}</span></Col>
                                <Col span={8}><span className={styles.color666}>座机号码：</span><span>{user.telephone}</span></Col>
                            </Row>
                       </Spin>
                   :''}
           </div>
        </div>
    )
}



export default connect(({userView,loading})=>({
    ...userView,
    loading
  }))(userInformation);