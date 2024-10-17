import { useRef, useState } from 'react';
import { Button, Input, Descriptions, type DescriptionsProps, message } from 'antd';
import { exchangeStr, getCharsStrokes, getDivinatorySign, type Stroke, type Paraphrase, delay, getDivinatorySignDesc, isChineseCharacters } from '@/units/tools';
import Spin from '@/components/Spin';
import styles from './index.less';
import YinYang from '@/components/YinYang';


export default function Docs() {

  const inputDomRef = useRef(null);
  const [spin, setSpin] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();

  const [data, setData] = useState<{
    /** 简体字 */
    jtChars: string;
    /** 繁体字 */
    ftChars: string;
    /** 课数 */
    ks: number;
    /** 笔画数 */
    strokes: Stroke[];
    /** 卦象 */
    divinatorySign: string;
    /** 内容 */
    content?: Paraphrase;
  }>({
    jtChars: '',
    ftChars: '',
    ks: 0,
    strokes: [],
    divinatorySign: '',
    content: undefined,
  });

  const items: DescriptionsProps['items'] = [
    {
      key: 'jtChars',
      label: '简体字',
      children: data.jtChars,
    },
    {
      key: 'ftChars',
      label: '繁体字',
      children: data.ftChars,
    },
    {
      key: 'strokes',
      label: '笔画数',
      children: <div>
      {
        data.strokes?.map(item => (
          <p>{item.label}的笔画数为：{item.value};</p>
        ))
      }
    </div>,
    },
    {
      key: 'ks',
      label: '课数',
      children: <p>{data.ks} = ({data.strokes?.reduce((pre, cur, idx) => pre + `${idx ? ' +' : ''} ${cur.value} x ${10 ** (2 - idx)}`, '')}) % 215;</p>,
    },
    {
      key: 'divinatorySign',
      label: '卦象',
      children: data.divinatorySign,
    },
    {
      key: 'content',
      label: '解签',
      children: <ul className={styles.content}>
        <li><span style={{color: "rgba(0, 0, 0, 0.75)"}}>描述: </span>{data.content?.explain}</li>
        <li><span style={{color: "rgba(0, 0, 0, 0.75)"}}>解释: </span>{data.content?.description}</li>
        <li><span style={{color: "rgba(0, 0, 0, 0.75)"}}>禁忌: </span>{data.content?.avoid}</li>
      </ul>,
    },
  ];

  function getKs(strokes: Stroke[]): number {
    const sum = strokes?.reduce((pre, cur, idx) => (pre + cur.value * 10 ** (2 - idx)), 0);
    return sum % 215;
  }

  function validate(str: string): Promise<string> {
    if (!isChineseCharacters(str)) {
      return Promise.reject('请输入中文字符');
    } else if (str.length > 3) {
      return Promise.reject('请输入不超过3个中文字符');
    } else {
      return Promise.resolve(str);
    }
  }

  async function onSubmit() {
    const { input } = inputDomRef.current!;
    const { value } = input;
    try {
      const jtChars = await validate(value);
      setSpin(true);
      const _ftChars = exchangeStr(jtChars);
      const _strokes = getCharsStrokes(_ftChars);
      const _ks = getKs(_strokes);
      setData({
        jtChars: value,
        ftChars: _ftChars,
        ks: _ks,
        strokes: _strokes,
        divinatorySign: getDivinatorySign(_ks),
        content: getDivinatorySignDesc(_ks),
      })
      await delay(2000);
      setSpin(false);
    } catch(error) {
      messageApi.open({
        type: 'warning',
        content: error as string,
      });
    }
  }

  return (
    <div className={styles.view}>
      {contextHolder}
      <Spin spin={spin}>
        <h2 className={styles.title}>巧連神數</h2>
        <div className={styles.container}>
          {data.ftChars ? <Descriptions items={items} /> : <YinYang className={styles.yinYang} style={{margin: '80px auto'}} />}
        </div>
        <div className={styles.controller}>
          <Input ref={inputDomRef} placeholder="请输入中文名" />
          <Button onClick={onSubmit} type="primary">提交</Button>
        </div>
      </Spin>
    </div>
  );
}
