// 使用千分位分隔符转换数字：找到一个位置，这个位置右边的数字数量是 3 的倍数，然后插入逗号
function formatNumber(num) {
  const str = String(num);
  let result = "";

  for (let i = 0; i < str.length; i++) {
    if (i > 0 && (str.length - i) % 3 === 0) {
      result += ",";
    }

    result += str[i];
  }

  return result;
}

formatNumber(123456789); // "123,456,789"
