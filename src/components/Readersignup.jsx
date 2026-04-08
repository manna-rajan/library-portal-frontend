import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";

const Readersignup = () => {
  const VALIDATION_RULES = {
    name: {
      pattern: /^[a-zA-Z0-9\s]+$/,
      message: "Only letters, numbers, and spaces are allowed."
    },
    email: {
      pattern: /^[a-zA-Z0-9._+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/,
      message: "Please enter a valid email format (e.g., user@example.co)."
    },
    password: {
      pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{8,}$/,
      message: "Password must be at least 8 characters long and include a letter, a number, and a special character."
    },
    phone: {
      pattern: /^(\+91-)?(0)?\s?[6-9][0-9]{9}$/,
      message: "Please enter a valid 10-digit Indian phone number. Optional +91- prefix is allowed."
    }
  };

  const navigate = useNavigate();
  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
    phone: ""
  });
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
      } else if (!VALIDATION_RULES[field].pattern.test(input[field])) {
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
      name: input.name.trim(),
      email: input.email.trim(),
      phone: input.phone.trim()
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/reader-signup`, trimmedInput);
      if (response.data.status === "success") {
        alert("Signed up successfully! Please sign in.");
        navigate("/reader/signin");
      } else {
        alert(response.data.message || "Sign up failed for an unknown reason.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert(err.response?.data?.message || "An error occurred during sign-up.");
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-12 col-md-6">
          <div className="card bg-secondary-subtle text-danger-emphasis">
            <form className="card-body d-flex flex-column gap-3" onSubmit={handleSubmit} noValidate>
              <h5 className="card-title">Reader Sign Up</h5>
              <div>
                <label htmlFor="nameInput" className="form-label">Name</label>
                <input type="text" className={`form-control ${errors.name ? 'is-invalid' : ''}`} id="nameInput" name='name' value={input.name} onChange={handleChange} required placeholder='e.g. John Doe 2' />
                {errors.name && <div className="invalid-feedback d-block">{errors.name}</div>}
              </div>
              <div>
                <label htmlFor="emailInput" className="form-label">Email address</label>
                <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} id="emailInput" name='email' value={input.email} onChange={handleChange} required placeholder='e.g. john.doe@example.com' />
                {errors.email && <div className="invalid-feedback d-block">{errors.email}</div>}
              </div>
              <div>
                <label htmlFor="passwordInput" className="form-label">Password</label>
                <input type="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`} id="passwordInput" name='password' value={input.password} onChange={handleChange} required placeholder='Min 8 chars, with letters, numbers & symbols' />
                {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
              </div>
              <div>
                <label htmlFor="phoneInput" className="form-label">Phone</label>
                <input type="tel" className={`form-control ${errors.phone ? 'is-invalid' : ''}`} id="phoneInput" required placeholder="e.g. 9876543210 or +91-9876543210" name="phone" value={input.phone} onChange={handleChange} />
                {errors.phone && <div className="invalid-feedback d-block">{errors.phone}</div>}
              </div>
              <button type="submit" className="btn btn-primary">Sign Up</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Readersignup