module.exports = {
  closeReSize: true, //关闭limit更新
  BASE_WIDTH: (150 / 1660) * window.screen.width, // 基础宽度
  ORDER_WIDTH: 60, // 序号宽度
  PADDING_HEIGHT: 20, // padding 高度
  TABLE_HEAD_HEIGHT: 40, // 表格头高度
  PAGE_NATION_HEIGHT: 52, // 分页表格高度
  MODAL_PADDING_TOP: 8,
  MODAL_PADDING_HEADER: 40,
  MODAL_PADDING_FOOTER: 47,
  defaultLayoutState: {
    "settings": {
      "hasHeaders": true,
      "constrainDragToContainer": false,
      "reorderEnabled": true,
      "selectionEnabled": false,
      "popoutWholeStack": false,
      "blockedPopoutsThrowError": true,
      "closePopoutsOnUnload": true,
      "showPopoutIcon": false,
      "showMaximiseIcon": false,
      "showCloseIcon": true,
      "responsiveMode": "onload",
      "tabOverlapAllowance": 0,
      "reorderOnTabMenuClick": true,
      "tabControlOffset": 10
    },
    "dimensions": {
      "borderWidth": 8,
      "borderGrabWidth": 8,
      "minItemHeight": 10,
      "minItemWidth": 10,
      "headerHeight": 20,
      "dragProxyWidth": 500,
      "dragProxyHeight": 300
    },
    "labels": {
      "close": "关闭",
      "maximise": "最大化",
      "minimise": "最小化",
      "popout": "弹出",
      "popin": "pop in",
      "tabDropdown": "additional tabs"
    },
    "content": [{
      "type": "row",
      "isClosable": true,
      "reorderEnabled": true,
      "title": "",
      "height": 100,
      "content": [{
        "type": "stack",
        "header": {},
        "isClosable": true,
        "reorderEnabled": true,
        "title": "",
        "activeItemIndex": 0,
        "width": 50,
        "height": 100,
        "content": [{
          "title": "工作事项",
          "type": "component",
          "component": "ColumnWorkList",
          "componentName": "lm-react-component",
          "isClosable": true,
          "reorderEnabled": true
        }]
      }, {
        "type": "column",
        "isClosable": true,
        "reorderEnabled": true,
        "title": "",
        "width": 50,
        "content": [{
          "type": "stack",
          "header": {},
          "isClosable": true,
          "reorderEnabled": true,
          "title": "",
          "activeItemIndex": 0,
          "height": 50,
          "content": [{
            "title": "日程管理",
            "type": "component",
            "component": "ColumnCalendar",
            "componentName": "lm-react-component",
            "isClosable": true,
            "reorderEnabled": true
          }]
        }, {
          "type": "stack",
          "header": {},
          "isClosable": true,
          "reorderEnabled": true,
          "title": "",
          "activeItemIndex": 0,
          "height": 50,
          "width": 50,
          "content": [{
            "title": "通知公告",
            "type": "component",
            "component": "ColumnNotice",
            "componentName": "lm-react-component",
            "isClosable": true,
            "reorderEnabled": true
          }]
        }]
      }]
    }],
    "isClosable": true,
    "reorderEnabled": true,
    "title": "",
    "openPopouts": [],
    "maximisedItemId": null
  },
  emptyLayoutState: {
    "settings": {
      "hasHeaders": true,
      "constrainDragToContainer": false,
      "reorderEnabled": true,
      "selectionEnabled": false,
      "popoutWholeStack": false,
      "blockedPopoutsThrowError": true,
      "closePopoutsOnUnload": true,
      "showPopoutIcon": false,
      "showMaximiseIcon": false,
      "showCloseIcon": true,
      "responsiveMode": "onload",
      "tabOverlapAllowance": 0,
      "reorderOnTabMenuClick": true,
      "tabControlOffset": 10
    },
    "dimensions": {
      "borderWidth": 8,
      "borderGrabWidth": 8,
      "minItemHeight": 10,
      "minItemWidth": 10,
      "headerHeight": 20,
      "dragProxyWidth": 500,
      "dragProxyHeight": 300
    },
    "labels": {
      "close": "关闭",
      "maximise": "最大化",
      "minimise": "最小化",
      "popout": "弹出",
      "popin": "pop in",
      "tabDropdown": "additional tabs"
    },
    "content": [],
    "isClosable": true,
    "reorderEnabled": true,
    "title": "",
    "openPopouts": [],
    "maximisedItemId": null
  },
  BASE_WIDTH: (150/1660)*window.screen.width, // 基础宽度
  ORDER_WIDTH: 60, // 序号宽度
  PADDING_HEIGHT: 20, // padding 高度 
  TABLE_HEAD_HEIGHT: 40, // 表格头高度
  PAGE_NATION_HEIGHT: 52, // 分页表格高度
  WRITE_BORDER_LIST: [
    {
      name: 'windows系统-蒙恬（L370、L398p、L500）',
      value: 'WINDOWS_MT',
    },
    {
      name: 'windows系统-汉王（ESP370、ESP500、ESP560）',
      value: 'WINDOWS_HW',
    },
    {
      name: '国产化系统-汉王-统信4016系统专用（ESP560）',
      value: 'HW_ESP560',
    },
    {
      name: '国产化系统-汉王-银河麒麟系统V10（SP1）专用',
      value: 'HW_SP1',
    },
    {
      name: '国产化系统-蒙恬-统信银河麒麟系统（L370、L398P）',
      value: 'MT_L370_L398p',
    },
    {
      name: '国产化系统-蒙恬-统信银河麒麟系统（L500）',
      value: 'MT_L500',
    },
  ],
}