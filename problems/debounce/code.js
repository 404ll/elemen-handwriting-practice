function debounce(func, wait, immediate = false) {
    let timer = null;

    function debounced(...args) {
        const context = this;
        const callNow = immediate && timer === null;

        clearTimeout(timer);

        timer = setTimeout(() => {
            timer = null;

            if (!immediate) {
                func.apply(context, args);
            }
        }, wait);

        if (callNow) {
            func.apply(context, args);
        }
    }

    debounced.cancel = () => {
        clearTimeout(timer);
        timer = null;
    };

    return debounced;
}

// 模拟搜索 API
function searchAPI(keyword, signal) {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            resolve([`${keyword} 结果1`, `${keyword} 结果2`]);
        }, 300);

        // 支持取消
        signal?.addEventListener('abort', () => {
            clearTimeout(timeout);
            reject(new DOMException('Aborted', 'AbortError'));
        }, { once: true });
    });
}

// 搜索组件核心逻辑
function createSearchBox() {
    let loading = false;
    let abortController = null;

    const performSearch = debounce(async (keyword) => {
        if (abortController) {
            abortController.abort();
        }

        const controller = new AbortController();
        abortController = controller;

        try {
            loading = true;
            console.log('🔍 搜索中...', keyword);

            const results = await searchAPI(keyword, controller.signal);

            console.log('✅ 搜索结果:', results);
            return results;

        } catch (error) {
            if (error?.name === 'AbortError') {
                console.log('❌ 请求已取消');
            } else {
                console.error('搜索失败:', error);
            }
        } finally {
            if (abortController === controller) {
                loading = false;
                abortController = null;
            }
        }
    }, 500);

    const handleInput = (e) => {
        const keyword = e.target.value.trim();

        if (!keyword) {
            performSearch.cancel();
            if (abortController) {
                abortController.abort();
                abortController = null;
            }
            loading = false;
            return;
        }

        performSearch(keyword);
    };

    return { handleInput };
}

// 测试
const searchBox = createSearchBox();

// 模拟用户快速输入
const mockInput = (value) => {
    searchBox.handleInput({ target: { value } });
};

mockInput('r');
mockInput('re');
mockInput('rea');
mockInput('reac');
mockInput('react');
// 只有最后一次 'react' 会在 500ms 后触发搜索
