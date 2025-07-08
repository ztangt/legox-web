import {
  createArraySchema,
  createOperationConmponentFieldSchema,
  createOperationFieldSchema,
} from '@/designable/antd/components/Field'
import { createBehavior } from '@/designable/core'
import { AllLocales } from '../../locales'
import { AllSchemas } from '../../schemas'

export const createArrayBehavior = (name: string) => {
  return createBehavior(
    {
      name,
      extends: ['Field'],
      selector: (node) => node.props['x-component'] === name,
      designerProps: {
        droppable: true,
        propsSchema: createArraySchema(AllSchemas[name]),
        allowAppend: (
          target,
          source //只可添加一个控件且不可再嵌套自增表格组件
        ) =>
          target.children.length === 0 &&
          source.every(
            (node) =>
              node.props['x-component'] != 'ArrayTable' &&
              node.props['x-component'] != 'WriteSign' &&
              node.props['x-component'] != 'UploadFile' &&
              node.props['x-component'] != 'AssociatedBiz' &&
              node.props['x-component'] != 'FormGrid' &&
              node.props['x-component'] != 'FormLayout' &&
              node.props['x-component'] != 'FormStep' &&
              node.props['x-component'] != 'FormTab' &&
              node.props['x-component'] != 'Card' &&
              node.props['x-component'] != 'FromCollapse' &&
              !(
                node?.props?.['type'] == 'object' &&
                node?.props?.['x-component-props']?.['subContainerName'] ===
                  'subObject'
              )
          ),
      },
      designerLocales: AllLocales[name],
    },
    {
      name: `${name}.Importition`,
      extends: ['Field'],
      selector: (node) => node.props['x-component'] === `${name}.Importition`,
      designerProps: {
        allowDrop(parent) {
          return parent.props['x-component'] === name
        },
        // propsSchema: createOperationFieldSchema(AllSchemas[name].Addition),
        // propsSchema: createOperationFieldSchema(),
        propsSchema: createOperationConmponentFieldSchema(),
      },
      designerLocales: AllLocales.ArrayImportition,
    },
    {
      name: `${name}.Exportition`,
      extends: ['Field'],
      selector: (node) => node.props['x-component'] === `${name}.Exportition`,
      designerProps: {
        allowDrop(parent) {
          return parent.props['x-component'] === name
        },
        // propsSchema: createOperationFieldSchema(AllSchemas[name].Addition),
        propsSchema: createOperationFieldSchema(),
      },
      designerLocales: AllLocales.ArrayAddition,
    },
    {
      name: `${name}.Addition`,
      extends: ['Field'],
      selector: (node) => node.props['x-component'] === `${name}.Addition`,
      designerProps: {
        allowDrop(parent) {
          return parent.props['x-component'] === name
        },
        propsSchema: createOperationConmponentFieldSchema(),
        // propsSchema: createOperationFieldSchema(),
      },
      designerLocales: AllLocales.ArrayAddition,
    },
    {
      name: `${name}.Remove`,
      extends: ['Field'],
      selector: (node) => node.props['x-component'] === `${name}.Remove`,
      designerProps: {
        allowDrop(parent) {
          return parent.props['x-component'] === name
        },
        // propsSchema: createVoidFieldSchema(),
        propsSchema: createOperationFieldSchema(),
      },
      designerLocales: AllLocales.ArrayRemove,
    },
    {
      name: `${name}.Index`,
      extends: ['Field'],
      selector: (node) => node.props['x-component'] === `${name}.Index`,
      designerProps: {
        allowDrop(parent) {
          return parent.props['x-component'] === name
        },
        // propsSchema: createVoidFieldSchema(),
        propsSchema: createOperationFieldSchema(),
      },
      designerLocales: AllLocales.ArrayIndex,
    },
    {
      name: `${name}.MoveUp`,
      extends: ['Field'],
      selector: (node) => node.props['x-component'] === `${name}.MoveUp`,
      designerProps: {
        allowDrop(parent) {
          return parent.props['x-component'] === name
        },
        // propsSchema: createVoidFieldSchema(),
        propsSchema: createOperationFieldSchema(),
      },
      designerLocales: AllLocales.ArrayMoveUp,
    },
    {
      name: `${name}.MoveDown`,
      extends: ['Field'],
      selector: (node) => node.props['x-component'] === `${name}.MoveDown`,
      designerProps: {
        allowDrop(parent) {
          return parent.props['x-component'] === 'ArrayCards'
        },
        // propsSchema: createVoidFieldSchema(),
        propsSchema: createOperationFieldSchema(),
      },
      designerLocales: AllLocales.ArrayMoveDown,
    },
    {
      name: `${name}.Copy`,
      extends: ['Field'],
      selector: (node) => node.props['x-component'] === `${name}.Copy`,
      designerProps: {
        allowDrop(parent) {
          return parent.props['x-component'] === name
        },
        // propsSchema: createVoidFieldSchema(),
        propsSchema: createOperationConmponentFieldSchema(),
      },
      designerLocales: AllLocales.ArrayCopy,
    },
    {
      name: `${name}.Edit`,
      extends: ['Field'],
      selector: (node) => node.props['x-component'] === `${name}.Edit`,
      designerProps: {
        allowDrop(parent) {
          return parent.props['x-component'] === name
        },
        // propsSchema: createVoidFieldSchema(),
        propsSchema: createOperationConmponentFieldSchema(),
      },
      designerLocales: AllLocales.ArrayEdit,
    },
    {
      name: `${name}.View`,
      extends: ['Field'],
      selector: (node) => node.props['x-component'] === `${name}.View`,
      designerProps: {
        allowDrop(parent) {
          return parent.props['x-component'] === name
        },
        // propsSchema: createVoidFieldSchema(),
        propsSchema: createOperationConmponentFieldSchema(),
      },
      designerLocales: AllLocales.ArrayView,
    }
  )
}
