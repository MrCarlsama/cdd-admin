import { useEffect, useState } from "react";

/**
 * 防抖hooks
 */
export const useDebounce = <V>(value: V, delay?: number) => {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounceValue(value), delay);

    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debounceValue;
};

/**
 * 传入一个对象，和键集合，返回对应的对象中的键值对
 */
export const subset = <
  O extends { [key in string]: unknown },
  K extends keyof O
>(
  obj: O,
  keys: K[]
) => {
  const filteredEntries = Object.entries(obj).filter(([key]) =>
    keys.includes(key as K)
  );
  return Object.fromEntries(filteredEntries) as Pick<O, K>;
};

export const isVoid = (value: unknown) =>
  value === undefined || value === null || value === "";

/**
 * 清除对象内空值
 */
export const cleanObject = (object: { [key: string]: unknown }) => {
  const result = { ...object };
  Object.keys(result).forEach((key) => {
    const value = result[key];
    if (isVoid(value)) {
      delete result[key];
    }
  });
  return result;
};
