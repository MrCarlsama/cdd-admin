import { Form, Drawer, Row, Input, Button, Spin, Col } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useEffect } from "react";
import { useAddArtists, useEditArtists } from "./model";
import { useArtistModal, useArtistsQueryKey } from "./util";

export const ArtistModal = () => {
  const { artistModalOpen, close, editingArtist, isLoading } = useArtistModal();

  const useMutateArtist = editingArtist ? useEditArtists : useAddArtists;

  // 更新数据
  const { mutateAsync, error, isLoading: mutateLoading } = useMutateArtist(
    useArtistsQueryKey()
  );

  const [form] = useForm();

  // 提交表单
  const onFinish = (values: any) => {
    mutateAsync({
      ...editingArtist,
      ...values,
    }).then(() => {
      closeModal();
    });
  };

  // 关闭模态框
  const closeModal = () => {
    form.resetFields();
    close();
  };
  const title = editingArtist ? "编辑声优" : "新建声优";

  // 设置初始化值
  useEffect(() => {
    form.setFieldsValue(editingArtist);
  }, [editingArtist, form]);

  return (
    <Drawer
      forceRender={true}
      title={title}
      onClose={closeModal}
      width={"40%"}
      visible={artistModalOpen}
    >
      {isLoading ? (
        <Spin size={"large"} />
      ) : (
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form form={form} layout={"vertical"} onFinish={onFinish}>
              <Form.Item
                label={"名称"}
                name={"name"}
                rules={[
                  {
                    required: true,
                    message: "请输入名称",
                  },
                ]}
              >
                <Input placeholder={"请输入名称"} />
              </Form.Item>
              <Form.Item label={"原名称"} name={"nameJA"}>
                <Input placeholder={"请输入原名称"} />
              </Form.Item>
              <Form.Item
                label={"罗马音"}
                name={"nameRoma"}
                rules={[
                  {
                    required: true,
                    message: "请输入罗马音",
                  },
                ]}
              >
                <Input placeholder={"请输入罗马音"} />
              </Form.Item>
              <Form.Item style={{ textAlign: "right" }}>
                <Button
                  loading={mutateLoading}
                  type={"primary"}
                  htmlType={"submit"}
                >
                  提交
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      )}
    </Drawer>
  );
};
