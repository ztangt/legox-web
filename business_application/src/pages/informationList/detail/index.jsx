/*
 * @Author: gaohy gaohy@suirui.com
 * @Date: 2022-06-09 18:36:46
 * @LastEditors: gaohy gaohy@suirui.com
 * @LastEditTime: 2022-06-12 18:57:25
 * @FilePath: \WPX\business_application\src\pages\informationList\detail\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import React from 'react';
import { history, useOutletContext} from 'umi';
import Detail from "./detail"

export default ({ location }) => {
  const search = history.location.search.includes('?') || !history.location.search ? history.location.search : `?${history.location.search}`;
  return (
      <Detail location={location|| useOutletContext()?.location}></Detail>
  );
};
