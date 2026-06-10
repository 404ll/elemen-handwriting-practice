//一个失败就全部失败（但是并不会中断），要求返回结果的顺序与输入数组一致
function promiseAll(promises) {
  const n = promises.length;
  let count = 0;
  const result = [];

  return new Promise((resolve, reject) => {
    if (n === 0) {
      resolve([]);
      return;
    }

    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then((value) => {
          count++;
          result[index] = value; //需要按照顺序返回
          if (count === n) {
            resolve(result);
          }
        })
        .catch((err) => {
          // 任意一个失败立即 reject
          reject(err);
        });
    });
  });
}
