import React, { useState } from "react";
import './regs.css'

function Regs() {
    const [formData, setFormData] = useState({
        fullName: "",
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleInput = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Frontend validation for password match
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        const response = await fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();
        if (data.success) {
            alert("Registration done");
        } else {
            alert("Error: " + data.message);
        }
    };

    return (
            <div className="container">
                <h1>Register</h1>
                <form onSubmit={handleSubmit}>
                    <div className="formField">
                        <input
                            type="text"
                            placeholder="Enter Fullname"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInput}
                            required
                        />
                        
                    </div>

                    <div className="formField">
                        <input
                            type="text"
                            placeholder="Enter username"
                            name="userName"
                            value={formData.userName}
                            onChange={handleInput}
                            required
                        />
                    </div>

                    <div className="formField">
                        <input
                            type="email"
                            placeholder="Enter email"
                            name="email"
                            value={formData.email}
                            onChange={handleInput}
                            required
                        />
                    </div>

                    <div className="formField">
                        <input
                            type="password"
                            placeholder="Enter password"
                            name="password"
                            value={formData.password}
                            onChange={handleInput}
                            required
                        />
                    </div>

                    <div className="formField">
                        <input
                            type="password"
                            placeholder="Confirm password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInput}
                            required
                        />
                    </div>

                    <button type="submit">Register</button>
                </form>
            </div>
    );
}

export default Regs;
