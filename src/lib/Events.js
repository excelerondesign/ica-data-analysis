
const all = new Map();

const on = (type, handler) => {
    const handlers = all.get(type);
    if (handlers) {
        handlers.push(handler);
    } else {
        all.set(type, [handler]);
    }
}

const off = (type, handler) => {
    const handlers = all.get(type);
    if (handlers) {
        if (handler) {
            handlers.splice(handlers.indexOf(handler) >>> 0, 1);
        } else {
            all.set(type, []);
        }
    }
}

const emit = (type, detail = {}, useNativeDispatch) => {
    const handlers = all.get(type);
    
    if (handlers) {
        handlers.slice().map(handler => handler(detail));
    }
    if (useNativeDispatch) document.dispatchEvent(new CustomEvent(type, { detail }));
}

export {
    on,
    off,
    emit
};