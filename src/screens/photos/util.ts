import { Photos } from "types/photos";
import { useMemo, useState } from "react";
import { Pageination } from "types";

type PhotoParamType = Pageination<Partial<Photos & { artistIds: number[] }>>;

/**
 *  返回参数
 */
export const usePhotosParams = (paramData: PhotoParamType) => {
  const [param, setParam] = useState(paramData);

  return [useMemo(() => ({ ...param }), [param]), setParam] as const;
};

/**
 * ReactQuery Key
 */
export const usePhotosQueryKey = (paramData: PhotoParamType) => {
  const [param] = usePhotosParams(paramData);

  return ["photos", param];
};
