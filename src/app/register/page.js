'use client';

import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Register() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        emailCode: '',
    });

    const [emailVerified, setEmailVerified] = useState(false);
    const [secretCode, setSecretCode] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEmailVerification = async () => {
        try {
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            setSecretCode(code);
            const response = await axios.post('http://localhost:5000/sendEmail', {
                email: formData.email,
                secretCode: code,
            });
            if (response.status === 200) {
                alert(response.data.message);
                setEmailVerified(true);
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
        if (emailCode !== secretCode) {
            alert('Invalid email verification code.');
            return;
        }
        try {
            const response = await axios.post('http://localhost:5000/register', formData);
            if (response.status === 200) {
                alert('Registration successful!');
                router.push("/login");
            }
        } catch (error) {
            console.error('Error registering:', error);
            alert('An error occurred during registration.');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-6 bg-muted">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center text-xl">Create an Account</CardTitle>
                    <CardDescription className="text-center">Sign up to get started</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label>Name</Label>
                            <Input type="text" name="name" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div>
                            <Label>Email</Label>
                            <Input type="email" name="email" value={formData.email} onChange={handleChange} required />
                        </div>
                        <Button type="button" onClick={handleEmailVerification} disabled={emailVerified} className="w-full">
                            {emailVerified ? 'Email Verified' : 'Verify Email'}
                        </Button>
                        <div>
                            <Label>Email Verification Code</Label>
                            <Input type="text" name="emailCode" value={formData.emailCode} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Password</Label>
                            <Input type="password" name="password" value={formData.password} onChange={handleChange} required />
                        </div>
                        <div>
                            <Label>Confirm Password</Label>
                            <Input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                        </div>
                        <Button type="submit" className="w-full">Register</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
