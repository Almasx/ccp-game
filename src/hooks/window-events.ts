import { useEffect } from "react";

type CustomEventMap = Record<string, CustomEvent<unknown>>;

type EventCallback<T> = (event: CustomEvent<T>) => void;

export function useEventListener<
  T extends CustomEventMap,
  K extends keyof T,
  P = T[K]["detail"]
>(eventName: K, callback: EventCallback<P>) {
  useEffect(() => {
    const handler = ((event: CustomEvent<P>) => {
      callback(event);
    }) as EventListener;

    window.addEventListener(eventName as string, handler);

    return () => {
      window.removeEventListener(eventName as string, handler);
    };
  }, [eventName, callback]);
}
