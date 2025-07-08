import { Empty, Tabs } from 'antd';
import axios from 'axios';
import { connect } from 'dva';
import qs from 'qs';
import { useEffect, useState } from 'react';
import BasicDataTree from '../../../components/BasicDataTree';
import styles from '../index.less';
import { tabUrlList } from './config';
import SearchCom from './searchCom';

const Index = ({ dispatch, dataEntryPayBudget }) => {
    const [iframeUrl, setIframeUrl] = useState('');
    const [baseUrl, setBaseUrl] = useState('');
    const [tabList, setTabList] = useState(tabUrlList);

    const [token, setToken] = useState('');

    useEffect(() => {
        // let origin = 'http://10.20.105.69:8080';
        // let fine_auth_token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInRlbmFudElkIjoiZGVmYXVsdCIsImlzcyI6ImZhbnJ1YW4iLCJkZXNjcmlwdGlvbiI6ImFkbWluKGFkbWluKSIsImV4cCI6MTcyNzE2MzU1OCwiaWF0IjoxNzI1OTUzOTU4LCJqdGkiOiJ5aTNhNmtQbUlVbThhVWZFcDBTKzdPdGJUc1hKRlVZVkEzS3lYenBZOEFaODNLb2EifQ.n3rsA-vjk2-ZWmEhX38FziRDua3odzniklQ3Ef0bWkc'

        // 获取fine_auth_token
        let origin = window.location.origin;
        let url = `${origin}/webroot/decision/login/cross/domain?fine_username=admin&fine_password=tladmin*78902022&validity=-2&callback=`;
        axios.get(url, {}).then(function (res) {
            let str = res.data;
            let newStr = str.replace(/^callback\((.*)\)$/, '$1');
            const obj = JSON.parse(newStr);

            let fine_auth_token = obj.accessToken;
            setToken(fine_auth_token);

            let newTabList = tabUrlList.map((item) => ({
                ...item,
                key: `${item.key}&fine_auth_token=${fine_auth_token}`,
            }));
            setTabList(newTabList);
            setBaseUrl(newTabList[0].key);
            getPage(newTabList[0].key);
        });
    }, []);
    const getPage = (paramsUrl) => {
        dispatch({
            type: 'dataEntryPayBudget/getState',
            callback: ({ formInfo }) => {
                //传过来url参数就取传过来的，没传就取现在的
                let newUrl = paramsUrl
                    ? `${paramsUrl}&${qs.stringify(formInfo)}`
                    : `${baseUrl}&${qs.stringify(formInfo)}`;
                setIframeUrl(newUrl);
                console.log(newUrl, '-->最后的url');
            },
        });
    };
    const changeTab = (key) => {
        setBaseUrl(key);
        getPage(key);
    };

    //选中左侧单位
    const getSelectBaseTree = (selectId, selectInfo) => {
        let { orgId, ...others } = dataEntryPayBudget.formInfo;
        const { json } = selectInfo;
        let resJson = JSON.parse(json || '{}');
        dispatch({
            type: 'dataEntryPayBudget/updateStates',
            payload: {
                formInfo: selectId ? { ...others, orgId: resJson?.OBJ_CODE } : others,
            },
        });
        getPage();
    };

    //选中左侧项目类别
    const getSelectBaseTreeBot = (selectId, selectInfo) => {
        let { projectCategoryCode, ...others } = dataEntryPayBudget.formInfo;
        const { json } = selectInfo;
        let resJson = JSON.parse(json);
        dispatch({
            type: 'dataEntryPayBudget/updateStates',
            payload: {
                formInfo: selectId ? { ...others, projectCategoryCode: resJson.OBJ_CODE } : others,
            },
        });
        getPage();
    };

    return (
        <div className={'flex pl8 pr8 pt8'}>
            <div
                style={{ height: '100%', width: '300px' }}
                className={`flex flex_direction_column mr10 ${styles.tree_content}`}
            >
                <div className={`height_100 mb10 width_100`}>
                    <BasicDataTree
                        title={'单位名称'}
                        year={dataEntryPayBudget.formInfo.year}
                        logicCode={'FT_CMA_900050'}
                        getSelectTree={getSelectBaseTree}
                        innerHeight={'calc(100% - 65px)'}
                    />
                </div>
                {/* <div className={`${styles.leftBottom}   width_100`}>
                    <BasicDataTree
                        title={'项目类别'}
                        year={dataEntryPayBudget.formInfo.year}
                        logicCode={'CMA_900005'}
                        getSelectTree={getSelectBaseTreeBot}
                        innerHeight={'calc(100% - 65px)'}
                    />
                </div> */}
            </div>

            <div className={'flex_1'} style={{ overflowX: 'auto' }}>
                <SearchCom getPage={getPage} />
                <Tabs defaultActiveKey="1" items={tabList} onChange={changeTab} />
                <div style={{ height: 'calc(100vh - 280px)' }}>
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

export default connect(({ dataEntryPayBudget }) => ({ dataEntryPayBudget }))(Index);
