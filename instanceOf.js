//沿着对象的原型链往上找，看是否能找到构造函数的 prototype
function myInstanceOf(obj, Constructor){
    //如果是初始类型
    if(obj === null || (typeof obj !== 'object' && typeof obj !== 'function')){
        return false
    }

    //获取对象的原型
    let proto = Object.getPrototypeOf(obj)
    const target = Constructor.prototype

    while(proto){
        if(proto === target) return true
        proto = Object.getPrototypeOf(proto)
    }

    return false
}

function Foo() {}
const f = new Foo();

console.log(myInstanceOf(f, Foo)); // true
console.log(myInstanceOf(f, Object)); // true

// 基础类型
console.log(myInstanceOf(1, Number)); // false
console.log(myInstanceOf("a", String)); // false
console.log(myInstanceOf(null, Object)); // false
console.log(myInstanceOf(undefined, Object)); // false

// 函数也是对象
function Bar() {}
console.log(myInstanceOf(Bar, Function)); // true
console.log(myInstanceOf(Bar, Object)); // true

// 自定义原型链
function A() {}
function B() {}
B.prototype = Object.create(A.prototype);
const b = new B();

console.log(myInstanceOf(b, B)); // true
console.log(myInstanceOf(b, A)); // true