import * as ReactVTable from '@visactor/react-vtable';
import * as VTable from '@visactor/vtable';
import { forwardRef, useEffect, useRef, useState } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import NoDataImg from '../../pages/assets/noData.svg';
import EditorDiv from './divEditor';
/*
 * @columns 表格列配置
 * {
 *   title: '标题',被插件转化为了caption,
 *   field: '显示字段',
 *   width: '宽度',
 *   cellType: '单元格类型',
 *   fieldFormat: '格式化单元格值回调函数',
 *   formatValueCallBack: '双击时：格式化单元格值回调函数'
 * }
 * @headId 表头id
 * @others 其他配置
 * @getLimit 获取表格行数
 *
 * */

//修改排序图标
VTable.register.icon('sort_normal', {
    type: 'svg',
    svg: '<svg t="1716526144988" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6475" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M256 576 768 576 512 832Z" fill="#bfbfbf" p-id="6476" data-spm-anchor-id="a313x.search_index.0.i25.79593a81vnyimm" class="selected"></path><path d="M768 448 256 448 512 192Z" fill="#bfbfbf" p-id="6477" data-spm-anchor-id="a313x.search_index.0.i24.79593a81vnyimm" class="selected"></path></svg>',
    width: 16, //其实指定的是svg图片绘制多大，实际占位是box，margin也是相对阴影范围指定的
    height: 16,
    funcType: VTable.TYPES.IconFuncTypeEnum.sort,
    positionType: VTable.TYPES.IconPosition.right,
    marginLeft: 0,
    marginRight: 0,
    name: 'sort_normal',
    cursor: 'pointer',
});
VTable.register.icon('sort_downward', {
    type: 'svg',
    svg: '<svg t="1716526144988" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6475" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M256 576 768 576 512 832Z" fill="#bfbfbf" p-id="6476" data-spm-anchor-id="a313x.search_index.0.i25.79593a81vnyimm" class="selected"></path><path d="M768 448 256 448 512 192Z" fill="#1890ff" p-id="6477" data-spm-anchor-id="a313x.search_index.0.i24.79593a81vnyimm" class=""></path></svg>',
    width: 16, //其实指定的是svg图片绘制多大，实际占位是box，margin也是相对阴影范围指定的
    height: 16,
    funcType: VTable.TYPES.IconFuncTypeEnum.sort,
    positionType: VTable.TYPES.IconPosition.right,
    marginLeft: 0,
    marginRight: 0,
    name: 'sort_downward',
    cursor: 'pointer',
});

VTable.register.icon('sort_upward', {
    type: 'svg',
    svg: `<svg t="1716526144988" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6475" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M256 576 768 576 512 832Z" fill="#1890ff" p-id="6476" data-spm-anchor-id="a313x.search_index.0.i25.79593a81vnyimm" class="selected"></path><path d="M768 448 256 448 512 192Z" fill="#bfbfbf" p-id="6477" data-spm-anchor-id="a313x.search_index.0.i24.79593a81vnyimm" class=""></path></svg>`,
    width: 16, //其实指定的是svg图片绘制多大，实际占位是box，margin也是相对阴影范围指定的
    height: 16,
    funcType: VTable.TYPES.IconFuncTypeEnum.sort,
    positionType: VTable.TYPES.IconPosition.right,
    marginLeft: 0,
    marginRight: 0,
    name: 'sort_upward',
    cursor: 'pointer',
});

const BG_COLOR = (args) => {
    const row = args.row;
    //判断是否是偶数
    if (row % 2 === 0) {
        return '#f8f9fa';
    } else {
        return '#fff';
    }
};
//判断表格是否可以选择
const getIsEditor = (item) => {
    let cellType = item.cellType ? item.cellType : 'text';
    let editorText = '';
    //title被转化为了caption
    if (
        cellType == 'link' ||
        (cellType == 'text' &&
            item.title != '操作' &&
            item.title != '序号' &&
            item.caption != '操作' &&
            item.caption != '序号')
    ) {
        editorText = 'div-editor';
    }
    return editorText;
};

