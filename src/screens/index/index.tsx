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
import { useEffect, useState } from "react";
import { useLoginModal } from "./util";
import { LoginModal } from "./login";
import { useAuth } from "context/authContext";
import { ComparisonScreen } from "screens/comparison";

const useRouteType = () => {
  const units = useLocation().pathname.split("/");
  return units[units.length - 1];
};

const Sider = ({ ...props }) => {
  const routeType = useRouteType();

  const { open } = useLoginModal();

  const { user } = useAuth();

  return (
    <Layout.Sider
      breakpoint="lg"
      collapsedWidth="0"
      style={{
        height: "100vh",
        position: "fixed",
        left: 0,
        zIndex: 2,
      }}
      onBreakpoint={(broken) => props.setSiderBroken(broken)}
    >
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
        <Menu.Item key="comparison" icon={<UsergroupAddOutlined />}>
          <Link to={"artists/comparison"}>对照表</Link>
        </Menu.Item>
      </Menu>
    </Layout.Sider>
  );
};

const Container = ({ ...props }) => {
  return (
    <Layout.Content
      style={{
        margin: props.siderBroken ? "24px 24px 0 24px" : "24px 24px 0 224px",
        display: "flex",
        overflow: "hidden",
      }}
    >
      <div style={{ padding: 24, backgroundColor: "white", flex: 1 }}>
        <Routes>
          <Route path={"/artists"} element={<ArtistsScreen />}></Route>
          <Route path={"/photos"} element={<PhotosScreen />}></Route>
          <Route
            path={"/photos/audit"}
            element={<WaitAuditPhotosScreen />}
          ></Route>
          <Route
            path={"/artists/comparison"}
            element={<ComparisonScreen />}
          ></Route>
          <Navigate to={window.location.pathname + "/photos"} />
        </Routes>
      </div>
    </Layout.Content>
  );
};

const Footer = () => {
  return (
    <Layout.Footer style={{ textAlign: "center" }}>
      阿卡家的DD图床
      <Button type={"link"} href="http://www.beian.miit.gov.cn/">
        粤ICP备2021046228号
      </Button>
      ©2021 Created by Carl
    </Layout.Footer>
  );
};

const Main = ({ ...props }) => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Container {...props} />
      <Footer />
    </Layout>
  );
};

export const IndexScreen = () => {
  const [siderBroken, setSiderBroken] = useState(false);

  return (
    <Layout>
      <Router>
        <Sider setSiderBroken={setSiderBroken} />
        <Main siderBroken={siderBroken} />
      </Router>
      <BackTop />
    </Layout>
  );
};
