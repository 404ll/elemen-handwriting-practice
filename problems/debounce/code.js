function debounce(fn, delay, immediate = false) {
    let timer = null;

    return function (...args) {
        const context = this;
        const callNow = immediate && !timer;

        clearTimeout(timer);

        timer = setTimeout(() => {
            timer = null;

            if (!immediate) {
                fn.apply(context, args);
            }
        }, delay);

        if (callNow) {
            fn.apply(context, args);
        }
    };
}