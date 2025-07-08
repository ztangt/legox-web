import react,{useEffect,useState} from 'react'
import {connect,useSearchParams} from 'umi'
import {dataFormat,axiosGetUrl} from '../../../util/util'
import isCollect from '../../../../public/assets/isCollect.svg'
import noCollect from '../../../../public/assets/noCollect.svg'
import styles from './index.less'

// 详情页
const AnnounceDetail = ({dispatch,mobileAnnounceDetail})=>{
    const [msgData,setMsgData]  = useState('')
    const {announceDetail,curUserInfo} = mobileAnnounceDetail
    const [searchParams] = useSearchParams();
    const arrFileData = announceDetail.fileStorageAttachment?JSON.parse(announceDetail.fileStorageAttachment):[]
    const userName = JSON.parse(
        JSON.stringify(localStorage.getItem('userName')),
      );
    useEffect(()=>{
        collectDetail()
        getUserInfo()
    },[])
    // 获取用户信息
    const getUserInfo = ()=>{
        dispatch({
            type: 'mobileAnnounceDetail/getCurrentUserInfo',
            payload: {

            }
        })
    }

    // 收藏详情
    const collectDetail = ()=>{
        dispatch({
            type: 'mobileAnnounceDetail/getNotice',
            payload: {
                noticeId: searchParams.get('id')
            },
            callback:(detail)=>{
                detail.noticeHtmlUrl&&getUrl(detail)
            }   
        })
    }
     // 获取url参数
    const getUrl = async(detail)=>{
        const res = await axiosGetUrl(detail.noticeHtmlUrl).get
        setMsgData(res.data.value)
             
    }
    // 收藏
    const collectItem = ()=>{
        if(announceDetail.collectState == 1){
            dispatch({
                type: 'announcementSpace/delNoticeCollect',
                payload: {
                    noticeIds: announceDetail.id
                },
                callback:()=>{
                    collectDetail()
                }
            })
        }else{
            dispatch({
                type: 'announcementSpace/putNoticeCollect',
                payload:{
                    noticeIds:  announceDetail.id
                },
                callback:()=>{
                    collectDetail()
                }
            })
        }
    }

    // 下载
    const downloadUrl = (item)=>{
        dispatch({
            type: 'mobileAnnounceDetail/getDownFileUrl',
            payload: {
                fileStorageId: item.uid,
            },
            callback: (url) => {
                let userAgent = navigator.userAgent;
                const isiOS = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); 
                if(item.fileType == 'pdf'||item.fileType== '.pdf'||item.name.includes('.pdf')){
                    let href = window.document.location.href
                    let pathname = href.split('/business_application')
                    if(isiOS){
                        window.location.href = `${pathname[0]}/business_application/pdfPreview?src=${url}`
                    }else{
                        window.open(`${pathname[0]}/business_application/pdfPreview?src=${url}`)
                    }
                }else{
                    global.location.href = url;
                } 
            },
        });
    }   

const rangeMap = {
    0: '本单位',
    1: '本单位及下属单位',
    2: '指定人员',
    3: '全部'
}

// console.log("announceDetail988",announceDetail)

    return (
        <div className={styles.detail_box}>
            <div className={styles.detail_main}>
                <div className={styles.title_box}>
                   <div className={styles.title}>{announceDetail.noticeTitle}</div>
                   <div onClick={()=>collectItem()} className={styles.collect}>
                     {announceDetail.collectState == 1? <img src={isCollect} />:<img src={noCollect} />}   
                    收藏</div>     
                </div>
                <div className={styles.subTitle}>公告类型：<span className={styles.noticeType}>{announceDetail.noticeTypeName}</span><span>{dataFormat(announceDetail.createTime,'YYYY-MM-DD HH:mm:ss')}</span></div>
                <div className={styles.title_range}>
                    {announceDetail.noticeRange==2?<span className={styles.appoint}>公告范围: {announceDetail.appointName}</span>:<span>公告范围: {rangeMap[announceDetail.noticeRange]}</span>}
                </div>
                <div className={styles.detail_content}>
                    {/* <div className={styles.detail_img}>
                        <img src="" alt="" />
                    </div> */}
                    <p className={styles.text} dangerouslySetInnerHTML={{ __html: msgData }}>
                    </p>
                    <div className={styles.annex}>
                        附件：<div className={styles.file_data}>
                            {arrFileData.map(item=>(
                                <span key={item.uid} onClick={()=>downloadUrl(item)}><a>{item.name}</a></span>
                            ))} 
                        </div>
                    </div> 
                    <div className={styles.view_times}> 
                        浏览次数: <span>{announceDetail.noticeRange &&
                  announceDetail.appointName?.split(',').includes(curUserInfo.userName)
                    ? `${announceDetail.noticeViews + 1}`
                    : announceDetail.noticeRange &&
                      !announceDetail.appointName?.split(',').includes(curUserInfo.userName)
                    ? `${announceDetail.noticeViews}`
                    : `${announceDetail.noticeViews + 1}`}</span>
                    </div>
                </div>
            </div>

        </div>
    )
}


export default connect(({mobileAnnounceDetail,announcementSpace})=>({mobileAnnounceDetail,announcementSpace}))(AnnounceDetail);