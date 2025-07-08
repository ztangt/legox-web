import { ITreeNode } from '@/designable/core'
import { clone, uid } from '@/designable/shared'
import { ISchema, Schema } from '@formily/json-schema'
import _ from 'lodash'

let reg = /^[a-zA-Z\u4e00-\u9fa5]{1}.*$/
let regAll = /^[a-zA-Z0-9_\u4e00-\u9fa5]*$/
let regCode = /^[A-Z][A-Z0-9_]*$/
let regNumber = /^[1-9]+[0-9]*$/
export interface ITransformerOptions {
  designableFieldName?: string
  designableFormName?: string
}
interface configSchema {
  columnCode?: String
  columnName?: String
  columnDecLength?: any
  columnLength?: Number
  columnType?: String
  formCode?: String
  formName?: String
  subFormName?: String
  subFormCode?: String
  tableId?: String
  type?: String
  isHide?: String
  subFormId?: String
  columns?: Array<configSchema | configSchema[]>
}
interface FormilySchema {
  columns?: Array<configSchema | configSchema[]>
  formCode?: String
  formName?: String
  subFormName?: String
  subFormCode?: String
  type?: String
}
export interface IFormilyConfigSchema {
  formJSON?: Array<FormilySchema | FormilySchema[]>
  form?: Record<string, any>
  error?: String
}
export interface IFormilySchema {
  schema?: ISchema
  subSchema?: ISchema
  form?: Record<string, any>
}

const createOptions = (options: ITransformerOptions): ITransformerOptions => {
  return {
    designableFieldName: 'Field',
    designableFormName: 'Form',
    ...options,
  }
}

const findNode = (node: ITreeNode, finder?: (node: ITreeNode) => boolean) => {
  if (!node) return
  if (finder(node)) return node
  if (!node.children) return
  for (let i = 0; i < node.children.length; i++) {
    if (findNode(node.children[i])) return node.children[i]
  }
  return
}

