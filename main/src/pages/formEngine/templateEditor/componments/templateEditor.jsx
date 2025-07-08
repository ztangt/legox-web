import ButtonList from './buttonList';
import TemplateTree from './templateTree';
import Editor from './editor';
import TemplateConfig from './templateConfig';
import styles from './templateEditor.less';
import { parse } from 'query-string';
import { useEffect } from 'react'
import { history,useDispatch } from 'umi'
function TemplateEditor({}) {
  const dispatch = useDispatch()
  useEffect(()=>{
    const query = parse(history.location.search);
    const { formId, version } = query;
    dispatch({
      type: 'templateEditor/updateStates',
      payload: {
        formId,
        version,
      },
    });

    // 获取bean数据集
    dispatch({
      type: 'templateEditor/datasetAndResult',
      payload: {
        formId,
        version,
      },
    });

    // 获取表单字段
    dispatch({
      type: 'templateEditor/getFromColumnsAll',
      payload: {
        formId,
        version,
      },
      callback: id => {
        // 获取表单资源路径
        dispatch({
          type: 'templateEditor/getPrintTemplate',
          payload: { id },
        });
      },
    });
  },[])
  return (
    <div className={styles.content}>
      <ButtonList />
      <div className={styles.warp}>
        <TemplateTree />
        <Editor />
        <TemplateConfig />
      </div>
    </div>
  );
}

export default TemplateEditor;
