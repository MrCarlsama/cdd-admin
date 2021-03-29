import { QueryKey, useQueryClient } from "react-query";

// react-query 乐观更新 config
export const useConfig = (
  queryKey: QueryKey,
  callback: (target: any, old?: any[]) => any[]
) => {
  const queryClient = useQueryClient();

  return {
    onSuccess: () => queryClient.invalidateQueries(queryKey),
    onMutate(target: any) {
      // 获取之前数据快照
      const previousItems = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old?: any[]) => {
        return callback(target, old);
      });

      // 返回快照上下文，给错误回退用
      return { previousItems };
    },
    onError(error: any, newItem: any, context: any) {
      queryClient.setQueryData(queryKey, context.previousItems);
    },
  };
};
export const useQueryDeleteConfig = (queryKey: QueryKey) =>
  useConfig(
    queryKey,
    (target, old) => old?.filter((item) => item.id !== target.id) || []
  );

export const useQueryEditConfig = (queryKey: QueryKey) =>
  useConfig(
    queryKey,
    (target, old) =>
      old?.map((item) =>
        item.id === target.id ? { ...item, ...target } : item
      ) || []
  );

export const useQueryAddConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old) => (old ? [...old, target] : []));
