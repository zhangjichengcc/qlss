import { jtPYStr, ftPYStr, strokeArr } from "@/units/charInfo";
import divinatorySign, { paraphrase } from "./divinatorySign";

/**
 * 根据简体字获取对应繁体字
 *
 * @param {string} str 简体字
 * @returns {string} 繁体字
 */
export function jt2ft(str?: string) {
  str = str || "";
  const idx = jtPYStr.indexOf(str);
  if (idx >= 0) {
    return ftPYStr[idx];
  }
  return str;
}

/**
 * 简体字符串转繁体
 * @param {string} str 简体字
 * @returns {string} 繁体字
 */
export function exchangeStr(str?: string) {
  str = str || "";
  return str.replace(/[\u4e00-\u9fa5]/g, (s: string) => jt2ft(s));
}

/**
 * 获取当前单一汉字的笔画数
 * @param {string} 汉字
 * @returns {number} 笔画数
 */
export function getCharStrokes(str: string): number {
  if (str.length > 1) return 0;
  for (let i = 0; i < strokeArr.length; i++) {
    if (strokeArr[i].includes(str)) {
      return i;
    }
  }
  return 0;
}

/** 笔画数对象 */
export interface Stroke {
  /** 汉字 */
  label: string;
  /** 笔画数 */
  value: number;
}

/**
 * 获取汉字字符串的笔画数
 * @param {string} 汉字字符串
 * @returns {Object} 笔画数对象
 */
export function getCharsStrokes(str: string): Stroke[] {
  const ftChar = exchangeStr(str);
  return ftChar.split("").reduce((pre: Stroke[], cur) => {
    const strokes = getCharStrokes(cur);
    return pre.concat({
      label: cur,
      value: strokes,
    });
  }, []);
}

/**
 * 根据课数获取卦象
 *
 * @param {number} num 课数
 * @returns {string} 卦象
 */
export function getDivinatorySign(num: number) {
  return divinatorySign[num - 1] || "无对应卦象！";
}

/**
 * 卦象枚举
 */
export type Paraphrase = (typeof paraphrase)[number];

/**
 * 根据课数获取卦象描述
 *
 * @param {number} num 课数
 * @returns {Object} 卦象描述
 */
export function getDivinatorySignDesc(num: number) {
  return paraphrase[num - 1];
}

/**
 * 判断是否为中文
 *
 * @param {string} input
 * @returns
 */
export function isChineseCharacters(input: string) {
  const chineseCharacterRegex = /^[\u4e00-\u9fff]+$/;

  return chineseCharacterRegex.test(input);
}

/**
 * 延迟执行
 *
 * @param {number} time 延迟时间
 */
export function delay(time: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}