export const transformToConfigSchema = (
  node: ITreeNode,
  type?: any,
  options?: ITransformerOptions
): IFormilyConfigSchema => {
  const realOptions = createOptions(options)
  const root = findNode(node, (child) => {
    return child.componentName === realOptions.designableFormName
  })
  const formJSON = []
  if (!root) return { formJSON }
  debugger
  String.prototype.endsWith = function (endStr) {
    let d = this.length - endStr.length
    return d >= 0 && this.lastIndexOf(endStr) == d
  }
  let error = '' //错误信息
  let curSubFormCode = '' //当前子表编码
  let subFormCodes = [] //子表编码集合
  let curSubCodes = [] //当前子表中字段编码集合
  let mainFormCodes = [] //主表中字段编码集合
  if (!root.props?.ctlgId) {
    error = `表单分类不能为空`
  }
  if (!error && !root.props.formName) {
    error = `主表名称不能为空`
  }
  if (!error && !root.props.formCode) {
    error = `主表编码不能为空`
  }
  if (!error && root.props.formName.length > 40) {
    error = `主表名称不能大于40个字符`
  }
  if (!error && !regCode.test(root.props.formCode)) {
    error = `主表编码须以字母开头，支持（大写字母、数字，下划线）`
  }

  formJSON.push({
    type: 'MAIN',
    formName: root.props.formName,
    formCode: root.props.formCode,
    columns: [],
    tableId: root.props.tableId?.split(',')?.[0],
  })
  const isAddHideFn = (child: ITreeNode) => {
    switch (
      child.props['x-component'] //树控件类型组件 追加一个默认的隐藏字段
    ) {
      case 'OrgTree':
      case 'PersonTree':
      case 'DeptTree':
        return true
        break
      default:
        return false
        break
    }
  }
  const setSub = (child, formJSON) => {
    if (child.props?.['x-component'] != 'Text') {
      //文本字段排除
      curSubFormCode = child.props.columnCode
      curSubCodes = []
      if (!child.props.columnName && !error) {
        //校验必填项
        error = `子表名称不能为空`
      }
      if (!child.props.columnCode && !error) {
        //校验必填项
        error = `子表编码不能为空`
      }
      if (node.props.formName == child.props.columnCode && !error) {
        //校验子表编码是否与主表重复
        error = `子表${child.props.columnName}编码与主表相同`
      }
      if (
        subFormCodes.findIndex((item) => {
          return item == child.props.columnCode
        }) != -1 &&
        !error
      ) {
        //校验子表编码是否与已有子表重复
        error = `子表${child.props.columnName}编码重复`
      } else {
        //无重复编码时放入子表编码集合
        subFormCodes.push(child.props.columnCode)
      } //组件类型为array类型时，暂定为子表数据

      if (!error && child.props.columnName.length > 40) {
        error = `子表${child.props.columnName}名称不能大于40个字符`
      }

      if (!error && !regCode.test(child.props.columnCode)) {
        error = `子表${child.props.columnName}编码须以字母开头，支持（大写字母、数字，下划线）`
      }
    }
    formJSON.push({
      tableId: child?.props?.tableId?.includes(',')
        ? child.props.tableId?.split(',')?.[0]
        : child.props.tableId || '',
      subFormName: child.props.columnName || '',
      subFormCode: child.props.columnCode || '',
      type: 'SUB',
      columns: subCreateSchema(child, []),
      subFormId: child.props.subFormId || '',
    })
    return formJSON
  }
  const subCreateSchema = (node: ITreeNode, formJSON: Array<configSchema>) => {
    node.children.forEach((child, index) => {
      if (child.props.type === 'void' || child.props.type == 'object') {
        subCreateSchema(child, formJSON)
      } else {
        if (
          child.props?.['x-component'] != 'Text' &&
          child.props?.['x-component'] != 'Button' &&
          child.props?.['x-component'] != 'FlowDetails'
        ) {
          let subTbaleName =
            node?.props?.type == 'object' && !node?.props?.['x-component']
              ? child?.parent?.props?.columnName
              : child?.parent?.parent?.parent?.props?.columnName
          //文本字段排除
          if (!child.props.columnName && !error) {
            //校验必填项
            error = `子表${subTbaleName}中字段名称不能为空`
          }

          if (!child.props.columnCode && !error) {
            //校验必填项
            error = `子表${subTbaleName}中字段编码不能为空`
          }

          if (!child.props.columnLength && !error) {
            //校验必填项
            error = `子表${subTbaleName}中字段长度不能为空`
          }

          let hiddenColumns = child?.props?.['x-component-props']?.hiddenColumn
            ? child?.props?.['x-component-props']?.hiddenColumn?.includes(',')
              ? child?.props?.['x-component-props']?.hiddenColumn?.split(',')
              : [child?.props?.['x-component-props']?.hiddenColumn]
            : []
          if (hiddenColumns?.length > 0 && !error) {
            hiddenColumns.map((hcItems: any) => {
              if (child.props['x-component'] == 'PullData') {
                //拉取
                hcItems = `${
                  child.props.columnCode?.split('NAME_')[0]
                }${hcItems}_`
              }
              if (
                curSubCodes.findIndex((item) => {
                  return item == hcItems
                }) != -1 &&
                !error
              ) {
                //判断当前字段编码是否在当前子表字段编码中
                error = `子表${subTbaleName}中${child.props.columnName}${hcItems}字段编码重复`
              } else {
                //在当前子表编码数组中无重复字段则放入当前子表字段编码数组中
                curSubCodes.push(hcItems)
              }
            })
          }

          if (
            (child?.parent?.parent?.parent?.props?.columnCode ==
              curSubFormCode ||
              child?.parent?.props?.columnCode == curSubFormCode) &&
            !error //是否为当前子表
          ) {
            let codes = []
            if (
              curSubCodes.findIndex((item) => {
                return item == child.props.columnCode
              }) != -1
            ) {
              //判断当前字段编码是否在当前子表字段编码中
              error = `子表${subTbaleName}中${child.props.columnName}字段编码重复`
            }
            if (
              !error &&
              child?.props?.colCodes?.length != 0 &&
              child?.props?.isExsit != 1
            ) {
              codes = curSubCodes.concat(_.cloneDeep(child?.props?.colCodes))
            }
            if (
              !child.props.columnId &&
              codes.findIndex((item) => {
                return item == child.props.columnCode
              }) != -1
            ) {
              //判断当前字段编码是否在当前子表字段编码中
              error = `子表${subTbaleName}中${child.props.columnName}字段编码与已有数据源编码中的重复`
            } else {
              //在当前子表编码数组中无重复字段则放入当前子表字段编码数组中
              curSubCodes.push(child.props.columnCode)
            }

            if (
              !error &&
              (child.props['x-component'] == 'PersonTree' ||
                child.props['x-component'] == 'DeptTree' ||
                child.props['x-component'] == 'OrgTree')
            ) {
              let treeIdCode =
                child?.props?.columnCode?.split('NAME_')[0] + 'ID_'
              if (
                curSubCodes.findIndex((item) => {
                  return item == treeIdCode
                }) != -1 &&
                !error
              ) {
                //判断当前字段编码是否在当前子表字段编码中
                error = `子表${subTbaleName}中${child.props.columnName}隐藏字段编码重复`
              } else {
                //在当前子表编码数组中无重复字段则放入当前子表字段编码数组中
                curSubCodes.push(treeIdCode)
              }
            }
          }
          if (!error && child.props.columnName.length > 40) {
            error = `子表${subTbaleName}中${child.props.columnName}字段名称不能大于40个字符`
          }
          if (!regCode.test(child.props.columnCode) && !error) {
            error = `子表${subTbaleName}中${child.props.columnName}字段编码须以字母开头，支持（大写字母、数字，下划线）`
          }
          if (
            !error &&
            child.props.columnCode &&
            (child.props?.['x-component'] == 'PersonTree' ||
              child.props?.['x-component'] == 'DeptTree' ||
              child.props?.['x-component'] == 'OrgTree') &&
            !child.props.columnCode.endsWith('NAME_')
          ) {
            error = `子表${child?.parent?.parent?.parent?.props?.columnName}中${child.props.columnName}字段编码不符合命名格式,需添以NAME_结尾`
          }
          if (
            !error &&
            child.props.columnCode &&
            child.props?.['x-component'] == 'BasicData' &&
            !child.props.columnCode.endsWith('TLDT_')
          ) {
            error = `子表${child?.parent?.parent?.parent?.props?.columnName}中${child.props.columnName}字段编码不符合命名格式,需添以TLDT_结尾`
          }
          if (
            !error &&
            child.props.columnCode &&
            child.props?.['x-component'] == 'PullData' &&
            !child.props.columnCode.endsWith('NAME_')
          ) {
            error = `子表${child?.parent?.parent?.parent?.props?.columnName}中${child.props.columnName}字段编码不符合命名格式,需添以NAME_结尾`
          }
          let columnRefObj = ''
          if (child.props?.['x-component'] == 'BasicData') {
            columnRefObj = child?.props?.['x-component-props']?.codeTable
          } else if (child.props?.['x-component'] == 'TreeTable') {
            columnRefObj = child?.props?.['x-component-props']?.bizSolId
          }
          const column = {
            columnId: child.props.columnId || '',
            columnCode: child.props.columnCode || '',
            columnName: child.props.columnName || '',
            columnDecLength: Number(child.props.columnDecLength) || '',
            columnLength: Number(child.props.columnLength),
            columnType: child.props.columnType || '',
            isHide: child.props.isHide || '0',
            columnRefObj: columnRefObj,
          }
          //自定义控件的隐藏字段
          if (child.props['x-component-props']?.hiddenColumn) {
            let hiddenColumns = child.props[
              'x-component-props'
            ]?.hiddenColumn.split(',')

            hiddenColumns.map((item: any) => {
              let tmpColumn = {
                ...column,
                columnName:
                  child?.props?.['x-component'] == 'PullData'
                    ? `${child?.props?.columnName}${item}_`
                    : item,
                //如果为拉取控件添加默认隐藏字段  字段code_隐藏字段后缀（存于hiddenColumn）
                columnCode:
                  child?.props?.['x-component'] == 'PullData'
                    ? `${child?.props?.columnCode?.split('NAME_')[0]}${item}_`
                    : item,
                isHide: '',
                columnType: 'CONTROLHINDENTEXT',
                columnLength: 500,
              }
              formJSON.push(tmpColumn)
            })
          }
          // const hideColumn = {
          //   ...column,
          //   columnName: child?.props?.columnName + 'ID_' || '',
          //   columnCode:
          //     child?.props?.columnCode?.split('NAME_')[0] + 'ID_' || '',
          //   isHide: '',
          //   columnType: 'SINGLETEXT',
          // }

          const hideColumn = {
            ...column,
            columnName:
              child?.props?.columnName?.split('NAME_')[0] + 'ID_' || '',
            columnCode:
              child?.props?.columnCode?.split('NAME_')[0] + 'ID_' || '',
            isHide: '',
            columnType: 'CONTROLHINDENTEXT',
            columnLength: 500,
          }

          const isAddHide = isAddHideFn(child)
          formJSON.push(column)
          isAddHide && formJSON.push(hideColumn)
        }
      }
    })
    return formJSON
  }
  const createSchema = (node: ITreeNode, formJSON: Array<configSchema>) => {
    node.children.forEach((child, index) => {
      if (child.props.type === 'array') {
        formJSON = setSub(child, formJSON)
      } else if (child.props.type === 'void' || child.props.type == 'object') {
        if (
          child.props.type == 'object' &&
          child?.props?.type == 'object' &&
          !child?.props?.['x-component']
        ) {
          formJSON = setSub(child, formJSON)
          // formJSON.push({
          //   tableId: child?.props?.tableId?.includes(',')
          //     ? child.props.tableId?.split(',')?.[0]
          //     : child.props.tableId || '',
          //   subFormName: child.props.columnName || '',
          //   subFormCode: child.props.columnCode || '',
          //   type: 'SUB',
          //   columns: subCreateSchema(child, []),
          //   subFormId: child.props.subFormId || '',
          // })
        } else {
          createSchema(child, formJSON)
        }
      } else {
        if (
          child.props?.['x-component'] != 'Text' &&
          child.props?.['x-component'] != 'Button' &&
          child.props?.['x-component'] != 'FlowDetails'
        ) {
          if (!child.props.columnName && !error) {
            //校验必填项
            error = `主表中字段名称不能为空`
          }
          if (!child.props.columnCode && !error) {
            //校验必填项
            error = `主表中字段编码不能为空`
          }
          if (!child.props.columnLength && !error) {
            //校验必填项
            error = `主表中字段长度不能为空`
          }
          if (!error && child.props.columnName.length > 40) {
            error = `主表中字段名称不能大于40个字符`
          }
          let codes = []
          // if (child?.props?.colCodes?.length != 0 && !child?.props?.isExsit) {
          //   codes = mainFormCodes.concat(child?.props?.colCodes)
          // } else {
          //   codes = mainFormCodes
          // }

          if (
            !error &&
            (child.props['x-component'] == 'PersonTree' ||
              child.props['x-component'] == 'DeptTree' ||
              child.props['x-component'] == 'OrgTree')
          ) {
            let treeIdCode = child?.props?.columnCode?.split('NAME_')[0] + 'ID_'
            if (
              mainFormCodes.findIndex((item) => {
                return item == treeIdCode
              }) != -1 &&
              !error
            ) {
              //判断当前字段编码是否在当前主表字段编码中
              error = `主表中${child.props.columnName}字段隐藏字段编码重复`
            } else {
              //在当前子表编码数组中无重复字段则放入当前主表字段编码数组中
              mainFormCodes.push(treeIdCode)
            }
          }

          if (
            // !child.props.columnId &&
            mainFormCodes.findIndex((item) => {
              return item == child.props.columnCode
            }) != -1 &&
            !error
          ) {
            //校验主表中字段编码是否重复
            error = `主表中${child.props.columnName}字段编码重复`
          }
          if (
            !error &&
            child?.props?.colCodes?.length != 0 &&
            !child?.props?.isExsit
          ) {
            codes = mainFormCodes.concat(_.cloneDeep(child?.props?.colCodes))
          }
          if (
            !child.props.columnId &&
            codes.findIndex((item) => {
              return item == child.props.columnCode
            }) != -1 &&
            !error
          ) {
            //校验主表中字段编码是否重复
            error = `主表中${child.props.columnName}字段编码与已有数据源编码中的重复`
          } else {
            //无重复编码时放入主表编码结合
            mainFormCodes.push(child.props.columnCode)
          }

          // else {

          //   //无重复编码时放入主表编码结合
          //   // mainFormCodes.push(child.props.columnCode)
          // }

          if (!regCode.test(child.props.columnCode) && !error) {
            error = `主表中${child.props.columnName}编码须以字母开头，支持（大写字母、数字，下划线）`
          }
          if (
            !error &&
            child.props.columnCode &&
            (child.props?.['x-component'] == 'PersonTree' ||
              child.props?.['x-component'] == 'DeptTree' ||
              child.props?.['x-component'] == 'OrgTree') &&
            !child.props.columnCode.endsWith('NAME_')
          ) {
            error = `主表中${child.props.columnName}编码不符合命名格式,需添以NAME_结尾`
          }
          if (
            !error &&
            child.props.columnCode &&
            child.props?.['x-component'] == 'BasicData' &&
            !child.props.columnCode.endsWith('TLDT_')
          ) {
            error = `主表中${child.props.columnName}编码不符合命名格式,需添以TLDT_结尾`
          }

          if (
            !error &&
            child.props.columnCode &&
            child.props?.['x-component'] == 'PullData' &&
            !child.props.columnCode.endsWith('NAME_')
          ) {
            error = `主表中${child.props.columnName}编码不符合命名格式,需添以NAME_结尾`
          }
          let columnRefObj = ''
          if (child.props?.['x-component'] == 'BasicData') {
            columnRefObj = child?.props?.['x-component-props']?.codeTable
          } else if (child.props?.['x-component'] == 'TreeTable') {
            columnRefObj = child?.props?.['x-component-props']?.bizSolId
          }
          const column = {
            columnId: child.props.columnId || '',
            columnCode: child.props.columnCode || '',
            columnName: child.props.columnName || '',
            columnDecLength: Number(child.props.columnDecLength) || '',
            columnLength: Number(child.props.columnLength),
            columnType: child.props.columnType || '',
            isHide: child.props.isHide || '0',
            columnRefObj: columnRefObj,
          }
          //自定义控件的隐藏字段
          if (child.props['x-component-props']?.hiddenColumn) {
            let hiddenColumns = child?.props?.[
              'x-component-props'
            ]?.hiddenColumn?.split(',')
            hiddenColumns.map((item: any) => {
              let tmpColumn = {
                ...column,
                columnName:
                  child?.props?.['x-component'] == 'PullData'
                    ? `${child?.props?.columnName}${item}_`
                    : item,
                columnCode:
                  child?.props?.['x-component'] == 'PullData'
                    ? `${child?.props?.columnCode?.split('NAME_')[0]}${item}_`
                    : item,
                isHide: child?.props?.['x-component'] == 'TreeTable' ? '1' : '',
                columnType: 'CONTROLHINDENTEXT',
                columnLength: 500,
              }
              formJSON[0].columns.push(tmpColumn)
            })
          }
          const hideColumn = {
            ...column,
            columnName:
              child?.props?.columnName?.split('NAME_')[0] + 'ID_' || '',
            columnCode:
              child?.props?.columnCode?.split('NAME_')[0] + 'ID_' || '',
            isHide: '',
            columnType: 'CONTROLHINDENTEXT',
            columnLength: 500,
          }
          const isAddHide = isAddHideFn(child)
          formJSON[0].columns.push(column)
          isAddHide && formJSON[0].columns.push(hideColumn)
        }
      }
    })
    return formJSON
  }
  let newFormJSON = createSchema(root, formJSON)
  return {
    form: clone(root.props),
    formJSON: newFormJSON,
    error,
  }
}

