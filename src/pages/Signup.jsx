import { useState } from "react";
import { useUser } from "../lib/context/user";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const { signup } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword || !name) {
      alert("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    setLoading(true);
    try {
      await signup(email, password, name);
      alert("Account created! You are now logged in.");
      nav("/admin");
    } catch (e) {
      alert(e.message || "Error creating account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="login-form" onSubmit={(e) => { e.preventDefault(); handleSignup(); }}>
        <h2>Admin Signup</h2>
        <input 
          type="text"
          placeholder="Name" 
          value={name}
          onChange={e => setName(e.target.value)} 
          className="input-field"
        />
        <input 
          type="email"
          placeholder="Email" 
          value={email}
          onChange={e => setEmail(e.target.value)} 
          className="input-field"
        />
        <input 
          type="password"
          placeholder="Password" 
          value={password}
          onChange={e => setPassword(e.target.value)} 
          className="input-field"
        />
        <input 
          type="password"
          placeholder="Confirm Password" 
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)} 
          className="input-field"
          autoComplete="new-password"
        />
        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Creating Account...' : 'Signup'}
        </button>
        <p className="auth-link">Already have an account? <a href="/login">Login</a></p>
      </form>
    </div>
  );
}