const tsfFeld = 'TSTSTSTSTSTSTSTTS20221019'

export function injectCodeSnippet(
  primaryTableName,
  guizeArr,
  optTypeArr,
  resultTypeArr,
  toggleCaseArr,
  eventTypeArr,
  guizeNumberArr,
  toggleColumnArr
) {
  let someCode = []
  guizeArr.forEach((guize, index) => {
    // 1.去空格
    guize = guize.replace(/\s*/g, '')
    // 2.先分割表达式 根据=  一左一右分割
    let leftE, rightE, rightEBefore
    guize.indexOf('=')
    leftE = guize.slice(0, guize.indexOf('=')) //左侧·表达式    "BDHKHSC:ZED"
    rightEBefore = rightE = guize.slice(guize.indexOf('=') + 1) //右侧·表达式   "(BDHKHSC:JTF+BDHKHSC:HSF)*BDHKHSC:RS"
    if (rightEBefore.indexOf('sum(') < 0 && rightEBefore.indexOf('(') > -1) {
      rightE = rightE.replace('(', '').replace(')', '')
    }
    // 3.  根据:再分割  **一步到位**（左侧·表达式）
    let leftTableName = leftE.split(':')[0] //左侧·表达式 --->结果字段 表名  "BDHKHSC"
    let leftResField = leftE.split(':')[1] //左侧·表达式 --->结果字段 字段名   "ZED"
    // 4. 根据（+-*/）再分割  **需再处理下**（右侧·表达式）
    let separator = /\+|-|\*|\//
    let expressArr = rightE.split(separator) //表达式数组（根据运算符切割）
    // 5. 右侧表单名&右侧字段名&运算符  (数组)
    let symbolString = rightE
      .replace(/\([^\)]*\)/g, '')
      .replace(/[a-zA-Z]+/g, '')
      .replace(/[0-9]+/g, '')
      .replace(/:/g, '')
      .replace(/\./g, '')
      .replace(/\_/g, '')
    //去掉字母 数字&:() _ .
    let symbolArr = symbolString.split('') //整理 所有运算符  ['*', '']
    symbolArr.push('') // 运算符数组  为方便 尾部push个空字符
    const rightTableArr = [] // 右侧·表达式 ---> 表名数组   ['(BDHKHSC', 'BDHKHSC', 'BDHKHSC']
    const rightFieldArr = [] // 右侧·表达式 ---> 字段数组   ['JTF', 'HSF)', 'RS']
    for (let i = 0; i < expressArr.length; i++) {
      if (expressArr[i].indexOf(':') > -1) {
        rightTableArr.push(expressArr[i].split(':')[0])
        rightFieldArr.push(expressArr[i].split(':')[1])
      } else {
        rightTableArr.push(tsfFeld) //特殊filed
        rightFieldArr.push(expressArr[i])
      }
    }

    if (optTypeArr[index] === 'DATE') {
      //  1 .左右表名相同  主表
      if (isSameTableByDate(primaryTableName, rightTableArr)) {
        if (rightTableArr.includes(tsfFeld)) {
          //有数字
          let code1 = transferDateCode(rightFieldArr, ['&&', ''], 'form.values')
          let code2 = transferDateCode(rightFieldArr, [',', ''], 'form.values')

          rightFieldArr.forEach((el) => {
            if (!IsNum(el)) {
              someCode.push({
                key: el,
                val: `if (${code1}) {
                  form.values.${leftResField} = calculateTime(${code2},'${resultTypeArr[index]}')${symbolArr[1]}${rightFieldArr[2]}
                }`,
              })
            }
          })
        } else {
          // 无数字
          let code1 = transferDateCode(rightFieldArr, ['&&', ''], 'form.values')
          let code2 = transferDateCode(rightFieldArr, [',', ''], 'form.values')
          rightFieldArr.forEach((el) => {
            someCode.push({
              key: el,
              val: `if (${code1}) {
                form.values.${leftResField} = calculateTime(${code2},'${resultTypeArr[index]}')
              }`,
            })
          })
        }
      }

      // 2. 左右表名相同 浮动表
      if (
        isSameTableByDate(leftTableName, rightTableArr) &&
        leftTableName !== primaryTableName
      ) {
        if (rightTableArr.includes(tsfFeld)) {
          //有数字
          if (rightTableArr.length === 2) {
            someCode.push({
              key: `${leftTableName}.*.${rightFieldArr[0]}`,
              val: `
              if (form.values.${leftTableName}) {
                for (let i = 0; i < form.values.${leftTableName}.length; i++) {
                  const item = form.values.${leftTableName}[i];
                  item.${leftResField} = item.${rightFieldArr[0]}${symbolArr[0]}${rightFieldArr[1]} 
                }
              }`,
            })
          } else {
            let code1 = transferDateCode(rightFieldArr, ['&&', ''])
            let code2 = transferDateCode(rightFieldArr, [',', ''])
            rightFieldArr.forEach((el) => {
              if (!IsNum(el)) {
                someCode.push({
                  key: `${leftTableName}.*.${el}`,
                  val: `
                  if (form.values.${leftTableName}) {
                    for (let i = 0; i < form.values.${leftTableName}.length; i++) {
                      const item = form.values.${leftTableName}[i];
                      if (${code1}) {
                        item.${leftResField} = calculateTime(${code2},'${resultTypeArr[index]}')${symbolArr[1]}${rightFieldArr[2]} 
                      }
                    }
                  }
                  `,
                })
              }
            })
          }
        } else {
          // 无数字
          let code1 = transferDateCode(rightFieldArr, ['&&', ''])
          let code2 = transferDateCode(rightFieldArr, [',', ''])
          rightFieldArr.forEach((el) => {
            someCode.push({
              key: `${leftTableName}.*.${el}`,
              val: `
              if (form.values.${leftTableName}) {
                for (let i = 0; i < form.values.${leftTableName}.length; i++) {
                  const item = form.values.${leftTableName}[i];
                  if (${code1}) {
                    item.${leftResField} = calculateTime(${code2},'${resultTypeArr[index]}');
                  }
                }
              }
              `,
            })
          })
        }
      }
    } else {
      // 仅处理（）  不包含sum()
      if (rightEBefore.indexOf('sum(') < 0 && rightEBefore.indexOf('(') > -1) {
        // 主表的
        if (isSameTable(primaryTableName, rightTableArr)) {
          let code = rightEBefore
          // (BDHKHSC:JTF+BDHKHSC:HSF)*BDHKHSC:RS
          let reg = new RegExp(`${primaryTableName}:`, 'g')
          code = code.replace(reg, 'form.values.')

          rightFieldArr.forEach((el) => {
            let expression = ''
            expression = `
              onFieldChange('${el}', (field, form) => {
                form.values.${leftResField} = ${code}
              })
            `
            someCode.push({
              key: `${el}`,
              val: `form.values.${leftResField} = ${code}`,
            })
          })
          // 仅处理子表对子表  别的情况我不处理了  设置的时候注意
        } else {
          // console.log('guizeNumberArr:',guizeNumberArr,index,guizeNumberArr[index]);
          let code = ''
          if (guizeNumberArr[index]) {
            code = guizeNumberArr[index]
          } else {
            code = rightEBefore
          }
          // (BDHKHSC:JTF+BDHKHSC:HSF)*BDHKHSC:RS
          let reg = new RegExp(`${leftTableName}:`, 'g')
          code = code.replace(reg, 'item.')
          // if (toggleCaseArr[index] == 1) {
          //   code = `dealBigMoney(${code})`
          // }
          let resCode
          resCode = `
          for (let i = 0; i < form.values.${leftTableName}.length; i++) {
            const item = form.values.${leftTableName}[i];
            item.${leftResField} = ${code};
          }`
          rightFieldArr.forEach((el) => {
            someCode.push({
              key: `${leftTableName}.*.${el}`,
              val: `${resCode}`,
            })
          })
        }
      } else {
        // BDHKHSC:ZED=(BDHKHSC:JTF+BDHKHSC:HSF)*BDHKHSC:RS
        // if (    sum( !
        //  1 .左右表名相同  主表
        if (
          isSameTable(leftTableName, rightTableArr) &&
          leftTableName == primaryTableName
        ) {
          let resCode = transferCode(rightFieldArr, symbolArr, 'form.values')
          let code = ''
          let dealBigCode = ''
          if (toggleCaseArr[index] == 1 && toggleColumnArr[index]) {
            dealBigCode = `
              onFieldChange('${leftResField}', (field, form) => {
                form.values.${toggleColumnArr[index]} = dealBigMoney(form.values.${leftResField})
              })
            `
            someCode.push({
              key: `${leftResField}`,
              val: `form.values.${toggleColumnArr[index]} = dealBigMoney(form.values.${leftResField})`,
            })
          }

          code = `form.values.${leftResField} = ${resCode}`

          rightFieldArr.forEach((el) => {
            let expression = ''
            if (!IsNum(el)) {
              expression = `
                onFieldChange('${el}', (field, form) => {
                  ${code}
                })
              `
              someCode.push({
                key: `${el}`,
                val: `${code}`,
              })
            }
          })
        }

        // 2. 左右表名相同 浮动表
        if (
          isSameTable(leftTableName, rightTableArr) &&
          leftTableName !== primaryTableName
        ) {
          let resCode = transferCode(rightFieldArr, symbolArr)
          let code = ''
          code = `
          for (let i = 0; i < form.values.${leftTableName}.length; i++) {
            const item = form.values.${leftTableName}[i];
            item.${leftResField} = ${resCode};
          }
          `
          rightFieldArr.forEach((el) => {
            let expression = ''
            expression = `
            onFieldChange('${leftTableName}.*.${el}', (field, form) => {
              ${code}
            })
            `
            someCode.push({
              key: `${leftTableName}.*.${el}`,
              val: `${code}`,
            })
          })
        }

        // 3. sum 合计 if 合计sum ！！！！！！！！！！！！！！！！！！！！！！！！ 切割 sum( 和   )
        if (rightE.indexOf('sum(') > -1) {
          for (let i = 0; i < rightTableArr.length; i++) {
            if (rightTableArr[i].indexOf('sum(') > -1) {
              rightTableArr[i] = rightTableArr[i].slice(4)
            }
          }
          for (let i = 0; i < rightFieldArr.length; i++) {
            if (rightFieldArr[i].indexOf(')') > -1) {
              rightFieldArr[i] = rightFieldArr[i].slice(
                0,
                rightFieldArr[i].length - 1
              )
            }
          }
          let resSumCode = ''
          for (let i = 0; i < rightTableArr.length; i++) {
            resSumCode += `
                      const ${rightFieldArr[i]}${leftResField}Data${i} = [];
                      if(!form.values.${rightTableArr[i]} && window.localStorage.getItem('teshucount') == 'on') {
                        window.localStorage.setItem('teshucount','pi');
                        message.error('表单运算失败，请检查公式配置！',5);
                        return;
                      }
                      const ${leftResField}items${i} = form.values.${rightTableArr[i]};
                      for (let j = 0; j < ${leftResField}items${i}.length; j++) {
                        const item = ${leftResField}items${i}[j];
                        if (item.${rightFieldArr[i]}) {
                          ${rightFieldArr[i]}${leftResField}Data${i}.push(toNumber(item.${rightFieldArr[i]}));
                        } else {
                          ${rightFieldArr[i]}${leftResField}Data${i}.push(0);
                        }
                      }
                      let ${rightFieldArr[i]}${leftResField}Sum${i} = 0;
                      for (let j = 0; j < ${rightFieldArr[i]}${leftResField}Data${i}.length; j++) {
                        ${rightFieldArr[i]}${leftResField}Sum${i} = ${rightFieldArr[i]}${leftResField}Sum${i} + ${rightFieldArr[i]}${leftResField}Data${i}[j];
                      }
                    `
          }
          let dealBigCode = ''
          if (toggleCaseArr[index] == 1 && toggleColumnArr[index]) {
            dealBigCode = `
              onFieldChange('${leftResField}', (field, form) => {
                form.values.${toggleColumnArr[index]} = dealBigMoney(form.values.${leftResField})
              })
            `
            // someCode += dealBigCode
            someCode.push({
              key: `${leftResField}`,
              val: `form.values.${toggleColumnArr[index]} = dealBigMoney(form.values.${leftResField})`,
            })
          }

          resSumCode += `
                  form.values.${leftResField} = ${transferSumCode(
            rightFieldArr,
            symbolArr,
            leftResField
          )};`

          // 兼容隐藏字段的拉取
          //   let expressionHide = `
          // onFieldChange('${rightTableArr[0]}.*', (field, form) => {
          //   ${resSumCode}
          // })
          // `
          //   // someCode += expressionHide
          //   someCode.push({
          //     key: `${rightTableArr[0]}.*`,
          //     val: `${resSumCode}`
          //   })

          rightFieldArr.forEach((el, i) => {
            let expression = ''
            expression = `
              onFieldChange('${rightTableArr[i]}.*.${el}', (field, form) => {
                ${resSumCode}
              })
              `
            someCode.push({
              key: `${rightTableArr[i]}.*.${el}`,
              val: `${resSumCode}`,
            })
          })
        }
      }
    }
  })
  return someCode
}

