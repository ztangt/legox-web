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
export const baseUrl = `${origin}/webroot/decision/v10/entry/access/68460747-703e-4a28-8a72-d89a78c81552?preview=true`;