export const transformToSchema = (
  node: ITreeNode,
  data?: any,
  type?: any,
  options?: ITransformerOptions
): IFormilySchema => {
  console.log('data', data)

  const realOptions = createOptions(options)
  const root = findNode(node, (child) => {
    return child.componentName === realOptions.designableFormName
  })
  const schema = {
    type: 'object',
    properties: {},
  }
  let subSchema = {}
  if (!root) return { schema }
  const createSchema = (node: ITreeNode, schema: ISchema = {}) => {
    if (node !== root) {
      Object.assign(schema, clone(node.props))
    }
    schema['x-designable-id'] = node.id

    if (
      schema.type === 'array' ||
      schema['x-component-props']?.['subContainerName'] === 'subObject'
    ) {
      if (node.children[0] && schema.type === 'array') {
        if (
          node.children[0].componentName === realOptions.designableFieldName
        ) {
          schema.items = createSchema(node.children[0])
          schema['x-index'] = 0
        }
      }

      if (
        data?.subForms &&
        data?.subForms?.length != 0 &&
        node?.props.columnCode
      ) {
        //发布成功   将已发布的子表tableId和 subFormId存入schema
        const obj = _.find(data?.subForms, {
          formCode: node?.props?.columnCode,
        })
        if (obj && Object?.keys(obj)?.length) {
          schema['subFormId'] = obj?.subFormId
          schema['tableId'] = obj?.tableId
        }
      }
      let childrenArray = node.children
      if (schema.type === 'array') {
        childrenArray = node.children.slice(1)
      }
      childrenArray.forEach((child, index) => {
        if (child.componentName !== realOptions.designableFieldName) return
        const key = child.props.name || child.id
        schema.properties = schema.properties || {}
        schema.properties[key] = createSchema(child)
        schema.properties[key]['x-index'] = index
        if (type == 'release' || type == 'update') {
          //发布成功
          schema.properties[key]['isDeploy'] = 1
        }
        if (type) {
          //加入到已有数据源判断
          schema.properties[key]['isExsit'] = 1
        }
      })
      subSchema[node.props.name || node.id] = schema
    } else {
      node.children.forEach((child, index) => {
        if (child.componentName !== realOptions.designableFieldName) return
        const key = child.props.name || child.id
        schema.properties = schema.properties || {}
        schema.properties[key] = createSchema(child)
        schema.properties[key]['x-index'] = index
        schema.properties[key]['x-designbale'] = index
        if (type == 'release' || type == 'update') {
          //发布成功
          schema.properties[key]['isDeploy'] = 1
        }
        if (type) {
          //加入到已有数据源判断
          schema.properties[key]['isExsit'] = 1
        }
      })
    }
    return schema
  }

  return {
    form: {
      ...clone(root.props),
      tableId: data?.tableId || node?.props?.tableId,
      formId: data?.formId || node?.props?.formId || '',
    },
    schema: createSchema(root, schema),
    subSchema,
  }
}

export const transformToTreeNode = (
  formily: IFormilySchema = {},
  options?: ITransformerOptions
) => {
  const realOptions = createOptions(options)
  const root: ITreeNode = {
    componentName: realOptions.designableFormName,
    props: formily.form,
    children: [],
  }
  const schema = new Schema(formily.schema)
  const cleanProps = (props: any) => {
    if (props['name'] === props['x-designable-id']) {
      delete props.name
    }
    delete props['version']
    delete props['_isJSONSchemaObject']
    return props
  }
  const appendTreeNode = (parent: ITreeNode, schema: Schema) => {
    if (!schema) return
    const current = {
      id: schema['x-designable-id'] || uid(),
      componentName: realOptions.designableFieldName,
      props: cleanProps(schema.toJSON(false)),
      children: [],
    }
    parent.children.push(current)
    if (schema.items && !Array.isArray(schema.items)) {
      appendTreeNode(current, schema.items)
    }
    schema.mapProperties((schema) => {
      schema['x-designable-id'] = schema['x-designable-id'] || uid()
      appendTreeNode(current, schema)
    })
  }
  schema.mapProperties((schema) => {
    schema['x-designable-id'] = schema['x-designable-id'] || uid()
    appendTreeNode(root, schema)
  })
  return root
}
