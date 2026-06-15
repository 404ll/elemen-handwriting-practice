//创建一个新对象，并让它的隐式原型（[[Prototype]]）指向 proto
function createObject(proto) {

    // 边界处理：proto 必须是对象或 null
    if (typeof proto !== 'object' && proto !== null) {
        throw new TypeError('Object prototype may only be an Object or null');
    }

    // 1. 创建一个临时构造函数
    function F() {}
    
    // 2. 将构造函数的原型指向传入的对象
    F.prototype = proto;
    
    // 3. 返回这个构造函数的实例（实例的 __proto__ 指向 proto）
    return new F();
}
