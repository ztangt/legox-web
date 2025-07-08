import { getMaxDataRuleCode, getMenuId } from '@/util/util';
import axios from 'axios';
import dayjs from 'dayjs';
import { connect } from 'dva';
import qs from 'qs';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const Index = ({ dispatch }) => {
    useEffect(() => {
        const handleMessage = (event) => {
            // 在这里处理来自iframe的消息
            // event.data包含了从iframe传递过来的数据
            let { data, type } = event.data;
            if (
                type === 'LINK_CUSTOM_MESSAGE_TYPE' &&
                data.bizId &&
                data.solId &&
                data.mainTableId &&
                data.documentNumber
            ) {
                debugger;
                historyPush({
                    pathname: `/dynamicPage/formShow`,
                    query: {
                        bizInfoId: data.bizId,
                        bizSolId: data.solId,
                        id: data.mainTableId,
                        currentTab: dayjs().valueOf(),
                        maxDataruleCode: '',
                        title: data.documentNumber,
                    },
                });
            }
        };
        // 添加事件监听器
        window.addEventListener('message', handleMessage);
        // 在组件卸载时移除事件监听器
        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []); // 空依赖数组确保只在组件挂载时添加监听器一次

    function removeHashSymbols(str) {
        return str.replace(/#/g, '');
    }

    function getUrlParameters() {
        const result = removeHashSymbols(window.location.href);
        const parsedUrl = new URL(result);
        return Object.fromEntries(parsedUrl.searchParams.entries());
    }

    //有urlQK的情况为弹窗组件  没有urlQK为路由独立页面
    const { location, urlQK } = useModel('@@qiankunStateFromMaster');
    const [refUrl, setRefUrl] = useState('');

    useEffect(async () => {
        let token = 'Bearer ' + localStorage.getItem('userToken');
        let userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : {};
        let userId;
        let identityId;
        let orgId;
        let deptId;
        if (userInfo) {
            userId = userInfo.userId;
            identityId = userInfo.identityId;
            orgId = userInfo.orgId;
            deptId = userInfo.deptId;
        }
        // let origin = 'http://152.136.18.219:8088';
        let origin = window.location.origin;
        const { url: allUrl, bizSolId, listId } = location?.query ? location?.query : getUrlParameters();
        let { to: refUrl } = urlQK ? qs.parse(urlQK?.split('?')[1]) : qs.parse(allUrl?.split('?')[1]);

        //添加menuId
        // let menuIdKeyValArr = JSON.parse(localStorage.getItem('menuIdKeyValArr'));
        // let menuId = menuIdKeyValArr[`${bizSolId || allUrl}-${listId || 0}`];

        let menuId = getMenuId();
        let dataRuleCode = getMaxDataRuleCode();
        console.log(dataRuleCode, '---->积目新获取的dataRuleCode');
        console.log('menuId', menuId, '------>积目新获取的menuId');
        let fine_auth_token;

        if (refUrl.indexOf('webroot') !== -1) {
            //获取fine_auth_token
            let url = `${origin}/webroot/decision/login/cross/domain?fine_username=admin&fine_password=tladmin*78902022&validity=-2&callback=`;
            axios.get(url, {}).then(function (res) {
                console.log(res.data);

                let str = res.data;
                let newStr = str.replace(/^callback\((.*)\)$/, '$1');
                const obj = JSON.parse(newStr);
                fine_auth_token = obj.accessToken;

                //如果有manageOrg=true这个值，就需要获取manageOrg的值
                if (refUrl.includes('manageOrg=true')) {
                    let newRefUrl = refUrl.split('?')[0];
                    let manageOrg = '';
                    dispatch({
                        type: 'jimu/getManageOrgList',
                        payload: { headers: { menuId } },
                        callback: (list) => {
                            manageOrg = list.map((item) => item.orgId).join(',');
                            let lastUrl = `${origin}${newRefUrl}?token=${token}&menuId=${menuId}&userId=${userId}&identityId=${identityId}&orgId=${orgId}&fine_auth_token=${fine_auth_token}&manageOrg=${manageOrg}&dataRuleCode=${dataRuleCode}&deptId=${deptId}`;
                            console.log(lastUrl, '---->lastUrl', 111);
                            setRefUrl(lastUrl);
                        },
                    });
                } else {
                    let lastUrl = `${origin}${refUrl}?token=${token}&menuId=${menuId}&userId=${userId}&identityId=${identityId}&orgId=${orgId}&fine_auth_token=${fine_auth_token}&dataRuleCode=${dataRuleCode}&deptId=${deptId}`;
                    console.log(lastUrl, '---->lastUrl', 222);
                    setRefUrl(lastUrl);
                }
            });
        } else {
            // let lastUrl = `${origin}${refUrl}?token=${token}&menuId=${menuId}&userId=${userId}&identityId=${identityId}&orgId=${orgId}&dataRuleCode=${dataRuleCode}&deptId=${deptId}`;
            let { to, ...others } = urlQK ? qs.parse(urlQK?.split('?')[1]) : qs.parse(allUrl?.split('?')[1]);
            let queryObj = {
                ...others,
                token: token,
                menuId: menuId,
                userId: userId,
                identityId: identityId,
                orgId: orgId,
                dataRuleCode: dataRuleCode,
                deptId: deptId,
            };
            console.log(others, '---->others', 444);
            console.log(queryObj, '---->queryObj', 444);
            let lastUrl = `${origin}${refUrl}?${qs.stringify(queryObj)}`;
            console.log(lastUrl, '---->lastUrl', 333);
            setRefUrl(lastUrl);
        }
    }, []);

    return (
        <div style={{ height: '100%' }}>
            <iframe id="frame" src={refUrl} title="iframe" width="100%" height="100%"></iframe>
        </div>
    );
};

export default connect(({ jimu }) => ({
    jimu,
}))(Index);
