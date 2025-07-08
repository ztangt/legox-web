export const GlobalHelper = `
/** 
 * You can use the built-in context variables
 * 
 * 1. \`$self\` 对象类型，存储了当前字段模型
 * 
 * 2. \`$form\` 对象类型，存储了当前表单模型
 * 
 * 3. \`$deps\` 数组类型，存储了当前字段的“依赖字段”，对应“配置响应器”弹窗最上面的“依赖字段”
 * 
 * 4. \`$observable\` 函数类型，用于创建一个持久的可观察状态对象
 *
 * 5. \`$memo\` 函数类型，用于创建持久化数据
 * 
 * 6. \`$effect\` 函数类型，用于处理副作用逻辑 
 * 
 * 7. \`$props\`  函数类型，它的参数将会直接穿透给组件
  *    ○ 比如用antd的组件制作了designable中的物料，通常会把组件的参数对接成“属性面板”中的配置
  *    ○ 如果“属性面板”的配置参数有遗漏，可以通过$props穿透给antd组件，做补位。
 * 
 * Document Links
 * 
 * https://react.formilyjs.org/api/shared/schema#%E5%86%85%E7%BD%AE%E8%A1%A8%E8%BE%BE%E5%BC%8F%E4%BD%9C%E7%94%A8%E5%9F%9F
 **/
`

export const BooleanHelper = `
/** 
 * Example 1
 * Static Boolean
 **/

false

/** 
 * Example 2
 * Equal Calculation
 **/

$deps.VariableName === 'TARGET_VALUE'

/** 
 * Example 3
 * Not Equal Calculation
 **/

$deps.VariableName !== 'TARGET_VALUE'

/** 
 * Example 4
 * And Logic Calculation
 **/

$deps.VariableName1 && $deps.VariableName2

/** 
 * Example 5
 * Grater Logic Calculation
 **/

$deps.VariableName > 100

/** 
 * Example 6
 * Not Logic Calculation
 **/

!$deps.VariableName

${GlobalHelper}
`

export const DisplayHelper = `
/** 
 * Example 1
 * Static Mode
 **/

'none'

/** 
 * Example 2
 * Equal Condition Associated
 **/

$deps.VariableName === 'TARGET_VALUE' ? 'visible' : 'none'

/** 
 * Example 3
 * Not Equal Condition Associated
 **/

$deps.VariableName !== 'TARGET_VALUE' ? 'visible' : 'hidden'

/** 
 * Example 4
 * And Logic Condition Associated
 **/

$deps.VariableName1 && $deps.VariableName2 ? 'visible' : 'none'

/** 
 * Example 5
 * Grater Logic Condition Associated
 **/

$deps.VariableName > 100 ? 'visible' : 'hidden'

/** 
 * Example 6
 * Not Logic Condition Associated
 **/

!$deps.VariableName ? 'visible' : 'none'

${GlobalHelper}
`

export const PatternHelper = `
/** 
 * Example 1
 * Static Mode
 **/

'readPretty'

/** 
 * Example 2
 * Equal Condition Associated
 **/

$deps.VariableName === 'TARGET_VALUE' ? 'editable' : 'disabled'

/** 
 * Example 3
 * Not Equal Condition Associated
 **/

$deps.VariableName !== 'TARGET_VALUE' ? 'editable' : 'readOnly'

/** 
 * Example 4
 * And Logic Condition Associated
 **/

$deps.VariableName1 && $deps.VariableName2 ? 'editable' : 'readPretty'

/** 
 * Example 5
 * Grater Logic Condition Associated
 **/

$deps.VariableName > 100 ? 'editable' : 'readOnly'

/** 
 * Example 6
 * Not Logic Condition Associated
 **/

!$deps.VariableName ? 'editable' : 'disabled'

${GlobalHelper}
`

export const StringHelper = `
/** 
 * Example 1
 * Static String
 **/

'Normal String Text'

/** 
 * Example 2
 * Associated String
 **/

$deps.VariableName === 'TARGET_VALUE' ? 'Associated String Text' : ''

${GlobalHelper}
`

export const AnyHelper = `
/** 
 * Example 1
 * String Type
 **/

'String'

/** 
 * Example 2
 * String Array
 **/

['StringArray']

/** 
 * Example 3
 * Object Array
 **/

[{ key: 'ObjectArray' }]

/** 
 * Example 4
 * Boolean
 **/

true

/** 
 * Example 5
 * RegExp
 **/

/\d+/

/** 
 * Example 1
 * Associated String Value
 **/

$deps.VariableName + 'Compose String'

/** 
 * Example 2
 * Associated Array Value
 **/

[ $deps.VariableName ]

/** 
 * Example 3
 * Associated Object Value
 **/

{
  key : $deps.VariableName
}

/** 
 * Example 4
 * Associated Boolean Value
 **/

!$deps.VariableName

${GlobalHelper}
`