const VTableReact = forwardRef(({ columns = [], getLimit, headId, ...others }, ref) => {
    const [curHeight, setCurHeight] = useState(0);
    const isInit = useRef(false);
    //实现监听表格上表单的高度变化
    useEffect(() => {
        const observer = new ResizeObserver((entries) => {
            for (let entry of entries) {
                // entry.target 是被观察的元素
                // entry.contentRect 包含了元素的尺寸信息（如 width, height, left, top 等）
                // 在这里，你可以根据元素的新尺寸来执行相应的操作
                console.log(entry.contentRect, '被观察的元素');
                const baseHeight = document.querySelector('.ant-tabs-content').clientHeight - 40 - 18;
                const { height, top, y, bottom } = entry.contentRect;
                let headerHeight = bottom; //计算时加上了算bottom的值
                console.log(headerHeight, '头部的高度');
                let newHeight = baseHeight - headerHeight;
                console.log(newHeight, '表格的高度有headId');
                setCurHeight(newHeight > 0 ? newHeight : 500);
            }
        });
        if (headId && document.getElementById(headId)) {
            observer.observe(document.getElementById(headId));
        } else {
            const baseHeight = document.querySelector('.ant-tabs-content').clientHeight - 40 - 18;
            console.log(baseHeight, '表格的高度无headId');
            setCurHeight(baseHeight > 0 ? baseHeight : 500);
        }
        return () => {
            observer.disconnect();
        };
    }, []);

    useEffect(() => {
        if (getLimit && curHeight > 0) {
            isInit.current = true;
            getLimit(Math.floor((curHeight - 40) / 46));
        }
    }, [curHeight]);

    return (
        <div style={{ borderTop: '1px solid', height: curHeight }}>
            <ReactVTable.ListTable
                {...others}
                height={curHeight}
                ref={ref}
                onReady={(instance) => {
                    //注册编辑器
                    const div_editor = new EditorDiv({ vTableRef: instance });
                    VTable.register.editor('div-editor', div_editor);
                }}
                columns={columns.map((item) => ({
                    ...item,
                    editor: getIsEditor(item),
                    headerEditor: getIsEditor(item),
                    editCellTrigger: 'doubleclick',
                    style: {
                        bgColor: BG_COLOR,
                    },
                }))}
                autoWrapText={true}
                defaultHeaderRowHeight={40}
                theme={{
                    columnResize: {
                        lineColor: '#1890ff',
                    },
                    scrollStyle: {
                        visible: 'always',
                        width: 12,
                        scrollSliderColor: '#e9e9e9',
                    },
                    selectionStyle: {
                        cellBgColor: 'rgba(208,224,252, 0.1)',
                        cellBorderColor: '#1890ff',
                    },
                    bodyStyle: {
                        color: '#333',
                        fontSize: 14,
                        textBaseline: 'middle',
                        lineHeight: 20,
                        borderColor: '#f0f0f0',
                        hover: {
                            cellBgColor: '#d0e0fc',
                        },
                        padding: 13,
                    },
                    headerStyle: {
                        bgColor: '#fafafa',
                        lineClamp: 'auto',
                        textBaseline: 'middle',
                        color: '#333',
                        borderColor: '#f0f0f0',
                        fontSize: 14,
                        lineHeight: 20,
                        fontWeight: 'bold',
                    },
                    frozenColumnLine: {
                        shadow: {
                            width: 6,
                            startColor: 'rgba(0, 0, 0, 0.1)',
                            endColor: 'rgba(0, 0, 0, 0)',
                        },
                    },
                }}
                heightMode={'autoHeight'}
                autoFillWidth={true}
                emptyTip={{
                    text: '暂无数据',
                    textStyle: {
                        color: '#00000040',
                        fontSize: 14,
                    },
                    icon: {
                        width: 64,
                        height: 40,
                        image: NoDataImg,
                    },
                }}
            />
        </div>
    );
});

export default VTableReact;
