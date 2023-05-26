const all = new Map();

const on = (type:string, handler:unknown) => {
    const handlers = all!.get(type);
    if (handlers) {
        handlers.push(handler);
    } else {
        all!.set(type, [handler]);
    }
}

const off = (type:string, handler:unknown) => {
    const handlers = all!.get(type);
    if (handlers) {
        if (handler) {
            handlers.splice(handlers.indexOf(handler) >>> 0, 1);
        } else {
            all!.set(type, []);
        }
    }
}

const emit = (type: string, detail = {}) => {
    
    const handlers = all!.get(type);
    console.log(type, handlers);
    if (handlers) {
        handlers.slice().map(handler => handler(detail));
    }
}

export {
    on,
    off,
    emit,
    all
};