// 比较两个时间之间相隔的方法
function  daysDistance(date1, date2 , way) {  
    let year = 1000 * 60 * 60 * 24 *365
    let mon = 1000 * 60 * 60 * 24 * 30
    let day = 1000 * 60 * 60 * 24
    let hour = 1000 * 60 * 60
    let min = 1000 * 60

    let start_ = new Date(date1);
    let startTime = start_.getTime();
    
    let start2_ = new Date(date2);
    let startTime2 = start2_.getTime();
    let cha = undefined

    if(way == 'year'){
        cha = (startTime - startTime2) / year
        cha = downFixed(cha,1)
    }else if(way == 'mon'){
        cha = (startTime - startTime2) / mon
        cha = downFixed(cha,1)
    }else if(way == 'day'){
        cha = (startTime - startTime2) / day
        cha = downFixed(cha,1)
    }else if(way == 'hour'){
        cha = (startTime - startTime2) / hour
        cha = downFixed(cha)
    }else if(way == 'min'){
        cha = (startTime - startTime2) / min
        cha = downFixed(cha,1)
    }else{
        cha = downFixed(cha,1)
    }
    return cha
}

// 向下保留小数
function downFixed (num, fix) {  // num为原数字，fix是保留的小数位数
    let result = '0'  
    if (Number(num) && fix > 0) { // 简单的做个判断
      fix = +fix || 2
      num = num + ''    
      if (/e/.test(num)) { // 如果是包含e字符的数字直接返回
        result = num
      } else if (!/\./.test(num)) { // 如果没有小数点
        result = num + `.${Array(fix + 1).join('0')}`
      } else { // 如果有小数点
        num = num + `${Array(fix + 1).join('0')}`
        let reg = new RegExp(`-?\\d*.\\d{0,${fix}}`)
        result = reg.exec(num)[0]
      }
    }  return result
  }
  


module.exports = {
    daysDistance
}
