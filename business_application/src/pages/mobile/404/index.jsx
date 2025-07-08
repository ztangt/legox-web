import styles from './index.less';
import logoSrc from './404.png'

export default function IndexPage() {

  return <div className={styles.wrapper}>
    <div>
      <img src={logoSrc} alt="logo" />
      <p>404错误</p>
    </div>
  </div>;
}
