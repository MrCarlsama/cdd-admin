import { Layout, Menu } from "antd";
import { UserOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { Navigate, Route, Routes } from "react-router";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { ArtistsScreen } from "screens/artists";
import { PhotosScreen } from "screens/photos";
import { WaitAuditPhotosScreen } from "screens/photos/waitAuditPhotos";

const Sider = () => {
  return (
    <Layout.Sider collapsedWidth="0">
      <div className="logo" />
      <Menu theme="dark" mode="inline">
        <Menu.Item key="1" icon={<UserOutlined />}>
          <Link to={"artists"}>声优</Link>
        </Menu.Item>
        <Menu.SubMenu key="2" title={"图床"} icon={<VideoCameraOutlined />}>
          <Menu.Item key="2-1">
            <Link to={"photos"}>DD区</Link>
          </Menu.Item>
          <Menu.Item key="2-2">
            <Link to={"photos/audit"}>审核区</Link>
          </Menu.Item>
        </Menu.SubMenu>
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
          <Navigate to={window.location.pathname + "/artists"} />
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
  return (
    <Layout>
      <Router>
        <Sider />
        <Main />
      </Router>
    </Layout>
  );
};
