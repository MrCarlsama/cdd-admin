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
  Statistic,
  Tag,
} from "antd";
import { useExportPhotos, usePhotos } from "./model";
import { Photos } from "types/photos";
import styled from "@emotion/styled";
import { ArtistSelect } from "components/artistSelect";
import { usePhotosParams, PhotoParamType } from "./util";
import {
  DownloadOutlined,
  ReloadOutlined,
  DeleteOutlined,
  StopOutlined,
  SearchOutlined,
  PictureFilled,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useScroll } from "utils/useScroll";
import { PageinationList, PageinationResult } from "types";
const GridContainer = ({
  handleLoadMore,
  photos,
  isLoading,
}: {
  handleLoadMore: () => void;
  photos: Photos[];
  isLoading?: boolean;
}) => {
  const ref = useScroll(() => {
    handleLoadMore();
  });

  return (
    <Row gutter={[8, 8]} ref={ref}>
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

  const actions = [<DeleteOutlined />, <StopOutlined />];

  return (
    <Card
      hoverable={true}
      cover={
        <ImageWrap>
          <Image
            src={`${OSS_HOST}${photo.url}?x-oss-process=image/auto-orient,1/interlace,1/quality,q_40`}
            preview={{
              src: `${OSS_HOST}${photo.url}`,
            }}
          />
        </ImageWrap>
      }
      actions={actions}
    >
      <Space wrap={true}>
        {photo.artists.map((artist) => (
          <Tag key={artist.id}>
            <Button
              type={"link"}
              target={"_blank"}
              href={`https://zh.moegirl.org.cn/${artist.name}`}
            >
              {artist.name}
            </Button>
          </Tag>
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
  total: number;
  currentTotal: number;
}

const SearchContainer = ({
  param,
  setParam,
  total,
  currentTotal,
}: SearchPanelProps) => {
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
              page: 0,
              options: { isAudit: true, artistIds: values },
            })
          }
        />
      </Col>
      <Col
        lg={2}
        xs={24}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Space>
          <Statistic
            value={currentTotal}
            prefix={<SearchOutlined />}
            valueStyle={{
              fontSize: "14px",
            }}
          />
          <Statistic
            value={total}
            prefix={<PictureFilled />}
            valueStyle={{
              fontSize: "14px",
            }}
          />
        </Space>
      </Col>
    </Row>
  );
};

export const PhotosScreen = () => {
  const [param, setParam] = usePhotosParams({
    limit: 12,
    page: 0,
    options: {
      isAudit: true,
      artistIds: [],
    },
  });

  const { data = new PageinationList<Photos[]>([]), isLoading } = usePhotos(
    param
  );

  const {
    data: loadPhotos = [],
    currentTotal,
    total,
  } = data as PageinationResult<Photos[]>;

  const [photos, setPhotos] = useState<Photos[]>([]);

  useEffect(() => {
    if (param.page === 0) {
      setPhotos([]);
    }
  }, [param]);

  useEffect(() => {
    setPhotos((photos) => [...photos, ...loadPhotos]);
  }, [loadPhotos]);

  const handleLoadMore = () => {
    if (!isLoading) {
      setParam((pre) => ({
        ...param,
        page: Number(pre.page) + 1,
      }));
    }
  };

  return (
    <>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <SearchContainer
            param={param}
            setParam={setParam}
            total={total}
            currentTotal={currentTotal}
          />
        </Col>

        <Col span={24}>
          <GridContainer photos={photos} handleLoadMore={handleLoadMore} />
        </Col>
        <Col span={24}>
          <Button
            id={"Btn"}
            type="link"
            loading={isLoading}
            onClick={handleLoadMore}
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