export const DataSourceHelper = `
/** 
 * Example 1
 * Static DataSource
 **/

[
  { label : "item1", value: "1" },
  { label : "item2", value: "2" }
]

/** 
 * Example 2
 * Associated DataSource
 **/

[
  { label : "item1", value: "1" },
  { label : "item2", value: "2" },
  ...$deps.VariableName
]

${GlobalHelper}
`

export const ComponentPropsHelper = `
/** 
 * Example 1
 * Static Props
 **/

{
  placeholder: "This is placeholder"
}

/** 
 * Example 2
 * Associated Props
 **/

{
  placeholder: $deps.VariableName
}

${GlobalHelper}
`

export const DecoratorPropsHelper = `
/** 
 * Example 1
 * Static Props
 **/

{
  labelCol:6
}

/** 
 * Example 2
 * Associated Props
 **/

{
  labelCol: $deps.VariableName
}

${GlobalHelper}
`

export const FulfillRunHelper = `
/** 
 * Example 1
 * Async Select
 **/

$effect(()=>{
  $self.loading = true
  fetch("/api/sys/role/roles?start=1&limit=10&searchWord=&roleType=ALLROLE", {
    method: "get",
    headers: {
      // TODO   "Bearer " + window.localStorage.getItem("refreshToken")!!!!
      Authorization:
        "Bearer " +
        "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXB0TmFtZSI6bnVsbCwib3JnTmFtZSI6bnVsbCwidXNlcl9uYW1lIjoiNjg1NDQ0IiwiZGVwdElkIjpudWxsLCJyb2xlQ29kZXMiOm51bGwsInBvc3RJZCI6bnVsbCwidXNlck5hbWUiOiI2ODU0NDQiLCJ1c2VySWQiOjE0NTc1OTc5MDMxMDIwNDYyMDksInBpY3R1cmUiOiIxIiwib3JnSWQiOm51bGwsImNsaWVudF9pZCI6ImxlZ294IiwiY3VzdG9tVHlwZSI6Mywicm9sZUlkcyI6bnVsbCwib3JnQ29kZSI6bnVsbCwiaWRlbnRpdHlJZCI6bnVsbCwic2NvcGUiOlsiYWxsIl0sInVzZXJBY2NvdW50IjoiNjg1NDQ0IiwicG9zdE5hbWUiOm51bGwsInRlbmFudElkIjoxNDU3NTk3OTAzMTAyMDQ2MjA5LCJwb3N0Q29kZSI6bnVsbCwiZXhwIjoxNjU1Njk1NDA1LCJqdGkiOiIyYTQyOTUzMC0zNTk4LTQzY2MtYmFkYi0wOWI2YTJiOWVjZTIiLCJkZXB0Q29kZSI6bnVsbH0.LeO0dp3jil6DD3FpDxBYSj72NF49-citWu6_qTz-F7WNC-4KtJQtH3Uv4HqqLQCxMaWaw_bQ_l67mUN4XxPYZJPFK901lL7JJwaDH4zsvNsUmTri0TNZhdT4kSzj_bqqvepZb4ZQUGNE35HZz0oUqXmVX6CFJThLlOtp4blJhEQjcW_7ZwR-x2EpfslLqVMayb86X4NTuCr0ZzWJX66tD6xFs4_u2yt_PjXpJQc8OrSUfMNfIyurKs0R2TZvb-OMTFSqb_GR5yla-A19I4cSzo9H8YYebc3oKgZ_8_RAJod-LgBpQq_rRmIwF9O0ROrbwgLlvdlQ0qjfWmuA25eWbA",
    },
  })
    .then((response) => response.json())
    .then(
      ({ data }) => {
        let tmp = []
        data.list?.forEach((item) => {
          tmp.push({
            label: item.roleName,
            value: item.id,
          })
        })
        $self.loading = false
        $self.dataSource = tmp
      },
      () => {
        $self.loading = false
      }
    )
},[])
  

/** 
 * Example 2
 * Async Search Select
 **/

const state = $observable({
  keyword:''
})

$props({
  onSearch(keyword){
    state.keyword = keyword
  }
})

$effect(()=>{
  $self.loading = true
  fetch(\`//some.domain/getSomething?q=\${state.keyword}\`)
    .then(response=>response.json())
    .then(({ data })=>{
      $self.loading = false
      $self.dataSource = data
    },()=>{
      $self.loading = false
    })
},[ state.keyword ])

/** 
 * Example 3
 * Async Associated Select
 **/

const state = $observable({
  keyword:''
})

$props({
  onSearch(keyword){
    state.keyword = keyword
  }
})

$effect(()=>{
  $self.loading = true
  fetch(\`//some.domain/getSomething?q=\${state.keyword}&other=\${$deps.VariableName}\`)
    .then(response=>response.json())
    .then(({ data })=>{
      $self.loading = false
      $self.dataSource = data
    },()=>{
      $self.loading = false
    })
},[ state.keyword, $deps.VariableName ])

/** 
 * Example 4
 * onBlur
 **/

$props({
  onChange() {
    console.log("onChange", $self.inputValue)
  },
  onPressEnter() {
    console.log("onPressEnter", $self.inputValue)
  },
  onBlur() {
    $self.loading = true
    // TODO req
    setTimeout(() => {
      $self.loading = false
      if ($form.values.name == "张文文") {
        $form.values.dept = "A部门"
      }
      if ($form.values.name == "123") {
        $form.values.dept = " B部门"
      }
    }, 100)
  },
})
/** 
 * Example 5
 * subProps 子表弹窗的一些设置
 **/
const state = $observable({
  selectedRowKeys: []//已选中的key
})
$props({
    rowKey: 'UID',//默认为key值，可自定义keyCODE
    rowSelection:{
      selectedRowKeys: state.selectedRowKeys,
      type: 'checkbox',//radio单选  checkbox多选
      onChange: (selectedRowKeys, selectedRows) => {
        state.selectedRowKeys = selectedRowKeys
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        // if (!selected) {
        //   //取消全选
        //   state.selectedRowKeys = []
        //   state.selectedRows = []
        // } else {
        //   //全选
        //   state.selectedRowKeys = selectedRows.map((item) => {
        //       return item?.ID
        //   })
        //   state.selectedRows = selectedRows
        // }
      },
      onSelect: (record, selected, selectedRows, nativeEvent) => {
        if (!selected) {
          //取消选择
        } else {
        }
      },
    },
    onOk(e){
      const button = e.currentTarget
      button.disabled = true //当前按钮设为不可编辑
      $self.setComponentProps({//弹窗关闭
        isVisible: false
      })
      button.disabled = false //结束事件后当前按钮设为可编辑
    }

})
// const customValue = (field) =>{
//   var value = field.value //子表数据
//   var codeValue = field.vaue?.map((item)=>{//某个字段的数据集合
//       return item['某个字段的code']
//   })
//   var pathSegments = field.path.segments
//   var index = pathSegments[pathSegments.length - 2] //在子表中的字段获取当前字段所在行下标
//   var parentCode = pathSegments[pathSegments.length - 3]//在子表中的字段获取当前字段所在的子表code
//   var indexValue = field.vaue?.[indx] // 指定下标
//   return{
//       value,
//       indexValue,
//       codeValue,
//       index，
//       parentCode
//   }
// }
// const pushNewData = (field) =>{//追加到最后一行
//   field.vaue = field.vaue.push({name: '11'})
// }
// const spliceIndexData = (field,index) =>{//追加到当前行的下一行
//   var value = field.vaue
//   value.splice(index,0,{});
//   field.vaue = value
// }
// const unshiftData = (field) =>{//追加到第一行
//   var value = field.vaue
//   value.unshift({});
//   field.vaue = value
// }
// const deleteIndexData = (field,index) =>{//根据下标删除行
//   var value = field.vaue
//   value.splice(index,1);
//   field.vaue = value
// }
// const deleteIndexData = (field,index) =>{//根据下标删除行
//   var value = field.vaue
//   field.vaue?.[index] = {}//修改的数据
//   field.vaue = value
// }

// const contactData = (field) =>{//追加多条数据 批量插入
//   var value = field.vaue
//   value = value.concat([{},{},{}])
//   field.vaue = value
// }

// //其他控件调用子表
// $self.query('子表code').take((field)=>{
//   customValue(field) 
// })

// //子表自身
// customValue($self)
/** 
 * Example 5
 * 通用的设置值获取值的方法
 **/
//  //获取值
//  //获取当前字段值
//  $self.value
//  //当前字段在自表中获取其他子表数据
//  const pathSegments = $self.path.segments
//  const index = pathSegments[pathSegments.length - 2]
//  const parentCode = pathSegments[pathSegments.length - 3]//tableName
//   $form?.values?.[parentCode]?.[index]?.['字段code']
//  //主表具体某一字段的值  也可获取子表的全部数据值
//  $form?.values?.['字段code']
 
 
//  //设置值 
//  //获取当前字段值
//  $self.value = 值
//  //当前字段在自表中设置子表值
//  const pathSegments = $self.path.segments
//  const index = pathSegments[pathSegments.length - 2]//可通过当前index修改所在行的子表值
//  const parentCode = pathSegments[pathSegments.length - 3]
//  $form?.values?.[parentCode][index]= 行值
//  $form?.values?.[parentCode][index]['字段code'] = 值
//  $form.setValues({ [parentCode]:  子表整体的值})
//  //设置其他字段值
//  form.setValues({code: value})
// $self.query('字段CODE/子表CODE 等等').take((field)=>{
//   field.属性名 = 值
//   field.disabled = true
// })
${GlobalHelper}
`
