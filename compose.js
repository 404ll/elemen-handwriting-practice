function compose(...fns){
    const len = fns.length
    return function(value){
        let res = value

        for(let i = len - 1; i >= 0; i--){
            res = fns[i](res)
        }
        return res
    }
    
}

// 测试：
const add1 = x => x + 1;
const mul3 = x => x * 3;
const res = compose(mul3, add1)(2); // (2 + 1) * 3 = 9
console.log(res)