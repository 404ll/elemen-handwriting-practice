# promiseMap

## 题目目标

实现一个带并发限制的 `Promise.map`：

- 输入一个任务列表 `list`
- 对每一项执行异步函数 `mapper(item, index)`
- 同一时间最多只能运行 `limit` 个任务
- 所有任务成功后，按原数组顺序返回结果数组
- 任意一个任务失败后，整个 `promiseMap` 失败

## 核心思路

维护一个任务池，最多同时跑 `limit` 个任务；每完成一个任务，就补一个新的任务进去。

需要记录几个状态：

- `index`：下一个待启动任务的下标
- `running`：当前正在执行的任务数量
- `results`：保存每个任务的返回值，按原下标写入，保证结果顺序不乱
- `stopped`：是否已经失败；失败后不再启动新任务

## 执行流程

1. 定义 `runNext`，负责启动后续任务。
2. 每次进入 `runNext` 时，先判断是否已经 `stopped`。
3. 如果 `index === list.length && running === 0`，说明没有待启动任务，也没有运行中的任务，可以 `resolve(results)`。
4. 只要 `running < limit` 且还有任务没启动，就不断启动新任务。
5. 启动任务时先保存 `currentIndex`，因为异步完成顺序不固定。
6. 任务成功后，把结果写入 `results[currentIndex]`。
7. 任务失败后，设置 `stopped = true`，并 `reject(error)`。
8. 任务结束后执行 `finally`：`running--`，然后再次调用 `runNext` 补位。

## 关键点

### 结果保序

任务完成顺序不一定等于任务启动顺序，所以不能直接 `push` 结果。

应该使用任务启动时保存的下标：

```js
results[currentIndex] = result;
```

这样即使第 3 个任务先完成，也会写回第 3 个位置。

### 并发控制

`while (running < limit && index < list.length)` 是并发控制的核心。

每启动一个任务：

```js
index++;
running++;
```

每结束一个任务：

```js
running--;
runNext();
```

这样任务池里空出一个位置后，就会自动补上一个新任务。

### 失败处理

如果任意任务失败：

```js
stopped = true;
reject(error);
```

`stopped` 的作用是避免失败后继续启动新的任务。

注意：已经启动的任务无法被普通 Promise 取消，它们仍然可能执行完成；这里只是不再补充新任务，并让外层 Promise 进入 rejected 状态。

## 边界情况

- `list` 为空时，第一次 `runNext` 会直接满足完成条件，返回空数组。
- `limit` 应该是大于 `0` 的数字；如果 `limit <= 0`，任务无法启动，Promise 会一直挂起。
- `mapper` 可能同步抛错，也可能返回普通值，所以用 `Promise.resolve(mapper(...))` 统一包成 Promise。

## 伪代码

```js
function promiseMap(list, mapper, limit) {
  return new Promise((resolve, reject) => {
    function runNext() {
      if (已经失败) return;

      if (所有任务都启动了 && 没有运行中的任务) {
        resolve(results);
        return;
      }

      while (当前运行数量 < limit && 还有任务没启动) {
        启动一个任务;

        任务成功: 按原下标保存结果;
        任务失败: 标记停止并 reject;
        任务结束: 运行数量减一，然后继续补任务;
      }
    }

    runNext();
  });
}
```
