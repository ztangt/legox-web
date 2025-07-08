import styles from './index.less';
import logoSrc from './502.png'

export default function IndexPage() {

  return <div className={styles.wrapper}>
    <div>
      <img src={logoSrc} alt="logo" />
      <p>502错误</p>
    </div>
  </div>;
}
