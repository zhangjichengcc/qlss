import { useState } from 'react';
import { Button, TimePicker, Descriptions, type DescriptionsProps, message, DatePicker, Drawer } from 'antd';
import { delay } from '@/units/tools';
import dayjs, { Dayjs } from 'dayjs';
import { ReactComponent as HelpIcon } from '@/assets/help.svg';
import { Solar } from 'lunar-typescript';
import Spin from '@/components/Spin';
import styles from './index.less';
import YinYang from '@/components/YinYang';

type LunarDateProps = {
  year: string;
  month: string;
  day: string;
  hour: string;
}

type DateProps = {
  year?: number;
  month?: number;
  day?: number;
  hour?: number;
  minute?: number;
  second?: number;
}


export default function Docs() {

  const [spin, setSpin] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [date, setDate] = useState<Dayjs>()

  const [messageApi, contextHolder] = message.useMessage();

  const [data, setData] = useState<{
    /** 公历日期 */
    solarCalendar: DateProps;
    /** 农历日期 */
    lunarCalendar: LunarDateProps;
    /** 天干地支 */
    gz: LunarDateProps;
    /** 八字五行 */
    bzwx: string[];
    /** 纳音五行 */
    nywx: string[];
    /** 八字生肖 */
    shenxiao: LunarDateProps;
    /** 生肖 */
    animalSign: string;
    /** 星座 */
    starSign: string;
  }>({
    solarCalendar: {},
    lunarCalendar: {
      year: '',
      month: '',
      day: '',
      hour: '',
    },
    gz: {
      year: '',
      month: '',
      day: '',
      hour: '',
    },
    shenxiao: {
      year: '',
      month: '',
      day: '',
      hour: '',
    },
    bzwx: [],
    nywx: [],
    animalSign: '',
    starSign: '',
  });

  const items: DescriptionsProps['items'] = [
    {
      key: 'solarCalendar',
      label: '公历日期',
      children: dayjs(`${data.solarCalendar.year}-${data.solarCalendar.month}-${data.solarCalendar.day} ${data.solarCalendar.hour}:${data.solarCalendar.minute}:${data.solarCalendar.second}`).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      key: 'lunarCalendar',
      label: '农历日期',
      children: <div>
        <p>日期: {data.lunarCalendar.year}年 {data.lunarCalendar.month}月 {data.lunarCalendar.day}日</p>
        <p>时辰: {data.lunarCalendar.hour.slice(1)}时</p>
        <p>{data.gz.year}({data.shenxiao.year})年 {data.gz.month}({data.shenxiao.month})月 {data.gz.day}({data.shenxiao.day})日 {data.gz.hour.slice(1)}({data.shenxiao.hour})时</p>
      </div>
    },
    {
      key: 'gz',
      label: '生辰八字',
      children: `${data.gz.year}(年柱) ${data.gz.month}(月柱) ${data.gz.day}(日柱) ${data.gz.hour}(时柱)`,
    },
    {
      key: 'bzwx',
      label: '八字五行',
      children: data.bzwx.join('、'),
    },
    {
      key: 'rizhutiangan',
      label: '日柱天干',
      children: data.gz.day?.slice(0, 1)+data.bzwx[2]?.slice(0, 1),
    },
    {
      key: 'nywx',
      label: '纳音五行',
      children: data.nywx.join('、'),
    },
    {
      key: 'animalSign',
      label: '生肖',
      children: data.animalSign,
    },
    {
      key: 'starSign',
      label: '星座',
      children: data.starSign,
    }
  ];

  function validate() {
    if (!date) {
      return Promise.reject('请输入日期时间');
    } else {
      return Promise.resolve();
    }
  }

  function exchangeLunar(date: Dayjs) {
    const lunar = Solar.fromDate(date.toDate()).getLunar();
    /** 五行对象 */
    const lunarEightChar = lunar.getEightChar();
    const solar = Solar.fromDate(date.toDate());
    setData({
      solarCalendar: {
        year: date.year(),
        month: date.month() + 1,
        day: date.date(),
        hour: date.hour(),
        minute: date.minute(),
        second: date.second(),
      },
      lunarCalendar: {
        year: lunar.getYearInChinese(),
        month: lunar.getMonthInChinese(),
        day: lunar.getDayInChinese(),
        hour: lunar.getTimeInGanZhi(),
      },
      gz: {
        year: lunarEightChar.getYear(),
        month: lunarEightChar.getMonth(),
        day: lunarEightChar.getDay(),
        hour: lunarEightChar.getTime(),
      },
      bzwx: [lunarEightChar.getYearWuXing(), lunarEightChar.getMonthWuXing(), lunarEightChar.getDayWuXing(), lunarEightChar.getTimeWuXing()],
      nywx: [lunarEightChar.getYearNaYin(), lunarEightChar.getMonthNaYin(), lunarEightChar.getDayNaYin(), lunarEightChar.getTimeNaYin()],
      shenxiao: {
        year: lunar.getYearShengXiao(),
        month: lunar.getMonthShengXiao(),
        day: lunar.getDayShengXiao(),
        hour: lunar.getTimeShengXiao(),
      },
      animalSign: lunar.getYearShengXiao(),
      starSign: solar.getXingZuo(),
    })
  }

  async function onSubmit() {
    try {
      await validate();
      setSpin(true);
      await delay(2000);
      exchangeLunar(date!);
      setSpin(false);
    } catch(error) {
      messageApi.open({
        type: 'warning',
        content: error as string,
      });
    }
  }

  function onDateChange(value: Dayjs) {
    setDate(value);
  }

  function onClose() {
    setOpen(false);
  }

  return (
    <div className={styles.view}>
      {contextHolder}
      <Spin spin={spin}>
        <h2 className={styles.title}>生辰八字<HelpIcon className={styles.help} onClick={() => setOpen(true)} /></h2>
        <div className={styles.container}>
          {data.animalSign ? <Descriptions items={items} /> : <YinYang className={styles.yinYang} style={{margin: '80px auto'}} />}
        </div>
        <div className={styles.controller}>
          <DatePicker value={date} onChange={onDateChange} />
          <TimePicker value={date} onChange={onDateChange} format="HH:mm" />
          <Button onClick={onSubmit} type="primary">提交</Button>
        </div>
      </Spin>
      <Drawer
        title="八字说明"
        placement="bottom"
        closable={false}
        onClose={onClose}
        styles={{header: {padding: '16px 10px'}, body: {padding: 10}}}
        open={open}
      >
        <div className={styles.description}>
          <p>八字是以出生这一天的日柱天干代表自己本人的，而八字五行的用神，忌神，喜神等等都是围绕这个日柱展开的，日柱最需要什么样的五行来帮助，那么这个五行就是用神，或则喜神；而日柱忌讳什么样的五行，那这个五行就是忌神，是有害的，要避开；</p>
          <p>何为喜用神？喜用神是喜神与用神的合称，是八字中具有补益作用的一种五行元素，所以我们在起名的时候含有喜用神的元素比较好。 一生补救与否， 影响人一生的运。当一个人的命局中八字有“不及”或“太过”等非正常情况时，就好像人生了病一样，这种八字也就是命局，也算作有“病”，专业术语上也是将其称作“病”。而“喜用神”，就好像是医生开药打针治病的药是用来“治”八字的，能够起到生扶作用的阴阳五行元素，也就是说，喜用神是治病生扶的“药”。</p>
          <p>演示：生日2016年9月18日10时，八字： 丙申 丁酉 癸卯 丁巳 ，五行： 火金 火金 水木 火火，纳音： 山下火 山下火 金箔金 沙中土，五行统计：1木，4火，0土，2金，1水。五行缺土；日柱天干为水；同类为：水金；异类为：土火木。〖同类得分〗：水1.56，金2.4，共计3.96分；〖异类得分〗：土0，火3.7，木1，共计4.7分；〖差值〗：-0.74分；〖综合旺衰得分〗：-0.74分，「八字偏弱」；〖八字喜用神〗：八字偏弱，八字喜「水」，「水」就是此八字的「喜用神」，起名时建议带五行属性为水的汉字。</p>
          <p>起名时，不该五行缺什么就补什么，一般来说五行缺失的部分，大部分情况正好是喜用神，但还有一部分情况不是，所以应该测算出八字喜用神，再在起名时使用带相应五行属性的汉字。起名时，要是简单的按照五行缺什么就补什么，那就是大错特错了，其根本没有考虑五行的强弱、生克以及中和平衡。五行全部具备的八字并不多 ，而且八字中五行是否齐全，与该八字的吉否并无关系。所以应该测算出八字喜用神，再在起名时使用带相应五行属性的汉字。</p>
        </div>
      </Drawer>
    </div>
  );
}
