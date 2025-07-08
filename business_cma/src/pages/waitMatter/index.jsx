import { useModel } from 'umi';
import WaitMatter from './componments/waitMatter';
function Index({}) {
    const { location, menuObj } = useModel('@@qiankunStateFromMaster');

    return <WaitMatter location={location} menuObj={menuObj} />;
}
export default Index;
