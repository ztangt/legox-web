import styles from '../index.less';
import {  connect } from 'umi';
import '../index.less';
import {
  Popup,
  Button
} from 'antd-mobile/es';
import { USER_SCREEN_TYPE } from '../../../../service/constant';
function Index({ dispatch, location, groupData,loading,valueGroup,setValueGroup,screenVisible,setScreenVisible,itemKey,setItemKey,itemValue,setItemValue,getUserList }) {
  //点击搜索项
  const onNode = (item, key) => {
    if (!item) {
      var type = ''
      if(groupData?.['ORG'].length!=0){
        type = 'ORG'
      }else if(groupData?.['ROLE'].length!=0){
        type = 'ROLE'
      }else if(groupData?.['CUSTOM'].length!=0){
        type = 'CUSTOM'
      }
      //重置 初始化查询条件
      setValueGroup(groupData?.[type]?.[0]?.key);
      setItemValue(groupData?.[type]?.[0]);
      setItemKey(type);
      getUserList(groupData?.[type]?.[0], type, 1);
    } else {
      setValueGroup(item.key);
      setItemValue(item);
      setItemKey(key);
    }
  };


  //右侧筛选项
  const returnScreen = () => {
    return (
      <>
        {Object.keys(USER_SCREEN_TYPE).map((key) => {
          const element = groupData[key];
          if (!element||element?.length == 0) {
            return;
          }
          return (
            <div className={styles.screen_container_list} key={key}>
              <h1 className={styles.screen_title}> {USER_SCREEN_TYPE[key]}</h1>
              {element.length != 0 && (
                <ul className={styles.screen_list}>
                  {element.length &&
                    element?.map((item, index) => (
                      <li
                        key={item.key}
                        onClick={onNode.bind(this, item, key)}
                        className={
                          styles[
                          item.key == valueGroup
                            ? 'screen_item_checked'
                            : 'screen_item'
                          ]
                        }
                      >
                        {item.nodeName}
                      </li>
                    ))}
                </ul>
              )}
            </div>
          );
        })}
      </>
    );
  };

  return (
    <Popup
    position="right"
    visible={screenVisible}
    bodyStyle={{ width: '80%' }}
    onMaskClick={() => {
      setScreenVisible(false)
    }}
  >
    <div className={styles.screen_container}>{returnScreen()}</div>
    <div className={styles.screen_footer}>
      <Button
        onClick={() => {
          onNode();
        }}
      >
        重置
      </Button>
      <Button
        onClick={() => {
          getUserList(itemValue, itemKey, 1);
        }}
        type="primary"
      >
        确定
      </Button>
    </div>
  </Popup>
  );
}
export default Index;
