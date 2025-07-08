export const checkConfig = {
  checkType: [
    {
      id: -1,
      name: '全部',
    },
    {
      id: 1,
      name: '现金',
    },
    {
      id: 2,
      name: '转账',
    },
  ],
  voidStatus: [
    {
      id: -1,
      name: '全部',
    },
    {
      id: 0,
      name: '否',
    },
    {
      id: 1,
      name: '是',
    },
  ],
  provide: {
    checkStatus: [
      {
        id: -1,
        name: '全部',
      },
      {
        id: 1,
        name: '已入库未领用',
      },
      {
        id: 2,
        name: '已领用未使用',
      },
    ],
  },
  cashier: {
    checkStatus: [
      {
        id: -1,
        name: '全部',
      },
      {
        id: 1,
        name: '已入库未领用',
      },
      {
        id: 2,
        name: '已领用未使用',
      },
      {
        id: 3,
        name: '已使用',
      },
      {
        id: 4,
        name: '已作废',
      },
    ],
  },
  check: {
    checkStatus: [
      {
        id: -1,
        name: '全部',
      },
      {
        id: 1,
        name: '已入库未领用',
      },
      {
        id: 2,
        name: ':已领用未使用',
      },
      {
        id: 3,
        name: '已使用',
      },
      {
        id: 4,
        name: '已作废',
      },
    ],
  },
  pageType: {
    provide: 0,
    cashier: 2,
    check: 1,
  },
};
