/**
 * requestSerial：按顺序依次执行异步任务
 * @param {Function[]} tasks 异步任务函数数组，每一项执行后返回 Promise
 * @returns {Promise<Array>} 所有任务结果，顺序和 tasks 一致
 */

function requestSerial(tasks) {
  // TODO: 实现请求串行执行
  // 1. 按数组顺序依次执行每一个 task
  // 2. 前一个任务完成后，才能开始下一个任务
  // 3. 按原顺序收集每个任务的结果
  // 4. 任意任务失败时，整体失败并停止后续任务
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
