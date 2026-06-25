//时间戳版本
function throttle(fn, delay){
    let lastTime = 0

    return function(...args){
        const context = this
        const now = Date.now()

        if(now - lastTime >= delay){
            fn.apply(context, args)
        }
    }
}
//定时器版本
function throttle(fn, delay) {
    let timer = null;

    return function (...args) {
        if (timer) return;

        timer = setTimeout(() => {
            fn.apply(this, args);
            timer = null;
        }, delay);
    };
}