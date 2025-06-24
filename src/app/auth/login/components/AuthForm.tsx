"use client";

import { Button, Divider, Form, Input, Link } from "@heroui/react";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { NextAuthError } from "@/lib/types/nextAuth";

export default function AuthForm() {
  const router = useRouter();
  const [loginError, setLoginError] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = (await signIn("credentials", {
        redirect: false,
        email,
        password,
      })) as NextAuthError;

      if (result?.error) {
        setLoginError(result.error);
      } else if (result?.ok) {
        router.push("/dashboard");
      }
    } catch (error: unknown) {
      console.error("Error en login:", error);
      setLoginError(
        error instanceof Error ? error.message : "Error al iniciar sesión"
      );
    }
  };

  return (
    <div className="bg-default-50 flex min-h-screen items-center justify-center p-4">
      <div className="bg-content1 flex w-full max-w-sm flex-col gap-4 rounded-lg p-6 shadow-md">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <Form className="flex flex-col gap-3" onSubmit={handleSubmit}>
              <Input
                isRequired
                label="Email"
                name="email"
                placeholder="Enter your email"
                type="email"
                variant="bordered"
              />
              <Input
                isRequired
                label="Password"
                name="password"
                placeholder="Enter your password"
                type="password"
                variant="bordered"
              />
              {loginError && (
                <div className="text-danger-500 text-small">{loginError}</div>
              )}
              <Button className="w-full" color="primary" type="submit">
                Sign In
              </Button>
            </Form>
            <Divider />
            <p className="text-small text-center">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" size="sm">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
