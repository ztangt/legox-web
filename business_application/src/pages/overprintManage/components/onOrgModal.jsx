import {useState} from 'react'
import {connect} from 'umi'
import GlobalModal from '../../../componments/GlobalModal'
import RelevanceModal from '../../../componments/relevanceModal/relevanceModal';


const OrgModalComponents= ({dispatch,overprintTemplate,cancelRelevance})=>{
    const {selectedDatas}=overprintTemplate
    const okRelevance = () => {
        cancelRelevance()
        const nodeSelectArr = selectedDatas&&selectedDatas.length>0&&selectedDatas.map(item=>item.nodeName).join(',')||''
        const ids = selectedDatas&&selectedDatas.length>0&&selectedDatas.map(item=>item.nodeId).join(',')||''
        dispatch({
            type: 'overprintTemplate/updateStates',
            payload: {
                selectedDataPrintKeys: ids,
                selectedDataPrint: nodeSelectArr
            }
        })
    }

    return (
    <GlobalModal
        title="选择"
        widthType={3}
        mask={false}
        visible={true}
        onOk={okRelevance}
        onCancel={cancelRelevance}
        bodyStyle={{ padding: '16px 0px 0px 0px' }}
        getContainer={() => {
          return document.getElementById('overPrint')||false;
        }}
    >
        <RelevanceModal
            nameSpace="overprintTemplate"
            spaceInfo={overprintTemplate}
            orgUserType="ORG"
            selectButtonType="checkBox"
            treeType={'ORG'}
            type={'INCLUDESUB'}
            nodeIds={''}
        />

    </GlobalModal>)
}


export default connect(({overprintTemplate})=>({overprintTemplate}))(OrgModalComponents)