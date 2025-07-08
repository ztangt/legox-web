# 前端Readme

## 7.0 开发环境

### 在线工作环境

1. GIT 代码（需要申请账号与权限）

[http://49.232.108.106:12161/](http://49.232.108.106:12161/)

2. SVN 需求文档（需要申请账号与权限）

[https://152.136.204.187/svn/da3v7/Docs](https://152.136.204.187/svn/da3v7/Docs)

3. 禅道(需要申请账号与权限)

[http://81.70.211.99/zentao/](http://81.70.211.99/zentao/)

4. YAPI (使用suirui账号注册，再申请权限)

[http://49.232.108.106:3222/](http://49.232.108.106:3222/)

5. MockPlus 看原型的工具
6. 通讯工具(QQ、微信、瞩目)
7. VPN客户端(见随锐vpn登录文档)（需要申请账号与权限）

### 本地工作环境

1. **git v2.3及以上**
2. 开发工具推荐 VScode
3. 基础环境 Nodejs v14以上
4. 打包编译使用 Yarn 
5. 接口

## 技术栈

| 技术 | 使用 |
| --- | --- |
| 语言 | 优先Typescript，Javascript, CSS |
| 语言标准 | ES6 |
| 开发框架 | react 17.0.0 |
| React应用框架 | umi 3.2.25 |
| 微前端框架 | umi-qiankun 2.24.1 |
| UI框架 | antd 4.20.3 |
| React Hooks 库 | ahooks, useHooks |
| 数据可视化图表库 | echarts 5.0.2 |
| 消息传输框架(长连接) | stomp |
| icon库 | iconfont |
| 表单引擎 | Formily2 |
| 流程设计器 | BpmnJS 9.4.1 |

## 项目代码结构与地址

1. 主要业务项目仓库：http://49.232.108.106:12161/7.0/web/legox-web.git

```bash
#主项目仓库地址： 
./
./business_application                      # 业务前台(子项目)， 包含dynamicPage(建模前台组装)及 其他前台公共功能
./cloud                                     # 云管理平台(子项目)
./login                                     # 登录(qiankun主项目)
./main                                      # 支撑平台(子项目)
./designable                                # 表单设计器(子项目)
                                                                    # 表单设计器仓库地址：http://49.232.108.106:12161/7.0/web/designable.git
./business_controls                         # 内控业务(子项目)
                                                                    # 内控项目仓库地址：http://49.232.108.106:12161/7.0/web/business_controls.git
./output                                    # 打包输出目录, login的编译后文件在此目录
        /child                                # 子项目编译输出目录,子项目按各自文件夹输出编译后文件
                /business_application     
                /business_cma  
                /business_controls 
                /cloud  
                /designable  
                /main
```

1. 运营平台项目仓库：[http://49.232.108.106:12161/7.0/web/tom-web.git](http://49.232.108.106:12161/7.0/web/tom-web.git)