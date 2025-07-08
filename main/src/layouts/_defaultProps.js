import React from 'react';
import {
  SmileOutlined,
  CrownOutlined,
  TabletOutlined,
  CodepenOutlined,
  HomeOutlined,
} from '@ant-design/icons';

export default [
  {
    name: '组织与权限',
    icon: <SmileOutlined />,
    routes: [
      {
        name: '单位信息管理',
        path: '/unitInfoManagement',
      },
      {
        name: '部门信息管理',
        path: '/deptMg',
      },
      {
        name: '岗位信息管理',
        path: '/postMg',
      },
      {
        name: '用户组信息管理',
        path: '/userGroupMg',
      },
      {
        name: '用户信息管理',
        path: '/userInfoManagement',
      },
      {
        name: '系统角色',
        path: '/sysRole',
      },
      {
        name: '全局角色',
        path: '/allRole',
      },
      {
        name: '单位角色',
        path: '/unitRole',
      },
    ],
  },
  {
    name: '应用建模',
    icon: <CodepenOutlined />,
    routes: [
      {
        name: '表单引擎',
        path: '/formEngine',
      },
      {
        name: '流程引擎',
        path: '/workflowEngine',
      },
      {
        name: '业务应用类别',
        path: '/businessUseSort',
      },
      {
        name: '业务表单管理',
        path: '/businessFormManage',
      },
      {
        name: '应用数据建模',
        path: '/useDataBuildModel',
      },
      {
        name: '数据规则定义',
        path: '/dataRuleMg',
      },
      {
        name: '模块资源管理',
        path: '/moduleResourceMg',
      },
      {
        name: '按钮管理',
        icon: <HomeOutlined />,
        routes: [
          {
            name: '按钮库',
            path: '/buttonLibrary',
          },
          {
            name: '按钮方案',
            path: '/buttonSolution',
          },
        ],
      },
      {
        name: '基础数据码表',
        path: '/basicDataForm',
      },
      {
        name: '业务应用建模',
        path: '/applyModel',
      },
      {
        name: '列表建模',
        path: '/listMoudles',
      },
      {
        name: '数据驱动',
        path: '/dataDriven',
      },
    ],
  },
  {
    name: '服务中心',
    icon: <HomeOutlined />,
    routes: [
      {
        name: '系统配置',
        path: '/systemLayout',
      },
      {
        name: '租户配置',
        path: '/tenantSettings',
      },
    ],
  },
  {
    name: '系统配置',
    icon: <HomeOutlined />,
    routes: [
      {
        name: '手写签批样式管理',
        path: '/writeSignStyle',
      },
      {
        name: '密码管理',
        path: '/passwordMg',
      },
      {
        name: '插件管理',
        path: '/pluginManage',
      },
      {
        name: '节假日维护',
        path: '/holidaysManage',
      },
      {
        name: '全局审核人',
        path: '/globalReviewer',
      },
    ],
  },
  {
    name: '业务建模',
    icon: <HomeOutlined />,
    routes: [
      {
        name: '平台编码规则',
        path: '/platformCodeRules',
      },
      {
        name: '事件注册器',
        path: '/eventRegister',
      },
    ],
  },
  {
    name: '应用配置',
    icon: <HomeOutlined />,
    routes: [
      {
        name: '入口配置',
        path: '/entranceConfig',
      },
      {
        name: '图标配置',
        path: '/iconConfig',
      },
    ],
  },
];
