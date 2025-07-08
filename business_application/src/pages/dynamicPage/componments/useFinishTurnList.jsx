import { useState, useEffect, useMemo } from 'react';

export default function useFinishTurnList({ finishTreeList }) {
  const [treeList, setTreeList] = useState([]);
  const [treeMap, setTreeMap] = useState({});

  const getTreeList = (list) => {
    let treeMap = {};
    const dfs = (list, parendId) => {
      return list.reduce((pre, cur) => {
        let children = dfs(cur.children, cur.id);

        let transformKey = {
          title: `[${cur.obj_CODE}]${cur.obj_NAME}${
            cur.finish_TURN_TLDT_ === '1' ? '(已结转)' : ''
          }`,
          key: cur.id,
          disabled: cur.finish_TURN_TLDT_ === '1',
          isLeaf: !cur.children.length > 0,
          children,
        };

        treeMap[cur.id] = { ...transformKey, parendId };

        pre.push(transformKey);
        return pre;
      }, []);
    };

    let treeList = dfs(list, '');
    return { treeMap, treeList };
  };

  const getParentId = (checkedKeys) => {
    return checkedKeys.reduce((pre, cur) => {
      let parendId = cur != 1 ? treeMap[cur]?.parendId : '';

      if (parendId && parendId != '') {
        pre.push(parendId);
      } else {
        pre.push(cur);
        return pre;
      }

      return [...pre, cur, ...getParentId([parendId])];
    }, []);
  };

  useEffect(() => {
    if (finishTreeList && finishTreeList.length > 0) {
      let { treeMap, treeList } = getTreeList(finishTreeList);

      treeList.unshift({
        key: '1',
        title: '全选',
        disabled: false,
        isLeaf: true,
        children: [],
      });

      setTreeMap(treeMap);
      setTreeList(treeList);
    }
  }, [finishTreeList]);

  return { treeList, treeMap, getParentId };
}
