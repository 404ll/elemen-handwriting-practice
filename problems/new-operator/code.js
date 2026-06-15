function myNew(Constructor, ...args){
    const obj = Object.create(Constructor.prototype)
    //立即执行构造函数
    const result = Constructor.apply(obj, args)
    //如果构造函数显式返回对象，则 new 返回这个对象
    return (result !== null &&( typeof result === 'object' || typeof result === 'function')) ? result : obj
}


function Person(name) {
  this.name = name;
}
Person.prototype.say = function () {
  return `hi ${this.name}`;
};

// 1. 基础构造
const p1 = myNew(Person, "Alice");
console.log(p1.name); // Alice
console.log(p1.say()); // hi Alice
console.log(p1 instanceof Person); // true