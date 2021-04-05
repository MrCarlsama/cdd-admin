import styled from "@emotion/styled";
import { Button, Col, message, Row, Space } from "antd";
import { useEffect } from "react";
import { useDebounce } from "utils";
import { ArtistModal } from "./artistModal";
import { ArtistsList } from "./artistsList";
import { useArtists, useInitializeArtists } from "./model";
import { SearchPanel } from "./searchPanel";
import { useArtistModal, useArtistsSearchParams } from "./util";

export const ArtistsScreen = () => {
  const [param, setParam] = useArtistsSearchParams();
  const { data: artists, isLoading } = useArtists(useDebounce(param, 200));

  const { open } = useArtistModal();

  const {
    handle: handleInitArtists,
    isLoading: initLoading,
    data: initResultMsg,
  } = useInitializeArtists();

  useEffect(() => {
    if (initResultMsg?.msg) {
      message.success(String(initResultMsg.msg));
    }
  }, [initResultMsg]);

  return (
    <Container>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <SearchPanel param={param} setParam={setParam} />
        </Col>
        <Col span={24}>
          <Space>
            <Button type="primary" onClick={open}>
              新建声优
            </Button>
            <Button
              type="primary"
              loading={initLoading}
              onClick={() => handleInitArtists()}
            >
              自动生成
            </Button>
          </Space>
        </Col>
        <Col span={24}>
          <ArtistsList
            loading={isLoading}
            dataSource={artists || []}
            style={{ width: "100%" }}
            pagination={{ position: ["bottomRight"] }}
          />
        </Col>
      </Row>

      <ArtistModal />
    </Container>
  );
};

const Container = styled.div`
  height: 100%;
`;
