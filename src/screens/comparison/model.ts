import { useQuery, useQueryClient } from "react-query";
import { API_URL } from "utils/api";
import { useHttp } from "utils/http";
import { useAsync } from "utils/useAsync";

export type KeyVal = { key: string; value: string };
export type ComparisonParam = {
  empty: boolean;
  type: "name" | "roma";
};
// 查
export const useComparisonData = (param: ComparisonParam) => {
  const http = useHttp();

  return useQuery<KeyVal[]>(["comparison", param], () =>
    http(`${API_URL.ArtistComparison}`, { data: param })
  );
};

// 改
export const useModifyComparisonData = () => {
  const http = useHttp();

  const { run, ...result } = useAsync();

  const handle = (param: {
    updateArray: KeyVal[];
    deleteArray: { key: string }[];
    type: "name" | "roma";
  }) => {
    run(http(`${API_URL.ArtistComparison}`, { data: param, method: "POST" }));
  };

  return { handle, ...result };
};

// 重新匹配
export const useComparisonDataReMatch = () => {
  const http = useHttp();

  const { run, ...result } = useAsync();

  const handle = () => {
    run(http(`${API_URL.ArtistComparison}/reMatch`, { method: "POST" }));
  };

  return { handle, ...result };
};
