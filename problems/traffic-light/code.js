// 交通信号灯模拟：红灯 1 秒 -> 绿灯 1 秒 -> 黄灯 1 秒，循环执行
function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

async function trafficLight() {
  while (true) {
    console.log("red");
    await sleep(1000);

    console.log("green");
    await sleep(1000);

    console.log("yellow");
    await sleep(1000);
  }
}

trafficLight();
