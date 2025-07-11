import React, { useLayoutEffect, useRef, useMemo, useContext } from 'react'
import { markRaw } from '@formily/reactive'
import { observer } from '@formily/react'
import { Grid, IGridOptions } from '@formily/grid'
import { usePrefixCls, pickDataProps } from '../__builtins__'
import { useFormLayout } from '../form-layout'
import cls from 'classnames'

const FormGridContext = React.createContext<Grid<HTMLElement>>(null)

export interface IFormGridProps extends IGridOptions {
  grid?: Grid<HTMLElement>
  prefixCls?: string
  className?: string
  style?: React.CSSProperties
}

export interface IGridColumnProps {
  gridSpan?: number
  gridColumn?: number
  style?: React.CSSProperties
  className?: string
}

type ComposedFormGrid = React.FC<React.PropsWithChildren<IFormGridProps>> & {
  GridColumn: React.FC<React.PropsWithChildren<IGridColumnProps>>
  useFormGrid: () => Grid<HTMLElement>
  createFormGrid: (props: IFormGridProps) => Grid<HTMLElement>
  /**
   * @deprecated
   */
  useGridSpan: (gridSpan: number) => number
  /**
   * @deprecated
   */
  useGridColumn: (gridSpan: number) => number
}

export const createFormGrid = (props: IFormGridProps) => {
  return markRaw(new Grid(props))
}

export const useFormGrid = () => useContext(FormGridContext)

/**
 * @deprecated
 */
export const useGridSpan = (gridSpan = 1) => {
  return gridSpan
}

/**
 * @deprecated
 */
export const useGridColumn = (gridSpan = 1) => {
  return gridSpan
}

export const FormGrid: ComposedFormGrid = observer(
  ({
    children,
    className,
    style,
    ...props
  }: React.PropsWithChildren<IFormGridProps>) => {
    const layout = useFormLayout()
    const options = {
      columnGap: layout?.gridColumnGap ?? 0,
      rowGap: layout?.gridRowGap ?? 0,
      ...props,
    }
    const grid = useMemo(
      () => markRaw(options?.grid ? options.grid : new Grid(options)),
      [Grid.id(options)]
    )
    const ref = useRef<HTMLDivElement>()
    const prefixCls = usePrefixCls('formily-grid', props)
    const dataProps = pickDataProps(props)
    useLayoutEffect(() => {
      return grid.connect(ref.current)
    }, [grid])
    return (
      <FormGridContext.Provider value={grid}>
        <div
          {...dataProps}
          className={cls(`${prefixCls}-layout`, className)}
          style={{
            ...style,
            // display: window.location.href.includes('mobile') ? 'block' : 'grid',
            gridTemplateColumns: grid.templateColumns
              ? grid.templateColumns
              : `repeat(${props?.maxColumns}, minmax(0px, 1fr))`,
            gap: grid.gap,
          }}
          ref={ref}
        >
          {children}
        </div>
      </FormGridContext.Provider>
    )
  },
  {
    forwardRef: true,
  }
) as any

export const GridColumn: React.FC<
  React.PropsWithChildren<IGridColumnProps>
> = observer(({ gridSpan, gridColumn, children, ...props }) => {
  return (
    <div
      {...props}
      style={{ ...props.style, gridRowEnd: `span ${gridColumn}` }}
      data-grid-span={gridSpan}
    >
      {children}
    </div>
  )
})

GridColumn.defaultProps = {
  gridSpan: 1,
  gridColumn: 1,
}

FormGrid.createFormGrid = createFormGrid
FormGrid.useGridSpan = useGridSpan
FormGrid.useGridColumn = useGridColumn
FormGrid.useFormGrid = useFormGrid
FormGrid.GridColumn = GridColumn

export default FormGrid
