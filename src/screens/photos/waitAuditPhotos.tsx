import {
  Button,
  Card,
  Col,
  Image,
  message,
  Row,
  Space,
  Spin,
  Typography,
} from "antd";
import {
  CloseCircleOutlined,
  CheckCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { ArtistSelect } from "components/artistSelect";
import {
  useAuditPhotos,
  useAuditPhotosGlobal,
  usePhotos,
  usePhotosGlobalReMatch,
} from "./model";
import { Photos } from "types/photos";
import styled from "@emotion/styled";
import {
  useCardImageSelect,
  useDeletePhotosHandle,
  usePhotosParams,
} from "./util";
import { useEffect, useState } from "react";
import { useAuth } from "context/authContext";
import { useScroll } from "utils/useScroll";
import { PageinationList, PageinationResult } from "types";

type BatchSelectProps = {
  selectArtistsIds: number[][];
  handleSetSelectArtistsIds: (ids: number[], index: number) => void;
  deletePhotosHandle: (id: number) => void;
  handleAuditSingle: ({
    id,
    artistIds,
  }: {
    id: number;
    artistIds: number[];
  }) => void;
};

const CardContainer = ({
  photo,
  photoIdx,
  selectArtistsIds,
  handleSetSelectArtistsIds,
  deletePhotosHandle,
  handleAuditSingle,
}: { photo: Photos; photoIdx: number } & BatchSelectProps) => {
  const OSS_HOST = process.env.REACT_APP_OSS_URL;

  const isDisabled = photo.isAudit || !photo.status;

  const actions = isDisabled
    ? []
    : [
        <CloseCircleOutlined onClick={() => deletePhotosHandle(photo.id)} />,
        <CheckCircleOutlined
          onClick={() =>
            handleAuditSingle({
              id: photo.id,
              artistIds: selectArtistsIds[photoIdx],
            })
          }
        />,
      ];

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
      <Typography.Text>{photo.description}</Typography.Text>
      <ArtistSelect
        style={{ width: "100%" }}
        value={selectArtistsIds[photoIdx]}
        disabled={isDisabled}
        onChange={(val) => handleSetSelectArtistsIds(val, photoIdx)}
      />
    </Card>
  );
};

const GridContainer = ({
  photos,
  handleLoadMore,
  selectArtistsIds,
  handleSetSelectArtistsIds,
  deletePhotosHandle,
  handleAuditSingle,
}: { photos: Photos[]; handleLoadMore: () => void } & BatchSelectProps) => {
  // ????????????
  const ref = useScroll(() => {
    handleLoadMore();
  });

  return (
    <Row gutter={[8, 8]} ref={ref}>
      {photos.map((photo, photoIdx) => (
        <Col xs={24} sm={12} md={6} lg={4} key={photo.id}>
          <CardContainer
            photo={photo}
            photoIdx={photoIdx}
            selectArtistsIds={selectArtistsIds}
            handleSetSelectArtistsIds={handleSetSelectArtistsIds}
            deletePhotosHandle={deletePhotosHandle}
            handleAuditSingle={handleAuditSingle}
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
    page: 0,
    options: {
      isAudit: false,
    },
  });

  const {
    data = new PageinationList<Photos[]>([]),
    isLoading: gettingLoading,
  } = usePhotos(param);

  const { data: loadPhotos = [] } = data as PageinationResult<Photos[]>;

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
    setParam((pre) => ({
      ...param,
      page: Number(pre.page) + 1,
    }));
  };

  // ?????????
  const [selectArtistsIds, handleSetSelectArtistsIds] = useCardImageSelect(
    photos
  );

  // ??????
  const deletePhotosHandle = useDeletePhotosHandle(param, (id) => {
    const oldPhotos = [...photos];

    const idx = oldPhotos.findIndex((photo) => photo.id === id);

    idx && (oldPhotos[idx].status = false);

    setPhotos(oldPhotos);
  });
  // ????????????
  const { user } = useAuth();

  // ????????????
  const { mutateAsync, isLoading: editingLoading } = useAuditPhotos();
  const handleAudit = () => {
    if (!user) {
      message.error("???????????????~");
      return;
    }
    const auditList = photos
      .map((photo, photoIdx) => ({
        id: photo.id,
        artistIds: selectArtistsIds[photoIdx],
      }))
      .filter((list) => list.artistIds.length > 0);

    if (auditList.length === 0) {
      message.warning("???????????????????????????");
      return;
    }

    mutateAsync(auditList);
  };
  // ????????????
  const handleAuditSingle = async ({
    id,
    artistIds,
  }: {
    id: number;
    artistIds: number[];
  }) => {
    if (artistIds.length === 0) {
      message.warning("???????????????????????????");
      return;
    }
    await mutateAsync([{ id, artistIds }]);

    const oldPhotos = [...photos];

    const idx = oldPhotos.findIndex((photo) => photo.id === id);

    idx && (oldPhotos[idx].isAudit = true);

    setPhotos(oldPhotos);
  };

  // ????????????
  const {
    handle: handlePhotosReMatch,
    isLoading: reMatchLoading,
    data: rematchResult,
  } = usePhotosGlobalReMatch();

  useEffect(() => {
    if (rematchResult?.msg) {
      message.success(String(rematchResult.msg));
    }
  }, [rematchResult]);

  // ????????????
  const {
    handle: handlePhotosGlobalAudit,
    isLoading: auditPhotosGlobalLoading,
    data: auditPhotosGlobalResult,
  } = useAuditPhotosGlobal();

  useEffect(() => {
    if (auditPhotosGlobalResult?.msg) {
      message.success(String(auditPhotosGlobalResult.msg));
    }
  }, [auditPhotosGlobalResult]);

  return (
    <>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <Space>
            <Button type={"primary"} onClick={handleAudit}>
              ????????????
            </Button>
            <Button
              type={"primary"}
              loading={auditPhotosGlobalLoading}
              onClick={() => handlePhotosGlobalAudit()}
            >
              ????????????????????????
            </Button>
            <Button
              type={"primary"}
              loading={reMatchLoading}
              onClick={() => handlePhotosReMatch()}
            >
              ??????????????????
            </Button>
          </Space>
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
              handleLoadMore={handleLoadMore}
              handleAuditSingle={handleAuditSingle}
            />
          )}
        </Col>
        <Col span={24}>
          <Button
            id={"Btn"}
            type="link"
            loading={gettingLoading}
            onClick={handleLoadMore}
            block
            icon={<ReloadOutlined />}
          >
            {gettingLoading ? "Loading" : "????????????????????????????????????"}
          </Button>
        </Col>
      </Row>
    </>
  );
};
