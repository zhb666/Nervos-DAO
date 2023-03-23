import { BI } from "@ckb-lumos/lumos";
import { TransactionObject } from "../type";

export async function getCapacity(capacity: string) {
  let balance = BI.from(0);
  balance = balance.add(capacity);
  return balance;
}

export function cutValue(value: string, preLength = 6, subLength = 6) {
  if (!value || value.length < preLength + subLength) {
    return value;
  }
  return `${value.substr(0, preLength)}...${value.substr(
    value.length - subLength,
    subLength
  )}`;
}

export const shannonToCKBFormatter = (shannon: string = '0', showPositiveSign?: boolean, delimiter: string = ',') => {
  if (Number.isNaN(+shannon)) {
    console.warn(`Shannon is not a valid number`)
    return shannon
  }
  if (shannon === null) {
    return '0'
  }
  let sign = ''
  if (shannon.startsWith('-')) {
    sign = '-'
  } else if (showPositiveSign) {
    sign = '+'
  }
  const unsignedShannon = shannon.replace(/^-?0*/, '')
  let unsignedCKB = ''
  if (unsignedShannon.length <= 8) {
    unsignedCKB = `0.${unsignedShannon.padStart(8, '0')}`.replace(/\.?0+$/, '')
  } else {
    const decimal = `.${unsignedShannon.slice(-8)}`.replace(/\.?0+$/, '')
    const int = unsignedShannon.slice(0, -8).replace(/\^0+/, '')
    unsignedCKB = `${(
      int
        .split('')
        .reverse()
        .join('')
        .match(/\d{1,3}/g) || ['0']
    )
      .join(delimiter)
      .split('')
      .reverse()
      .join('')}${decimal}`
  }
  return +unsignedCKB === 0 ? '0' : `${sign}${unsignedCKB}`
}

export function formatDate(timeStamp: number = new Date().getTime()) {
  let date = new Date();
  date.setTime(timeStamp); //Timestamp is microsecond * 1, millisecond * 1000
  let y = date.getFullYear();
  let m: string | number = date.getMonth() + 1;
  m = m < 10 ? "0" + m : m;
  let d: string | number = date.getDate();
  d = d < 10 ? "0" + d : d;
  let h: string | number = date.getHours();
  h = h < 10 ? "0" + h : h;
  let minute: string | number = date.getMinutes();
  let second: string | number = date.getSeconds();
  minute = minute < 10 ? "0" + minute : minute;
  second = second < 10 ? "0" + second : second;
  return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
}

//First record with map structure
export function arrayToMap(data: TransactionObject[]) {
  //No processing for non array or data length of 0
  if (data.length === 0) {
    return [];
  }
  let map: any = {};
  for (var i = 0; i < data.length; i++) {
    if (data.length < 1) {
      continue;
    }

    let name = data[i].block_number;
    if (name !== undefined) {
      if (map[name] === undefined) {
        map[name] = [];
      }
      map[name].push(data[i]);
    }
  }
  let array = mapToArray(map);
  return array;
}

//Convert map to array
export function mapToArray(data: any) {
  if (data === undefined) {
    return [];
  }
  let array = [];
  for (let p in data) {
    array.push(data[p]);
  }
  return array;
}
