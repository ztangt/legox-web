import { Component } from 'react';
import { Outlet } from 'umi';

class BasicLayout extends Component {
    render() {
        return <Outlet />;
    }
}

export default BasicLayout;
