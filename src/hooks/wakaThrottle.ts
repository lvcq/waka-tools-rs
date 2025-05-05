import { useRef, useCallback } from 'react';

// 定义节流函数的类型
type ThrottleFunction<T extends any[]> = (...args: T) => void;

export function useWakaThrottle<T extends any[]>(
    callback: ThrottleFunction<T>, // 需要节流的函数
    delay: number =300// 节流时间间隔（毫秒）
): ThrottleFunction<T> {
    const lastExecuted = useRef<number>(0); // 上一次执行的时间戳

    const throttledCallback = useCallback(
        (...args: T) => {
            const now = Date.now();
            const timeSinceLastExecution = now - lastExecuted.current;

            if (timeSinceLastExecution >= delay) {
                lastExecuted.current = now; // 更新上一次执行时间
                callback(...args); // 执行回调函数
            }
        },
        [callback, delay]
    );

    return throttledCallback;
}
