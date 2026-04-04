type ErrorEvent = {
    message: string;
    fullDetail: string;
};

type Listener = (event: ErrorEvent) => void;

const listeners: Listener[] = [];

export const errorEmitter = {
    emit(event: ErrorEvent) {
        listeners.forEach((listener) => listener(event));
    },
    on(listener: Listener) {
        listeners.push(listener);
        return () => {
            const idx = listeners.indexOf(listener);
            if (idx !== -1) listeners.splice(idx, 1);
        };
    }
};
