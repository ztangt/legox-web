import React, { useEffect, useState } from 'react'
import { Modal, Badge ,message} from 'antd';
import { connect } from 'dva'
import { CheckOutlined } from '@ant-design/icons';
import styles from './addShortcut.less'
import IconFont from '../../Icon_manage';
import GlobalModal from '../GlobalModal'
import checked_img from '../SetModal/images/checked.png'
import unchecked_img from '../SetModal/images/unchecked.png'
import {Button} from '@/componments/TLAntd';
import { getFlatArr } from '../../util/util';
function AddShortcut({ dispatch, shortCut, handleOk, handleCancel, showModal,user }) {
    const { menuList, shortcutList, list } = shortCut
    const { menus } = user
    const [result, setRes] = useState([])
    const iconKeyValArr = JSON.parse(localStorage.getItem('iconKeyValArr'));
    const registerId=localStorage.getItem('registerId')
    useEffect(() => {
        console.log(menus,'menuskj');
        let tmp = _.cloneDeep(menus)?.filter(
          (i) => !i.hideInMenu,
        );
        let moreArr = tmp?.filter((i) => !i.children?.length && i.path);
    
        tmp =
          _.cloneDeep(menus)?.filter(
            (i) => i.children?.length,
          ) || [];
    
        tmp.forEach((element) => {
          element['children'] = getFlatArr(element.children)?.filter((i) => i.path);
        });
        tmp.push({
          menuId: 'more',
          menuName: '更多',
          children: moreArr,
        });
    
        dispatch({
          type: 'shortCut/updateStates',
          payload: {
            menuList: tmp,
          },
        });
      }, [menus]);
    const getMenuVal = (val) => {

        shortcutList.unshift({ menuCode: val.menuCode, menuName: val.menuName, path: val.path, menuId: val.menuId })
        let newList = shortcutList.reduce((p, n) => {
            return p.push(n.menuId), p
        }, []).filter((e, i, shortcutList) => {
            return shortcutList.indexOf(e) !== i
        })
        let res = shortcutList.filter((e) => {
            return newList.indexOf(e.menuId) == -1
        })
        setRes(res)
        dispatch({
            type: "shortCut/updateStates",
            payload: {
                shortcutList: res
            }
        })
    }
    //设置常用应用  
    const setMenuList = () => {
        // localStorage.setItem('addShortCut', JSON.stringify(shortcutList))
        const menuIds=[]
        shortcutList.forEach(item=>{
            menuIds.push(item.menuId)
        })
        if(menuIds.length>15){
            message.error('快捷方式不能超过15个！')
            return
        }
        dispatch({
            type: 'shortCut/addMenuList',
            payload: {
                commonMenus: menuIds.join(',')
            },
            callBack: () => {
                    getShortcutMenu()
                    showModal(false)

            }
        })

    }
    //获取常用应用
    const getShortcutMenu = () => {
        dispatch({
            type: 'shortCut/getMenuList',
            payload:{
              registerId,
            }
        })
    }
    return (
        <div>
            <GlobalModal
                title="快捷方式"
                visible={true}
                onOk={handleOk}
                onCancel={handleCancel}
                modalType={'layout'}
                widthType={2}
                bodyStyle={{ overflow: 'auto' }}
                getContainer={() =>{
                    return document.getElementById('dom_container')||false
                  }}
                // maskClosable={false}
                mask={false}
                footer={[
                    <Button  key='submit' onClick={() => { setMenuList() }} className={styles.shortCut_button}>设置</Button>,
                ]}
            >
                {menuList.map((item1, index1) => {
                    return (
                        item1?.children?.length ?
                        <div key={item1.menuId}>
                        <h3 className={styles.fontWeight}>{item1.menuName}</h3>
                        <div className={styles.menuItem}>

                                {item1?.children?.map((item2, index2) => {
                                return (
                                    <dl>
                                        <dt
                                        onClick={() => { getMenuVal(item2) }}
                                        key={item2.menuId}
                                        >
                                            { iconKeyValArr[item2.menuId]?<IconFont type={`icon-${iconKeyValArr[item2.menuId]}`} />:<IconFont type='icon-default'/> }
                                            <img src={_.find(shortcutList, { menuId: item2.menuId }) ? checked_img : unchecked_img} />
                                            <dd className={_.find(shortcutList, { menuId: item2.menuId }) ? styles.black : styles.gray} title={item2.menuName}>{item2.menuName}</dd>
                                        </dt>
                                    </dl>
                                );
                                })}
                        </div>

                        </div>
                        : null
                    );
                })}
            </GlobalModal>
        </div>
    )
}
export default connect(({ shortCut ,user}) => ({
    shortCut,user
}))(AddShortcut) 
