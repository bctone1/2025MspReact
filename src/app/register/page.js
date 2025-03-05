'use client';

import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        emailCode: '',
    });

    const generateSecretCode = () => {
        return Math.floor(100000 + Math.random() * 900000); // 100000에서 999999 사이의 숫자 생성
    };
    
    const [emailVerified, setEmailVerified] = useState(false);
    const [secretCode, setSecretCode] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEmailVerification = async () => {
        try {
            const code = generateSecretCode();
            setSecretCode(code);

            const response = await axios.post('http://localhost:5000/sendEmail', {
                email: formData.email,
                secretCode: code,
                // secretCode: code.toString(),
            });

            if (response.status === 200) {
                alert(response.data.message);
                setEmailVerified(true);
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error('Error sending email:', error);
            alert('An error occurred while sending the verification email.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, password, confirmPassword, emailCode } = formData;

        if (!name || !email || !password || !confirmPassword) {
            alert('All fields are required.');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        if (!emailVerified) {
            alert('Please verify your email.');
            return;
        }

        if (emailCode !== secretCode.toString()) {
            alert('Invalid email verification code.');
            return;
        }

        // 이메일 코드가 맞다면 /register API로 POST 요청
        try {
            const response = await axios.post('http://localhost:5000/register', {
                name,
                email,
                password,
                confirmPassword
            });

            if (response.status === 200) {
                alert('Registration successful!');
                router.push("/login");
                
            } else {
                alert('Registration failed.');
            }
        } catch (error) {
            console.error('Error registering:', error);
            alert('An error occurred during registration.');
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
            <h1 className="text-2xl font-bold text-center mb-6">Register</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <button
                        type="button"
                        onClick={handleEmailVerification}
                        className={`w-full p-3 text-white font-medium rounded-md ${
                            emailVerified
                                ? 'bg-green-500 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                        disabled={emailVerified}
                    >
                        {emailVerified ? 'Email Verified' : 'Verify Email'}
                    </button>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Email Verification Code:</label>
                    <input
                        type="text"
                        name="emailCode"
                        value={formData.emailCode}
                        onChange={handleChange}
                        placeholder="Enter verification code"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Confirm Password:</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-yellow-500 text-white p-3 rounded-md font-medium hover:bg-yellow-600"
                >
                    Register
                </button>
            </form>
        </div>
    );
}
