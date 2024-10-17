import { FC } from 'react';
import classNames from 'classnames';
import styles from './index.less';

interface Props {
  spin?: boolean;
  size?: number;
  border?: number;
  blight?: string;
  dark?: string;
  style?: React.CSSProperties;
  className?: string;
}

const View: FC<Props> = (props) => {

  const { spin = false, size = 50, border = 2, blight = '#fff', dark = '#000', style, className } = props;

  const _style = {
    ...style,
    '--spin-size': `${size}px`,
    '--border-width': `${border}px`,
    '--bright-color': blight,
    '--dark-color': dark,
  } as React.CSSProperties
  
  return <span className={classNames(styles.loader, className, { [styles.spin]: spin })} style={_style} />
}

export default View;