import { useUrlQueryParam } from "utils/url";
/**
 * 登录模态框
 */
export const useLoginModal = () => {
  // 从url获取参数
  const [{ login }, setLogin] = useUrlQueryParam(["login"]);

  const open = () => setLogin({ login: true });
  const close = () => setLogin({ login: "" });

  return {
    loginModalOpen: login === "true",
    open,
    close,
  };
};
