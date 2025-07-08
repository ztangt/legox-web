import { MicroAppWithMemoHistory } from 'umi';
export default ({}) => {

  return (
    <>
      <div
        style={{
          overflow: 'overlay',
          height: '100%',
          cursor: 'auto',
          userSelect: 'text',
          position: 'relative',
          background: 'F7F7F7',
        }}
      >
        <MicroAppWithMemoHistory
          name={'designable'}
          url={'/portalPreview'}
        />
      </div>
    </>
  );
};
