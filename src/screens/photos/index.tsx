import { Card, Col, Image, Row, Space, Spin, Tag } from "antd";
import { usePhotos } from "./model";
import { Photos } from "types/photos";
import styled from "@emotion/styled";
import { ArtistSelect } from "components/artistSelect";
import { usePhotosParams } from "./util";

const GridContainer = ({
  photos,
  isLoading,
}: {
  photos: Photos[];
  isLoading: boolean;
}) => {
  return (
    <Row gutter={[8, 8]}>
      {isLoading ? (
        <Spin size={"large"} />
      ) : (
        photos.map((photo) => (
          <Col span={4} key={photo.id}>
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
      <Space>
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

export const PhotosScreen = () => {
  const [param, setParam] = usePhotosParams({
    limit: 40,
    skip: 0,
    options: {
      isAudit: true,
      artistIds: [],
    },
  });

  const { data: photos = [], isLoading } = usePhotos(param);

  return (
    <>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <ArtistSelect
            value={param?.options?.artistIds || []}
            onChange={(values) =>
              setParam({
                ...param,
                options: { isAudit: true, artistIds: values },
              })
            }
          />
        </Col>
        <Col span={24}>
          <GridContainer photos={photos} isLoading={isLoading} />
        </Col>
      </Row>
    </>
  );
};
