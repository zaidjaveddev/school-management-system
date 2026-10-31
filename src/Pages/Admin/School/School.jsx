import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import {
  Button,
  Empty,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  message,
} from "antd";
import { useMemo, useState } from "react";
import "../management.css";

const storageKey = "schoolList";
const loadRows = () => {
  try {
    const rows = JSON.parse(localStorage.getItem(storageKey) || "[]");
    return Array.isArray(rows) ? rows : [];
  } catch {
    return [];
  }
};

export default function Schools() {
  const [rows, setRows] = useState(loadRows);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const filteredRows = useMemo(
    () =>
      rows.filter((row) =>
        Object.values(row).some((value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(search.toLowerCase()),
        ),
      ),
    [rows, search],
  );

  const commit = (nextRows, success) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(nextRows));
      setRows(nextRows);
      message.success(success);
    } catch {
      message.error(
        "Could not save this school. Please check browser storage.",
      );
    }
  };
  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };
  const openEdit = (record) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    form.resetFields();
  };
  const submit = (values) => {
    if (editing)
      commit(
        rows.map((row) =>
          row.id === editing.id ? { ...row, ...values } : row,
        ),
        "School updated successfully",
      );
    else {
      const id = Math.max(0, ...rows.map((row) => Number(row.id) || 0)) + 1;
      commit([...rows, { ...values, id }], "School added successfully");
    }
    closeModal();
  };
  const remove = (record) =>
    commit(
      rows.filter((row) => row.id !== record.id),
      "School removed successfully",
    );
  const columns = [
    {
      title: "School",
      dataIndex: "school-name",
      key: "school-name",
      render: (name, row) => (
        <div className="record-primary">
          <span className="record-avatar school-avatar">
            <ShopOutlined />
          </span>
          <span>
            <strong>{name}</strong>
            <small>School #{String(row.id).padStart(3, "0")}</small>
          </span>
        </div>
      ),
    },
    {
      title: "Principal",
      dataIndex: "principal",
      key: "principal",
      responsive: ["sm"],
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <Tag
          className="record-tag"
          color={
            type === "Private"
              ? "purple"
              : type === "Government"
                ? "blue"
                : type === "Madrassa"
                  ? "gold"
                  : "cyan"
          }
        >
          {type}
        </Tag>
      ),
    },
    { title: "Phone", dataIndex: "phone", key: "phone", responsive: ["md"] },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      ellipsis: true,
      responsive: ["lg"],
    },
    {
      title: "Actions",
      key: "actions",
      align: "right",
      render: (_, record) => (
        <Space size={4}>
          <Button
            className="table-action edit"
            type="text"
            icon={<EditOutlined />}
            aria-label={`Edit ${record["school-name"]}`}
            onClick={() => openEdit(record)}
          />
          <Popconfirm
            title="Remove this school?"
            description="This record will be removed from this browser."
            okText="Remove"
            cancelText="Cancel"
            onConfirm={() => remove(record)}
          >
            <Button
              className="table-action delete"
              type="text"
              icon={<DeleteOutlined />}
              aria-label={`Delete ${record["school-name"]}`}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="management-page">
      <div className="management-heading">
        <div>
          <span className="management-eyebrow">INSTITUTION DIRECTORY</span>
          <h2>Schools</h2>
          <p>Keep your school network organized and up to date.</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          Add school
        </Button>
      </div>
      <div className="management-summary">
        <div>
          <span className="summary-icon schools">
            <ShopOutlined />
          </span>
          <span>
            <small>Total institutions</small>
            <strong>{rows.length}</strong>
          </span>
        </div>
        <span className="summary-caption">Stored in this browser</span>
      </div>
      <section className="management-table-card">
        <div className="table-card-heading">
          <div>
            <h3>All schools</h3>
            <p>
              {filteredRows.length}{" "}
              {filteredRows.length === 1 ? "record" : "records"}
            </p>
          </div>
          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder="Search schools..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search schools"
          />
        </div>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredRows}
          pagination={{
            pageSize: 8,
            showSizeChanger: false,
            showTotal: (total, range) => `${range[0]}–${range[1]} of ${total}`,
          }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  search ? "No matching schools" : "No schools added yet"
                }
              />
            ),
          }}
          scroll={{ x: 600 }}
        />
      </section>
      <Modal
        title={editing ? "Edit school" : "Add a school"}
        open={modalOpen}
        onCancel={closeModal}
        footer={null}
        destroyOnHidden
      >
        <p className="modal-intro">
          Add institution details to your school directory.
        </p>
        <Form
          form={form}
          layout="vertical"
          onFinish={submit}
          requiredMark={false}
        >
          <Form.Item
            name="school-name"
            label="School name"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Enter the school name",
              },
            ]}
          >
            <Input placeholder="e.g. City Public School" maxLength={80} />
          </Form.Item>
          <Form.Item
            name="principal"
            label="Principal"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Enter the principal’s name",
              },
            ]}
          >
            <Input placeholder="Full name" maxLength={70} />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone number"
            rules={[{ required: true, message: "Enter a phone number" }]}
          >
            <Input placeholder="e.g. 0300 1234567" maxLength={24} />
          </Form.Item>
          <Form.Item
            name="type"
            label="School type"
            rules={[{ required: true, message: "Select a school type" }]}
          >
            <Select
              placeholder="Choose type"
              options={[
                "Government",
                "Private",
                "Semi-Government",
                "Madrassa",
              ].map((value) => ({ value, label: value }))}
            />
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Enter the school address",
              },
            ]}
          >
            <Input.TextArea
              placeholder="Street, area, city"
              rows={3}
              maxLength={180}
            />
          </Form.Item>
          <div className="modal-actions">
            <Button onClick={closeModal}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {editing ? "Save changes" : "Add school"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
