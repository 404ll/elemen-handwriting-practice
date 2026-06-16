/*
  add(1, 2, 3); 普通调用：一次性传 3 个参数
  柯里化后：可以拆成多次调用的链条
  curriedAdd(1)(2)(3); // 6
  每次调用返回的都是一个新函数，这个新函数记住之前传过的参数，继续等待剩余参数，直到参数收齐后才真正执行。
*/

function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }

    return function (...nextArgs) {
      return curried.apply(this, args.concat(nextArgs));
    };
  };
}

function add(a, b, c) {
  return a + b + c;
}

const curriedAdd = curry(add);

console.log(curriedAdd(1)(2)(3)); // 6
console.log(curriedAdd(1, 2)(3)); // 6
console.log(curriedAdd(1)(2, 3)); // 6
