
import styles from './index.less';
function showMenuItem(props) {
  return (
    <div className={styles.menuItem}>
      <p className={styles.menuicon}>{props.menuItemProps.pro_layout_parentKeys && props.menuItemProps.pro_layout_parentKeys.length > 0 && props.menuItemProps.icon}</p>
      <p style={{marginBottom:0}}>{props.defaultDom}</p>
    </div>

  )
}
export default showMenuItem;