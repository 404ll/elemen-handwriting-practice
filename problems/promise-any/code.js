function promiseAny(iterable) {
  const items = Array.from(iterable);
  const errors = [];
  let count = 0;

  return new Promise((resolve, reject) => {
    if (items.length === 0) {
      reject(new AggregateError(errors, "All promises were rejected"));
      return;
    }

    items.forEach((item, index) => {
      Promise.resolve(item)
        .then(resolve)
        .catch((reason) => {
          errors[index] = reason;
          count++;

          if (count === items.length) {
            reject(new AggregateError(errors, "All promises were rejected"));
          }
        });
    });
  });
}