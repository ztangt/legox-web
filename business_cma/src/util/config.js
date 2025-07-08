// 积木配置地址 添加不同环境ip
const ipUrl = process.env.NODE_ENV == 'development' ? 'http://152.136.18.219:8088/' : 'http://10.20.105.51:1111/';

export const config = {
    link: ipUrl + 'jmreport/view/',
};
export const splitParams = (params, symbol = ':') => {
    if (params.includes(symbol)) {
        return {
            param: params.split(symbol)[0],
            param1: params.split(symbol)[1],
        };
    }
};
