/**
 * requestSerial：按顺序依次执行异步任务
 * @param {Function[]} tasks 异步任务函数数组，每一项执行后返回 Promise
 * @returns {Promise<Array>} 所有任务结果，顺序和 tasks 一致
 */

//这里我认为和并发的区别是runNext的调用时机，串行在每个任务完成后才调用，而并发则是同时调用多个任务
function requestSerial(tasks) {
  const results = [];
  let index = 0;

  return new Promise((resolve, reject) => {
    function runNext() {
      if (index === tasks.length) {
        resolve(results);
        return;
      }

      const currentIndex = index;
      const task = tasks[currentIndex];
      index++;

      Promise.resolve()
        .then(() => task())
        .then((result) => {
          results[currentIndex] = result;
          runNext();
        })
        .catch((error) => {
          reject(error);
        });
    }

    runNext();
  });
}

// ==================== 测试
function createTask(id, delay) {
  return () =>
    new Promise((resolve) => {
      setTimeout(() => {
        console.log(`任务 ${id} 完成`);
        resolve(id);
      }, delay);
    });
}

const tasks = [
  createTask(1, 300),
  createTask(2, 100),
  createTask(3, 200),
];

requestSerial(tasks)
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.error(err);
  });
