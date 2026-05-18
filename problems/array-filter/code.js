Array.prototype.myFilter = function(callback){
    if(typeof callback !== 'function'){
        throw new TypeError(callback + ' is not a function')
    }

    const res = []
    const len = this.length

    for(let i = 0; i < len; i++){
        callback(this[i], i , this) && res.push(this[i])
    }

    return res
}

const arr = [1,2,3,4]
const res = arr.myFilter(item => item > 2)
console.log(res) //[3, 4]