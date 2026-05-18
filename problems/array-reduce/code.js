Array.prototype.myReduce = function (fn, initialValue) {
  if (typeof fn !== "function") {
    throw new TypeError(fn + " is not a function");
  }
  
  // 空数组且没有初始值时，直接抛错
  if(this.length === 0 && initialValue === undefined){
     throw new TypeError(
        'Reduce of empty array with no initial value'
     )
  }
  
  // 没有初始值时，默认用首项作为累计结果
  let res = initialValue === undefined ? this[0] : initialValue;
  // 起始索引根据是否有初始值决定
  let start = initialValue === undefined ? 1 : 0;

  for (let i = start; i < this.length; i++) {
    // 跳过稀疏数组的空位
    if(i in this){
        res = fn(res, this[i], i, this);
    }
  }
  return res;
};

const arr = [1, 2, 3, 4];
const res = arr.myReduce((acc, item) => acc + item);
console.log(res); //10
