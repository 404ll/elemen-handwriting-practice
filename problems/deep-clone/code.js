function deepClone(target, cache = new WeakMap()) {
  // 基本类型直接返回
  if (target === null || typeof target !== "object") return target;

  // 处理日期和正则
  if (target instanceof Date) return new Date(target);
  if (target instanceof RegExp) return new RegExp(target);

  // 如果已经克隆过，直接返回缓存结果，避免循环引用并保留共享引用关系
  if (cache.has(target)) return cache.get(target);

  // 处理数组或对象
  const cloneTarget = Array.isArray(target) ? [] : Object.create(Object.getPrototypeOf(target));

  cache.set(target, cloneTarget);

  // 遍历对象所有可枚举属性
  for (const key in target) {
    // 跳过原型链上的属性
    if (Object.prototype.hasOwnProperty.call(target, key)) {
      cloneTarget[key] = deepClone(target[key], cache);
    }
  }

  return cloneTarget;
}
