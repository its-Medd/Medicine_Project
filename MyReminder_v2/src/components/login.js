import React, { useState } from "react";
import { toast } from "react-toastify";
import SignInwithGoogle from "./signInWIthGoogle";
import SignInWithApple from "./signInWIthAppel";
import { loginUser } from "../services/api";
import './style.css';
import doctor from '../login.png';


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginUser({ email, password });
      window.location.href = "/home";
      toast.success("User logged in Successfully", {
        position: "top-center",
      });
    } catch (error) {
      toast.error(error.message, {
        position: "bottom-center",
      });
    }
  };

  return (
    // <form onSubmit={handleSubmit}>
    //   <h3>Login</h3>

    //   <div className="mb-3">
    //     <label>Email address</label>
    //     <input
    //       type="email"
    //       className="form-control"
    //       placeholder="Enter email"
    //       value={email}
    //       onChange={(e) => setEmail(e.target.value)}
    //     />
    //   </div>

    //   <div className="mb-3">
    //     <label>Password</label>
    //     <input
    //       type="password"
    //       className="form-control"
    //       placeholder="Enter password"
    //       value={password}
    //       onChange={(e) => setPassword(e.target.value)}
    //     />
    //   </div>

    //   <div className="d-grid">
    //     <button type="submit" className="btn btn-primary">
    //       Submit
    //     </button>
    //   </div>
    //   <p className="forgot-password text-right">
    //     New user <a href="/register">Register Here</a>
    //   </p>
    //   <SignInwithGoogle/>
    // </form>

    <div className="auth-wrapper">
    
  <form onSubmit={handleSubmit}>
    {/* Header Illustration */}
    <div className="header-illustration">
      <img 
        src={doctor} 
        alt="Doctor Illustration" 
      />
    </div> 
    <h3 style={{color:"black", padding:"10px"}}>Welcome To My Reminder</h3>


    {/* Tab Buttons */}
    <div className="auth-tabs">
      <button type="button" className="auth-tab active">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        Login
      </button>
      <button 
        type="button" 
        className="auth-tab"
        onClick={() => window.location.href = "/register"}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <line x1="19" y1="8" x2="19" y2="14"/>
          <line x1="22" y1="11" x2="16" y2="11"/>
        </svg>
        Sign up
      </button>
    </div>

    {/* Email Input */}
    <div className="mb-3">
      <label>Email:</label>
      <input
        type="email"
        className="form-control"
        placeholder="Enter your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
    </div>

    {/* Password Input */}
    <div className="mb-3">
      <label>Password:</label>
      <input
        type="password"
        className="form-control"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
    </div>

    {/* Forgot Password Link */}
    <p className="forgot-password text-right">
      <a href="/forgot-password">Forget password?</a>
    </p>

    {/* Login Button */}
    <div className="d-grid">
      <button type="submit" className="btn btn-primary">
        Login
      </button>
    </div>

    {/* OR Divider */}
    <div className="or-divider">OR</div>

    {/* Google Login Button */}
    <SignInwithGoogle />

    <SignInWithApple />

    {/* Sign Up Link */}
    <p className="signup-text">
      Don't yet an account? <a href="/register">Sign up</a>
    </p>
  </form>

</div>
  );
}

export default Login;
