import {toTeantMark} from '../util/loginUtil'
export default function Index({dispatch}){
    document.onreadystatechange = function () {
        if (document.readyState === 'loading') {
        }
        if (
            document.readyState === 'complete' ||
            document.readyState === 'interactive'
        ) {
            mark = localStorage.getItem('tenantMark');

            if((!window.location.hash||window.location.hash=='#/')&&(!window.localStorage.getItem('userToken')||(mark!=window.location.pathname.split('/')[1]))){
                window.location.href='#/login'
                return
            }
            if(!window.location.href.includes('/login')){
                toTeantMark(dispatch);
            }
        }
    };
    return <div/>
}
