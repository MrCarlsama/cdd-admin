import { BackTop, Button, Layout, Menu } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  HeartOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { Navigate, Route, Routes, useLocation } from "react-router";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { ArtistsScreen } from "screens/artists";
import { PhotosScreen } from "screens/photos";
import { WaitAuditPhotosScreen } from "screens/photos/waitAuditPhotos";
import { useEffect } from "react";
import { useLoginModal } from "./util";
import { LoginModal } from "./login";
import { useAuth } from "context/authContext";

const useRouteType = () => {
  const units = useLocation().pathname.split("/");
  return units[units.length - 1];
};

const Sider = () => {
  const routeType = useRouteType();

  const { open } = useLoginModal();

  const { user } = useAuth();

  return (
    <Layout.Sider breakpoint="lg" collapsedWidth="0">
      <div style={{ padding: "24px" }}>
        <Button
          style={{ color: "rgb(0, 170, 166)" }}
          type={"link"}
          size={"large"}
          onClick={open}
          icon={<UserOutlined />}
        >
          {user ? user.username : "？"}
        </Button>
      </div>

      <LoginModal />

      <Menu theme="dark" mode="inline" selectedKeys={[routeType]}>
        <Menu.Item key="photos" icon={<HeartOutlined />}>
          <Link to={"photos"}>DD区</Link>
        </Menu.Item>
        <Menu.Item key="artists" icon={<TeamOutlined />}>
          <Link to={"artists"}>声优</Link>
        </Menu.Item>
        <Menu.Item key="audit" icon={<UsergroupAddOutlined />}>
          <Link to={"photos/audit"}>审核区</Link>
        </Menu.Item>
      </Menu>
    </Layout.Sider>
  );
};

const Container = () => {
  return (
    <Layout.Content style={{ margin: "24px 24px 0", display: "flex" }}>
      <div style={{ padding: 24, backgroundColor: "white", flex: 1 }}>
        <Routes>
          <Route path={"/artists"} element={<ArtistsScreen />}></Route>
          <Route path={"/photos"} element={<PhotosScreen />}></Route>
          <Route
            path={"/photos/audit"}
            element={<WaitAuditPhotosScreen />}
          ></Route>
          <Navigate to={window.location.pathname + "/photos"} />

          <BackTop />
        </Routes>
      </div>
    </Layout.Content>
  );
};

const Footer = () => {
  return (
    <Layout.Footer style={{ textAlign: "center" }}>
      声优DD区 ©2021 Created by Carl
    </Layout.Footer>
  );
};

const Main = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Container />
      <Footer />
    </Layout>
  );
};

export const IndexScreen = () => {
  useEffect(() => {
    document.title = "人之初 性本D 誰でも大好き";
  }, []);

  return (
    <Layout>
      <Router>
        <Sider />
        <Main />
      </Router>
    </Layout>
  );
};
