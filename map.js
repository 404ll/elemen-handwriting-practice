Array.prototype.myMap = function (callback, thisArg) {
    if(typeof callback !== 'function'){
        throw new TypeError(callback + ' is not a function')
    }

    const res = []
    const len = this.length

    for(let i = 0; i < len; i++){
        if(i in this){
            const value = callback.call(thisArg, this[i], i, this)
            res.push(value)
        }
    }

    return res
}

const arr = [1,2,3]

const obj = {
   factor: 10
}

const res = arr.myMap(function(item){

   return item * this.factor

}, obj)

console.log(res) //[10,20,30]