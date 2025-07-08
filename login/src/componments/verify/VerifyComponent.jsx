import React, { Component } from 'react';
import './verify.less'
import $ from './verify.js'
import { Modal,message } from 'antd'
export default class Verify extends Component {


constructor(props){

    super(props);


    }



    componentDidMount(){
        const { onSuccess } =  this.props
        $('#mpanel').slideVerify({
            type : 2,		//类型
            vOffset : 5,	//误差量，根据需求自行调整
            vSpace : 5,	//间隔
            imgSize : {
                width: '100%',
                height: '200px',
            },
            blockSize : {
                width: '40px',
                height: '40px',
            },
            barSize : {
                width : '100%',
                height : '40px',
            },
            ready : function() {
            },
            success : function() {
                // message.success('验证成功!')

                onSuccess();
            },
            error : function() {
                message.error('验证失败!')

            }

        });


    }
    render(){
        const { onCancel } = this.props
        return(
            <Modal
                open={true}
                mask={true}
                width={this.props?.width||340}
                footer={null}
                onCancel={onCancel}
                maskClosable={false}
                style={this.props.style}
                className={'verify_modal'}>
                <div id="mpanel" >
                </div>



            </Modal>
        )



    }
}
