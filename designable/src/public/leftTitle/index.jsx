import styles from './index.less'

function Index({ title }) {
  return (
    <div className={styles.left}>
      <a></a>
      <span style={{ marginTop: 8 }}>{title}</span>
    </div>
  )
}
export default Index
