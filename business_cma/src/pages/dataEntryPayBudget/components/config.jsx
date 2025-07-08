const curYear = new Date().getFullYear();
const nextYear = curYear + 1;
const afterYear = curYear + 2;
export const dateList = [
    { label: `${curYear}年`, value: curYear },
    { label: `${nextYear}年`, value: nextYear },
    { label: `${afterYear}年`, value: afterYear },
];

let origin = window.location.origin;
// let origin = 'http://10.20.105.69:8080';
export const tabUrlList = [
    {
        key: `${origin}/webroot/decision/v10/entry/access/9d069f7e-40cc-43ba-89bc-03823c4823f0?preview=true`,
        label: '一般公共预算',
    },
    {
        key: `${origin}/webroot/decision/v10/entry/access/caa70eb6-7c9e-455d-b5f7-f7763b907246?preview=true`,
        label: '“三公”经费支出表',
    },
];
