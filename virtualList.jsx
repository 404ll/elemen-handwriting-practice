/**
 * 虚拟列表的核心： 只渲染可视区域内的DOM元素
 * 核心结构：
 * 1. 外层容器：设置固定高度和overflow-y: auto，作为滚动容器
 * 2. 内层容器：设置总高度，总高度 = 总数据量 * 每项高度
 * 3. 可视区域内的列表项：根据滚动位置动态改变transform:translateY(...)或则会top值。使其永远处于视口中
 */

import React, { useState, useRef, useEffect } from "react";

const VirtualList = ({ listData, itemHeight, containerHeight }) => {
  const [visibleData, setVisibleData] = useState([]); //实际渲染的数据
  const [startOffset, setStartOffset] = useState(0); //偏移量
  const [startIndex, setStartIndex] = useState(0); //起始索引

  const containerRef = useRef(null);

  const visibleCount = Math.ceil(containerHeight / itemHeight); //计算可见数量

  //滚动函数
  const onScroll = () => {
    const scrollTop = containerRef.current.scrollTop; // 获取滚动位置

    //计算当前的起始索引 -- 应该显示第几个列表
    const currStartIndex = Math.floor(scrollTop / itemHeight);
    setStartIndex(currStartIndex);

    //计算当前结束索引
    const currEndIndex = currStartIndex + visibleCount;

    //更新实际渲染的数据
    setVisibleData(listData.slice(currStartIndex, currEndIndex + 1)); 

    //更新偏移量
    setStartOffset(currStartIndex * itemHeight); //偏移量 = 起始索引 * 每项高度
  };

  useEffect(() => {
    onScroll();
  }, [listData, itemHeight, containerHeight]);

  return (
    <div
        ref={containerRef}
        style={{height: `${containerHeight}px`, overflow: "auto", position: "relative"}}
        onScroll={onScroll}
        >

        <div style={{height: `${listData.length * itemHeight}px`, position: "absolute", left: 0, top: 0, right: 0, zIndex: -1}}>
        </div>

        {/**实际渲染层 */}
        <div style={{transform: `translate3d(0, ${startOffset}px, 0)`}}>
            {visibleData.map((item, index) => (
                <div key={startIndex + index} style={{height: `${itemHeight}px`, borderBottom: "1px solid #eee"}}>
                    {item.value}
                </div>
            ))}
        </div>

    </div>
  )
};

export default VirtualList;
