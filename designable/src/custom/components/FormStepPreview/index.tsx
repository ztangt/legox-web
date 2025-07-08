import React, { Fragment } from 'react'
import { define, observable, action, markRaw, model } from '@formily/reactive'
import { Button, Steps } from 'antd'
import cls from 'classnames'
import { StepsProps, StepProps } from 'antd/lib/steps'
import { Form, VoidField } from '@formily/core'
import {
  connect,
  useField,
  observer,
  useFieldSchema,
  RecursionField,
} from '@formily/react'
import { Schema, SchemaKey } from '@formily/json-schema'
import { usePrefixCls } from '@/formily/antd/__builtins__'
import './index.less'
export interface IFormStep {
  connect: (steps: SchemaStep[], field: VoidField) => void
  current: number
  allowNext: boolean
  allowBack: boolean
  setCurrent(key: number): void
  submit: Form['submit']
  next(): void
  back(): void
}

export interface IFormStepProps extends StepsProps {
  formStep?: IFormStep
}
export interface OperationProps {
  formStep?: IFormStep
}

type ComposedFormStep = React.FC<React.PropsWithChildren<IFormStepProps>> & {
  StepPane: React.FC<React.PropsWithChildren<StepProps>>
  createFormStep: (defaultCurrent?: number) => IFormStep
  Operation?: React.FC<React.PropsWithChildren<OperationProps>>
}

type SchemaStep = {
  name: SchemaKey
  props: any
  schema: Schema
}

type FormStepEnv = {
  form: Form
  field: VoidField
  steps: SchemaStep[]
}
const isOperationComponent = (schema: Schema) => {
  return schema['x-component']?.indexOf('Operation') > -1
}
const useOperation = () => {
  const schema = useFieldSchema()
  return schema.reduceProperties((operation, schema, key) => {
    if (isOperationComponent(schema)) {
      return <RecursionField schema={schema} name={key} />
    }
    return operation
  }, null)
}
const parseSteps = (schema: Schema) => {
  const steps: SchemaStep[] = []
  schema.mapProperties((schema, name) => {
    if (schema['x-component']?.indexOf('StepPane') > -1) {
      steps.push({
        name,
        props: schema['x-component-props'],
        schema,
      })
    }
  })
  return steps
}

const createFormStep = (defaultCurrent = 0): IFormStep => {
  const env: FormStepEnv = define(
    {
      form: null,
      field: null,
      steps: [],
    },
    {
      form: observable.ref,
      field: observable.ref,
      steps: observable.shallow,
    }
  )

  const setDisplay = action.bound((target: number) => {
    const currentStep = env.steps[target]
    env.steps.forEach(({ name }) => {
      env.form.query(`${env.field.address}.${name}`).take((field) => {
        if (name === currentStep.name) {
          field.setDisplay('visible')
        } else {
          field.setDisplay('hidden')
        }
      })
    })
  })

  const next = action.bound(() => {
    if (formStep.allowNext) {
      formStep.setCurrent(formStep.current + 1)
    }
  })

  const back = action.bound(() => {
    if (formStep.allowBack) {
      formStep.setCurrent(formStep.current - 1)
    }
  })

  const formStep: IFormStep = model({
    connect(steps, field) {
      env.steps = steps
      env.form = field?.form
      env.field = field
    },
    current: defaultCurrent,
    setCurrent(key: number) {
      setDisplay(key)
      formStep.current = key
    },
    get allowNext() {
      console.log('formStep.current', formStep.current, env.steps)

      return formStep.current <= env.steps.length - 1
    },
    get allowBack() {
      return formStep.current >= 0
    },
    async next() {
      try {
        await env.form.validate()
        if (env.form.valid) {
          next()
        }
      } catch {}
    },
    async back() {
      back()
    },
    async submit(onSubmit) {
      return env.form?.submit?.(onSubmit)
    },
  })
  return markRaw(formStep)
}

export const FormStepPreview = connect(
  observer(({ formStep, className, ...props }: IFormStepProps) => {
    const field = useField<VoidField>()
    const prefixCls = usePrefixCls('formily-step', props)
    const schema = useFieldSchema()
    const steps = parseSteps(schema)
    const operation = useOperation()
    const current = props.current || formStep?.current || 0
    formStep?.connect?.(steps, field)
    return (
      <div className={cls(prefixCls, className)}>
        <Steps
          {...props}
          style={{ marginBottom: 10, ...props.style }}
          current={current}
        >
          {steps.map(({ props }, key) => {
            return <Steps.Step {...props} key={key} />
          })}
        </Steps>
        {steps.map(({ name, schema }, key) => {
          if (key !== current) return
          return <RecursionField key={key} name={name} schema={schema} />
        })}
        {operation}
      </div>
    )
  })
) as unknown as ComposedFormStep

const StepPane: React.FC<React.PropsWithChildren<StepProps>> = ({
  children,
}) => {
  return <Fragment>{children}</Fragment>
}
const Operation: React.FC<React.PropsWithChildren<OperationProps>> = ({
  formStep,
  ...props
}) => {
  return (
    <div className="button_group">
      <Button
        {...props}
        disabled={!formStep?.allowBack || props?.disabled}
        onClick={formStep?.back}
        style={{ marginRight: 8 }}
        type="primary"
      >
        上一步
      </Button>
      <Button
        disabled={!formStep?.allowNext || props?.disabled}
        onClick={formStep?.next}
        {...props}
        style={{}}
        type="primary"
      >
        下一步
      </Button>
    </div>
  )
}

FormStepPreview.StepPane = StepPane
FormStepPreview.createFormStep = createFormStep
FormStepPreview.Operation = Operation

export default FormStepPreview
