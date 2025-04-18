/* eslint-disable no-unused-vars */

import { useState } from 'react';
import API from '../api';

export default function Login() {
  const [form, setForm] = useState({
    identifier: '',
    password: ''
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', form);
      alert('Logged In!');
    } catch (err) {
      alert(err.response.data.message || 'Login failed');
    }
  };

  const handleGoogleLogin = () => {
    window.open('http://localhost:5000/api/auth/google', '_self');
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input name="identifier" placeholder="Username or Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>
      <hr />
      <button onClick={handleGoogleLogin}>Log in with Google</button>
    </div>
  );
}
