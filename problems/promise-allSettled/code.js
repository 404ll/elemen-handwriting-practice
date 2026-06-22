//全部完成后才退出
function promiseAllSettled(iterable) {
  const items = Array.from(iterable);
  const results = [];
  let count = 0;

  return new Promise((resolve) => {
    if (items.length === 0) {
      resolve(results);
      return;
    }

    items.forEach((item, index) => {
      Promise.resolve(item)
        .then(
          (value) => {
            results[index] = { status: "fulfilled", value };
          },
          (reason) => {
            results[index] = { status: "rejected", reason };
          },
        )
        .finally(() => {
          count++;
          if (count === items.length) {
            resolve(results);
          }
        });
    });
  });
}
