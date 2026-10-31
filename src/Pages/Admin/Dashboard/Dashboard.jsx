import {
  ArrowRightOutlined,
  CarOutlined,
  PlusOutlined,
  ReadOutlined,
  ShopOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Button, Progress, Tag } from "antd";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";

const readList = (key) => {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};

export default function Dashboard() {
  const navigate = useNavigate();
  const schools = readList("schoolList");
  const teachers = readList("teacherList");
  const drivers = readList("driverList");
  const activeDrivers = drivers.filter(
    (driver) => driver.status === "Active",
  ).length;
  const stats = [
    {
      title: "Total schools",
      value: schools.length,
      icon: <ShopOutlined />,
      tone: "violet",
      note: "Registered institutions",
    },
    {
      title: "Teachers",
      value: teachers.length,
      icon: <ReadOutlined />,
      tone: "blue",
      note: "In your directory",
    },
    {
      title: "Drivers",
      value: drivers.length,
      icon: <CarOutlined />,
      tone: "orange",
      note: "Transport team",
    },
    {
      title: "Active drivers",
      value: activeDrivers,
      icon: <TeamOutlined />,
      tone: "green",
      note: drivers.length
        ? `${Math.round((activeDrivers / drivers.length) * 100)}% of all drivers`
        : "No drivers added yet",
    },
  ];
  const schoolTypes = [
    ["Government", "#5b54df"],
    ["Private", "#13a8a0"],
    ["Semi-Government", "#f4a340"],
    ["Madrassa", "#df6a91"],
  ].map(([name, color]) => ({
    name,
    color,
    count: schools.filter((school) => school.type === name).length,
  }));
  const driverStatuses = ["Active", "Inactive", "On Leave", "Suspended"].map(
    (status) => ({
      status,
      count: drivers.filter((driver) => driver.status === status).length,
    }),
  );
  const recentTeachers = [...teachers].slice(-5).reverse();
  const today = new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <div className="overview-page">
      <div className="overview-welcome">
        <div>
          <span className="overview-date">{today}</span>
          <h2>Your school network at a glance</h2>
          <p>
            Track your institutions, teaching staff, and transport team from one
            place.
          </p>
        </div>
        <div className="overview-quick-actions">
          <Button
            icon={<PlusOutlined />}
            onClick={() => navigate("/schools")}
            className="quick-action-secondary"
          >
            Add school
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/teachers")}
            className="quick-action-primary"
          >
            Add teacher
          </Button>
        </div>
      </div>

      <section
        className="overview-stats"
        aria-label="School network statistics"
      >
        {stats.map((stat) => (
          <article className="overview-stat" key={stat.title}>
            <div className={`stat-icon ${stat.tone}`}>{stat.icon}</div>
            <div className="stat-copy">
              <span>{stat.title}</span>
              <strong>{stat.value.toLocaleString()}</strong>
              <small>{stat.note}</small>
            </div>
            <span className={`stat-accent ${stat.tone}`} />
          </article>
        ))}
      </section>

      <div className="overview-panels">
        <section className="overview-panel school-breakdown">
          <div className="panel-heading">
            <div>
              <h3>Schools by type</h3>
              <p>Distribution across registered institutions</p>
            </div>
            <Link to="/schools">
              View schools <ArrowRightOutlined />
            </Link>
          </div>
          <div className="school-total">
            <strong>{schools.length}</strong>
            <span>total schools</span>
          </div>
          <div className="school-bars">
            {schoolTypes.map((item) => (
              <div className="school-bar-row" key={item.name}>
                <div className="school-bar-label">
                  <span>
                    <i style={{ background: item.color }} />
                    {item.name}
                  </span>
                  <strong>{item.count}</strong>
                </div>
                <Progress
                  percent={
                    schools.length
                      ? Math.round((item.count / schools.length) * 100)
                      : 0
                  }
                  showInfo={false}
                  strokeColor={item.color}
                  trailColor="#f0f2f7"
                  size="small"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="overview-panel driver-overview">
          <div className="panel-heading">
            <div>
              <h3>Driver status</h3>
              <p>Current transport team overview</p>
            </div>
            <Link to="/drivers">
              Manage <ArrowRightOutlined />
            </Link>
          </div>
          <div className="driver-total">
            <div className="driver-total-icon">
              <CarOutlined />
            </div>
            <div>
              <strong>{drivers.length}</strong>
              <span>Total drivers</span>
            </div>
          </div>
          <div className="driver-status-list">
            {driverStatuses.map(({ status, count }) => (
              <div className="driver-status-row" key={status}>
                <span>
                  <i
                    className={`status-dot ${status.toLowerCase().replaceAll(" ", "-")}`}
                  />
                  {status}
                </span>
                <Tag bordered={false}>{count}</Tag>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="overview-panel recent-panel">
        <div className="panel-heading">
          <div>
            <h3>Recently added teachers</h3>
            <p>Your latest staff directory entries</p>
          </div>
          <Link to="/teachers">
            View all teachers <ArrowRightOutlined />
          </Link>
        </div>
        {recentTeachers.length === 0 ? (
          <div className="overview-empty">
            <span className="empty-icon">
              <ReadOutlined />
            </span>
            <strong>No teachers yet</strong>
            <p>Add teachers to see your latest directory updates here.</p>
            <Button type="link" onClick={() => navigate("/teachers")}>
              Go to teachers <ArrowRightOutlined />
            </Button>
          </div>
        ) : (
          <div className="recent-table-wrap">
            <table className="recent-table">
              <thead>
                <tr>
                  <th>Teacher</th>
                  <th>Subject</th>
                  <th>Email</th>
                  <th>Phone</th>
                </tr>
              </thead>
              <tbody>
                {recentTeachers.map((teacher, index) => (
                  <tr key={teacher.id ?? `${teacher.email}-${index}`}>
                    <td>
                      <span className="teacher-initials">
                        {(teacher["teacher-name"] || "T")
                          .slice(0, 1)
                          .toUpperCase()}
                      </span>
                      <strong>
                        {teacher["teacher-name"] || "Unnamed teacher"}
                      </strong>
                    </td>
                    <td>{teacher.subject || "—"}</td>
                    <td>{teacher.email || "—"}</td>
                    <td>{teacher.phone || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
