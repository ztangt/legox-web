import pinyinUtil from '@/utils/pinyinUtil'
import { dataFormat } from '@/utils/utils'
import { message, Modal } from 'antd'
import _ from 'lodash'
import qs from 'querystring'
import SnowflakeId from 'snowflake-id'
import { v4 as uuidv4 } from 'uuid'
import request from '../service/request'
//表单授权
export function authListFn(
  authList: any,
  subMap: any,
  form: any,
  bizInfo: any,
  location: any,
  isUpdataAuth: boolean
) {
  authList.map((item: any) => {
    let tabelCode = ''
    if (item.tableType == 'SUB') {
      let tabelCodes = Object.keys(subMap).filter(
        (i) => subMap[i] == item.deployFormId
      )
      tabelCode = tabelCodes[0]
      //写这个是应为子表可编辑了，子表里面的控件不应该编辑
      form.setFieldState(`${tabelCode}.*.*`, (state) => {
        state['editable'] = false
      })
    }
    item.columnAuthList.map((columnItem: any) => {
      //路径
      let path = columnItem.formColumnCode //主表
      if (tabelCode) {
        //子表(判断是object还是array)
        form.getFieldState(tabelCode, (state) => {
          if (state.displayName == 'ObjectField') {
            path = `${tabelCode}.${columnItem.formColumnCode}`
          } else {
            path = `${tabelCode}.*.${columnItem.formColumnCode}`
          }
        })
      }
      //formColumnCode,authType
      if (columnItem.formColumnCode == 'OPERATE') {
        //操作列不可编辑包含添加行
        form.setFieldState(tabelCode, (state: any) => {
          if (!window.location.href.includes('mobile')) {
            //移动端出了意见字段都不可编辑
            if (
              Object.keys(bizInfo).length &&
              bizInfo.operation != 'view' &&
              columnItem.authType &&
              columnItem.authType != 'NONE' && //是否可以编辑
              isUpdataAuth &&
              (typeof location?.query?.isBudget == 'undefined' ||
                location?.query?.isBudget != 'Y')
            ) {
              state['editable'] = true
            }
          }
        })
      } else {
        if (
          columnItem.formColumnType == 'PERSONTREE' ||
          columnItem.formColumnType == 'DEPTTREE' ||
          columnItem.formColumnType == 'ORGTREE'
        ) {
          //组织机构树需要增加ID的默认值
          let IDPath = columnItem.formColumnCode.split('NAME_')[0] + 'ID_'
          if (tabelCode) {
            //子表
            // IDPath = `${tabelCode}.*.${IDPath}`;
            // form.addProperty({`${tabelCode}.*`,IDPath})
            if (!window.location.href.includes('mobile')) {
              form.setFieldState(
                `${tabelCode}.*.${columnItem.formColumnCode}`,
                (state) => {
                  columnItem.defaultId &&
                    form.setValuesIn(
                      `${tabelCode}.${state.indexes?.[0]}.${IDPath}`,
                      columnItem.defaultId
                    )
                }
              )
            }
            // var tabelValue = form.values[tabelCode];
            // tabelValue[0][IDPath] = '111111';
            // form.setValues({tabelCode:tabelValue});
          } else {
            if (!window.location.href.includes('mobile')) {
              //移动端不加默认值
              if (!form.getValuesIn(IDPath)) {
                columnItem.defaultId &&
                  form.setValuesIn(IDPath, columnItem.defaultId)
              }
            }
          }
        }
        console.log('path11111====', path)
        form.setFieldState(path, (state) => {
          console.log('path===', path)
          if (window.location.href.includes('mobile')) {
            state.setDecoratorProps({
              labelCol: 6,
              wrapperCol: 18,
            })
          }
          if (
            Object.keys(bizInfo).length &&
            bizInfo.operation != 'view' &&
            columnItem.authType &&
            columnItem.authType != 'NONE' && //是否可以编辑
            isUpdataAuth &&
            (typeof location?.query?.isBudget == 'undefined' ||
              location?.query?.isBudget != 'Y')
          ) {
            if (!window.location.href.includes('mobile')) {
              //移动端出了意见字段都不可编辑
              state['editable'] = true
            } else if (
              window.location.href.includes('mobile') &&
              columnItem.formColumnType == 'OPINION'
            ) {
              state['editable'] = true
            }
          } else {
            if (columnItem.authType == 'NONE') {
              //两个都赋值一下吧，应为不知道什么情况下哪种起作用，暂时没找到原因
              state.authType = columnItem.authType
              state.setComponentProps({
                authType: columnItem.authType,
              })
            }
          }
          if (
            columnItem.formColumnType != 'ANNEX' &&
            !window.location.href.includes('mobile')
          ) {
            //移动端不加默认值
            //附件没有默认值
            //码表的值表单的默认值优先级，需要按照（节点字段权限>全局字段权限>表单配置的默认值）
            if (
              columnItem.formColumnType == 'DICTCODE' &&
              (state['value'] == 'first' ||
                state.componentProps.valueType == 'first') &&
              columnItem.defaultVal
            ) {
              state['value'] = columnItem.defaultVal
            } else {
              if (!state['value']) {
                if (columnItem.formColumnType == 'MONEY') {
                  state['value'] = columnItem.defaultVal
                    ? columnItem.defaultVal
                    : columnItem.formColumnType == 'DATE'
                    ? null
                    : 0 //默认值
                } else {
                  state['value'] = columnItem.defaultVal
                    ? columnItem.defaultVal
                    : columnItem.formColumnType == 'DATE'
                    ? null
                    : '' //默认值
                }
              }
            }
          }
          if (
            window.location.href.includes('mobile') &&
            columnItem.formColumnType == 'OPINION'
          ) {
            state['required'] = false //是否是必填
          } else {
            state['required'] = columnItem.isRequierd == 1 //是否是必填
          }
          if (columnItem.isRequierd == 1) {
            //必填时添加只输入空格检验
            state['validator'] = state['validator']?.concat([
              { whitespace: true },
            ])
          }
        })
      }
    })
  })
}
//编码信息默认数据
export const serialValueFn = (serialInfo: any, form: any) => {
  let value = ''
  if (typeof serialInfo != 'undefined') {
    value = serialInfo.serialNum
    if (serialInfo.needCols) {
      let needCols = serialInfo.needCols.split(',')
      let needColsValue = [] //获取编码字段对应的表单字段默认值的设置
      needCols.map((item) => {
        needColsValue.push({
          code: item,
          value: form.values[item],
        })
      })
      needColsValue.map((item) => {
        value = _.replace(value, item.code, item.value)
      })
    }
  }
  return value
}
//编码
export function serialNumListFn(serialNumList: any, form: any) {
  serialNumList.map((item: any) => {
    //路径
    // let path=columnItem.formColumnCode;//主表
    // if(tabelCode){//子表
    //   path = `${tabelCode}.*.${columnItem.formColumnCode}`
    // }
    form.setFieldState(item.bindCol, (state) => {
      if (!state.value) {
        let serialNum = serialValueFn(item, form)
        state['value'] = serialNum //默认值
      }
    })
  })
}
// delete values['upload_array'];
// delete values['commentJson'];
// delete values['array_areaTravel'];
export function clearRedColFn(form: any, preRedCol: any, subMap: any) {
  //清空上次错误颜色
  preRedCol.map((item) => {
    console.log('item=', item)
    let code = item.key
    let tabelCode = item.tableCode
    if (tabelCode) {
      //子表
      // Object.keys(subMap).map((subCode) => {
      //   //获取表的code
      //   if (subMap[subCode] == codes[0]) {
      //     tabelCode = subCode
      //   }
      // })
      code = `${tabelCode}.${item.index}.${code}`
      debugger
      form.setFieldState(code, (state) => {
        state.setComponentProps({ redClassName: '' })
        //state.setComponentProps({ style: { backgroundColor: '#FFF4F2' } })
      })
    } else {
      form.setFieldState(code, (state) => {
        state.setComponentProps({ redClassName: '' })
        console.log('state=', state)
        //state.setComponentProps({ style: { backgroundColor: '#FFF4F2' } })
      })
    }
  })
}
//规则定义背景变红
export function redColFn(form: any, redCol: any, subMap: any) {
  redCol.map((item: any) => {
    console.log('item=', item)
    let code = item.key
    let tabelCode = item.tableCode
    if (tabelCode != '') {
      //子表
      code = `${tabelCode}.${item.index}.${code}`
      form.setFieldState(code, (state) => {
        state.setComponentProps({ redClassName: 'rule_red_warp' })
      })
    } else {
      form.setFieldState(code, (state) => {
        state.setComponentProps({ redClassName: 'rule_red_warp' })
      })
    }
  })
}
/**
 *
 * @param form form实例
 * @param pathSegments 层级
 * @param columnCode 控件code
 * @param value 所要赋的值
 * @param isSetValue //是否赋值
 * @param selfFn //赋值中调用自己特有的方法
 */
