import React, { useEffect, useRef } from 'react';
import Luckysheet from 'luckysheet';
import {history} from 'umi';
import { parse } from 'query-string';
import LuckyExcel from 'luckyexcel';
const ExcelPreview = ({  }) => {
  const query = parse(history.location.search);
  const excelFile = query.src;
  const openExcel = (props) => {
    const {url,name} = props;
    LuckyExcel.transformExcelToLuckyByUrl(url, name,(exportJson, luckysheetfile) => {
      if (exportJson.sheets == null || exportJson.sheets.length === 0) {
        alert("Fail to read the content of the excel file")
        return;
      }
      // luckysheet生成网页excel
      window.luckysheet.destroy()
      window.luckysheet.create({
        container: 'luckysheet', // 设定DOM容器的id
        showtoolbar: false, // 是否显示工具栏
        showinfobar: false, // 是否显示顶部信息栏
        lang: 'zh', // 设定表格语言
        showsheetbar: true, // 默认就是true，可以不设置
        showsheetbarConfig: {
          add: false, //新增sheet
          menu: false, //sheet管理菜单
        },
        cellRightClickConfig:{
          copy: false, // 复制
          copyAs: false, // 复制为
          paste: false, // 粘贴
          insertRow: false, // 插入行
          insertColumn: false, // 插入列
          deleteRow: false, // 删除选中行
          deleteColumn: false, // 删除选中列
          deleteCell: false, // 删除单元格
          hideRow: false, // 隐藏选中行和显示选中行
          hideColumn: false, // 隐藏选中列和显示选中列
          rowHeight: false, // 行高
          columnWidth: false, // 列宽
          clear: false, // 清除内容
          matrix: false, // 矩阵操作选区
          sort: false, // 排序选区
          filter: false, // 筛选选区
          chart: false, // 图表生成
          image: false, // 插入图片
          link: false, // 插入链接
          data: false, // 数据验证
          cellFormat: false // 设置单元格格式
        },   
        sheetRightClickConfig:{
          delete: false, // 删除
          copy: false, // 复制
          rename: false, //重命名
          color: false, //更改颜色
          hide: false, //隐藏，取消隐藏
          move: false, //向左移，向右
        },
        menuRightClickConfig:{
          copy: false, // 复制
          copyAs: false, // 复制为
          paste: false, // 粘贴
          insertRow: false, // 插入行
          insertColumn: false, // 插入列
          deleteRow: false, // 删除选中行
          deleteColumn: false, // 删除选中列
          deleteCell: false, // 删除单元格
          hideRow: false, // 隐藏选中行和显示选中行
          hideColumn: false, // 隐藏选中列和显示选中列
          rowHeight: false, // 行高
          columnWidth: false, // 列宽
          clear: false, // 清除内容
          matrix: false, // 矩阵操作选区
          sort: false, // 排序选区
          filter: false, // 筛选选区
          chart: false, // 图表生成
          image: false, // 插入图片
          link: false, // 插入链接
          data: false, // 数据验证
          cellFormat: false // 设置单元格格式
        },
      
        showstatisticBar: false, // 是否显示底部计数栏
        sheetBottomConfig: false, // sheet页下方的添加行按钮和回到顶部按钮配置
        allowEdit: false, // 是否允许前台编辑
        enableAddRow: false, // 是否允许增加行
        enableAddCol: false, // 是否允许增加列
        sheetFormulaBar: false, // 是否显示公式栏
        enableAddBackTop: false, //返回头部按钮
        data: exportJson.sheets, //表格内容
        title: exportJson.info.name, //表格标题
      });
    })
  };
 useEffect(()=>{
  openExcel({url:excelFile,name:'表格'});
 },[])
  return <div id={"luckysheet"} style={{ width: "100%", height: "100%" }} />;
};
 
export default ExcelPreview;