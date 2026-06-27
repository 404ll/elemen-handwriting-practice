// 手写 useState
// 核心：闭包 + 数组 + 索引 cursor

function createRenderer(Component) {
  const states = [];
  let cursor = 0; //当前执行到了第几个 useState

  function useState(initialValue) {
    const currentIndex = cursor; 

    //只有第一次渲染的时候才使用初始值
    if (states[currentIndex] === undefined) {
      states[currentIndex] = initialValue;
    }

    //判断是普通的还是函数式更性
    function setState(newValue) {
      states[currentIndex] = typeof newValue === "function"
          ? newValue(states[currentIndex])
          : newValue;

      render();//触发一次重新渲染，让组件重新读取最新的 state
    }

    cursor++;

    return [states[currentIndex], setState];
  }

  //模拟组件重新执行
  function render() {
    cursor = 0;
    Component(useState);
  }

  return {
    render,
  };
}

//====测试=====//

function App(useState) {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("Elemen");

  console.log("render:", { count, name });

  globalThis.add = () => setCount(count + 1);
  globalThis.addSafe = () => setCount((prev) => prev + 1);
  globalThis.changeName = () => setName("React");
}

const app = createRenderer(App);

app.render();
// render: { count: 0, name: 'Elemen' }

add();
// render: { count: 1, name: 'Elemen' }

addSafe();
// render: { count: 2, name: 'Elemen' }

changeName();
// render: { count: 2, name: 'React' }