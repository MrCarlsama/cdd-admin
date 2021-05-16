import { RandomPhotosResult } from "./../../types/photos";
import { API_URL } from "utils/api";
import { useHttp } from "utils/http";
import { useAsync } from "utils/useAsync";

// 随机图片
export const useRandomPhoto = () => {
  const http = useHttp();

  const { run, ...result } = useAsync<RandomPhotosResult>();

  const handle = (name: string) => {
    run(
      http(`${API_URL.Photos}/getMyWife`, {
        method: "POST",
        data: {
          name,
        },
      })
    );
  };

  return { handle, ...result };
};

// 推荐
export const useRecommentArtists = () => {
  const http = useHttp();

  const { run, ...result } = useAsync<string[]>();

  const handle = () => {
    run(http(`${API_URL.Artist}/getRecomment`, { method: "POST" }));
  };

  return { handle, ...result };
};
