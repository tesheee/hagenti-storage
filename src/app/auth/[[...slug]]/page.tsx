import AuthFormLoader from "@/app/auth/auth";
import { AuthFormKey } from "@/lib/auth-forms";
import React from "react";

export default async function AuthPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;

  const view = (slug?.[0] ?? "login") as AuthFormKey;
  const extra = slug?.slice(1);

  return (
    <div>
      <AuthFormLoader view={view} extra={extra} />
    </div>
  );
}
