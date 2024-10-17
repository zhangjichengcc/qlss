import { FC, PropsWithChildren } from 'react';
import YinYang from "@/components/YinYang";

import styles from './index.less';

interface Props {
  spin: boolean;
}

const Spin: FC<PropsWithChildren<Props>> = (props) => {
  const { children, spin } = props;

  return (
    <div className={styles['spin-container']}>
      {children}
      {spin && <div className={styles.spin}><YinYang spin className={styles['yin-yang']} /></div>}
    </div>
  )
}

export default Spin;