import { Component } from 'react';
import { Outlet } from 'umi';

class BasicLayout extends Component {
  render() {
    return (
      // <Layout>
      //   <Sider width={200} style={{ minHeight: '100vh', color: 'white' }}>
      //     Sider
      //   </Sider>
      //   <Layout>
      //     <Header
      //       style={{ background: '#fff', textAlign: 'center', padding: 0 }}
      //     >
      //       Header
      //     </Header>
      //     <Content style={{ margin: '24px 16px 0' }}>
      //       <div style={{ padding: 8, background: '#fff', minHeight: '100%' }}>
      //         {this.props.children}
      //       </div>
      //     </Content>
      //     <Footer style={{ textAlign: 'center' }}>
      //       Ant Design ©2018 Created by Ant UED
      //     </Footer>
      //   </Layout>
      // </Layout>
      <Outlet />
    );
  }
}

export default BasicLayout;
