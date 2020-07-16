export function debounce(fn: Function, timeout = 500) {
    let timer: NodeJS.Timeout;

    return (...args: any) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            clearTimeout(timer);
            fn(...args)
        }, timeout);
    }
}