import { formModules } from './index'
const {
    getCodeRuleInfo
} = formModules

export default {
    'GET /form/dataDrives': {
        code: 200,
        data: {
            dataDrivers: [
                {
                    id: '111',
                    planName: '111text',
                },
                {
                    id: '222',
                    planName: '222text',
                },
                {
                    id: '333',
                    planName: '333text',
                },
            ]
        }
    },
    // 编号分类查询 getCodeRule
    "GET /form/codeRule": {
        code: 200,
        msg: '',
        data: {
            codeRules: [
                {
                    codeRuleId: '1111',
                    codeRuleName: '测试111',
                    children: []
                },
                {
                    codeRuleId: '2222',
                    codeRuleName: '测试2222',
                    children: []
                },
            ]
        }
    },
    // 编号规则查询
    "GET /form/codeRuleInfo": {
        code: 200,
        msg: '',
        data: {
            "returnCount": 10,
            "currentPage": 1,
            "allPage": 2,
            list: [
                getCodeRuleInfo(),
                getCodeRuleInfo(),
                getCodeRuleInfo(),
            ]
        }
    },
}