import decimal from 'decimal.js';
//加
const add = (arg1, arg2) => {
    if (!arg1 || Number.isNaN(arg1)) {
        arg1 = 0;
    }
    if (!arg2 || Number.isNaN(arg2)) {
        arg2 = 0;
    }

    // console.log(arg1, arg2, '----->');
    // console.log(decimal(arg1).add(decimal(arg2)).toNumber(), '----->111');
    return decimal(arg1).add(decimal(arg2)).toNumber();
};
//减
const sub = (arg1, arg2) => {
    if (!arg1 || Number.isNaN(arg1)) {
        arg1 = 0;
    }
    if (!arg2 || Number.isNaN(arg2)) {
        arg2 = 0;
    }

    return decimal(arg1).sub(decimal(arg2)).toNumber();
};
//乘
const mul = (arg1, arg2) => {
    if (!arg1 || Number.isNaN(arg1)) {
        arg1 = 0;
    }
    if (!arg2 || Number.isNaN(arg2)) {
        arg2 = 0;
    }

    return decimal(arg1).mul(decimal(arg2)).toNumber();
};
//除
const div = (arg1, arg2) => {
    if (!arg1 || Number.isNaN(arg1)) {
        arg1 = 0;
    }
    if (!arg2 || Number.isNaN(arg2)) {
        arg2 = 0;
    }

    return decimal(arg1).div(decimal(arg2)).toNumber();
};

export default { add, sub, mul, div };
