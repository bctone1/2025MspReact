"use client";
import axios from 'axios';


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


import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const { data: session } = useSession();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

  

    const handleLogin = async () => {
      const result = await signIn("credentials", {
        redirect: false, // 리디렉션 방지
        email,
        password,
      });
      
    
      if (result?.error) {
        alert("회원정보가 없습니다.");
        // alert("Login failed: " + result.error);
      } else {
        router.push("/dashboard/user");
      }
    };
    const handleSignup = () => {
      console.log("Redirect to signup page");
      router.push("/register")
      // router.push("/signup");
      // window.location.href="/register"
    };

  const handleGoogleLogin = () => {
    signIn("google", {
      callbackUrl: "/dashboard/user", // 로그인 후 리디렉션할 URL
    });
  };

  

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-md rounded-md w-96">
        <h1 className="text-2xl font-semibold mb-6 text-center">Login</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button onClick={handleLogin} className="w-full">
            Login
          </Button>
          <Button onClick={handleSignup} className="w-full bg-gray-300 text-gray-700 mt-4">
            Sign Up
          </Button>
          <Button
            onClick={handleGoogleLogin}
            className="w-full bg-blue-500 text-white mt-4"
          >
            Login with Google
          </Button>
        </div>
      </div>
    </div>
  );
}
