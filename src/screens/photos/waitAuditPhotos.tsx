import { Button, Card, Col, Image, Row, Typography } from "antd";
import { CloseCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { ArtistSelect } from "components/artistSelect";
import { useEffect, useState } from "react";
import { useAuditPhotos, usePhotos } from "./model";
import { Photos } from "types/photos";
import styled from "@emotion/styled";
import { usePhotosParams, usePhotosQueryKey } from "./util";
const GridContainer = ({ photos }: { photos: Photos[] }) => {
  return (
    <Row gutter={[8, 8]}>
      {photos.map((photo) => (
        <Col span={4} key={photo.id}>
          <CardContainer photo={photo} />
        </Col>
      ))}
    </Row>
  );
};

const CardContainer = ({ photo }: { photo: Photos }) => {
  const artistIds = photo.artists.map((artist) => artist.id);

  const [value, setValue] = useState<number[]>(artistIds);

  const OSS_HOST = process.env.REACT_APP_OSS_URL;

  return (
    <Card
      hoverable={true}
      cover={
        <ImageWrap>
          <Image src={`${OSS_HOST}${photo.url}`} />
        </ImageWrap>
      }
      actions={[<CloseCircleOutlined />, <CheckCircleOutlined />]}
    >
      <Typography.Text>{photo.description}</Typography.Text>
      <ArtistSelect value={value} onChange={(val) => setValue(val)} />
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

export const WaitAuditPhotosScreen = () => {
  // const  = useEditP

  const [param, setParam] = usePhotosParams({
    limit: 40,
    skip: 0,
    options: {
      isAudit: false,
    },
  });

  const { data: photos = [] } = usePhotos(param);

  // 审核
  const { mutateAsync } = useAuditPhotos(usePhotosQueryKey(param));
  const handleAudit = async () => {
    const auditList = photos
      .filter((photo) => photo.artists.length > 0)
      .map((photo) => ({
        id: photo.id,
        artistIds: photo.artists.map((artist) => artist.id),
      }));

    mutateAsync(auditList);
  };

  return (
    <>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <Button type={"primary"} onClick={handleAudit}>
            一键审核
          </Button>
        </Col>
        <Col span={24}>
          <GridContainer photos={photos} />
        </Col>
      </Row>
    </>
  );
};
