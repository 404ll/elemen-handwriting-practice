// 提前给一个函数“喂”一部分参数，返回一个只要剩余参数就能执行的新函数。
function partial(fn, ...presetArgs) {
  return function (...laterArgs) {
    return fn.apply(this, presetArgs.concat(laterArgs));
  };
}

function add(a, b, c) {
  return a + b + c;
}

const addOne = partial(add, 1);
const addOneAndTwo = partial(add, 1, 2);

console.log(addOne(2, 3)); // 6
console.log(addOneAndTwo(3)); // 6
