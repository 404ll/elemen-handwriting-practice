class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  on(event, cb) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event).add(cb);
  }

  //一次订阅后，执行后就删除
  once(event, cb) {
    const wrapper = (...args) => {
      this.off(event, wrapper);
      cb(...args);
    };
    wrapper.origin = cb;
    this.on(event, wrapper);
  }

  //取消订阅
  off(event, cb) {
    if (!this.events.has(event)) return;

    const callbacks = this.events.get(event);

    for (const fn of callbacks) {
      if (fn === cb || fn.origin === cb) {
        callbacks.delete(fn);
      }
    }

    if (callbacks.size === 0) {
      this.events.delete(event);
    }
  }


  //执行
  emit(event, ...args) {
    if (this.events.has(event)) {
      const callbacks = this.events.get(event);

      //复制一遍再删除，更稳定
      for (const cb of [...callbacks]) {
        cb(...args);
      }
    }
  }
}

const emitter = new EventEmitter();
emitter.once("click", (name) => {
  console.log("点击发生了", name);
});
emitter.emit("click", "elemen");
