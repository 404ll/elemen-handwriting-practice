# 手写深拷贝

深拷贝会另外创造一个一模一样的对象，新对象跟原对象不共享内存。修改新对象不会改到原对象，是“值”而不是“引用”。

## JSON.parse(JSON.stringify())

这个方法利用 JSON 的序列化和反序列化来实现深拷贝。

缺点：

- 会丢失 `undefined`、`Symbol` 和函数。
- `Date` 对象会被转换成字符串，`RegExp` 对象会被转换成 `{}`。
- 无法处理循环引用的对象，会报错。

示例：

```js
const obj = { a: 1, b: { c: 2 }, d: undefined };
const clone = JSON.parse(JSON.stringify(obj));

console.log(clone); // { a: 1, b: { c: 2 } }，d 丢失了
```

## structuredClone()

标准 API `structuredClone()` 支持更多数据类型，并且能处理循环引用。

缺点：

- 不支持函数和 `Symbol`。
- 不支持原型链上的属性。

示例：

```js
const obj = { a: 1, b: { c: 2 }, d: undefined };
obj.self = obj;

const clone = structuredClone(obj);

console.log(clone.self === clone); // true
```

## lodash 的 _.cloneDeep()

第三方库 `lodash` 的 `_.cloneDeep()` 功能强大，支持多种数据类型和循环引用。

缺点：

- 体积较大，可能引入不必要的代码。
- 性能较低，尤其是对于大对象。

示例：

```js
const _ = require("lodash");

const obj = { a: 1, b: { c: 2 }, d: undefined, e: Symbol("sym") };
const clone = _.cloneDeep(obj);
```

## 手写实现

手写递归深拷贝可以支持基本数据类型、对象、数组、日期、正则和循环引用。

### cache 的作用

`cache` 保存的是「已经克隆过的对象及其对应的克隆结果」。

它有两个作用：

- 防止循环引用导致无限递归。
- 保持多个引用指向同一个对象的关系不变。

`WeakMap` 是 ES6 引入的一种类似于 `Map` 的集合，但它有两个核心特征：弱引用、键必须是对象。

`typeof` 返回值包括：`"undefined"`、`"string"`、`"number"`、`"boolean"`、`"symbol"`、`"bigint"`、`"function"`、`"object"`。其中 `typeof null` 返回 `"object"` 是历史遗留问题。

`instanceof` 返回 `true` 或 `false`，一般用于判断引用类型。

## instanceof

`instanceof` 是关系操作符，用于测试构造函数的 `prototype` 属性是否出现在对象的原型链中。

适用场景：判断引用类型，例如对象、数组、自定义类。

返回值：布尔值。

工作原理：沿着对象的 `__proto__` 向上查找。

缺点：

- 不能检测基本类型，例如 `123 instanceof Number` 是 `false`，除非是 `new Number(123)`。
- 多窗口或 iframe 场景中，不同全局环境下的原型链不共享，可能导致判断失效。

## typeof

`typeof` 返回一个表示操作数类型的字符串。

适用场景：判断基本数据类型，除了 `null`。

返回值：`"undefined"`、`"string"`、`"number"`、`"boolean"`、`"symbol"`、`"bigint"`、`"function"`、`"object"`。

缺点：

- `typeof null` 返回 `"object"`。
- 无法区分对象细节，对于数组、普通对象、正则等统一返回 `"object"`。

## 精准判断对象类型

```js
function getTrueType(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
}

console.log(getTrueType([])); // "array"
console.log(getTrueType(null)); // "null"
console.log(getTrueType(new Date())); // "date"
```
