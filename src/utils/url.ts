import { subset } from "./index";
import { cleanObject } from "utils";
import { useMemo, useState } from "react";
import { URLSearchParamsInit, useSearchParams } from "react-router-dom";

/**
 * 返回页面URL中，指点键的参数值
 */
export const useUrlQueryParam = <K extends string>(keys: K[]) => {
  const [searchParams] = useSearchParams();
  const setSearchParam = useSetUrlSearchParam();
  const [stateKeys] = useState(keys);

  return [
    useMemo(
      () =>
        subset(Object.fromEntries(searchParams), stateKeys) as {
          [key in K]: string;
        },
      [searchParams, stateKeys]
    ),
    (params: Partial<{ [key in K]: unknown }>) => {
      return setSearchParam(params);
    },
  ] as const;
};

export const useSetUrlSearchParam = () => {
  const [searchParams, setSearchParam] = useSearchParams();
  return (params: { [key in string]: unknown }) => {
    const o = cleanObject({
      ...Object.fromEntries(searchParams),
      ...params,
    }) as URLSearchParamsInit;
    return setSearchParam(o);
  };
};
