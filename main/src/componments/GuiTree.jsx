import React, { useState, useEffect } from 'react';
import style from './GuiTree.less'
import classNames from 'classnames'
import { connect } from 'umi';
import { Checkbox, Row, Col, message, Divider } from 'antd';
const CheckboxGroup = Checkbox.Group;

function GuiTree({ dispatch, role, layoutG, guiTreeData, registerId }) {

    const { pathname } = role;
    const { searchObj } = layoutG;
    const {
        sysRegisteTree,
        sysModulesTree,
        roleModulesTree,
        roleId,
        menus
    } = searchObj[pathname];

    //合并回显树
    const loopMerge = (treeData, echoData) => {
        if (treeData && treeData.length) {
            return treeData.map(treeItem => {
                if (treeItem.children) {
                    loopMerge(treeItem.children, echoData);
                }
                treeItem.defaultChecked = false;
                echoData && echoData.forEach((echoItem, echoInd) => {
                    if (echoItem.rewriteMbType == "BUTTON") {
                        if (treeItem.nodeId == echoItem.buttonId) {
                            treeItem.defaultChecked = true;
                        }
                    } else {
                        if (treeItem.nodeId == echoItem.menuId) {
                            treeItem.defaultChecked = true;
                        }
                    }
                })
                return treeItem;
            })
        } else {
            return [];
        }
    }

    const [plainOptions, setPlainOptions] = useState([]);
    const [indeterminate, setIndeterminate] = useState(false);
    const [tempMenus, setTempMenus] = useState([]);


    const menuChecked = (ev, customInfo) => {
        if (ev.target.checked) {
            //勾选的
            if (customInfo.nodeType == "BUTTON") {
                let tempMenusItem = {
                    registerId: registerId,
                    menuId: customInfo.pid,
                    buttonId: customInfo.nodeId,
                    mbType: customInfo.nodeType,
                }
                tempMenus.push(tempMenusItem)
            } else if (customInfo.nodeType == "MENU") {
                let tempMenusItem = {
                    registerId: registerId,
                    menuId: customInfo.nodeId,
                    buttonId: '',
                    mbType: customInfo.nodeType,
                }
                tempMenus.push(tempMenusItem)
            } else {
                message.error('nodeType Error');
            }
        } else {
            //取消勾选
            tempMenus.forEach((item, ind) => {
                if (item.menuId == customInfo.nodeId) {
                    tempMenus.splice(ind, 1);
                }
            })
        }

        //父级联动
        if (customInfo.pid == "") {
            if (customInfo.children) {
                if (ev.target.checked) {
                    customInfo.children && customInfo.children.forEach(item => {
                        plainOptions.push(item.nodeId);
                    })
                } else {
                    customInfo.children && customInfo.children.forEach((item, ind) => {
                        plainOptions.forEach((plainItem, plainInd) => {
                            if (plainItem == item.nodeId) {
                                plainOptions.splice(plainInd, 1);
                            }
                        })
                    })
                }
            }
        }

        // 子级联动
        if (customInfo.nodeType == "MENU") {
            if (ev.target.checked) {
                // 勾选中的
                plainOptions.push(customInfo.nodeId);
            } else {
                // 取消勾选
                plainOptions.forEach((item, ind) => {
                    if (item == customInfo.nodeId) {
                        plainOptions.splice(ind, 1);
                    }
                })
            }
        }

        dispatch({
            type: 'role/updateStates',
            payload: {
                menus: tempMenus,
            }
        })
    }


    // 预选
    const indeterminateHandle = (highestItem) => {
        let tempBoolean = false;
        plainOptions && plainOptions.forEach(plainItem => {
            highestItem.children && highestItem.children.forEach((item, ind) => {
                if (plainItem == item.nodeId) {
                    tempBoolean = true;
                }
            })
        })
        return tempBoolean;
    }

    // 勾选
    const checkedHandle = (highestItem) => {
        let tempBoolean = true;
        highestItem.children && highestItem.children.forEach((item, ind) => {
            if (!plainOptions.includes(item.nodeId)) {
                tempBoolean = false;
            }
        })
        return highestItem.children ? tempBoolean : false;
    }

    return (
        <div div className={style.wrap} >
            {
                loopMerge(guiTreeData, roleModulesTree).map((highestItem, highestInd) => {
                    return (
                        <Row key={highestInd} className={style.elastic_box} style={{ height: `${highestItem.children && highestItem.children.length * 30}px` }}>
                            {/* <CheckboxGroup className={style.elastic_box}> */}
                            <Col className={style.highest_ele}>
                                <Checkbox onChange={(ev) => { menuChecked(ev, highestItem) }} defaultChecked={highestItem.defaultChecked} indeterminate={checkedHandle(highestItem) ? false : indeterminateHandle(highestItem)} checked={checkedHandle(highestItem)} />
                                <span className={style.inner_text}>{highestItem.nodeName}</span>
                            </Col>
                            <Col className={highestItem.children && highestItem.children[0].nodeType == "BUTTON" ? style.elastic_box : ''}>
                                {highestItem.children && highestItem.children.map((generalItem, generalInd) => {
                                    return (
                                        <Row key={generalInd} style={{ height: `30px` }}>
                                            <Col className={style.general_ele}>
                                                <Checkbox onChange={(ev) => { menuChecked(ev, generalItem) }} defaultChecked={generalItem.defaultChecked} checked={plainOptions.includes(generalItem.nodeId)} />
                                                <span className={style.inner_text}>{generalItem.nodeName}</span>
                                            </Col>
                                            <Col className={generalItem.children && generalItem.children[0].nodeType == "BUTTON" ? style.elastic_box : ''}>
                                                {generalItem.children && generalItem.children.map((mediumItem, mediumInd) => {
                                                    return (
                                                        <Row key={mediumInd}>
                                                            <Col className={style.medium_ele}>
                                                                <Checkbox onChange={(ev) => { menuChecked(ev, mediumItem) }} defaultChecked={mediumItem.defaultChecked} />
                                                                <span className={style.inner_text}>{mediumItem.nodeName}</span>
                                                            </Col>
                                                            <Col className={mediumItem.children && mediumItem.children[0].nodeType == "BUTTON" ? style.elastic_box : ''}>
                                                                {mediumItem.children && mediumItem.children.map((inferiorItem, inferiorInd) => {
                                                                    return (
                                                                        <Row key={inferiorInd}>
                                                                            <Col className={style.inferior_ele}>
                                                                                <Checkbox onChange={(ev) => { menuChecked(ev, inferiorItem) }} defaultChecked={inferiorItem.defaultChecked} />
                                                                                <span className={style.inner_text}>{inferiorItem.nodeName}</span>
                                                                            </Col>
                                                                            <Col className={inferiorItem.children && inferiorItem.children[0].nodeType == "BUTTON" ? style.elastic_box : ''}>
                                                                                {inferiorItem.children && inferiorItem.children.map((lowestItem, lowestInd) => {
                                                                                    return (
                                                                                        <Row key={lowestInd}>
                                                                                            <Col className={style.lowest_ele}>
                                                                                                <Checkbox onChange={(ev) => { menuChecked(ev, lowestItem) }} defaultChecked={lowestItem.defaultChecked} />
                                                                                                <span className={style.inner_text}>{lowestItem.nodeName}</span>
                                                                                            </Col>
                                                                                        </Row>
                                                                                    )
                                                                                })}
                                                                            </Col>
                                                                        </Row>
                                                                    )
                                                                })}
                                                            </Col>
                                                        </Row>
                                                    )
                                                })}
                                            </Col>
                                        </Row>
                                    )
                                })}
                            </Col>
                            {/* </CheckboxGroup> */}
                        </Row>
                    )
                })
            }
        </div>
    )
}
export default connect(({ role, layoutG }) => { return { role, layoutG } })(GuiTree)
