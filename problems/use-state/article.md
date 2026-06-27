# 手写 useState 学习笔记

## 题目目标

实现一个简化版 `useState`，理解 React Hooks 最核心的状态保存方式。

这份实现不追求完整模拟 React，只关注三个关键点：

1. 状态要保存在组件函数外面。
2. 多个 `useState` 要按照调用顺序依次读取。
3. `setState` 后要触发组件重新执行。

## 核心原理

`useState` 的核心是：闭包 + 数组 + 索引 `cursor`。

```js
const states = [];
let cursor = 0;
```

`states` 数组用来保存每一次 `useState` 的状态。

`cursor` 用来记录当前执行到了第几个 `useState`。

组件每次重新执行时，函数内部的局部变量都会重新创建。如果状态直接写在组件函数内部，下一次渲染时状态就丢了。所以状态必须放在组件外层，通过闭包保存下来。

## createRenderer 做了什么

`createRenderer(Component)` 接收一个组件函数，并在内部创建一套独立的状态系统。

```js
function createRenderer(Component) {
  const states = [];
  let cursor = 0;

  function useState(initialValue) {}

  function render() {
    cursor = 0;
    Component(useState);
  }

  return {
    render,
  };
}
```

这里的 `states` 和 `cursor` 都被 `useState`、`render` 闭包引用，所以它们不会随着组件函数执行结束而销毁。

## useState 的执行过程

每次调用 `useState` 时，先记录当前索引：

```js
const currentIndex = cursor;
```

这个 `currentIndex` 很重要。它表示当前这个 `useState` 对应 `states` 数组里的哪个位置。

如果这个位置还没有值，说明是第一次渲染，就使用初始值：

```js
if (states[currentIndex] === undefined) {
  states[currentIndex] = initialValue;
}
```

然后返回当前状态和更新函数：

```js
return [states[currentIndex], setState];
```

最后让 `cursor++`，下一个 `useState` 就会读取数组里的下一个位置。

## 为什么 setState 要记住 currentIndex

`setState` 不能直接使用 `cursor`，因为 `cursor` 会在每次渲染前被重置，也会随着 Hook 调用不断变化。

所以要在 `useState` 执行时保存一份固定的 `currentIndex`：

```js
function setState(newValue) {
  states[currentIndex] =
    typeof newValue === "function"
      ? newValue(states[currentIndex])
      : newValue;

  render();
}
```

这样每个 `setState` 都能更新自己对应的状态位置。

例如：

```js
const [count, setCount] = useState(0);
const [name, setName] = useState("Elemen");
```

`setCount` 永远更新 `states[0]`。

`setName` 永远更新 `states[1]`。

## 为什么 render 前要重置 cursor

组件重新执行时，Hook 要从第一个重新开始匹配。

```js
function render() {
  cursor = 0;
  Component(useState);
}
```

第一次渲染：

```text
useState(0)        -> cursor = 0 -> states[0]
useState("Elemen") -> cursor = 1 -> states[1]
```

第二次渲染也必须保持同样顺序：

```text
useState(0)        -> cursor = 0 -> states[0]
useState("Elemen") -> cursor = 1 -> states[1]
```

这就是 Hooks 依赖调用顺序的原因。

## 为什么 Hook 不能写在条件语句里

如果 Hook 写在条件语句里，某次渲染可能跳过一个 `useState`，后面的状态索引就会错位。

错误示例：

```js
function App(useState) {
  const [count, setCount] = useState(0);

  if (count > 0) {
    const [flag, setFlag] = useState(false);
  }

  const [name, setName] = useState("Elemen");
}
```

当 `count` 从 `0` 变成 `1` 后，中间多执行了一次 `useState`，`name` 对应的数组位置就变了，状态会乱。

所以 Hooks 必须写在函数组件最外层，不能写在条件、循环或嵌套函数里。

## setState 的两种写法

代码里支持两种更新方式。

第一种是直接传新值：

```js
setCount(count + 1);
```

第二种是函数式更新：

```js
setCount((prev) => prev + 1);
```

函数式更新会拿到当前最新状态：

```js
typeof newValue === "function"
  ? newValue(states[currentIndex])
  : newValue;
```

这也是 React 里推荐用于依赖旧状态更新的写法。

## 测试流程

初始渲染：

```js
app.render();
```

输出：

```text
render: { count: 0, name: 'Elemen' }
```

调用 `add()` 后，更新 `count`：

```js
add();
```

输出：

```text
render: { count: 1, name: 'Elemen' }
```

调用 `addSafe()` 后，用函数式更新继续累加：

```js
addSafe();
```

输出：

```text
render: { count: 2, name: 'Elemen' }
```

调用 `changeName()` 后，更新第二个状态：

```js
changeName();
```

输出：

```text
render: { count: 2, name: 'React' }
```

这说明两个状态分别保存在不同数组位置，更新时不会互相影响。

## 这版实现的限制

这只是一个帮助理解原理的简化模型。

它没有实现 React 里的 Fiber、批量更新、异步调度、组件树、事件系统，也没有处理多个组件实例之间的状态隔离。

但它抓住了 `useState` 最重要的思想：状态存放在组件函数外部，组件重新执行时，通过稳定的 Hook 调用顺序把状态取回来。

## 总结

手写 `useState` 的关键不是 `setState` 函数本身，而是状态如何在多次组件执行之间保持稳定。

这个实现里：

1. `states` 负责保存状态。
2. `cursor` 负责匹配 Hook 顺序。
3. `currentIndex` 让每个 `setState` 记住自己的状态位置。
4. `render` 通过重置 `cursor` 模拟组件重新执行。

理解这四点，就能理解 Hooks 为什么依赖调用顺序，也能理解为什么 Hooks 不能写在条件语句里。
