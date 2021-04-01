import { Photos } from "types/photos";
import { useEffect, useMemo, useState } from "react";
import { Pageination } from "types";
import { useDeletePhotos } from "./model";
import { message, Modal } from "antd";
import { useAuth } from "context/authContext";

export type PhotoParamType = Pageination<
  Partial<Photos & { artistIds: number[] }>
>;

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

export const useCardImageSelect = (photos: Photos[]) => {
  // 获取下拉框的值
  const [selectArtistsIds, setSelectArtistsIds] = useState<number[][]>([]);

  useEffect(() => {
    const artistsIds = photos.map((photo) =>
      photo.artists.map((artist) => artist.id)
    );
    setSelectArtistsIds(artistsIds);
  }, [photos]);

  const handleSetSelectArtistsIds = (ids: number[], index: number) => {
    const idsList = [...selectArtistsIds];

    idsList.splice(index, 1, ids);

    setSelectArtistsIds(idsList);
  };

  return [selectArtistsIds, handleSetSelectArtistsIds] as const;
};

export const useDeletePhotosHandle = (param: PhotoParamType) => {
  const { user } = useAuth();

  const { mutateAsync: deleteHandle } = useDeletePhotos(
    usePhotosQueryKey(param)
  );

  return (id: number) => {
    if (!user) {
      message.error("没有权限哟~");
      return;
    }
    Modal.confirm({
      okText: "确定",
      cancelText: "取消",
      title: "确定删除图片吗？",
      onOk() {
        return deleteHandle({ id });
      },
    });
  };
};
