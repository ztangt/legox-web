import { dataFormat,moneyFormateKilobit } from './util';
import styles from './list.less'
const titleRender=(columnCode,showStyle,text,showStyleInfo)=>{
    if(showStyle=='DATE'){
      return dataFormat(text,showStyleInfo)
    }else if(columnCode=='BIZ_STATUS'){
      return text=='1'?'在办':(text=='2'?'办结':"待发")
    }else{
      return text;
    }
}
const widthShow=(width)=>{
    let widths = width.split(',');
    return widths[0]+widths[1];
  }
export const widthShowCol=(width)=>{
    let widths = width.split(',');
    return calc(`${widths[0]+widths[1]} + 32px`);
}
 const styleInfo = (col,alignStyleName)=>{
    console.log('alignStyleName',col,alignStyleName,col[alignStyleName])
    if(col.width){
      if(col[alignStyleName]=='MIDDLE'){
        return {width:widthShow(col.width),paddingRight:'16px',paddingLeft:"16px",textAlign:'center'}
      }else if(col[alignStyleName]=='RIGHT'){
        return {width:widthShow(col.width),paddingLeft:"16px",textAlign:'right'}
      }else{
        return {width:widthShow(col.width),paddingRight:'16px',textAlign:'left'}
      }
    }else{
      if(col[alignStyleName]=='MIDDLE'){
        return {minWidth:`${col.columnName.length*15+32}px`,paddingRight:'16px',paddingLeft:"16px",textAlign:'center'}
      }else if(col[alignStyleName]=='RIGHT'){
        return {minWidth:`${col.columnName.length*15+32}px`,paddingLeft:"16px",textAlign:'right'}
      }else{
        return {minWidth:`${col.columnName.length*15+32}px`,paddingRight:'16px',textAlign:'left'}
      }
    }
  }
    export const renderHtml=(col,text,newLineFlag,alignStyleName)=>{
      console.log('alignStyleName',col,text,newLineFlag,alignStyleName)

    if(text=='0E-8'){//后端返回的问题，单独改变这个
      text='0.00';
    }
    //列表建模中设置了金额但是表单中随便输入的时候，如果是字符串则正常显示
    if(col.showStyle=='MONEY'&&typeof text!='undefined'&&text!=''){
      console.log('wwwwww======');
      //提取数字部分
      text = parseFloat(text);
      if(col.showStyleInfo=='SIXTH' ||col.showStyleInfo=='THUS_SIX'){
        text = text.toFixed(6)
      }else if(col.showStyleInfo=='FOURTH' ||col.showStyleInfo=='THUS_FOU'){
        text = text.toFixed(4)
      }else{
        text = text.toFixed(2)
      }
      if(col.showStyleInfo=='THUS_SIX'||col.showStyleInfo=='THUS_FOU'||col.showStyleInfo=='THUS_SEC'){
        text = moneyFormateKilobit(text)
      }
      return <p
              title={text}
              style={styleInfo(col,alignStyleName)}
              className={newLineFlag?'':styles.ellipsis}

            >
              {text}
            </p>
    }if(col.showStyle=='DATE'&&typeof text!='undefined'&&text!=''){
        
        return <p
                title={text}
                style={styleInfo(col,alignStyleName)}
                className={newLineFlag?'':styles.ellipsis}
              >
                {dataFormat(text,col.showStyleInfo)}
              </p>
    }else{
      let newText = titleRender(col.columnCode,col.showStyle,text,col.showStyleInfo);
      return <p
          title={newText}
          style={styleInfo(col,alignStyleName)}
          className={newLineFlag?'':styles.ellipsis}

        >
          {newText}
        </p>
    }
  }