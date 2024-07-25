"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const loginSchema = z.object({
  username: z.string().nonempty("Username is required"),
  password: z.string().nonempty("Password is required"),
});

export default function LoginComponent() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/admin");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate input fields using Zod
    const result = loginSchema.safeParse({ username, password });
    if (!result.success) {
      setError(result.error.errors.map((err) => err.message).join(", "));
      return;
    }

    try {
      const response = await axios.post(
        "https://api.aralboyitexnikum.uz/users/login/",
        {
          username,
          password,
        }
      );

      if (response.status === 200) {
        console.log("Login successful");
        localStorage.setItem("token", response.data.token); // Save token if needed
        router.push("/admin"); // Redirect to the admin dashboard
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("An error occurred:", err);
      setError("An error occurred. Please try again later.");
    }
  };

  if (isLoading) {
    return <div className="text-white">Loading...</div>; // or a loading spinner
  }

  return (
    <div className="flex h-screen px-4 items-center justify-center bg-gray-900">
      <Card className="w-full max-w-md bg-gray-800 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-500/10 p-4 text-red-500">{error}</div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="space-y-2 mb-4">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-gray-700 text-white"
              />
            </div>
            <div className="space-y-2 mb-4">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-700 text-white"
              />
            </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Sign in
              </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
