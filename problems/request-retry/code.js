/**
 * requestRetry：请求失败后自动重试
 * @param {Function} requestFn 每次执行请求的函数，返回 Promise
 * @param {number} retries 最大重试次数
 * @param {number} delay 每次重试前等待的时间，单位 ms
 * @returns {Promise<any>} 请求成功结果
 */

function requestRetry(requestFn, retries = 3, delay = 0) {
  let count = 0;

  return new Promise((resolve, reject) => {
    function attempt(){
      requestFn().then(resolve)
      .catch((err) => {

        if(count >= retries) {
          reject(err);
          return;
        }

        const wait = delay * 2 ** count;// 指数退避
        console.log(`${err.message}，等待 ${wait} ms`);
        count++;
        
        setTimeout(attempt, wait);
      })
    }
    attempt();
  })
}

// ==================== 测试
let count = 0;

function mockRequest() {
  return new Promise((resolve, reject) => {
    count++;
    console.log("当前 count =", count);

    setTimeout(() => {
      if (count < 3) {
        reject(new Error(`第 ${count} 次请求失败`));
        return;
      }

      resolve("请求成功");
    }, 300);
  });
}

requestRetry(mockRequest, 3, 500)
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.error(err);
  });