export function setColumnCodeValue(
  form,
  pathSegments,
  columnCode,
  value,
  isSetValue,
  selfFn,
  selectedNode?: any
) {
  debugger
  if (pathSegments.length > 1 && pathSegments[0] != 'x-component-props') {
    var parentCode = ''
    if (pathSegments.length > 2) {
      //包含在字表里面
      const index = pathSegments[pathSegments.length - 2]
      parentCode = pathSegments[pathSegments.length - 3]
      var tabelValue = form.values[parentCode]
      if (value && typeof value == 'object') {
        //所赋的值为对象（拉取控件、人员/部门/单位选择树中会有多个值）
        tabelValue[index] = {
          ...tabelValue[index],
          ...value,
        }
      } else {
        tabelValue[index][columnCode] = value
      }
      selfFn && selfFn(false, parentCode, index)
    } else {
      //对象容器
      parentCode = pathSegments[pathSegments.length - 2]
      var tabelValue = form.values[parentCode]
      if (value && typeof value == 'object') {
        //所赋的值为对象（拉取控件、人员/部门/单位选择树中会有多个值）
        tabelValue = {
          ...tabelValue,
          ...value,
        }
      } else {
        tabelValue[columnCode] = value
      }
      selfFn && selfFn(false, parentCode, -1)
    }
    form.setValuesIn(parentCode, _.cloneDeep(tabelValue))
    // form.setValues({ [parentCode]: _.cloneDeep(tabelValue) })
  } else if (pathSegments[0] == 'x-component-props') {
    //右侧属性
    selectedNode.setProps({
      'x-component-props': {
        ...selectedNode.props['x-component-props'],
        ...value,
      },
    })
  } else {
    //主表
    if (value && typeof value == 'object') {
      Object.keys(value).forEach((item) => {
        // form.setValuesIn(value)
        form.setValuesIn(item, value[item])
      })
      // form.setValues(value)
    } else {
      form.setValuesIn(columnCode, value)

      // form.setValues({ [columnCode]: value })
    }
    selfFn && selfFn(true, parentCode, -1)
  }
}

