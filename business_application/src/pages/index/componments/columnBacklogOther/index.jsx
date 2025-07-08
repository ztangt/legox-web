/**
 * @author zhangww
 * @description 栏目-待办事项-其他
 */

import React, { useEffect, useState } from 'react';
import { history } from 'umi';
import { connect } from 'dva';
import WaitMatter from "../../../waitMatter/componments/waitMatter";


function Index({user  }) {

  const [location, setLocation] = useState({pathname:'/waitMatter'});
  const { menus } = user
  useEffect(() => {
    let tmp = menus?.filter(
      (i) => !i.hideInMenu,
    );
    tmp =
      menus?.filter(
        (i) => i.children?.length,
      ) || [];
    let pathname = '/waitMatter';
    for (let i = 0; i < tmp.length; i++) {
      for (let j = 0; j < tmp[i].children.length; j++) {
        const element = tmp[i].children[j];
        if (
          element.path?.indexOf('/waitMatter') > -1 &&
          !element['extraParams']
        ) {
          pathname = element.path;
          break;
        }
      }
    }
    setLocation({pathname})
    // console.log('pathnamepathname',pathname);
  }, []);
  
  return (
    <div>
      <WaitMatter location={location}/>
    </div>
  );
}

export default connect(({ columnBacklogOther, user }) => ({
  columnBacklogOther,
  user
}))(Index);
