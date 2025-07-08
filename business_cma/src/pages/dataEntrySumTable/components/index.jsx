import { Empty } from 'antd';
import axios from 'axios';
import { connect } from 'dva';
import qs from 'qs';
import { useEffect, useState } from 'react';
import BasicDataTree from '../../../components/BasicDataTree';
import { baseUrl } from './config';
import SearchCom from './searchCom';

const Index = ({ dispatch, dataEntrySumTable }) => {
    const [iframeUrl, setIframeUrl] = useState('');
    const [token, setToken] = useState('');

    useEffect(() => {
        // let origin = 'http://10.20.105.69:8080';
        // let fine_auth_token='eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInRlbmFudElkIjoiZGVmYXVsdCIsImlzcyI6ImZhbnJ1YW4iLCJkZXNjcmlwdGlvbiI6ImFkbWluKGFkbWluKSIsImV4cCI6MTcyNzE2ODgzMSwiaWF0IjoxNzI1OTU5MjMxLCJqdGkiOiJGK2d2NzNRZ0RhNndWaWI1U1B2RjBnekJiZnljb3FpZTd5Mm5qemNqTXA4Sk1zcWMifQ.K-OByFT0STB-AFh63m4GaP2rH9l-BxIwxc16WlzQf_g'
        // 获取fine_auth_token
        let origin = window.location.origin;
        let url = `${origin}/webroot/decision/login/cross/domain?fine_username=admin&fine_password=tladmin*78902022&validity=-2&callback=`;
        axios.get(url, {}).then(function (res) {
            let str = res.data;
            let newStr = str.replace(/^callback\((.*)\)$/, '$1');
            const obj = JSON.parse(newStr);
            let fine_auth_token = obj.accessToken;
            setToken(fine_auth_token);
            const { formInfo } = dataEntrySumTable;
            let newUrl = `${baseUrl}&fine_auth_token=${fine_auth_token}&${qs.stringify(formInfo)}`;
            setIframeUrl(newUrl);
        });
    }, []);

    const getPage = () => {
        dispatch({
            type: 'dataEntrySumTable/getState',
            callback: ({ formInfo }) => {
                let newUrl = `${baseUrl}&${qs.stringify(formInfo)}`;
                console.log(newUrl, '-->最后的url');
                setIframeUrl(newUrl);
            },
        });
    };

    //选中左侧树
    const getSelectBaseTree = (selectId, selectInfo) => {
        let { orgId, ...others } = dataEntrySumTable.formInfo;
        const { json } = selectInfo;
        let resJson = JSON.parse(json);
        dispatch({
            type: 'dataEntrySumTable/updateStates',
            payload: {
                formInfo: selectId ? { ...others, orgId: resJson.OBJ_CODE } : others,
            },
        });
        getPage();
    };
    return (
        <div className={'flex pl8 pr8 pt8'}>
            <div className={`mr10`}>
                <BasicDataTree
                    title={'单位名称'}
                    year={dataEntrySumTable.formInfo.year}
                    logicCode={'FT_CMA_900050'}
                    getSelectTree={getSelectBaseTree}
                />
            </div>
            <div className={'flex_1'} style={{ overflowX: 'auto' }}>
                <SearchCom getPage={getPage} />
                <div style={{ height: 'calc(100vh - 190px)' }}>
                    {token ? (
                        <iframe src={iframeUrl} title="iframe" width="100%" height="100%" />
                    ) : (
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default connect(({ dataEntrySumTable }) => ({ dataEntrySumTable }))(Index);
