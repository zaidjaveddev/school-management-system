import { LockOutlined, MailOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAdminAccount, startAdminSession } from "../../utils/auth.js";
import "./auth.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const suggestedEmail = location.state?.email || "";

  const onFinish = (values) => {
    const account = getAdminAccount();
    const email = values.email.trim().toLowerCase();
    if (!account) {
      message.info("No saved account found. Create your admin account first.");
      navigate("/sign-up", { replace: true });
      return;
    }
    if (account.email.toLowerCase() === email && account.password === values.password) {
      startAdminSession(account.email);
      message.success("Welcome back!");
      navigate("/dashboard", { replace: true });
    } else {
      message.error("The email or password you entered is incorrect.");
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <Link to="/login" className="auth-brand"><span className="brand-mark">S<span>+</span></span><span><strong>Scholarly</strong><small>ADMIN CONSOLE</small></span></Link>
        <div className="auth-visual-copy"><span className="auth-kicker">SCHOOL MANAGEMENT, SIMPLIFIED</span><h1>Every school.<br />One clear view.</h1><p>Bring your school network, teachers, and transport team together in a workspace designed to keep you moving.</p><div className="auth-visual-note"><SafetyCertificateOutlined /><span>One organized place for your school operations</span></div></div>
        <span className="auth-visual-footer">A SCHOOL MANAGEMENT WORKSPACE</span><span className="auth-orb auth-orb-one" /><span className="auth-orb auth-orb-two" />
      </section>
      <section className="auth-form-side"><div className="auth-form-wrap">
        <div className="auth-mobile-brand"><span className="brand-mark">S<span>+</span></span><strong>Scholarly</strong></div>
        <span className="auth-form-eyebrow">ADMINISTRATOR ACCESS</span><h2>Welcome back</h2><p className="auth-form-subtitle">Sign in with the account you created earlier.</p>
        <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false} className="auth-form" initialValues={{ email: suggestedEmail }}>
          <Form.Item name="email" label="Email address" rules={[{ required: true, message: "Enter your email address" }, { type: "email", message: "Enter a valid email address" }]}><Input prefix={<MailOutlined />} placeholder="you@school.edu" autoComplete="email" size="large" /></Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true, message: "Enter your password" }]}><Input.Password prefix={<LockOutlined />} placeholder="Enter your password" autoComplete="current-password" size="large" /></Form.Item>
          <Button className="auth-submit" type="primary" htmlType="submit" block size="large">Sign in</Button>
        </Form>
        <div className="auth-switch">New to Scholarly? <Link to="/sign-up">Create an admin account</Link></div>
        <div className="auth-local-note"><LockOutlined /> Your account remains saved when you sign out.</div>
      </div></section>
    </main>
  );
}
