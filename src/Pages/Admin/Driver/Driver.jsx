import {
  CarOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
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

const storageKey = "driverList";
const loadRows = () => {
  try {
    const rows = JSON.parse(localStorage.getItem(storageKey) || "[]");
    return Array.isArray(rows) ? rows : [];
  } catch {
    return [];
  }
};
const statusColor = {
  Active: "green",
  Inactive: "default",
  "On Leave": "orange",
  Suspended: "red",
};

export default function Drivers() {
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
  const activeCount = rows.filter((row) => row.status === "Active").length;
  const commit = (nextRows, success) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(nextRows));
      setRows(nextRows);
      message.success(success);
    } catch {
      message.error(
        "Could not save this driver. Please check browser storage.",
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
        "Driver updated successfully",
      );
    else {
      const id = Math.max(0, ...rows.map((row) => Number(row.id) || 0)) + 1;
      commit([...rows, { ...values, id }], "Driver added successfully");
    }
    closeModal();
  };
  const remove = (record) =>
    commit(
      rows.filter((row) => row.id !== record.id),
      "Driver removed successfully",
    );
  const columns = [
    {
      title: "Driver",
      dataIndex: "driver-name",
      key: "driver-name",
      render: (name, row) => (
        <div className="record-primary">
          <span className="record-avatar driver-avatar">
            <CarOutlined />
          </span>
          <span>
            <strong>{name}</strong>
            <small>Driver #{String(row.id).padStart(3, "0")}</small>
          </span>
        </div>
      ),
    },
    {
      title: "License number",
      dataIndex: "license-no",
      key: "license-no",
      responsive: ["sm"],
    },
    { title: "Phone", dataIndex: "phone", key: "phone", responsive: ["md"] },
    { title: "Vehicle", dataIndex: "vehicle-no", key: "vehicle-no" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag className="record-tag" color={statusColor[status] || "default"}>
          {status || "Unassigned"}
        </Tag>
      ),
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
            aria-label={`Edit ${record["driver-name"]}`}
            onClick={() => openEdit(record)}
          />
          <Popconfirm
            title="Remove this driver?"
            description="This record will be removed from this browser."
            okText="Remove"
            cancelText="Cancel"
            onConfirm={() => remove(record)}
          >
            <Button
              className="table-action delete"
              type="text"
              icon={<DeleteOutlined />}
              aria-label={`Delete ${record["driver-name"]}`}
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
          <span className="management-eyebrow">TRANSPORT DIRECTORY</span>
          <h2>Drivers</h2>
          <p>Manage driver contacts, vehicle assignments, and availability.</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          Add driver
        </Button>
      </div>
      <div className="management-summary">
        <div>
          <span className="summary-icon drivers">
            <CarOutlined />
          </span>
          <span>
            <small>Total drivers</small>
            <strong>{rows.length}</strong>
          </span>
        </div>
        <span className="summary-caption">
          <i className="driver-summary-dot" />
          {activeCount} active
        </span>
      </div>
      <section className="management-table-card">
        <div className="table-card-heading">
          <div>
            <h3>All drivers</h3>
            <p>
              {filteredRows.length}{" "}
              {filteredRows.length === 1 ? "record" : "records"}
            </p>
          </div>
          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder="Search drivers..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search drivers"
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
                  search ? "No matching drivers" : "No drivers added yet"
                }
              />
            ),
          }}
          scroll={{ x: 600 }}
        />
      </section>
      <Modal
        title={editing ? "Edit driver" : "Add a driver"}
        open={modalOpen}
        onCancel={closeModal}
        footer={null}
        destroyOnHidden
      >
        <p className="modal-intro">
          Add driver and vehicle details to your transport directory.
        </p>
        <Form
          form={form}
          layout="vertical"
          onFinish={submit}
          requiredMark={false}
        >
          <Form.Item
            name="driver-name"
            label="Full name"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Enter the driver’s name",
              },
            ]}
          >
            <Input placeholder="e.g. Muhammad Usman" maxLength={70} />
          </Form.Item>
          <Form.Item
            name="license-no"
            label="License number"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Enter the license number",
              },
            ]}
          >
            <Input placeholder="e.g. LHR-2024-12345" maxLength={40} />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone number"
            rules={[{ required: true, message: "Enter a phone number" }]}
          >
            <Input placeholder="e.g. 0300 1234567" maxLength={24} />
          </Form.Item>
          <Form.Item
            name="vehicle-no"
            label="Vehicle number"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Enter the vehicle number",
              },
            ]}
          >
            <Input placeholder="e.g. LHR-123-ABC" maxLength={30} />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Select a driver status" }]}
          >
            <Select
              placeholder="Choose status"
              options={["Active", "Inactive", "On Leave", "Suspended"].map(
                (value) => ({ value, label: value }),
              )}
            />
          </Form.Item>
          <div className="modal-actions">
            <Button onClick={closeModal}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {editing ? "Save changes" : "Add driver"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
