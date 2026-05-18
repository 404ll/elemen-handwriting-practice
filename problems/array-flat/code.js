// //将嵌套的数组扁平化
// const arr = [1, [2, 3], [4, 5]]
// //默认只展开一层，完全展开可以传infinity
// //同时会自动忽略空位
// console.log(arr.flat())
// // [1, 2, 3, 4, 5]

const arr = [1, [2, 3], 4,[5,[6]]]

Array.prototype.myflat = function(depth = 1){
    const res = []

    for(const p of this){
        if(Array.isArray(p) && depth >= 0){
            res = res.concat(p.myflat(depth - 1))
        }else{
            res.push(p)
        }
    }
    return res
}
console.log(arr.myflat(2))
