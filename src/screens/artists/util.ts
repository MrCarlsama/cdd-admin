import { useArtist } from "./model";
import { useMemo } from "react";
import { useSetUrlSearchParam, useUrlQueryParam } from "./../../utils/url";

/**
 *  返回Url搜索参数
 */
export const useArtistsSearchParams = () => {
  const [param, setParam] = useUrlQueryParam(["name"]);

  return [useMemo(() => ({ ...param }), [param]), setParam] as const;
};

/**
 * ReactQuery Key
 */
export const useArtistsQueryKey = () => {
  const [param] = useArtistsSearchParams();

  return ["artists", param];
};

/**
 * 模态框
 */
export const useArtistModal = () => {
  // 从url获取参数
  const [{ artistCreate }, setArtistCreate] = useUrlQueryParam([
    "artistCreate",
  ]);

  const [{ editingArtistId }, setEditingArtistId] = useUrlQueryParam([
    "editingArtistId",
  ]);

  const setUrlParams = useSetUrlSearchParam();

  const { data: editingArtist, isLoading } = useArtist(Number(editingArtistId));
  const open = () => setArtistCreate({ artistCreate: true });
  const close = () => setUrlParams({ artistCreate: "", editingArtistId: "" });
  const startEdit = (id: number) => setEditingArtistId({ editingArtistId: id });

  return {
    artistModalOpen: artistCreate === "true" || !!editingArtistId,
    open,
    close,
    startEdit,
    editingArtist,
    isLoading,
  };
};
