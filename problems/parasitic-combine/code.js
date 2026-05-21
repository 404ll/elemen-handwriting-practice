function Parent(name){
    this.name = name
}

Parent.prototype.say = function(){
    return `hi ${this.name}`
}

function Child(name, age){
    //只需要调用一次父构造函数
    Parent.call(this, name) //继承父构造函数的属性
    this.age = age
}

//不需要直接new Parent
// 创建一个以Parent.prototype为原型的对象，并赋值给Child.prototype，实现寄生组合继承
//让 Child 的实例能够访问 Parent.prototype 上的方法
Child.prototype = Object.create(Parent.prototype)
Child.prototype.constructor = Child //修复constructor指向

Child.prototype.info = function (){
    return `${this.name} - ${this.age}`
}

// 测试用例
const child = new Child('Alice', 18)
console.log(child.name) // Alice
console.log(child.age) // 18
console.log(child.say()) // hi Alice
console.log(child.info()) // Alice - 18
console.log(child instanceof Child) // true
console.log(child instanceof Parent) // true