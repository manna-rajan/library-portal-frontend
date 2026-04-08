import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";


const Adminsignin = () => {
  const navigate = useNavigate();
  const VALIDATION_RULES = {
    email: {
      pattern: /^[a-zA-Z0-9._+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/,
      message: "Please enter a valid email format (e.g., user@example.com)."
    },
    password: {
      pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{8,}$/,
      message: "Password must be at least 8 characters long and include a letter, a number, and a special character."
    }
  };
  const [input, setInput] = useState(
    {
      email: "",
      password: ""
    }
  );
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput({
      ...input,
      [name]: value
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validate = () => {
    const newErrors = {};
    for (const field in VALIDATION_RULES) {
      if (!input[field]) {
        newErrors[field] = "This field is required.";
      } else if (VALIDATION_RULES[field].pattern && !VALIDATION_RULES[field].pattern.test(input[field])) {
        newErrors[field] = VALIDATION_RULES[field].message;
      }
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setErrors({});

    const trimmedInput = {
      ...input,
      email: input.email.trim(),
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/admin-signin`, trimmedInput);
      if (response.data.status === "success") {
        sessionStorage.setItem("adminid", response.data.adminId);
        sessionStorage.setItem("adminname", response.data.name);
        navigate("/admin/borrows");
      } else {
        alert(response.data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Signin error:", err);
      alert(err.response?.data?.message || "An error occurred during sign-in.");
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-12 col-md-6">
          <div className="card bg-secondary-subtle text-danger-emphasis">
            <form className="card-body d-flex flex-column gap-3" onSubmit={handleSubmit} noValidate>
              <h5 className="card-title">Admin Sign In</h5>
              <div>
                <label htmlFor="emailInput" className="form-label">Email address</label>
                <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} id="emailInput" name='email' value={input.email} onChange={handleChange} required placeholder="e.g., user@example.com" />
                {errors.email && <div className="invalid-feedback d-block">{errors.email}</div>}
              </div>
              <div>
                <label htmlFor="passwordInput" className="form-label">Password</label>
                <input type="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`} id="passwordInput" name="password" value={input.password} onChange={handleChange} required placeholder="Min 8 chars, with letter, number & symbol" />
                {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
              </div>
              <button type="submit" className="btn btn-primary w-100">Sign In</button>
              <div className="mb-3">
                <Link to="/admin/signup" className="btn btn-outline-primary w-100">Sign Up as Admin</Link>
              </div>
              <div className="mb-3">
                <Link to="/reader/signin" className="btn btn-outline-primary w-100">Reader Sign In</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

  )
}


export default Adminsignin