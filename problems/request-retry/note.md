# 手写可配置异步重试器 retry

## 场景

一个异步操作失败后，按策略自动再试几次。它不只适用于 HTTP 请求；只要传入的是“每次调用都会重新发起操作”的异步函数，读文件、调用第三方 API、提交任务等都能使用。

常见使用场景：

- 网络抖动导致请求偶发失败
- 后端服务短暂不可用
- 调用第三方 API 时遇到临时的 `429` 或 `5xx`
- 某些任务需要容忍短暂的资源竞争

## 题目目标

实现一个 `retry` 方法：

- 接收一个返回 Promise 的函数 `fn`
- 第一次直接执行 `fn()`；失败后最多额外重试 `retries` 次
- 每次重试前先等待，等待时间按倍率递增
- 可设置最长等待时间、随机抖动，以及哪些错误允许重试
- 成功时立刻返回结果；最终失败时抛出最后一次错误

## 函数签名

```js
async function retry(fn, options = {}) {}
```

## 先抓住核心

你刚开始卡住的两个点，正好就是它的主体：

1. **循环尝试**：`for` 控制最多能调用 `fn()` 几次。
2. **失败后等待**：`await setTimeout(...)` 让这一次 `retry()` 暂停；等待结束，循环才会进入下一轮。

把它连起来，就是一个失败后的状态流：

```text
第 0 轮：执行 fn()
  ├─ 成功 → return 结果，整个 retry 结束
  └─ 失败 → 判断是否还能重试
             ├─ 不能 → throw 原错误
             └─ 能 → 等待 → 增加下次等待时间 → 第 1 轮
```

`retries` 不包含第一次执行。因此 `retries = 3` 时，最多执行 `1 + 3 = 4` 次。

## 选项与退避

```js
retry(fetchProfile, {
  retries: 3,
  initialDelay: 1000,
  factor: 2,
  maxDelay: 30_000,
  jitter: true,
  shouldRetry: (error) => error instanceof Error,
});
```

- `initialDelay`：第一次重试前等多久。
- `factor`：每次等待时间的增长倍率。
- `maxDelay`：单次等待的最大值。
- `jitter`：把等待时间随机浮动在约 `0.5x ~ 1.5x`，避免大量请求同时失败后又同时重试。
- `shouldRetry`：决定当前错误是否值得再试；例如 4xx 参数错误通常不应重试。

关闭抖动时，`initialDelay = 500`、`factor = 2` 的等待时间是：

- 第 1 次重试前等待 `500ms`
- 第 2 次重试前等待 `1000ms`
- 第 3 次重试前等待 `2000ms`

## 代码里各自负责什么

- `for (let attempt = 0; attempt <= retries; attempt++)`：计算并限制总尝试次数。
- `return await fn()`：每轮真正执行的操作；一旦成功，函数马上结束，不会继续循环。
- `catch`：只处理失败后的分支。
- `isLastAttempt || !shouldRetry(error)`：最后一次失败、或错误明确不该重试时，保留原错误并抛出。
- `await new Promise(resolve => setTimeout(resolve, waitTime))`：不是新开一个循环，而是把当前异步函数暂停一段时间。
- `currentDelay`：保存“下一次失败后要等多久”；等待后才按 `factor` 增长，并被 `maxDelay` 限制。

## 两个容易混淆的点

### 为什么传函数，而不是直接传 Promise？

Promise 创建后就已经开始执行了。重试时需要的是一次新的操作，所以要传 `() => fetch(...)`，每轮都重新调用它。

```js
retry(() => fetch("/api/profile"));
```

### 等待是不是循环本身？

不是。循环负责“是否进行下一次尝试”；等待只是失败后、进入下一轮之前插入的一段暂停。没有失败，就不会等待；没有剩余次数，也不会等待。

## 进一步可补

- 支持 `AbortController` 取消重试流程
- 支持 `onRetry` 回调，记录第几次重试和等待时间
- 把 `shouldRetry` 写成针对 HTTP 状态码的策略
- 在请求层再搭配超时、限流和熔断，而不是无限重试
