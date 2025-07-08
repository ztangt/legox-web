//表格的属性（rowKey为复选框需要的唯一值）
export const tabelProps = {
  columns: [
    {
      title: '编码',
      dataIndex: 'OBJ_CODE',
    },
    {
      title: '名称',
      dataIndex: 'OBJ_NAME',
    },
  ],
  rowKey: 'OBJ_CODE',
};
//高级搜索配置
export const advancedSearch = [
  {
    searchParam: 'year',
    searchType: 'select',
    url: 'sys/dictType/ZJLY?showType=ALL&searchWord=&isTree=1',
    name: '年度',
    ismultiple: true,
    fieldNames: { value: 'dictInfoCode', label: 'dictInfoName' },
  },
  {
    searchParam: 'name',
    searchType: 'input',
    name: '名称',
  },
  {
    searchParam: 'name1',
    searchType: 'input',
    name: '名称1',
  },
  {
    searchParam: 'name2',
    searchType: 'date',
    name: '日期',
    showTime: false, //是否显示时间
    format: 'YYYY-MM-DD',
  },
  {
    searchParam: 'org',
    searchType: 'select',
    url: '',
    name: '单位',
    ismultiple: true,
    //"fieldNames":{value:'dictInfoCode',label:'dictInfoName'},
    option: [
      { value: 'jack', label: 'Jack' },
      { value: 'lucy', label: 'Lucy' },
      { value: 'Yiminghe', label: 'yiminghe' },
      { value: 'disabled', label: 'Disabled', disabled: true },
    ],
  },
];
//自定义按钮，name为按钮名称，click为按钮事件，title是提示信息
export const headerButtons = [
  {
    name: '修改',
    click: () => {
      alert('1111');
    },
    title: '提示信息',
  },
  {
    name: '修改',
    click: () => {
      alert('1111');
    },
    title: '提示信息',
  },
  {
    name: '修改',
    click: () => {
      alert('1111');
    },
    title: '提示信息',
  },
];
//isParent包含子节点的时候。增加children
export const loopDataSource = (data) => {
  data &&
    data.map((item, index) => {
      if (item.isParent == 1) {
        //如果含有子节点增加children
        item.children = [
          {
            key: '1-1',
          },
        ];
      }
    });
  return data;
};
//获取表格数据（params为搜索的参数）
export const getDataSource = (start, limit, params, setDataSource) => {
  debugger;
  // let searchObj = {
  //   bizSolId: location.query.bizSolId,
  //   ...params,
  //   start,
  //   limit,
  // };
  fetch(
    `${window.localStorage.getItem(
      'env',
    )}/ic/budgetProject/tree?start=1&limit=10&searchWord=&bizSolId=1572148138712526850&parentCode=0&usedYear=2023&option=and%20IS_ENABLE_TLDT_%3D1`,
    {
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + window.localStorage.getItem('userToken'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  ).then((response) => {
    response.json().then((returnData) => {
      if (returnData.code == 200) {
        let tmpList = loopDataSource(returnData.data?.list || []);
        let tmpData = { ...returnData.data, list: tmpList };
        setDataSource(returnData.data);
      } else {
        message.error(returnData.msg);
      }
    });
  });
};
export const onExpand = (expanded, record, callback) => {
  fetch(
    `${window.localStorage.getItem(
      'env',
    )}/ic/budgetProject/tree?start=1&limit=1000&searchWord=&bizSolId=1572148138712526850&parentCode=01&usedYear=2023&option=and%20IS_ENABLE_TLDT_=1`,
    {
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + window.localStorage.getItem('userToken'),
      },
    },
  ).then((response) => {
    response.json().then((data) => {
      callback(data.data.list);
    });
  });
};
//确认按钮的操作
export const onOk = (selectedRows, setIsTableModal) => {
  alert(1111111);
  setIsTableModal(false);
};
