# 复制成功后，每个标签页会话只提示一次

## 场景

复制内容成功后，可以展示一次后续操作提示；但连续点击复制按钮或刷新页面后，不应让提示反复打扰用户。

这是一条工作实战中的 React 交互记录，学习重点是 `sessionStorage` 在“当前标签页会话”里的使用边界。

## 我做了什么

- 只在剪贴板写入成功后，才判断是否要展示提示。
- 用 `sessionStorage` 记录当前标签页是否已经展示过提示。
- 用 `useRef` 保护当前组件生命周期，作为存储不可用时的兜底。
- 在打开弹窗前写入记录，避免快速连续点击导致重复弹出。

## 核心流程

```text
点击复制
  ↓
clipboard.writeText 成功
  ↓
检查 useRef 与 sessionStorage
  ↓
未展示过：先写入标记
  ↓
打开提示弹窗
```

## 代码

```tsx
const NUDGE_SHOWN_KEY = 'copy-nudge-shown:v1';

function claimNudgeForSession(storage: Storage): boolean {
  try {
    if (storage.getItem(NUDGE_SHOWN_KEY) === 'true') return false;

    storage.setItem(NUDGE_SHOWN_KEY, 'true');
    return true;
  } catch {
    // 存储不可用时，交给组件内的 ref 继续避免重复展示。
    return true;
  }
}

function CopyAction() {
  const shownInCurrentPage = useRef(false);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);

    if (
      shownInCurrentPage.current ||
      !claimNudgeForSession(window.sessionStorage)
    ) {
      return;
    }

    shownInCurrentPage.current = true;
    openNudgeDialog();
  };
}
```

## 记一下

`sessionStorage` 的范围是当前标签页会话：刷新页面后记录还在，关闭标签页后自然失效。因此它适合“当前会话只提示一次”，而不是长期记住用户选择。

不过，“同一个标签页”不等于一定可以共享。`sessionStorage` 还按同源隔离；同源指协议、域名和端口都相同。

- 在同一标签页内，从 `https://example.com/home` 进入 `https://example.com/settings`，可以共享这份记录。
- 从 `https://example.com` 跳到 `https://admin.example.com`，域名不同，不能共享。
- `http://example.com` 与 `https://example.com` 协议不同，`https://example.com:3000` 与 `https://example.com:3001` 端口不同，也都不能共享。
- 页面里的第三方 iframe 虽然同处一个浏览器标签页，但它的存储属于自己的源，宿主页面读不到。

`useRef` 处理的是当前组件生命周期内的即时重复触发；即使隐私模式或浏览器策略让存储不可用，也能避免同一页连续弹窗。

关键是顺序：必须先确认复制成功，再读标记；而且要在打开弹窗前写入标记。若先弹窗再写入，快速连续点击可能在状态完成前重复触发。

如果需求改成“这台设备长期只提示一次”，可考虑 `localStorage`；如果要跨设备识别同一用户，则需要登录态与服务端记录。
