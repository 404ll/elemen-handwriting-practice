// apply: 绑定 this，并且接受一个数组或类数组作为参数，立即调用
Function.prototype.myApply = function (context, args) {
  if (typeof this !== "function") {
    throw new TypeError("Function.prototype.myApply called on incompatible receiver");
  }

  context = context == null ? globalThis : Object(context);
  const fnKey = Symbol("fn");

  context[fnKey] = this;
  const result = context[fnKey](...Array.from(args || []));
  delete context[fnKey];

  return result;
};

// call: 绑定 this，并且接受参数列表，立即调用
Function.prototype.myCall = function (context, ...args) {
  if (typeof this !== "function") {
    throw new TypeError("Function.prototype.myCall called on incompatible receiver");
  }

  context = context == null ? globalThis : Object(context);
  const fnKey = Symbol("fn");

  context[fnKey] = this;
  const result = context[fnKey](...args);
  delete context[fnKey];

  return result;
};

// bind: 绑定 this，并且接受参数列表，不立即调用，返回一个新函数
Function.prototype.myBind = function (context, ...args) {
  if (typeof this !== "function") {
    throw new TypeError("Function.prototype.myBind called on incompatible receiver");
  }

  const originFn = this;

  function boundFn(...nextArgs) {
    const thisArg = this instanceof boundFn ? this : context;
    return originFn.apply(thisArg, args.concat(nextArgs));
  }

  if (originFn.prototype) {
    boundFn.prototype = Object.create(originFn.prototype);
  }

  return boundFn;
};

function add(a, b) {
  return `${this.name} ${a} ${b}`;
}

const obj = {
  name: "Tom",
};

console.log(add.myApply(obj, [1, 2])); // Tom 1 2
console.log(add.myCall(obj, 1, 2)); // Tom 1 2

const fn = add.myBind(obj, 1);
console.log(fn(2)); // Tom 1 2
console.log(fn(3)); // Tom 1 3
