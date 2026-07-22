/**
 * retry：为任意异步操作加入可配置的重试策略。
 * @template T
 * @param {() => Promise<T>} fn 每次尝试时重新执行的异步函数
 * @param {{
 *   retries?: number,
 *   initialDelay?: number,
 *   factor?: number,
 *   maxDelay?: number,
 *   jitter?: boolean,
 *   shouldRetry?: (error: unknown) => boolean,
 * }} [options]
 * @returns {Promise<T>}
 */
async function retry(fn, options = {}) {
  const {
    retries = 3,
    initialDelay = 1000,
    factor = 2,
    maxDelay = 30_000,
    jitter = true,
    shouldRetry = () => true,
  } = options;

  let currentDelay = initialDelay;

  // attempt = 0 是首次执行；retries 表示失败后额外允许尝试几次。
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const isLastAttempt = attempt === retries;

      if (isLastAttempt || !shouldRetry(error)) {
        throw error;
      }

      const baseDelay = Math.min(currentDelay, maxDelay);
      const waitTime = jitter
        ? Math.min(baseDelay * (0.5 + Math.random()), maxDelay)
        : baseDelay;

      console.log(
        `第 ${attempt + 1} 次尝试失败，${Math.round(waitTime)}ms 后重试`,
      );

      // await 会暂停这次 retry 调用；等待结束后，for 循环才进入下一次尝试。
      await new Promise((resolve) => {
        setTimeout(resolve, waitTime);
      });

      currentDelay = Math.min(baseDelay * factor, maxDelay);
    }
  }

  throw new Error("Retry failed unexpectedly");
}

// ==================== 测试：前两次临时失败，第三次成功
let count = 0;

function mockRequest() {
  count++;
  console.log("当前 count =", count);

  if (count < 3) {
    return Promise.reject(new Error(`第 ${count} 次请求失败`));
  }

  return Promise.resolve("请求成功");
}

retry(mockRequest, {
  retries: 3,
  initialDelay: 100,
  jitter: false,
  shouldRetry: (error) => error instanceof Error,
})
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error(error);
  });
