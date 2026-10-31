import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReadOutlined,
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
  message,
} from "antd";
import { useMemo, useState } from "react";
import "../management.css";

const storageKey = "teacherList";
const loadRows = () => {
  try {
    const rows = JSON.parse(localStorage.getItem(storageKey) || "[]");
    return Array.isArray(rows) ? rows : [];
  } catch {
    return [];
  }
};

export default function Teachers() {
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
        "Could not save this teacher. Please check browser storage.",
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
        "Teacher updated successfully",
      );
    else {
      const id = Math.max(0, ...rows.map((row) => Number(row.id) || 0)) + 1;
      commit([...rows, { ...values, id }], "Teacher added successfully");
    }
    closeModal();
  };
  const remove = (record) =>
    commit(
      rows.filter((row) => row.id !== record.id),
      "Teacher removed successfully",
    );
  const columns = [
    {
      title: "Teacher",
      dataIndex: "teacher-name",
      key: "teacher-name",
      render: (name, row) => (
        <div className="record-primary">
          <span className="record-avatar teacher-avatar">
            {(name || "T").slice(0, 1).toUpperCase()}
          </span>
          <span>
            <strong>{name}</strong>
            <small>Staff #{String(row.id).padStart(3, "0")}</small>
          </span>
        </div>
      ),
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      render: (value) => <span className="subject-pill">{value}</span>,
    },
    { title: "Email", dataIndex: "email", key: "email", responsive: ["sm"] },
    { title: "Phone", dataIndex: "phone", key: "phone", responsive: ["md"] },
    {
      title: "Qualification",
      dataIndex: "qualification",
      key: "qualification",
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
            aria-label={`Edit ${record["teacher-name"]}`}
            onClick={() => openEdit(record)}
          />
          <Popconfirm
            title="Remove this teacher?"
            description="This record will be removed from this browser."
            okText="Remove"
            cancelText="Cancel"
            onConfirm={() => remove(record)}
          >
            <Button
              className="table-action delete"
              type="text"
              icon={<DeleteOutlined />}
              aria-label={`Delete ${record["teacher-name"]}`}
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
          <span className="management-eyebrow">STAFF DIRECTORY</span>
          <h2>Teachers</h2>
          <p>Manage teacher profiles, subjects, and contact details.</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          Add teacher
        </Button>
      </div>
      <div className="management-summary">
        <div>
          <span className="summary-icon teachers">
            <ReadOutlined />
          </span>
          <span>
            <small>Total teachers</small>
            <strong>{rows.length}</strong>
          </span>
        </div>
        <span className="summary-caption">Across your directory</span>
      </div>
      <section className="management-table-card">
        <div className="table-card-heading">
          <div>
            <h3>All teachers</h3>
            <p>
              {filteredRows.length}{" "}
              {filteredRows.length === 1 ? "record" : "records"}
            </p>
          </div>
          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder="Search teachers..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search teachers"
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
                  search ? "No matching teachers" : "No teachers added yet"
                }
              />
            ),
          }}
          scroll={{ x: 600 }}
        />
      </section>
      <Modal
        title={editing ? "Edit teacher" : "Add a teacher"}
        open={modalOpen}
        onCancel={closeModal}
        footer={null}
        destroyOnHidden
      >
        <p className="modal-intro">
          Add a staff profile to your teacher directory.
        </p>
        <Form
          form={form}
          layout="vertical"
          onFinish={submit}
          requiredMark={false}
        >
          <Form.Item
            name="teacher-name"
            label="Full name"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Enter the teacher’s name",
              },
            ]}
          >
            <Input placeholder="e.g. Ayesha Khan" maxLength={70} />
          </Form.Item>
          <Form.Item
            name="subject"
            label="Subject"
            rules={[
              { required: true, whitespace: true, message: "Enter a subject" },
            ]}
          >
            <Input placeholder="e.g. Mathematics" maxLength={60} />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Enter an email address" },
              { type: "email", message: "Enter a valid email address" },
            ]}
          >
            <Input placeholder="name@school.edu" maxLength={100} />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone number"
            rules={[{ required: true, message: "Enter a phone number" }]}
          >
            <Input placeholder="e.g. 0300 1234567" maxLength={24} />
          </Form.Item>
          <Form.Item
            name="qualification"
            label="Qualification"
            rules={[{ required: true, message: "Select a qualification" }]}
          >
            <Select
              placeholder="Choose qualification"
              options={[
                "Matric",
                "Inter",
                "Bachelor",
                "Master",
                "M.Phil",
                "PhD",
              ].map((value) => ({ value, label: value }))}
            />
          </Form.Item>
          <div className="modal-actions">
            <Button onClick={closeModal}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {editing ? "Save changes" : "Add teacher"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
