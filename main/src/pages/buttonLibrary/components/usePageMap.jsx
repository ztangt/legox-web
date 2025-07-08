import { useState, useEffect } from 'react';

export default function usePageMap({ list, page = 1, limit = 10 }) {
  const [listMap, setListMap] = useState({});
  // 切片
  const getButtonListMap = list => {
    try {
      let step = 1;
      return list.reduce((pre, cur, index) => {
        if (pre[step] && pre[step].length < limit) {
          pre[step].push(cur);
        } else {
          pre[step] = [cur];
        }

        if (pre[step].length === limit) {
          step++;
        }

        return pre;
      }, {});
    } catch (e) {
      console.log(e);
    }
  };

  // 返回页数的内容
  const getPageList = page => {
    if (Object.keys(listMap).length > 0) {
      return listMap[Number(page)];
    }
    return list;
  };

  useEffect(() => {
    if (list) {
      let map = getButtonListMap(list);
      setListMap(map);
    }
  }, [list, limit]);

  return { getPageList };
}
