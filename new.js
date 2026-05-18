function myNew(Constructor, ...args){
    const obj = Object.create(Constructor.prototype)
    //执行构造函数
    const result = Constructor.apply(obj, args)

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