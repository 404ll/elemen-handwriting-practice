// 深拷贝会另外创造一个一模一样的对象，新对象跟原对象不共享内存，修改新对象不会改到原对象，是“值”而不是“引用”（不是分支）

/**
 * JSON.parse(JSON.stringify())这个方法利用json的序列化和反序列化来实现
 * 缺点：1. 丢失undefined、Symbol和函数
        2. Date对象会被转换成字符串,RegExp对象会被转换成{}
        3. 无法处理循环引用的对象，会报错
*/

//示例
const obj = { a: 1, b: { c: 2 }, d: undefined };
const clone = JSON.parse(JSON.stringify(obj));

console.log(clone); // { a: 1, b: { c: 2 } } —— d 丢失了

/**
 * 标准api - structuredClone()，支持更多数据类型，且能处理循环引用
 * 缺点：1. 不支持函数和Symbol
        2. 不支持原型链上的属性
*/

//示例
const obj = { a: 1, b: { c: 2 }, d: undefined, e: Symbol('sym') };
const clone = structuredClone(obj);

/** 
 *  第三方库 - lodash的_.cloneDeep()，功能强大，支持多种数据类型和循环引用
 *  缺点： 1. 体积较大，可能引入不必要的代码
 *       2. 性能较低，尤其是对于大对象
 */
//示例
const _ = require('lodash');
const obj = { a: 1, b: { c: 2 }, d: undefined, e: Symbol('sym') };
const clone = _.cloneDeep(obj);

/**
 * 手写实现 - 递归深拷贝，支持基本数据类型和对象
 * WeakMap 是 ES6 引入的一种类似于 Map 的集合，但它有两个核心特征：“弱引用”和“键必须是对象”。
 * typeof 返回：undefined string number boolean symbol bigint function object 存在null的历史遗留问题
 * intanceof 返回： true/false 一般用于判断引用类型
 */

function deepClone(EventTarget, cache = new WeakMap){
    //处理原始类型
    if(target === null || typeof target !== 'object') return target

    //处理日期和正则
    if(target instanceof Date) return new Date(target)
    if(target instanceof RegExp) return new RegExp(target)

    //处理循环引用
    if(cache.has(target)) return cache.get(target)

    //创造新的容器
    const cloneTarget = Array.isArray(target) ? [] : {}
    cache.set(target, cloneTarget)

    //递归遍历
    for(const key in target){
        if(target.hasOwnProperty(key)){
            cloneTarget[key] = deepClone(target[key], cache)
        }
    }
    return cloneTarget
}

/**
 * instanceof (关系操作符)
instanceof 用于测试构造函数的 prototype 属性是否出现在对象的 原型链 中的任何位置。
适用场景：判断引用类型（对象、数组、自定义类）。
返回值：布尔值（true 或 false）。
工作原理：它会沿着 __proto__ 向上查找。
缺点：
不能检测基本类型：例如 123 instanceof Number 是 false（除非是 new Number(123)）。
多窗口/Iframe 问题：不同全局环境下（如 iframe 之间）的原型链不共享，会导致判断失效。
 */

/**
 *  typeof (类型操作符)
typeof 返回一个表示操作数类型的 字符串。
适用场景：判断基本数据类型（除了 null）。
返回值："undefined", "string", "number", "boolean", "symbol", "bigint", "function", "object"。
缺点：
null 的历史遗留问题：typeof null 返回 "object"（这是一个公认的 Bug）。
无法区分对象细节：对于数组、普通对象、正则等，统一返回 "object"。
 */


/**精准判断对象
 * function getTrueType(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
}

console.log(getTrueType([]));      // "array"
console.log(getTrueType(null));    // "null"
console.log(getTrueType(new Date())); // "date"
 */