import { Typography } from "antd";

// 类型守卫
const isError = (value: any): value is string => value;

export const ErrorBox = ({ error }: { error: unknown }) => {
  if (isError(error)) {
    return <Typography.Text type={"danger"}>{error}</Typography.Text>;
  }
  return null;
};
