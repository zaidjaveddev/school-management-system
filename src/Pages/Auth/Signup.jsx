import { LockOutlined, MailOutlined, SafetyCertificateOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { getAdminAccount, startAdminSession } from "../../utils/auth.js";
import "./auth.css";

export default function Signup() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = (values) => {
    const email = values.email.trim().toLowerCase();
    const existing = getAdminAccount();
    if (existing?.email?.toLowerCase() === email) {
      message.info("This account already exists. Sign in with your password.");
      navigate("/login", { replace: true, state: { email } });
      return;
    }

    const account = { name: values.name.trim(), email, password: values.password };
    try {
      localStorage.setItem("admin-account", JSON.stringify(account));
      startAdminSession(email);
      message.success("Account created. Welcome to Scholarly!");
      navigate("/dashboard", { replace: true });
    } catch {
      message.error("Could not save the account. Please check browser storage.");
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <Link to="/sign-up" className="auth-brand"><span className="brand-mark">S<span>+</span></span><span><strong>Scholarly</strong><small>ADMIN CONSOLE</small></span></Link>
        <div className="auth-visual-copy"><span className="auth-kicker">A BETTER WAY TO STAY ORGANIZED</span><h1>Build a calmer<br />school day.</h1><p>Create your admin workspace and keep the essentials for your school network close at hand.</p><div className="auth-visual-note"><SafetyCertificateOutlined /><span>Your workspace is ready when you are</span></div></div>
        <span className="auth-visual-footer">A SCHOOL MANAGEMENT WORKSPACE</span><span className="auth-orb auth-orb-one" /><span className="auth-orb auth-orb-two" />
      </section>
      <section className="auth-form-side"><div className="auth-form-wrap">
        <div className="auth-mobile-brand"><span className="brand-mark">S<span>+</span></span><strong>Scholarly</strong></div>
        <span className="auth-form-eyebrow">GET STARTED</span><h2>Create your account</h2><p className="auth-form-subtitle">Your account stays saved in this browser, even after you sign out.</p>
        <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false} className="auth-form">
          <Form.Item name="name" label="Full name" rules={[{ required: true, whitespace: true, message: "Enter your name" }]}><Input prefix={<UserOutlined />} placeholder="e.g. Ayesha Khan" autoComplete="name" size="large" maxLength={70} /></Form.Item>
          <Form.Item name="email" label="Email address" rules={[{ required: true, message: "Enter your email address" }, { type: "email", message: "Enter a valid email address" }]}><Input prefix={<MailOutlined />} placeholder="you@school.edu" autoComplete="email" size="large" maxLength={100} /></Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true, message: "Create a password" }, { min: 8, message: "Use at least 8 characters" }]}><Input.Password prefix={<LockOutlined />} placeholder="At least 8 characters" autoComplete="new-password" size="large" /></Form.Item>
          <Form.Item name="confirmPassword" label="Confirm password" dependencies={["password"]} rules={[{ required: true, message: "Confirm your password" }, ({ getFieldValue }) => ({ validator(_, value) { return !value || getFieldValue("password") === value ? Promise.resolve() : Promise.reject(new Error("Passwords do not match")); } })]}><Input.Password prefix={<LockOutlined />} placeholder="Enter password again" autoComplete="new-password" size="large" /></Form.Item>
          <Button className="auth-submit" type="primary" htmlType="submit" block size="large">Create account</Button>
        </Form>
        <div className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></div>
        <div className="auth-local-note"><LockOutlined /> Account saved in this browser; sign out only ends your session.</div>
      </div></section>
    </main>
  );
}
