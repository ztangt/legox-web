import React from 'react';
import { SmileOutlined, CrownOutlined, TabletOutlined ,CodepenOutlined,HomeOutlined} from '@ant-design/icons';




export default [
  {
    name: 'MMMMMMMMM',
    icon: <SmileOutlined />,
    routes: [],
  },
  {
    name: '工作事项',
    routes: [
      {
        name: '待办事项',
        path: '/waitMatter',
      },
      {
        name: '已办事项',
        path: '/doneWork',
      },
      {
        name:'传阅事项',
        path:'/circulateWork'
      }
    ],
  },
  {
    name: '日程管理',
    routes: [
      {
        name: '日程管理',
        path: '/calendarMg',
      },
    ],
  },
];

