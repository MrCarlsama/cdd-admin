import styled from "@emotion/styled";
import { Button, Col, Row } from "antd";
import { useDebounce } from "utils";
import { ArtistModal } from "./artistModal";
import { ArtistsList } from "./artistsList";
import { useArtists } from "./model";
import { SearchPanel } from "./searchPanel";
import { useArtistModal, useArtistsSearchParams } from "./util";

export const ArtistsScreen = () => {
  const [param, setParam] = useArtistsSearchParams();
  const { data: artists, isLoading } = useArtists(useDebounce(param, 200));

  const { open } = useArtistModal();

  return (
    <Container>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <SearchPanel param={param} setParam={setParam} />
        </Col>
        <Col span={24}>
          <Button type="primary" onClick={open}>
            新建声优
          </Button>
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
