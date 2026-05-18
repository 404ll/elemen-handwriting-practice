Array.prototype.myFill = function(value, start = 0, end = this.length){
    const len = this.length

    // 处理负数索引并限制范围
    start = start < 0 ? Math.max(len + start, 0) : Math.min(start, len)
    end = end < 0 ? Math.max(len + end, 0) : Math.min(end, len)

    for(let i = start; i < end; i++){
        // 覆盖指定区间的元素
        this[i] = value
    }

    return this
}

const arr = [1,2,3,4]
arr.myFill(8,1,3)
console.log(arr)//[1, 8, 8, 4]