import { fetchResource } from '../../../../util/performScript';

export function getBeanList(list) {
  return list.reduce((pre, cur) => {
    const columnList = (cur.resultList || []).reduce((rePre, reCur) => {
      rePre.push({
        formColumnCode: reCur.resultCode,
        formColumnControlCode: reCur.resultControl,
        formColumnId: reCur.id,
        formColumnName: reCur.resultDesc,
      });
      return rePre;
    }, []);

    pre.push({
      formTableName: cur.name,
      formTableId: cur.id,
      formTableCode: cur.code,
      tableScope: 'DATASET',
      isArray: cur.isArray === 1 ? true : false,
      columnList,
    });

    return pre;
  }, []);
}

export function getFromColumnsToMap(list) {
  const fromMap = {};

  const fromList = list.reduce((pre, cur) => {
    fromMap[cur.formTableId] = cur;

    const children = (cur.columnList || []).reduce((chPre, chCur) => {
      if (chCur.formColumnControlCode != 'ANNEX') {
        fromMap[chCur.formColumnId] = { ...chCur, parent: cur };

        chPre.push({
          title: chCur.formColumnName,
          key: chCur.formColumnId,
          isLeaf: true,
        });
      }

      return chPre;
    }, []);

    pre.push({
      formTableCode: cur.formTableCode,
      title: cur.formTableName,
      key: cur.formTableId,
      tableScope: cur.tableScope,
      isArray: cur?.isArray ? true : false,
      children,
    });

    return pre;
  }, []);

  return { fromMap, fromList };
}

export function getFromCodeEntries(list) {
  let fromCodeMap = new Map();

  list.forEach(item => {
    console.log('item', item);
    if (
      item.tableScope === 'SUB' ||
      (item.tableScope === 'DATASET' && item.isArray)
    ) {
      (item.columnList || []).forEach(chItem => {
        fromCodeMap.set(chItem.formColumnCode, item.formTableCode);
      });
    }
  });
  console.log('item', fromCodeMap);
  return fromCodeMap;
}

// 遍历DOM,过滤空值
export async function filterDOM(templateFullPath) {
  let HTMLStr = await fetchResource(templateFullPath);

  let parser = new DOMParser();
  let dom = parser.parseFromString(HTMLStr, 'text/html');
  // let titleStyle = '';

  // for (let elm of dom.getElementsByTagName('*')) {
  //   if (elm.localName === 'h1') {
  //     titleStyle = elm.style.textAlign;
  //   }
  // }

  return dom.getElementsByTagName('*')[0].outerHTML;
}

export function getCodeType(selectData) {
  let code = '';
  let type = '';

  if (
    selectData.includes('#dateFormat(') ||
    selectData.includes('#moneyFormat(') ||
    selectData.includes('#signature(')
  ) {
    if (selectData.includes('#moneyFormat(')) {
      type = 'MONEY';
    }
    if (selectData.includes('#dateFormat(')) {
      type = 'DATE';
    }
    if (selectData.includes('#signature(')) {
      type = 'OPINION';
    }
  }

  if (selectData.includes(')')) {
    if (selectData.includes('[0].')) {
      code = selectData.slice(selectData.indexOf('[0].') + 4, -1);
      return { code, type };
    } else if (selectData.includes('$!item.')) {
      code = selectData.slice(selectData.indexOf('$!item.') + 7, -1);
      return { code, type };
    } else if (selectData.includes('$!')) {
      code = selectData.slice(selectData.indexOf('$!') + 2, -1);
      return { code, type };
    }
  } else {
    if (selectData.includes('[0].')) {
      code = selectData.slice(selectData.indexOf('[0].') + 4);
      return { code, type };
    }

    if (selectData.includes('.')) {
      code = selectData.slice(selectData.indexOf('.') + 1);
      return { code, type };
    }

    if (selectData.includes('$!')) {
      code = selectData.slice(selectData.indexOf('$!') + 2);
      return { code, type };
    }
  }

  return { code, type };
}

export const PAGESIZE = {
  A3: {
    paperWidth: 29.7,
    paperHeight: 42,
    topMargin: 2.54,
    bottomMargin: 2.54,
    leftMargin: 3.18,
    rightMargin: 3.18,
  },
  A4: {
    paperWidth: 21,
    paperHeight: 29.7,
    topMargin: 2.54,
    bottomMargin: 2.54,
    leftMargin: 3.18,
    rightMargin: 3.18,
  },
  A5: {
    paperWidth: 14.8,
    paperHeight: 21,
    topMargin: 2.54,
    bottomMargin: 2.54,
    leftMargin: 3.18,
    rightMargin: 3.18,
  },
  A6: {
    paperWidth: 10.5,
    paperHeight: 14.8,
    topMargin: 2.54,
    bottomMargin: 2.54,
    leftMargin: 3.18,
    rightMargin: 3.18,
  },
};
