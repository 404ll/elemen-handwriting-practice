// 列表转树的核心思想就是递归实现

function getTreeList(arr, parentId) {
  // 当前层级的结果
  const result = [];

  // 遍历整个数组，寻找当前 parentId 下的直接子节点
  for (const item of arr) {

    if (item.pid === parentId) {
      // 拷贝一份节点，避免直接修改原数组对象
      const node = { ...item };

      // 递归查找当前节点的子节点
      const children = getTreeList(arr, node.id);

      // 如果存在子节点，则挂载 children 属性
      if (children.length > 0) {
        node.children = children;
      }

      // 将当前节点放入结果数组
      result.push(node);
    }
  }

  // 返回当前层级构造完成的树结构
  return result;
}

let arr = [
  { id: 1, name: '部门1', pid: 0 },
  { id: 2, name: '部门2', pid: 1 },
  { id: 3, name: '部门3', pid: 1 },
  { id: 4, name: '部门4', pid: 3 },
  { id: 5, name: '部门5', pid: 4 },
  { id: 6, name: '部门6', pid: 0 },
];

// 从 pid = 0 开始构建整棵树
const res = getTreeList(arr, 0);

console.log(res);