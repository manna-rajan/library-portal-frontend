import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Nav from './Nav';
const AddBook = () => {

    const VALIDATION_RULES = {
        title: {
            pattern: /^[a-zA-Z0-9\s"':.,!&?-]+$/,
            message: "Title can only contain letters, numbers, spaces, and basic punctuation (\"-':.,!&?)."
        },
        author: {
            pattern: /^[a-zA-Z\s.'-]+$/,
            message: "Author can only contain letters, spaces, periods, apostrophes, and hyphens."
        },
        quantity: {
            pattern: /^[1-9][0-9]*$/,
            message: "Please provide a quantity of at least 1."
        },
        description: {
            pattern: /^\S+(\s+\S+){4,}.*$/,
            message: "Please enter a description with at least 5 words."
        },
        genre: {
            pattern: /^[a-zA-Z\s,-/]+$/,
            message: "Genre can only contain letters, spaces, commas, hyphens and slashes."
        }
    };

    const navigate = useNavigate();
    const [input, setInput] = useState(
        {
            title: "",
            author: "",
            description: "",
            genre: "",
            quantity: "",
            adminName: sessionStorage.getItem("adminname"),
            adminId: sessionStorage.getItem("adminid"),
            link: ""
        }
    )
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!sessionStorage.getItem("adminid")) {
            navigate("/");
        }
    }, [navigate]);

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
        const form = e.currentTarget;
        const formErrors = validate();

        // Trigger the browser's built-in validation for the link field directly
        const linkInput = form.elements.link;
        if (linkInput && !linkInput.checkValidity()) {
            formErrors.link = linkInput.validationMessage;
        }

        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }
        setErrors({});

        const trimmedInput = {
            ...input,
            title: input.title.trim(),
            author: input.author.trim(),
            description: input.description.trim(),
            genre: input.genre.trim(),
            link: input.link.trim()
        };
        try {
            const response = await axios.post("http://localhost:3001/add-book", trimmedInput);
            if (response.data.status === "success") {
                alert("Book added successfully!");
                setInput({
                    title: "",
                    author: "",
                    description: "",
                    genre: "",
                    quantity: "",
                    link: "",
                    adminName: sessionStorage.getItem("adminname"),
                    adminId: sessionStorage.getItem("adminid"),
                });
                setErrors({});
            } else {
                alert(response.data.message || "Failed to add book.");
            }
        } catch (err) {
            console.error("Error adding book:", err);
            alert(err.response?.data?.message || "An error occurred during book addition.");
        }
    };

    return (
        <div className="container">
            <Nav />
            <div className="row g-3 mt-3">
                <div className=" col col-12 col-md-8">
                    <div className="card bg-secondary-subtle text-danger-emphasis mb-3">
                        <form className="card-body d-flex flex-column gap-3" onSubmit={handleSubmit} noValidate>
                            <h5 className="card-title">Add Book</h5>
                            <div>
                                <label htmlFor="link" className="form-label">Link</label>
                                <input type="url" className={`form-control ${errors.link ? 'is-invalid' : ''}`} id="link" name='link' value={input.link} onChange={handleChange} required placeholder="https://example.com/image.jpg" />
                                {errors.link && <div className="invalid-feedback d-block">{errors.link}</div>}
                            </div>
                            <div>
                                <label htmlFor="title" className="form-label">Book Title</label>
                                <input type="text" className={`form-control ${errors.title ? 'is-invalid' : ''}`} id="title" name='title' value={input.title} onChange={handleChange} required placeholder="e.g. The Great Gatsby" />
                                {errors.title && <div className="invalid-feedback d-block">{errors.title}</div>}
                            </div>
                            <div>
                                <label htmlFor="author" className="form-label">Author</label>
                                <input type="text" className={`form-control ${errors.author ? 'is-invalid' : ''}`} id="author" name='author' value={input.author} onChange={handleChange} required placeholder="e.g. F. Scott Fitzgerald" />
                                {errors.author && <div className="invalid-feedback d-block">{errors.author}</div>}
                            </div>
                            <div>
                                <label htmlFor="quantity" className="form-label">Quantity</label>
                                <input type="number" className={`form-control ${errors.quantity ? 'is-invalid' : ''}`} id="quantity" name='quantity' value={input.quantity} onChange={handleChange} required min="1" placeholder="e.g. 5" />
                                {errors.quantity && <div className="invalid-feedback d-block">{errors.quantity}</div>}
                            </div>
                            <div>
                                <label htmlFor="description" className="form-label">Description</label>
                                <textarea className={`form-control ${errors.description ? 'is-invalid' : ''}`} id="description" name='description' value={input.description} onChange={handleChange} required placeholder="Please enter a description with at least 5 words" />
                                {errors.description && <div className="invalid-feedback d-block">{errors.description}</div>}
                            </div>
                            <div>
                                <label htmlFor="genre" className="form-label">Genre</label>
                                <input type="text" className={`form-control ${errors.genre ? 'is-invalid' : ''}`} id="genre" name='genre' value={input.genre} onChange={handleChange} required placeholder="e.g. Fiction, Novel" />
                                {errors.genre && <div className="invalid-feedback d-block">{errors.genre}</div>}
                            </div>
                            <button type="submit" className="btn btn-primary">Add Book</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );

}
export default AddBook