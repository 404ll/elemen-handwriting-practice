function Parent(name){
    this.name = name
}

Parent.prototype.say = function(){
    return `hi ${this.name}`
}

function Child(name, age){
    //只需要调用一次父构造函数
    Parent.call(this, name)
    this.age = age
}

//不需要直接new Parent

Child.prototype = Object.create(Parent.prototype)
Child.prototype.contructor = Child

Child.prototype.info = function (){
    return `${this.name} - ${this.age}`
}