function transferCode(v1, v2, v3 = 'item') {
  let code = ''
  for (let i = 0; i < v1.length; i++) {
    if (IsNum(v1[i])) {
      code += `${v1[i]}${v2[i]}`
    } else {
      code += `(toNumber(${v3}.${v1[i]}) || 0)${v2[i]}`
    }
  }
  return code
}

function transferSumCode(v1, v2, v3) {
  let code = ''
  for (let i = 0; i < v1.length; i++) {
    code += `${v1[i]}${v3}Sum${i}${v2[i]}`
  }
  return code
}

function transferDateCode(arr, symbolArr, v = 'item') {
  let code = ''
  for (let i = 0; i < arr.length; i++) {
    if (!IsNum(arr[i])) {
      code += `${v}.${arr[i]}${symbolArr[i]}`
    }
  }
  return code
}

function isSameTable(v1, v2) {
  for (let i = 0; i < v2.length; i++) {
    if (v1 !== v2[i] && v2[i] !== tsfFeld) {
      return false
    }
  }
  return true
}

function isSameTableByDate(v1, v2) {
  for (let i = 0; i < v2.length; i++) {
    if (v1 !== v2[i] && v2[i] !== tsfFeld) {
      return false
    }
  }
  return true
}

function IsNum(s) {
  if (s != null && s != '') {
    return !isNaN(s)
  }
  return false
}
