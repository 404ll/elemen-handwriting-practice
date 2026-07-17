import { useRef } from "react";

const NUDGE_SHOWN_KEY = "copy-nudge-shown:v1";

function claimNudgeForSession(storage) {
  try {
    if (storage.getItem(NUDGE_SHOWN_KEY) === "true") return false;

    storage.setItem(NUDGE_SHOWN_KEY, "true");
    return true;
  } catch {
    // 存储不可用时，交给组件内的 ref 继续避免重复展示。
    return true;
  }
}

export function CopyAction({ openNudgeDialog }) {
  const shownInCurrentPage = useRef(false);

  const handleCopy = async (text) => {
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

  return <button onClick={() => handleCopy("待复制内容")}>复制</button>;
}
