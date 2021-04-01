import {
  Button,
  Card,
  Col,
  Image,
  message,
  notification,
  Row,
  Space,
  Spin,
  Tag,
} from "antd";
import { useExportPhotos, usePhotos } from "./model";
import { Photos } from "types/photos";
import styled from "@emotion/styled";
import { ArtistSelect } from "components/artistSelect";
import { usePhotosParams, PhotoParamType } from "./util";
import { DownloadOutlined, ReloadOutlined } from "@ant-design/icons";
import { useEffect } from "react";
const GridContainer = ({
  photos,
  isLoading,
}: {
  photos: Photos[];
  isLoading?: boolean;
}) => {
  return (
    <Row gutter={[8, 8]}>
      {isLoading ? (
        <Spin size={"large"} />
      ) : (
        photos.map((photo) => (
          <Col xs={24} sm={12} md={6} lg={4} key={photo.id}>
            <CardContainer photo={photo} />
          </Col>
        ))
      )}
    </Row>
  );
};

const CardContainer = ({ photo }: { photo: Photos }) => {
  const OSS_HOST = process.env.REACT_APP_OSS_URL;

  return (
    <Card
      hoverable={true}
      cover={
        <ImageWrap>
          <Image src={`${OSS_HOST}${photo.url}`} />
        </ImageWrap>
      }
    >
      <Space wrap={true}>
        {photo.artists.map((artist) => (
          <Tag key={artist.id}>{artist.name}</Tag>
        ))}
      </Space>
    </Card>
  );
};

const ImageWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  height: 240px;
`;

interface SearchPanelProps {
  param: PhotoParamType;
  setParam: (param: SearchPanelProps["param"]) => void;
}

const SearchContainer = ({ param, setParam }: SearchPanelProps) => {
  const {
    data: { url } = { url: "" },
    mutateAsync: exportHandle,
    isLoading,
    status,
  } = useExportPhotos();

  useEffect(() => {
    if (isLoading && status === "loading") {
      message.loading({
        content: "当前【一键D爆】导出功能可能有点慢请见谅！",
        key: "export",
      });
    } else if (!isLoading && status === "success") {
      // message.success({ content: "Loaded!", key: "export"});
      notification.success({
        message: "您的DD大礼包已到！",
        duration: null,
        btn: (
          <Button
            type="primary"
            size="small"
            onClick={() => {
              window.location.href = url;
            }}
          >
            下载
          </Button>
        ),
      });
    }
  }, [isLoading, status, url]);

  return (
    <Row gutter={[8, 8]}>
      <Col lg={2} xs={12}>
        <Button
          type={"primary"}
          loading={isLoading}
          onClick={() =>
            exportHandle({ artistIds: param?.options?.artistIds || [] })
          }
          block
          icon={<DownloadOutlined />}
        >
          一键D爆！
        </Button>
      </Col>
      <Col lg={20} xs={12}>
        <ArtistSelect
          style={{ width: "100%" }}
          value={param?.options?.artistIds || []}
          onChange={(values) =>
            setParam({
              ...param,
              options: { isAudit: true, artistIds: values },
            })
          }
        />
      </Col>
    </Row>
  );
};

export const PhotosScreen = () => {
  const [param, setParam] = usePhotosParams({
    limit: 12,
    skip: 0,
    options: {
      isAudit: true,
      artistIds: [],
    },
  });

  const { data: photos = [], isLoading, status } = usePhotos(param);

  useEffect(() => {
    if (status === "success" && param.limit > 12) {
      window.location.href =
        window.location +
        (window.location.toString().includes("#Btn") ? "" : "#Btn");
    }
  }, [status, param]);

  return (
    <>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <SearchContainer param={param} setParam={setParam} />
        </Col>
        <Col span={24}>
          <GridContainer photos={photos} />
        </Col>
        <Col span={24}>
          <Button
            id={"Btn"}
            type="link"
            loading={isLoading}
            onClick={() => {
              setParam((pre) => ({
                ...param,
                limit: Number(pre.limit) + 12,
              }));
            }}
            block
            icon={<ReloadOutlined />}
          >
            {isLoading ? "Loading" : "加载更多！もっともっと！"}
          </Button>
        </Col>
      </Row>
    </>
  );
};
