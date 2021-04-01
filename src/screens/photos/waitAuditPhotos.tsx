import { Button, Card, Col, Image, message, Row, Spin, Typography } from "antd";
import {
  CloseCircleOutlined,
  CheckCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { ArtistSelect } from "components/artistSelect";
import { useAuditPhotos, usePhotos } from "./model";
import { Photos } from "types/photos";
import styled from "@emotion/styled";
import {
  useCardImageSelect,
  useDeletePhotosHandle,
  usePhotosParams,
  usePhotosQueryKey,
} from "./util";
import { useEffect } from "react";
import { useAuth } from "context/authContext";

type BatchSelectProps = {
  selectArtistsIds: number[][];
  handleSetSelectArtistsIds: (ids: number[], index: number) => void;
  deletePhotosHandle: (id: number) => void;
};

const CardContainer = ({
  photo,
  photoIdx,
  selectArtistsIds,
  handleSetSelectArtistsIds,
  deletePhotosHandle,
}: { photo: Photos; photoIdx: number } & BatchSelectProps) => {
  const OSS_HOST = process.env.REACT_APP_OSS_URL;

  return (
    <Card
      hoverable={true}
      cover={
        <ImageWrap>
          <Image src={`${OSS_HOST}${photo.url}`} />
        </ImageWrap>
      }
      actions={[
        <CloseCircleOutlined onClick={() => deletePhotosHandle(photo.id)} />,
        <CheckCircleOutlined />,
      ]}
    >
      <Typography.Text>{photo.description}</Typography.Text>
      <ArtistSelect
        style={{ width: "100%" }}
        value={selectArtistsIds[photoIdx]}
        onChange={(val) => handleSetSelectArtistsIds(val, photoIdx)}
      />
    </Card>
  );
};

const GridContainer = ({
  photos,
  selectArtistsIds,
  handleSetSelectArtistsIds,
  deletePhotosHandle,
}: { photos: Photos[] } & BatchSelectProps) => {
  return (
    <Row gutter={[8, 8]}>
      {photos.map((photo, photoIdx) => (
        <Col xs={24} sm={12} md={6} lg={4} key={photo.id}>
          <CardContainer
            photo={photo}
            photoIdx={photoIdx}
            selectArtistsIds={selectArtistsIds}
            handleSetSelectArtistsIds={handleSetSelectArtistsIds}
            deletePhotosHandle={deletePhotosHandle}
          />
        </Col>
      ))}
    </Row>
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
  const [param, setParam] = usePhotosParams({
    limit: 12,
    skip: 0,
    options: {
      isAudit: false,
    },
  });

  const { data: photos = [], status, isLoading: gettingLoading } = usePhotos(
    param
  );

  // 最底部
  useEffect(() => {
    if (status === "success" && param.limit > 12) {
      window.location.href =
        window.location +
        (window.location.toString().includes("#Btn") ? "" : "#Btn");
    }
  }, [status, param]);

  // 下拉框
  const [selectArtistsIds, handleSetSelectArtistsIds] = useCardImageSelect(
    photos
  );

  // 删除
  const deletePhotosHandle = useDeletePhotosHandle(param);
  // 登录信息
  const { user } = useAuth();

  // 审核
  const { mutateAsync, isLoading: editingLoading } = useAuditPhotos(
    usePhotosQueryKey(param)
  );
  const handleAudit = async () => {
    if (!user) {
      message.error("没有权限哟~");
      return;
    }
    const auditList = photos
      .map((photo, photoIdx) => ({
        id: photo.id,
        artistIds: selectArtistsIds[photoIdx],
      }))
      .filter((list) => list.artistIds.length > 0);

    if (auditList.length === 0) {
      message.warning("没有一个能审核的！");
      return;
    }

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
          {editingLoading ? (
            <Spin size="large" />
          ) : (
            <GridContainer
              photos={photos}
              selectArtistsIds={selectArtistsIds}
              handleSetSelectArtistsIds={handleSetSelectArtistsIds}
              deletePhotosHandle={deletePhotosHandle}
            />
          )}
        </Col>
        <Col span={24}>
          <Button
            id={"Btn"}
            type="link"
            loading={gettingLoading}
            onClick={() => {
              setParam((pre) => ({ ...param, limit: Number(pre.limit) + 12 }));
            }}
            block
            icon={<ReloadOutlined />}
          >
            {gettingLoading ? "Loading" : "加载更多！もっともっと！"}
          </Button>
        </Col>
      </Row>
    </>
  );
};
