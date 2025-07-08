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
            key={nowHeight}
            onCancel={handleViewCancel}
            destroyOnClose={true}
            bodyStyle={{padding:8}}
            incomingHeight={nowHeight}
            mask={false}
            getContainer={() => {
            return document.getElementById('systemLayout_container')||false;
            }}
            footer={
                [
                    <Button key="close" onClick={handleViewCancel}>关闭</Button>
                ]
            }
        >
            <div style={{background:'rgb(221, 221, 221)'}}>
                <img className="image" src={logoUrl} style={{width:'100%'}}/>
            </div>
        </GlobalModal>
    )
}

export default ViewImage
