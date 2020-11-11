import enquireJs from 'enquire.js'

export function isDef(v) {
  return v !== undefined && v !== null
}

/**
 * Remove an item from an array.
 */
export function remove(arr, item) {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

export function isRegExp(v) {
  return _toString.call(v) === '[object RegExp]'
}

export function enquireScreen(call) {
  const handler = {
    match: function () {
      call && call(true)
    },
    unmatch: function () {
      call && call(false)
    }
  }
  enquireJs.register('only screen and (max-width: 767.99px)', handler)
}
/*
*   参数:interval,字符串表达式，表示要添加的时间间隔.
*   参数:number,数值表达式，表示要添加的时间间隔的个数.
*   参数:date,时间对象.
*   返回:新的时间对象.
*   var now = new Date();
*   var newDate = DateAdd( "d", 5, now);
*---------------   DateAdd(interval,number,date)   -----------------
*/
export function DateAdd(interval, number, date) {
  number = parseInt(number)
  switch (interval) {
    case "y": {
      date.setFullYear(date.getFullYear() + number);
      return date;
    }
    case "q": {
      date.setMonth(date.getMonth() + number * 3);
      return date;
    }
    case "m": {
      date.setMonth(date.getMonth() + number);
      date.setDate(date.getDate() - 1);
      return date;
    }
    case "w": {
      date.setDate(date.getDate() + number * 7);
      return date;
    }
    case "d": {
      date.setDate(date.getDate() + number);
      return date;
    }
    case "h": {
      date.setHours(date.getHours() + number);
      return date;
    }
    case "mm": {
      date.setMinutes(date.getMinutes() + number);
      return date;
    }
    case "s": {
      date.setSeconds(date.getSeconds() + number);
      return date;
    }
    default: {
      date.setDate(date.getDate() + number);
      return date;
    }
  }
}
const _toString = Object.prototype.toString
