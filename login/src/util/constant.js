module.exports = {
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
        "width": 58.769230769230774,
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
        "width": 41.230769230769226,
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
          "width": 41.230769230769226,
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
  MODAL_PADDING_TOP: 8,
  MODAL_PADDING_HEADER: 40,
  MODAL_PADDING_FOOTER: 47,

}