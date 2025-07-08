import moment from 'moment';

// 驼峰转换下划线
export function toLine(name) {
    return name.replace(/([A-Z])/g, '_$1').toLowerCase();
}

export function checkAndReplace(a, b) {
    let found = false;
    for (let i = 0; i < a.length; i++) {
        if (a[i].row === b.row) {
            a[i].fixedVal = !a[i].fixedVal;
            found = true;
            break;
        }
    }
    if (!found) {
        a.push(b);
    }
}

// 时间转化为时间戳
export function timeStamp(timer) {
    return new Date(timer).getTime() / 1000;
}

// 时间戳转化为时间
export function timeStampFormat(time, format) {
    if (!time) {
        return '';
    }
    return format == 'YYYY-MM-DD' || !format
        ? moment(Number(time)).format('YYYY-MM-DD')
        : moment(Number(time)).format('YYYY-MM-DD HH:mm:ss');
}

//47是footer 52是底部分页高度
export const modalCurrentHeight = (id = 'modal_container', head = 'modal_list_head') => {
    console.log(
        'height',
        document.getElementById(id)?.clientHeight,
        'head',
        document.getElementById(head)?.clientHeight,
    );
    return document.getElementById(id)?.clientHeight - document.getElementById(head)?.clientHeight || 0 - 47 - 52 <= 0
        ? 300
        : document.getElementById(id)?.clientHeight - document.getElementById(head)?.clientHeight || 0 - 47 - 52;
};

//100是表格表头高度和底部
export const getModalTableHeight = (id = 'modal_container', head = 'modal_list_head', more) => {
    let moreHeight = more || 102;
    let number =
        (document.getElementById(id)?.clientHeight - document.getElementById(head)?.clientHeight || 0) - moreHeight;
    return number <= 0 ? 300 : number;
};

// 超大功能弹窗计算
export const superModelComputed = () => {
    const width = window.outerWidth;
    const height = window.outerHeight;
    // const height = window.outerHeight < 1008 ? 1008 : window.outerHeight;
    return {
        width,
        height,
    };
};

export function formattingMoney(value) {
    let a = Number(value || 0); //转为数字格式
    let b = a.toLocaleString('zh', {
        style: 'currency',
        currency: 'CNY',
    });
    let c = b.replace('¥', '');
    //解决缺少负号和负号位置不对的问题
    return '¥' + c;
}
export function formattingMoneyEn(value) {
    let a = Number(value || 0); //转为数字格式
    let b = a == 0 ? '0.00' : a.toLocaleString('en-US');
    return b;
}

// 乘
export function accMul(arg1, arg2) {
    let m = 0;
    const s1 = arg1.toString();
    const s2 = arg2.toString();
    m += s1.split('.')[1] ? s1.split('.')[1].length : 0;
    m += s2.split('.')[1] ? s2.split('.')[1].length : 0;
    return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / Math.pow(10, m);
}

/**
 * [formatDate 时间戳格式化为指定日期格式]
 * @param  {[String]} timestamp [时间戳字符串]
 * @param  {[String]} format [转换格式，全格式"YYYY MM DD HH:mm:ss" 缺省则默认"MM-DD HH:mm"]
 * @return {[String]}           [日期格式]
 */
export function dataFormat(timestamp, format) {
    if (!timestamp) {
        return '';
    }
    var day = moment.unix(Number(timestamp));
    var thisFormat = format == undefined ? 'YYYY-MM-DD' : format;
    return day.format(thisFormat).toString();
}

export function toChinese(num) {
    num = Math.floor(num);
    var chinese = '';
    var digits = Math.floor(Math.log10(num)) + 1;
    var digit = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    var times = ['', '十', '百', '千', '万'];
    if (digits >= 9) {
        var quotient = Math.floor(num / Math.pow(10, 8));
        var remainder = num % Math.pow(10, 8);
        var remainderDigits = Math.floor(Math.log10(remainder)) + 1;
        return (
            toChinese(quotient) + '亿' + (remainderDigits < 8 ? '零' : '') + (remainder > 0 ? toChinese(remainder) : '')
        );
    }
    //10000 0000
    if (digits == 1) return digit[num];
    if (digits == 2) {
        var quotient = Math.floor(num / 10);
        var remainder = num % 10;
        if (quotient > 1) {
            chinese = digit[quotient];
        }
        chinese = chinese + times[1];
        if (remainder > 0) {
            chinese = chinese + digit[remainder];
        }
        return chinese;
    }
    if (digits > 5) {
        var quotient = num / Math.pow(10, 4);
        var remainder = num % Math.pow(10, 4);
        var remainderDigits = Math.floor(Math.log10(remainder)) + 1;
        return (
            toChinese(quotient) + '万' + (remainderDigits < 4 ? '零' : '') + (remainder > 0 ? toChinese(remainder) : '')
        );
    }
    for (var index = digits; index >= 1; index--) {
        var number = Math.floor((num / Math.pow(10, index - 1)) % 10);
        //console.log(index+" "+number);
        if (number > 0) {
            chinese = chinese + digit[number] + times[index - 1];
        } else {
            if (index > 1) {
                var nextNumber = Math.floor((num / Math.pow(10, index - 2)) % 10);
                if (nextNumber > 0 && index > 1) {
                    chinese = chinese + digit[number];
                }
            }
        }
    }
    return chinese;
}

