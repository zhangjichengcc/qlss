import { Link, Outlet } from 'umi';
import { ConfigProvider } from 'antd';
import locale from 'antd/locale/zh_CN';
import 'dayjs/locale/zh-cn';
import dayjs from 'dayjs';
import styles from './index.less';

dayjs.locale('zh-cn');

export default function Layout() {
  return (
    <ConfigProvider locale={locale}>
      <div className={styles.container}>
        <Outlet />
      </div>
      <ul className={styles.nav}>
        <li><Link to="/">巧连神数</Link></li>
        <li><Link to="/lunar">八字排盘</Link></li>
        <li><a href="https://ji.js.cn/">及时雨排盘</a></li>
      </ul>
    </ConfigProvider>
  );
}
