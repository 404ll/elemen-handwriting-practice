/**
 * requestConcurrent：限制并发数量地执行异步任务
 * @param {Function[]} tasks 异步任务函数数组，每一项执行后返回 Promise
 * @param {number} limit 最大并发数
 * @returns {Promise<Array>} 所有任务结果，顺序和 tasks 一致
 */

function requestConcurrent(tasks, limit = 3) {
  let index = 0
  let running = 0
  const result = []

  return new Promise((resolve, reject) =>{

    if (tasks.length === 0) {
      resolve([]);
      return;
    }

    function runTask(){
      if(index === tasks.length && running === 0){
        resolve(result)
        return
      }

      while(index < tasks.length && running < limit){
        const curIndex = index
        const task = tasks[index]

        index++
        running++

        Promise.resolve(task()).then((res) => {
          result[curIndex] = res
        }).catch((err) => {
          result[curIndex] = err
        }).finally(()=>{
          running--
          runTask()
        })
      }
    }

    runTask()
  })
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
  createTask(4, 100),
];

requestConcurrent(tasks, 2)
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.error(err);
  });
