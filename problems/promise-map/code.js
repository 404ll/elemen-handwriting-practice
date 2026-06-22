/**
 * promiseMap：限制并发数量地执行异步任务
 * @param {Array} list 任务列表，比如 url 数组、file 数组
 * @param {Function} mapper 每一项要执行的异步函数，必须返回 Promise
 * @param {number} limit 最大并发数
 * @returns {Promise<Array>} 所有任务结果，顺序和原数组一致
 */

function promiseMap(list, mapper, limit) {
    const results = [];
    let index = 0;
    let running = 0;
    let stopped = false;

    return new Promise((resolve, reject) => {
        // 运行下一个任务
        function runNext() {
            // 如果已经停止执行，直接返回
            if (stopped) {
                return;
            }
            //所有任务都完成
            if(index === list.length && running === 0) {
                resolve(results);
                return;
            }

            while(running < limit && index < list.length) {
                const currentIndex = index;
                const item = list[currentIndex];
                index++;
                running++;

                Promise.resolve(mapper(item, currentIndex))
                    .then((result) => {
                        results[currentIndex] = result;
                    })
                    .catch((error) => {
                        stopped = true; // 停止执行后续任务
                        reject(error);
                    })
                    .finally(() => {
                        running--;
                        runNext();
                    });
            }
        }

        // 开始执行任务
        runNext();
    })
}

//================测试
const urls = [1, 2, 3, 4, 5, 6];

function request(id) {

  return new Promise((resolve) => {

    setTimeout(() => {

      console.log("完成请求", id);

      resolve(id * 10);

    }, 1000);

  });

}

promiseMap(urls, request, 3).then((res) => {
  console.log(res);
});

