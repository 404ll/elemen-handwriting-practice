Array.prototype.myForEach = function (callback, thisArg) {
  if (typeof callback !== "function") {
    throw new TypeError(callback + "is not a fcuntion");
  }

  const len = this.length;

  for (let i = 0; i < len; i++) {
    // 跳过稀疏数组的空位
    if (i in this) {
      // 绑定 thisArg，让回调中的 this 指向指定对象
      callback.call(thisArg, this[i], i, this);
    }
  }
};

const arr = [10, 20, 30]

const obj = {
  prefix: '当前值'
}

arr.myForEach(function(item, index, array) {

  console.log('this =>', this)

  console.log('this.prefix =>', this.prefix)

  console.log('item =>', item)

  console.log('index =>', index)

  console.log('array =>', array)

  console.log('----------------')

}, obj)