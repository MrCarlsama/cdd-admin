import { Input, Space } from "antd";
import { Artists } from "types/artists";

export interface SearchPanelProps {
  param: Partial<Pick<Artists, "name">>;
  setParam: (param: SearchPanelProps["param"]) => void;
}

export const SearchPanel = ({ param, setParam }: SearchPanelProps) => {
  return (
    <Space align={"center"} wrap={true}>
      <Input
        placeholder={"名字"}
        type={"text"}
        value={param.name}
        onChange={(evt) => setParam({ ...param, name: evt.target.value })}
      />
    </Space>
  );
};
