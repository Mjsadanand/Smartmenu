/* eslint-disable no-unused-vars */

import { useState } from 'react';
import API from '../api.js';

export default function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return alert("Passwords don't match");
    try {
      const res = await API.post('/auth/register', form);
      alert('Registered Successfully!');
    } catch (err) {
      alert(err.response.data.message || 'Registration failed');
    }
  };

  const handleGoogleSignup = () => {
    window.open('http://localhost:5000/api/auth/google', '_self');
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <input name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} required />
        <button type="submit">Register</button>
      </form>
      <hr />
      <button onClick={handleGoogleSignup}>Sign up with Google</button>
    </div>
  );
}
