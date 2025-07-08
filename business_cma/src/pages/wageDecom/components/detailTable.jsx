import { Select, Form, Table, Button, message, Row, Col } from 'antd';
import { useEffect, useState, useCallback } from 'react';
import { connect } from 'dva';
import styles from '../index.less';
function DecomLeftTabel({ wageDecom }) {
    const { years, orgs, wageClasss, wageMonths, wageBatchs, wageItems, wageInfos, decomWageInfos } = wageDecom;
    const [isScroll, setIsScroll] = useState(false);
    useEffect(() => {
        if (wageInfos?.resuleList?.length) {
            debugger;
            let scrollHeight = document.getElementById('detail_content').scrollHeight;
            let offsetHeight = document.getElementById('detail_content').offsetHeight;
            if (offsetHeight < scrollHeight) {
                setIsScroll(true);
            } else {
                setIsScroll(false);
            }
        }
    }, [wageInfos]);
    const onResize = useCallback(() => {
        let scrollHeight = document.getElementById('detail_content').scrollHeight;
        let offsetHeight = document.getElementById('detail_content').offsetHeight;
        if (offsetHeight < scrollHeight) {
            setIsScroll(true);
        } else {
            setIsScroll(false);
        }
    }, []);
    useEffect(() => {
        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener('resize', onResize);
        };
    }, []);
    return (
        <table border="1" className={styles.table} style={{ height: '100%' }}>
            <thead>
                <tr>
                    <th colspan={3} className={styles.background}>
                        提取工资明细
                    </th>
                </tr>
                <tr>
                    <td colspan={2} className={styles.background}>
                        应发合计
                    </td>
                    <td className={styles.background} style={isScroll ? { borderRight: 'unset' } : {}}>
                        {wageInfos?.sumMap?.yfhj ? parseFloat(wageInfos?.sumMap?.yfhj).toFixed(2) : ''}
                    </td>
                    <td
                        style={isScroll ? { width: '6px', borderLeft: 'unset' } : { display: 'none' }}
                        className={styles.background}
                    ></td>
                </tr>
                <tr>
                    <td colspan={2} className={styles.background}>
                        扣款合计
                    </td>
                    <td className={styles.background} style={isScroll ? { borderRight: 'unset' } : {}}>
                        {wageInfos?.sumMap?.kkhj ? parseFloat(wageInfos?.sumMap?.kkhj).toFixed(2) : ''}
                    </td>
                    <td
                        style={isScroll ? { width: '6px', borderLeft: 'unset' } : { display: 'none' }}
                        className={styles.background}
                    ></td>
                </tr>
                <tr>
                    <td colspan={2} className={styles.background}>
                        实发合计
                    </td>
                    <td className={styles.background} style={isScroll ? { borderRight: 'unset' } : {}}>
                        {wageInfos?.sumMap?.sshj ? parseFloat(wageInfos?.sumMap?.sshj).toFixed(2) : ''}
                    </td>
                    <td
                        style={isScroll ? { width: '6px', borderLeft: 'unset' } : { display: 'none' }}
                        className={styles.background}
                    ></td>
                </tr>
                <tr>
                    <td className={styles.background}>序号</td>
                    <td className={styles.background}>工资项</td>
                    <td className={styles.background} style={isScroll ? { borderRight: 'unset' } : {}}>
                        应发金额
                    </td>
                    <td
                        style={isScroll ? { width: '6px', borderLeft: 'unset' } : { display: 'none' }}
                        className={styles.background}
                    ></td>
                </tr>
            </thead>
            <tbody style={{ height: '100%' }} id="detail_content">
                {wageInfos?.resuleList?.length ? (
                    wageInfos?.resuleList.map((item, index) => {
                        return (
                            <tr>
                                <td>{index + 1}</td>
                                <td>{item.wageItemName}</td>
                                <td>{item.payableAmount}</td>
                            </tr>
                        );
                    })
                ) : (
                    <tr>
                        <td colSpan={3}>没有找到匹配的记录</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}
export default DecomLeftTabel;
