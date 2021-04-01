import {
  Button,
  Dropdown,
  Menu,
  message,
  Modal,
  Table,
  TableProps,
} from "antd";
import { Artists } from "types/artists";
import { useDeleteArtists } from "./model";
import { useArtistModal, useArtistsQueryKey } from "./util";
import { CloseCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useAuth } from "context/authContext";

export const ArtistsList = ({ ...props }: TableProps<Artists>) => {
  return (
    <Table
      rowKey={"id"}
      pagination={false}
      columns={[
        { title: "名称", dataIndex: "name" },
        { title: "罗马音", dataIndex: "nameRoma" },
        {
          title: "创建时间",
          render(value, artist) {
            return (
              <span>
                {artist.createDate
                  ? dayjs(artist.createDate).format("YYYY-MM-DD HH:mm:ss")
                  : "无"}
              </span>
            );
          },
        },
        {
          title: "审核状态",
          render: (value, artist) => StatusIcon(artist.isAudit),
        },
        {
          title: "启禁用状态",
          render: (value, artist) => StatusIcon(artist.status),
        },
        {
          render(value, artist) {
            return <More artist={artist} />;
          },
        },
      ]}
      {...props}
    />
  );
};

// 状态icon
const StatusIcon = (status: boolean) => {
  return status ? (
    <CheckCircleOutlined style={{ color: "#73d13d" }} />
  ) : (
    <CloseCircleOutlined style={{ color: "#ff4d4f" }} />
  );
};

// 更多
const More = ({ artist }: { artist: Artists }) => {
  const { startEdit } = useArtistModal();
  const editArtist = (id: number) => startEdit(id);

  const { user } = useAuth();

  const { mutate: deleteProject } = useDeleteArtists(useArtistsQueryKey());

  const confirmDeleteArtist = (id: number) => {
    if (!user) {
      message.error("没有权限哟~");
      return;
    }
    Modal.confirm({
      title: "确定删除这个项目吗？",
      content: "点击确定删除",
      okText: "确定",
      cancelText: "取消",
      onOk() {
        deleteProject({ id });
      },
    });
  };

  const editArtistHandle = (id: number) => {
    if (!user) {
      message.error("没有权限哟~");
      return;
    }
    editArtist(id);
  };

  return (
    <Dropdown
      overlay={
        <Menu>
          <Menu.Item onClick={() => editArtistHandle(artist.id)} key={"edit"}>
            编辑
          </Menu.Item>
          <Menu.Item
            key={"delete"}
            onClick={() => confirmDeleteArtist(artist.id)}
          >
            删除
          </Menu.Item>
        </Menu>
      }
    >
      <Button type={"link"}>...</Button>
    </Dropdown>
  );
};
