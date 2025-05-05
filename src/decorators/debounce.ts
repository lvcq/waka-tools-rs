
/**
 * 防抖装饰器
 */
export function debounce(delay: number) {
    return function (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value; // 保存原始方法
        let timeoutId: ReturnType<typeof setTimeout> | null = null;

        // 重写方法
        descriptor.value = function (...args: any[]) {
            if (timeoutId) {
                clearTimeout(timeoutId); // 清除之前的定时器
            }

            // 设置新的定时器
            timeoutId = setTimeout(() => {
                originalMethod.apply(this, args); // 调用原始方法
            }, delay);
        };

        return descriptor;
    };
}