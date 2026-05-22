let arr = [
  { id: 1, name: '部门1', pid: 0 },
  { id: 2, name: '部门2', pid: 1 },
  { id: 3, name: '部门3', pid: 1 },
  { id: 4, name: '部门4', pid: 3 },
  { id: 5, name: '部门5', pid: 4 },
  { id: 6, name: '部门6', pid: 0 },
];

function getTreeList(list, parentId, result) {
  // 先找出当前父节点下的直接子节点
  for (const item of list) {
    if (item.pid === parentId) {
      result.push(item);
    }
  }
  // 递归为每个子节点补 children
  for (const node of result) {
    node.children = [];
    getTreeList(list, node.id, node.children);
    if (node.children.length === 0) {
      // 没有子节点时移除 children
      delete node.children;
    }
  }
  return result;
}

const res = getTreeList(arr, 0, []);
console.log(res);