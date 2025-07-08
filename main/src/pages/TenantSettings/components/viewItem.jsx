import react,{useEffect,useState} from 'react'
import {Button} from 'antd'
import GlobalModal from '../../../componments/GlobalModal'
const ViewImage = ({logoUrl,handleViewOk,handleViewCancel})=>{

    const [nowHeight,setNowHeight] =useState(0)
    useEffect(()=>{
        const image = document.querySelector('.image')
        setNowHeight(image.height+16)
    },[])
    return (
        <GlobalModal
            widthType={1}
            title="预览"
            visible={true}
            onOk={handleViewOk}
            onCancel={handleViewCancel}
            destroyOnClose={true}
            key={nowHeight}
            bodyStyle={{padding:8}}
            incomingHeight={nowHeight}
            mask={false}
            getContainer={() => {
            return document.getElementById('tenantSettings_container')||false;
            }}
            footer={
                [
                    <Button key="close" onClick={handleViewCancel}>关闭</Button>
                ]
            }
        >
            <img className='image' src={logoUrl} style={{width:'100%'}}/>
        </GlobalModal>
    )
}

export default ViewImage
