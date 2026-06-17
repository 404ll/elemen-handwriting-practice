function promiseRace(iterable) {
  const items = Array.from(iterable);

  return new Promise((resolve, reject) => {
    if (items.length === 0) {
      return;
    }

    items.forEach((item) => {
      Promise.resolve(item).then(resolve).catch(reject);
    });
  });
}