/**
 * 中英文数字混合排序
 * @param {*} a
 * @param {*} b
 */
export function arrSortMinToMax(a, b) {
    let cReg =
        /^[\u4E00-\u9FCC\u3400-\u4DB5\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\ud840-\ud868][\udc00-\udfff]|\ud869[\udc00-\uded6\udf00-\udfff]|[\ud86a-\ud86c][\udc00-\udfff]|\ud86d[\udc00-\udf34\udf40-\udfff]|\ud86e[\udc00-\udc1d]/;
    if (!cReg.test(a) || !cReg.test(b)) {
        return a.localeCompare(b);
    } else {
        return a.localeCompare(b, 'zh');
    }
}

//表格排序
export const tableSort = (x, y, showStyle) => {
    x = typeof x == 'undefined' ? '0' : x;
    y = typeof y == 'undefined' ? '0' : y;
    if (typeof x == 'string') {
        if (showStyle == 'MONEY') {
            //兼容后端返回值为空
            let numberX = x ? parseInt(x) : 0;
            let numberY = y ? parseInt(y) : 0;
            return numberX - numberY;
        } else {
            return arrSortMinToMax(x, y);
        }
    } else {
        return x - y;
    }
};

// 过滤掉值为null、undefined或''的元素
export const formatObj = (obj) => {
    return Object.fromEntries(
        Object.entries(obj).filter(([key, value]) => value !== null && value !== '' && value !== undefined),
    );
};
export const getMenus = () => {
    getItem('menus');
    return getItemValue;
};

export function formatSeconds(seconds) {
    if (seconds < 60) {
        return `${seconds}秒`;
    } else {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        if (remainingSeconds === 0) {
            return `${minutes}分`;
        } else {
            return `${minutes}分${remainingSeconds}秒`;
        }
    }
}

export const getLabel = (list, value) => {
    let item = list.find((item) => item.value == value);
    return item ? item.label : '';
};

//获取menuId的新方式
export const getMenuId = () => {
    let menuId = '';
    let activeNode = document.getElementById(`dom_container`)?.getElementsByClassName('ant-tabs-tab-active')?.[0] || '';
    if (activeNode) {
        // console.log(activeNode?.getElementsByClassName('menu_lable')[0], '带menuId的节点');
        menuId = activeNode?.getElementsByClassName('menu_lable')[0]?.getAttribute('menuId') || '';
    }
    return menuId;
};

//获取maxDataruleCode的新方式
export const getMaxDataRuleCode = () => {
    let maxDataruleCode = '';
    let activeNode = document.getElementById(`dom_container`)?.getElementsByClassName('ant-tabs-tab-active')?.[0];
    if (activeNode) {
        // console.log(activeNode?.getElementsByClassName('menu_lable')[0], '带maxDataruleCode的节点');
        maxDataruleCode = activeNode?.getElementsByClassName('menu_lable')[0]?.getAttribute('maxDataruleCode') || '';
        // console.log(maxDataruleCode, '获取到的maxDataruleCode');
    }
    return maxDataruleCode;
};

//部门人员单位岗位去掉GTPU(只去掉第一个)
export function replaceGTPU(item) {
    let element = item;
    if (item.startsWith('G')) {
        //单位
        element = item.slice(1);
    } else if (item.startsWith('T')) {
        //部门
        element = item.slice(1);
    } else if (item.startsWith('P')) {
        //岗位
        element = item.slice(1);
    } else if (item.startsWith('U')) {
        //用户
        element = item.slice(1);
    }
    return element;
}
