'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoginForm from "@/components/LoginForm";
import { Sparkles } from "lucide-react";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FDFBF7]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF4F4F]"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FDFBF7] p-4 text-neutral-900">
      <div className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-between gap-12">

        {/* Left Side: Copy & Branding */}
        <div className="flex-1 space-y-8 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 text-[#FF4F4F]">
            <Sparkles size={36} />
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900">AI Powered Resume Analysis</h1>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Optimize your resume for the job you want.
            </h2>
            <p className="text-lg text-neutral-600 max-w-xl">
              AI-powered analysis compares your resume against specific job descriptions.
              Get an instant match score, identify missing skills, and improve your bullet points.
            </p>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl shadow-neutral-200/50 border border-neutral-100">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
