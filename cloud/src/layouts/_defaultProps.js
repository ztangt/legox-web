import {UpCircleOutlined,SafetyCertificateOutlined,AppstoreOutlined} from '@ant-design/icons'
export default[
    {
      name: '首页',
      icon: <UpCircleOutlined/>,
      path: '/',
      routes: []
    },
    {
      name: '租户管理',
      icon: <SafetyCertificateOutlined/>,
      path: '/tenement',
      routes: []
    },
    {
      name: '组织中心',
      icon: <AppstoreOutlined/>,
      path: '/organization',
      routes: []
    },
    {
      name: '用户中心',
      icon: <UpCircleOutlined/>,
      path: '/userMg',
      routes: []
    },
    {
      name: '模型管理',
      icon: <SafetyCertificateOutlined/>,
      path: '/manageModel',
      routes: []
    },
    {
      name: '下发任务',
      icon: <AppstoreOutlined/>,
      path: '/sendTask',
      routes: []
    },
  ]

