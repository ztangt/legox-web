import { connect } from 'dva';
import { useState } from 'react';
import GlobalModal from '../../../components/GlobalModal';
import { timeStampFormat } from '../../../util/util';
import configs, { currentYear } from '../configs';
import styles from '../index.less';

const HomeModal = ({
    dispatch,
    onCancel,
    tagsItem,
    cmaHomeDataTypeArr,
    cmaHomeDateCateArr,
    cmaHomeWarningLevelArr,
    cmaHomePublicArr,
    cmaHomeSpace,
    getHomeData,
}) => {
    const { nccOrgCode, startTimes, endTimes, dataTypes, dataCates, dataLevels, dataPublics } = cmaHomeSpace;

    const [pickerTimer, setPickerTimer] = useState(timeStampFormat(new Date().getTime()));
    const [dataType, setDataType] = useState('');
    const [dataCate, setDataCate] = useState('');
    const [dataLevel, setDataLevel] = useState('');
    const [datePublic, setDataPublic] = useState('1');
    // 确认
    const confirm = () => {
        getHomeData(nccOrgCode, startTimes, endTimes, dataTypes, dataCates, dataLevels);
        onCancel();
    };
    // 所有change
    const onChange = (value, valueString) => {
        // 根据不同类别设置不同数值
        const obj = {
            1: () => {
                const startYear = valueString.split('-')[0];
                const getCurrentData = currentYear(startYear);
                const endTime = valueString;
                // setPickerTimer(valueString);
                dispatch({
                    type: 'cmaHomeSpace/updateStates',
                    payload: {
                        startTimes: getCurrentData.startTime,
                        endTimes: endTime,
                    },
                });
            },
            2: () => {
                setDataType(value);
                dispatch({
                    type: 'cmaHomeSpace/updateStates',
                    payload: {
                        dataTypes: value,
                    },
                });
            },
            3: () => {
                setDataCate(value);
                dispatch({
                    type: 'cmaHomeSpace/updateStates',
                    payload: {
                        dataCates: value,
                    },
                });
            },
            4: () => {
                setDataLevel(value);
                dispatch({
                    type: 'cmaHomeSpace/updateStates',
                    payload: {
                        dataLevels: value,
                    },
                });
            },
            // 6: () => {
            //     dispatch({
            //         type: 'cmaHomeSpace/updateStates',
            //         payload: {
            //             dataPublics: value.target.value,
            //         },
            //     });
            //     setDataPublic(value.target.value);
            // },
        };
        obj[tagsItem.id]();
    };

    return (
        <div>
            <GlobalModal
                title={tagsItem.name}
                open={true}
                onCancel={onCancel}
                onOk={confirm}
                getContainer={() => {
                    return document.getElementById('cma_home_box');
                }}
                maskClosable={false}
                mask={false}
                modalSize="small"
                bodyStyle={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <div className={styles.home_tags}>
                    {configs.tagsObj[tagsItem.id](
                        onChange,
                        tagsItem.name,
                        {
                            type: cmaHomeDataTypeArr,
                            cate: cmaHomeDateCateArr,
                            level: cmaHomeWarningLevelArr,
                            public: cmaHomePublicArr,
                        },
                        {
                            dataTypes,
                            dataCates,
                            dataLevels,
                        },
                    )}
                </div>
            </GlobalModal>
        </div>
    );
};

export default connect(({ cmaHomeSpace }) => ({ cmaHomeSpace }))(HomeModal);
