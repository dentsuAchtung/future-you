import styles from './Loader.module.scss'
export default function Loader() {
  return (
    <div className={styles.loader}>
      <div className={styles.loaderBar}></div>
      <div className={styles.loaderBar}></div>
      <div className={styles.loaderBar}></div>
      <div className={styles.loaderBar}></div>
      <div className={styles.loaderBar}></div>
    </div>
  )
}