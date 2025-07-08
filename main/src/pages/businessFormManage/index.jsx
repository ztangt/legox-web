
import React from 'react';
import BusinessFormManage from './components/businessFormManage';


export default ({location}) => {
    return (
            <div style={{ height: '100%' }} id='businessFormManage_container'>
                <BusinessFormManage location={location} />
            </div>
    );
}
