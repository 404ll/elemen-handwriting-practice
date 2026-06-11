class EventEmitter {
    constructor() {
        this.events = new Map();
    }

    addEventListener(event, callback) {
        if (typeof callback !== 'function') {
            throw new TypeError('callback must be a function');
        }

        if (!this.events.has(event)) {
            this.events.set(event, new Set());
        }

        this.events.get(event).add(callback);
        return this;
    }

    on(event, callback) {
        return this.addEventListener(event, callback);
    }

    once(event, callback) {
        if (typeof callback !== 'function') {
            throw new TypeError('callback must be a function');
        }

        const wrapper = (...args) => {
            this.removeEventListener(event, wrapper);
            callback(...args);
        };

        wrapper.origin = callback;
        return this.addEventListener(event, wrapper);
    }

    removeEventListener(event, callback) {
        const callbacks = this.events.get(event);

        if (!callbacks) return this;

        callbacks.forEach(cb => {
            if (cb === callback || cb.origin === callback) {
                callbacks.delete(cb);
            }
        });

        if (callbacks.size === 0) {
            this.events.delete(event);
        }

        return this;
    }

    off(event, callback) {
        return this.removeEventListener(event, callback);
    }

    dispatchEvent(event, ...args) {
        const callbacks = this.events.get(event);

        if (!callbacks) return false;

        [...callbacks].forEach(callback => callback(...args));
        return true;
    }

    emit(event, ...args) {
        return this.dispatchEvent(event, ...args);
    }

    removeAllListeners(event) {
        if (event !== undefined) {
            this.events.delete(event);
        } else {
            this.events.clear();
        }

        return this;
    }
}

// 测试代码
const emitter = new EventEmitter();

function handleClick(data) {
  console.log("click", data);
}

emitter.addEventListener("click", handleClick);

emitter.dispatchEvent("click", {
  name: "elemen"
});// click { name: 'elemen' }


emitter.removeEventListener(
  "click",
  handleClick
);

emitter.dispatchEvent("click");// 不会触发

emitter.once("login", user => {
  console.log("login once", user);
});

emitter.emit("login", "elemen");// login once elemen
emitter.emit("login", "again");// 不会触发
