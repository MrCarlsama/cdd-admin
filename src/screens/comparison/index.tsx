import styled from "@emotion/styled";
import { Col, Form, Input, Row, Switch, Table, Button, Popconfirm } from "antd";
import { RedoOutlined } from "@ant-design/icons";

import { useEffect, useState } from "react";
import {
  ComparisonParam,
  KeyVal,
  useComparisonData,
  useModifyComparisonData,
  useComparisonDataReMatch,
} from "./model";

interface ComparisonDataProps {
  isLoading: boolean;
  data: KeyVal[];
  onSwitch: (val: boolean) => void;
  onSave: (record: KeyVal[]) => void;
  onDelete: (record: { key: string }[]) => void;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: string;
  inputType: "text";
  record: KeyVal;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `请输入${title}！`,
            },
          ]}
        >
          <Input />
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export const ComparisonData = ({
  isLoading,
  data,
  onSwitch,
  onDelete,
  onSave,
}: ComparisonDataProps) => {
  const [form] = Form.useForm();

  const [editingKey, setEditingKey] = useState("");

  const isEditing = (record: KeyVal) => record.key === editingKey;

  const handleDelete = (record: KeyVal) => {
    const param = [{ key: record.key }];
    onDelete(param);
  };

  const columns = [
    { title: "对照键", dataIndex: "key", width: "40%", editable: true },
    { title: "对照值", dataIndex: "value", width: "40%", editable: true },
    {
      title: "操作",
      dataIndex: "operation",
      render: (_: any, record: KeyVal) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button type={"link"} onClick={() => save()}>
              Save
            </Button>
            <Button type={"link"} onClick={cancel}>
              Cancel
            </Button>
          </span>
        ) : (
          <span>
            <Button
              type={"link"}
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
            >
              Edit
            </Button>
            <Popconfirm
              title="Sure to Delete?"
              onConfirm={() => handleDelete(record)}
            >
              <Button type="link" danger disabled={editingKey !== ""}>
                Delete
              </Button>
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: KeyVal) => ({
        record,
        inputType: "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const edit = (record: KeyVal) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async () => {
    try {
      const row = (await form.validateFields()) as KeyVal;
      onSave([row]);
      cancel();
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24}>
        <Switch
          onChange={(val) => onSwitch(val)}
          checkedChildren="空"
          unCheckedChildren="全"
          defaultChecked
        />
      </Col>
      <Col xs={24}>
        <Form form={form} component={false}>
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            loading={isLoading}
            dataSource={data}
            columns={mergedColumns}
            size="small"
            pagination={{ position: ["bottomRight"] }}
          />
        </Form>
      </Col>
    </Row>
  );
};

export const ComparisonScreen = () => {
  // 编辑
  const {
    handle: handleEditting,
    isLoading: edittingLoading,
  } = useModifyComparisonData();

  // 重新匹配
  const {
    handle: handleReMatch,
    isLoading: rematchLoading,
  } = useComparisonDataReMatch();

  // 名字对照表
  const [paramName, setParamName] = useState<ComparisonParam>({
    empty: true,
    type: "name",
  });
  const {
    data: nameList = [],
    isLoading: nameListLoading,
    refetch: refetchByName,
  } = useComparisonData(paramName);

  const handleOnSwitchByName = (empty: boolean) => {
    setParamName({ ...paramName, empty });
  };

  const handleSaveByName = (record: KeyVal[]) => {
    handleEditting({
      updateArray: record,
      deleteArray: [],
      type: "name",
    });
    refetchByName();
  };

  const handleDeleteByName = (record: { key: string }[]) => {
    handleEditting({
      updateArray: [],
      deleteArray: record,
      type: "name",
    });
    refetchByName();
  };

  // 罗马音对照表
  const [paramRoma, setParamRoma] = useState<ComparisonParam>({
    empty: true,
    type: "roma",
  });

  const {
    data: romaList = [],
    isLoading: romaListLoading,
    refetch: refetchByRoma,
  } = useComparisonData(paramRoma);

  const handleOnSwitchByRoma = (empty: boolean) => {
    setParamRoma({ ...paramRoma, empty });
  };

  const handleSaveByRoma = (record: KeyVal[]) => {
    handleEditting({
      updateArray: record,
      deleteArray: [],
      type: "roma",
    });
    refetchByName();
  };

  const handleDeleteByRoma = (record: { key: string }[]) => {
    handleEditting({
      updateArray: [],
      deleteArray: record,
      type: "roma",
    });
    refetchByName();
  };

  // retry
  useEffect(() => {
    refetchByName();
    refetchByRoma();
  }, [rematchLoading, edittingLoading, refetchByName, refetchByRoma]);

  return (
    <Container>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Button onClick={() => handleReMatch()} icon={<RedoOutlined />}>
            全局重新匹配
          </Button>
        </Col>
        <Col lg={12} xs={24}>
          <ComparisonData
            data={nameList}
            isLoading={nameListLoading || edittingLoading || rematchLoading}
            onSave={handleSaveByName}
            onDelete={handleDeleteByName}
            onSwitch={handleOnSwitchByName}
          />
        </Col>
        <Col lg={12} xs={24}>
          <ComparisonData
            data={romaList}
            isLoading={romaListLoading || edittingLoading || rematchLoading}
            onSave={handleSaveByRoma}
            onDelete={handleDeleteByRoma}
            onSwitch={handleOnSwitchByRoma}
          />
        </Col>
      </Row>
    </Container>
  );
};

const Container = styled.div`
  height: 100%;
`;
