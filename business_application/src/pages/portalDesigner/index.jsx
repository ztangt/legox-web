
import { MicroAppWithMemoHistory, history } from 'umi';
import './index.less'
export default ({}) => {
  return (
    <>
      <div id={'portalDesign'}>
        <MicroAppWithMemoHistory
          name={'designable'}
          url={'/portalSetting'}
        />
      </div>
     
    </>
  );
};
