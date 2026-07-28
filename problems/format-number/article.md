# 千分位格式化数字

## 场景

订单金额、浏览量或统计数据展示时，常需要把长数字按每三位插入一个逗号，让人更容易阅读。

## 题目目标

实现 `formatNumber`：

```js
formatNumber(123456789); // "123,456,789"
```

小数部分不参与插入逗号，会原样保留。

## 代码

```js
function formatNumber(value) {
  const [integer, decimal] = String(value).split(".");
  const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return decimal === undefined ? formattedInteger : `${formattedInteger}.${decimal}`;
}
```

## 核心思路

先把输入转成字符串，再把整数部分和小数部分拆开。整数部分使用正则找到“右边还剩 3、6、9… 位数字”的位置，并在这些位置插入逗号；最后再把小数部分拼回去。

正则 `/\B(?=(\d{3})+(?!\d))/g` 的含义是：

- `\B`：匹配不是单词边界的位置，避免在数字开头插入逗号。
- `(?=(\d{3})+(?!\d))`：向右看，后面必须是若干组三位数字，并且最后一组后面不再跟数字。
- `g`：匹配所有符合的位置。

## 记一下

这道题的关键不是逐位计算，而是确定逗号应该插在哪里。把小数部分先拆开，可以避免给小数位也插入千分位分隔符。
