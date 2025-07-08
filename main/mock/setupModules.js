import { setupModules } from './index'
const {
    getBusinessForm
} = setupModules

export default {
    'GET /setup/event/list': {
        code: 200,
        data: {
            returnCount: '20',
            allPage: '2',
            currentPage: '1',
            list: [
                {
                    id: '11111111',
                    eventName: '一二三四五',
                    eventMethod: '阿斯蒂芬',
                    dataDriverId: '333',
                    remark: '阿萨德发撒的',
                    createUserId: '3333333333',
                    createTime: '1111111111111'
                },
                {
                    id: '22222222',
                    eventName: '一二三四',
                    eventMethod: '阿斯蒂芬',
                    dataDriverId: '111',
                    remark: '阿萨德发撒的',
                    createUserId: '3333333333',
                    createTime: '1111111111111'
                }
            ]
        }
    },
    // 根据业务应用类别ID查询业务表单
    'GET /setup/businessForm/:ctlgId': {
        code: 200,
        msg: '',
        data: {
            returnCount: 1,
            allPage: 1,
            currentPage: 1,
            list: [
                getBusinessForm(),
                getBusinessForm(),
                getBusinessForm(),
                getBusinessForm(),
                getBusinessForm(),
            ],
        }
    },
}