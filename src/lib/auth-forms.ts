import dynamic from "next/dynamic";

export const authForms = {
  login: dynamic(() => import("@/app/auth/components/LoginForm")),
  signup: dynamic(() => import("@/app/auth/components/SignUpForm")),
} as const;

export type AuthFormKey = keyof typeof authForms;
