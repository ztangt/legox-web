/**
 * @author zhangww
 * @description 桌面布局（right）
 */
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import { emptyLayoutState } from '../../../../util/constant';
import { GoldenLayoutComponent } from '../../../../componments/GoldenLayout/goldenLayoutComponent';
import ColumnApp from '../columnApp';
import ColumnNotice from '../columnNotice';
import ColumnProfile from '../columnProfile';
import ColumnFollow from '../columnFollow';
import ColumnBacklog from '../columnBacklog';
import ColumnBacklogOther from '../columnBacklogOther';
import ColumnCalendar from '../columnCalendar';
import ColumnWorkList from '../columnWorkList';
import ColumnInformation from '../columnInformation';
import ColumnFree from '../columnFree';

//个人桌面配置
const mainSettings = {
  settings: {
    hasHeaders: false,
    showCloseIcon: true,
    showPopoutIcon: false,
    reorderEnabled: false,
    showPopoutIcon: false,
    showMaximiseIcon: false,
    constrainDragToContainer: false,
  },
};

// TODO: 配置项 后续或有更改
const selectData = [
  { key: 'ColumnApp', component: ColumnApp, name: '常用应用' },
  { key: 'ColumnProfile', component: ColumnProfile, name: '个人信息' },
  { key: 'ColumnBacklog', component: ColumnBacklog, name: '待办事项' },
  { key: 'ColumnBacklogOther', component: ColumnBacklogOther, name: '待办事项-全部' },
  { key: 'ColumnNotice', component: ColumnNotice, name: '通知公告' },
  { key: 'ColumnCalendar', component: ColumnCalendar, name: '日程管理' },
  { key: 'ColumnFollow', component: ColumnFollow, name: '跟踪事项' },
  { key: 'ColumnWorkList', component: ColumnWorkList, name: '工作事项' },
  { key: 'ColumnInformation', component: ColumnInformation, name: '资讯公告' },
];

function DesktopLayout({ dispatch, desktopLayout, type }) {
  const { layoutState, isFinsh, addData, addTextData } = desktopLayout;

  // 获取右侧渲染栏目的所有titile
  function getAllContentItemsTitle(arr, content) {
    for (let i = 0; i < content.length; i++) {
      content[i].title && arr.push(content[i].title);
      content[i].content && getAllContentItemsTitle(arr, content[i].content);
    }
    return arr;
  }

  // 渲染dragSource（一个source仅一次拖拽操作）
  function renderDragSource(myLayout, item, index, title) {
    if (index === 0) {
      const titleEle = $("<li class='column_title'>" + title + '</li>');
      $('#menuContainer').append(titleEle);
    }
    // const element = $('<li>' + item.name + '</li>');
    let element
    if (item?.dr == 1) {
      element = $('<li style="display:none;" >' + item.name + '</li>');
    } else {
      element = $('<li>' + item.name + '</li>');
    }
    $('#menuContainer').append(element);
    if (
      !layoutState ||
      !getAllContentItemsTitle([], layoutState.content).includes(element.text())
    ) {
      const newItemConfig = {
        title: item.name,
        type: 'react-component',
        component: item.key,
      };
      myLayout.createDragSource(element, newItemConfig);
    } else {
      setStyle(element, 'not-allowed', '该功能已存在!');
    }
  }

  // 获取拖到右侧的dragSource
  function getRemoveSingleSource(myLayout, tab) {
    for (let i = 0; i < myLayout._dragSources.length; i++) {
      if (
        myLayout._dragSources[i]._itemConfig.component ===
        tab.contentItem.config.component
      ) {
        return myLayout._dragSources[i];
      }
    }
  }

  // 获取布局state
  function gainState() {
    return layoutState ? layoutState : emptyLayoutState;
  }

  function setStyle(dom, state, title) {
    dom.css('cursor', state);
    dom.attr('title', title);
  }

  function defaultHeight() {
    let height = '100%';
    height = type === 'main' ? '90%' : '100%';
    return height;
  }

  return (
    <>
      {isFinsh && (
        <GoldenLayoutComponent
          htmlAttrs={{ style: { height: defaultHeight(), width: '100%' } }}
          config={
            type === 'main'
              ? Object.assign({}, gainState(), mainSettings)
              : gainState()
          }
          // 组件注册（events all in）
          registerComponents={myLayout => {
            selectData.map((item, index) => {
              myLayout.registerComponent(item.key, item.component);
              type !== 'main' &&
                renderDragSource(myLayout, item, index, '内置栏目');
            });

            addData.map((item, index) => {
              myLayout.registerComponent(item.key, ColumnFree);
              type !== 'main' &&
                renderDragSource(myLayout, item, index, '自定义栏目');
            });

            addTextData.map((item, index) => {
              myLayout.registerComponent( item.key, function(){
                  return <ColumnFree id={item.id} val="文字栏目"></ColumnFree>;
              });
              type !== 'main' &&
                renderDragSource(myLayout, item, index, '文字栏目');
            });

            // 初始化 在调用 layout.init() 并创建布局树后触发
            myLayout.on('initialised', function() {
              setTimeout(() => {
                if (type === 'main') {
                  // tmp calculate
                  myLayout.updateSize(
                    $(window).width() -
                      $('.ant-layout-sider-children').width() -
                      50,
                    $(window).height() - 150,
                  );
                } else {
                  myLayout.updateSize();
                }
              });
            });

            // 布局变化时执行(首次渲染也会执行)
            myLayout.on('stateChanged', function() {
              $(window).on('resize', function() {
                if (type === 'main') {
                  // tmp calculate
                  myLayout.updateSize(
                    $(window).width() -
                      $('.ant-layout-sider-children').width() -
                      50,
                    $(window).height() - 150,
                  );
                } else {
                  myLayout.updateSize();
                }
              });
              if (type !== 'main') {
                const state = myLayout.toConfig();
                // const state = JSON.stringify(myLayout.toConfig());
                dispatch({
                  type: 'desktopLayout/updateStates',
                  payload: {
                    layoutState: state,
                  },
                });
              }
            });

            // 栏目添加时执行(首次渲染也会执行)
            myLayout.on('tabCreated', function(tab) {
              if (getRemoveSingleSource(myLayout, tab)) {
                myLayout.removeDragSource(getRemoveSingleSource(myLayout, tab));
                $('#menuContainer')
                  .find('li')
                  .each(function() {
                    if ($(this).text() === tab.contentItem.config.title) {
                      setStyle($(this), 'not-allowed', '该功能已存在!');
                      return false;
                    }
                  });
              }
            });

            // 删除栏目时执行
            myLayout.on('itemDestroyed', function(item) {
              if (item.config.title) {
                const newItemConfig = {
                  title: item.config.title,
                  type: 'react-component',
                  component: item.config.component,
                };
                $('#menuContainer')
                  .find('li')
                  .each(function() {
                    if ($(this).text() === item.config.title) {
                      myLayout.createDragSource($(this), newItemConfig);
                      setStyle($(this), 'pointer', '');
                      return false;
                    }
                  });
              }
            });
          }}
        />
      )}
    </>
  );
}
export default connect(({ desktopLayout }) => ({
  desktopLayout,
}))(DesktopLayout);
