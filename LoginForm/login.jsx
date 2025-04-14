import React, { useState } from 'react';
import './login.css';


const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic for form submission (authentication, etc.)
    alert('Login successful!');
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="formField">
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
          <i className="fas fa-user"></i>
        </div>

        <div className="formField">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <i className="fas fa-lock"></i>
        </div>

        <button type="submit">Login</button>
      </form>
      <div className="login-link">
        <p>Don't have an account? <a href="register">Sign Up</a></p>
      </div>
    </div>
  );
};

export default Login;