/**
 *
 * @param form form实例
 * @param pathSegments 层级
 * @param columnCode 控件code
 * @returns
 */
export function getColumnCodeValue(
  form,
  pathSegments,
  columnCode,
  selectedNode?: any
) {
  var value = ''
  var parentCode = ''
  var objectValue = {}
  if (pathSegments.length > 1 && pathSegments[0] != 'x-component-props') {
    if (pathSegments.length > 2) {
      //包含在字表里面
      const index = pathSegments[pathSegments.length - 2]
      parentCode = pathSegments[pathSegments.length - 3]
      const tabelValue = form.values[parentCode]
      value = tabelValue?.[index]?.[columnCode]
      objectValue = tabelValue
    } else {
      //对象容器
      parentCode = pathSegments[pathSegments.length - 2]
      const tabelValue = form.values[parentCode]
      value = tabelValue?.[columnCode]
      objectValue = tabelValue
    }
  } else if (pathSegments[0] == 'x-component-props') {
    //右侧属性
    value = selectedNode.props['x-component-props'][columnCode]
    objectValue = selectedNode.props['x-component-props']
  } else {
    //主表
    value = form.values[columnCode]
    objectValue = form.values
  }
  return {
    value, //所取的控件值
    parentCode, //所取的控件的父节点code 子表code
    objectValue, //子表当前行的值 子表对象容器的值 主表的值
  }
}
/**
 *
 * @param htmlString 将字符串转换成html
 * @returns
 */
export const ENCODEHTML = (htmlString) => {
  let html = <div dangerouslySetInnerHTML={{ __html: htmlString }}></div>
  return html
}
//雪花ID
const snowflakeId = new SnowflakeId({
  mid: new Date().getTime() + parseInt(Math.random() * 1000000),
  offset: (2019 - 1970) * 31536000 * 1000,
})
export const SNOWFLAKE = () => {
  return snowflakeId.generate()
}
//获取子表单行id
export const GETFORMDATAID = () => {
  return new Promise((resolve, reject) => {
    fetchAsync(`form/form/formData/id`, {
      method: 'get',
    }).then(
      (response) => {
        resolve(response.data)
      },
      (error) => {
        reject(error) //接口报错抛出错误信息
      }
    )
  })
}
export const CONFIRM = Modal.confirm
export const MESSAGE = message
export const QS = qs
export const globalPinyinUtil = pinyinUtil
export const LOCATIONHASH = () => {
  return window.localStorage.getItem('currentHash')
}
export const UUID = () => {
  return uuidv4()
} //随机数
export const DATAFORMAT = dataFormat
//这个是为了在按钮，配置相应器，规则定义中写fetch，等待数据返回在往下进行
//暂时写到全局，会有点影响内存，暂时不知道影响大不大
export const fetchAsync = async (action, params) => {
  //获取来源的menuId
  //获取当前激活页签的lable的menuId属性
  let activeNode = document
    .getElementById(`dom_container`)
    ?.getElementsByClassName('ant-tabs-tab-active')?.[0]
  let menuId =
    activeNode
      ?.getElementsByClassName('menu_lable')[0]
      ?.getAttribute('menuId') || ''
  const maxDataruleCode =
    activeNode
      ?.getElementsByClassName('menu_lable')[0]
      ?.getAttribute('maxDataruleCode') || ''
  const buttonId = window.localStorage.getItem('currentButtonId') || ''
  const listId = window.localStorage.getItem('listId') || ''
  const bizSolId = window.localStorage.getItem('bizSolId') || ''
  let options = {}
  options.body = qs.stringify(params.body)
  options.data = params.body
  return request(action, {
    ...params,
    ...options,
    headers: {
      Authorization: 'Bearer ' + window.localStorage.getItem('userToken'),
      ...params.headers,
    },
  })
}
