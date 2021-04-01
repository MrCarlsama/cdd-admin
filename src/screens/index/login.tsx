import { Form, Drawer, Row, Input, Button, Spin, Col, Space } from "antd";
import { useForm } from "antd/lib/form/Form";
import { ErrorBox } from "components/lib";
import { useAuth } from "context/authContext";
import { useEffect } from "react";
import { useLoginModal } from "./util";

export const LoginModal = () => {
  const { loginModalOpen, close } = useLoginModal();

  // // 更新数据
  const { mutateAsync, isLoading: mutateLoading, error } = useAuth().useLogin();

  const [form] = useForm();

  // 关闭模态框
  const closeModal = () => {
    form.resetFields();
    close();
  };

  // 提交表单
  const onFinish = (values: any) => {
    mutateAsync({
      ...values,
    }).then(() => {
      closeModal();
    });
  };

  // 设置初始化值
  useEffect(() => {
    form.setFieldsValue({ username: "", password: "" });
  }, [form]);

  return (
    <Drawer
      forceRender={true}
      title={"登录"}
      placement="left"
      onClose={closeModal}
      width={"100%"}
      visible={loginModalOpen}
    >
      {mutateLoading ? (
        <Spin size={"large"} />
      ) : (
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={8}>
            <Form form={form} layout={"vertical"} onFinish={onFinish}>
              <Form.Item
                name={"username"}
                rules={[{ required: true, message: "请输入用户名" }]}
              >
                <Input placeholder={"用户名"} type="text" id={"username"} />
              </Form.Item>
              <Form.Item
                name={"password"}
                rules={[{ required: true, message: "请输入密码" }]}
              >
                <Input placeholder={"密码"} type="password" id={"password"} />
              </Form.Item>
              <Form.Item style={{ textAlign: "right" }}>
                <Space>
                  <ErrorBox error={error} />
                  <Button
                    loading={mutateLoading}
                    type={"primary"}
                    htmlType={"submit"}
                  >
                    登录
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      )}
    </Drawer>
  );
};
