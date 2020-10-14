// // 表单验证

/* 合法uri*/
export function validateURL(textval) {
    const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    return urlregex.test(textval);
}
   
// 验证是否整数
export function isInteger(rule, value, callback) {
    if (!value) {
        return callback(new Error('输入不可以为空'));
    }
    setTimeout(() => {
        if (!Number(value)) {
        callback(new Error('请输入正整数'));
        } else {
        const re = /^[0-9]*[1-9][0-9]*$/;
        const rsCheck = re.test(value);
        if (!rsCheck) {
            callback(new Error('请输入正整数'));
        } else {
            callback();
        }
        }
    }, 1000);
}

// 验证是否是[0-1]的小数
export function isDecimal(rule, value, callback) {
    if (!value) {
        return callback(new Error('输入不可以为空'));
    }
    setTimeout(() => {
        if (!Number(value)) {
            callback(new Error('请输入数字'));
        } else {
            if (value < 0 || value > 1) {
                callback(new Error('请输入[0,1]之间的数字'));
            } else {
                callback();
            }
        }
    }, 1000);
}


/* 小写字母*/
export function validateLowerCase(str) {
    const reg = /^[a-z]+$/;
    return reg.test(str);
}

// 大写字母
export function validateUpperCase(val) {
    const reg = /^[A-Z]+$/;
    return reg.test(val);
}

// 大小写字母
export function validatAlphabets(val) {
    const reg = /^[A-Za-z]+$/;
    return reg.test(val);
}

//   是否是手机号码
export function validatePhone(rule, value,callback) {
    const reg =/^[1][3-9][0-9]{9}$/;
    if(value==''||value==undefined||value==null){
      callback();
    }else {
      if ((!reg.test(value)) && value != '') {
        callback(new Error('请输入正确的电话号码'));
      } else {
        callback();
      }
    }
}

// 是否身份证号码
export function validateIdNo(rule, value,callback) {
    const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if(value==''||value==undefined||value==null){
      callback();
    }else {
      if ((!reg.test(value)) && value != '') {
        callback(new Error('请输入正确的身份证号码'));
      } else {
        callback();
      }
    }
}

// // 是否邮箱
export function validateEMail(rule, value,callback) {
    const reg =/^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
        if(value==''||value==undefined||value==null){
            callback();
        }else{
            if(!reg.test(value)){
                callback(new Error('请输入正确的邮箱'));
            } else {
                callback();
            }
        }
}

// 验证内容是否包含英文数字以及下划线
export function isPassword(rule, value, callback) {
    const reg =/^[_a-zA-Z0-9]+$/;
    if(value==''||value==undefined||value==null){
      callback();
    } else {
      if (!reg.test(value)){
        callback(new Error('仅由英文字母，数字以及下划线组成'));
      } else {
        callback();
      }
    }
}

// 纯数字验证
export const validateNumber = (rule, value, callback) => {
    let numberReg = /^\d+$|^\d+[.]?\d+$/
    if (value !== '') {
        if (!numberReg.test(value)) {
            callback(new Error('请输入数字'))
        } else {
            callback()
        }
    } else {
        callback(new Error('请输入值'))
    }
}

// 最多1位小数
export const onePoint = (rule, value, callback) => {
    if (!/^[0-9]+([.]{1}[0-9]{1})?$/.test(value)) {
      callback(new Error('最多一位小数！！！'));
    } else {
      callback();
    }
};




