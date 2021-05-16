import {
  Badge,
  Button,
  Card,
  Col,
  Image,
  Input,
  Row,
  Space,
  Tag,
  Typography,
} from "antd";
import { SyncOutlined, SearchOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";
import { useRandomPhoto, useRecommentArtists } from "./model";
import { useEffect, useState } from "react";
import { RandomPhotos } from "types/photos";

const RecommentdContainer = ({ ...props }) => {
  const { data: tags, handle, isLoading } = useRecommentArtists();

  useEffect(() => {
    handle();
  }, []);

  return (
    <Row>
      <Col span={24} style={{ marginTop: "12px" }}>
        <Typography.Title level={5}>
          或许你可以尝试一下{" "}
          <Button
            onClick={handle}
            loading={isLoading}
            icon={<SyncOutlined />}
            type={"link"}
          >
            换一批
          </Button>
        </Typography.Title>
      </Col>
      <Space direction={"vertical"}>
        <Col span={24}>
          <Space wrap={true}>
            {(tags || []).map((tag) => (
              <PointerTag
                onClick={() => props.handleSetName(tag)}
                color="volcano"
                key={tag}
              >
                {tag}
              </PointerTag>
            ))}
          </Space>
        </Col>
        <Col span={24}>
          <img
            src={
              "https://cdd-images.oss-cn-guangzhou.aliyuncs.com/public/hellowife.jpg"
            }
          />
        </Col>
      </Space>
    </Row>
  );
};

const InfoContainer = ({ ...props }) => {
  return props.data ? (
    <Row>
      <Col span={24}>
        <Badge count={props.data.total} offset={[12, 0]} overflowCount={9999}>
          <Typography.Title level={3}>{props.data.name}</Typography.Title>
        </Badge>
      </Col>
      <Col span={24}>
        <Space wrap={true}>
          {(props.data.nicknames || []).map((nickname: string) => (
            <PointerTag
              onClick={() => props.handleSetName(nickname)}
              key={nickname}
            >
              {nickname}
            </PointerTag>
          ))}
        </Space>
      </Col>
    </Row>
  ) : null;
};

const Container = ({ ...props }) => {
  return (
    <Row gutter={[8, 8]}>
      <InfoContainer {...props} />
      <RecommentdContainer {...props} />
    </Row>
  );
};

const PointerTag = styled(Tag)`
  cursor: pointer;
`;

export const RandomScreens = () => {
  const OSS_HOST = process.env.REACT_APP_OSS_URL;

  const {
    data = new RandomPhotos(),
    handle: handleRandomPhoto,
    isLoading,
  } = useRandomPhoto();

  const [name, setName] = useState("");

  const handleSetName = (name: string) => setName(name);

  useEffect(() => {
    handleRandomPhoto("");
  }, []);

  const actions = [
    <Button
      type={"dashed"}
      size={"large"}
      shape="round"
      onClick={() => {
        setName("");
        handleRandomPhoto("");
      }}
      loading={isLoading}
      icon={<SyncOutlined />}
    >
      随机一张
    </Button>,
    <Button
      type="primary"
      size={"large"}
      shape="round"
      onClick={() => handleRandomPhoto(name)}
      loading={isLoading}
      icon={<SearchOutlined />}
    >
      查找老婆
    </Button>,
  ];

  const imageUrl = data?.data?.url
    ? `${OSS_HOST}${data!.data.url}`
    : `${OSS_HOST}/public/hellowife.jpg`;

  return (
    <Row gutter={[8, 24]}>
      <Col lg={{ span: 6, push: 5 }} sm={{ span: 24 }}>
        <Card
          cover={
            <ImageWrap>
              <Image
                src={`${imageUrl}?x-oss-process=image/auto-orient,1/interlace,1/quality,q_80`}
                preview={{
                  src: `${imageUrl}`,
                }}
              />
            </ImageWrap>
          }
          actions={actions}
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value.trim())}
              placeholder={"随便输入一个名字，比如：岩田阳葵"}
            />
          </Space>
        </Card>
      </Col>
      <Col lg={{ span: 6, push: 7 }} sm={{ span: 24 }}>
        <Container handleSetName={handleSetName} data={data} />
      </Col>
    </Row>
  );
};

const ImageWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  height: 420px;
`;
