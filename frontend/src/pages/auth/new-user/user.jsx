import React from "react";
import { useForm } from "react-hook-form";
import { User, Mail, Lock, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "@/components/logo";

const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = (data) => {
    console.log("Register Data:", data);
    alert("Account created successfully!");
  };

  return (
  <div className="min-h-screen w-full flex items-center justify-center bg-[#F8FAF9] px-4 py-4 overflow-y-auto">
    <div className="w-full max-w-md">
      {/* Card */}
      <div className="bg-white rounded-3xl border border-[#041E23] p-8 shadow-xl">


        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg font-semibold text-white bg-[#041E23] hover:bg-[#062c33] transition text-[15px]"
          >
            <ArrowLeft size={14} />
            Back
          </Link>
        </div>

        {/* Logo & Header */}
        <div className="text-center mb-6">
          <Logo containerSize="w-14 h-14" iconSize={28} className="mx-auto" />

        <h2 className="text-3xl font-extrabold text-[#041E23] mt-5 mb-2">
  Create Account
</h2>

<p className="text-slate-500 text-sm">
  Start planning your next adventure.
</p>

        </div>

        {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

  {/* Full Name */}
  <div>
    <label className="block text-[10px] font-bold text-[#041E23]/60 uppercase tracking-wider mb-2">
      Full Name
    </label>

    <div className="relative">
      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
      <input
        {...register("name", { required: "Full name is required" })}
        type="text"
        className={`w-full bg-slate-50 border ${
          errors.name ? "border-red-400" : "border-slate-200"
        } rounded-xl pl-12 pr-4 py-3 text-base
        focus:border-[#041E23] focus:ring-2 focus:ring-[#041E23]/10
        outline-none transition`}
        placeholder="John Doe"
      />
    </div>

    {errors.name && (
      <span className="text-red-500 text-xs mt-1 font-semibold">
        {errors.name.message}
      </span>
    )}
  </div>

  {/* Email */}
  <div>
    <label className="block text-[10px] font-bold text-[#041E23]/60 uppercase tracking-wider mb-2">
      Email
    </label>

    <div className="relative">
      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
      <input
        {...register("email", {
          required: "Email is required",
          pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
        })}
        type="email"
        className={`w-full bg-slate-50 border ${
          errors.email ? "border-red-400" : "border-slate-200"
        } rounded-xl pl-12 pr-4 py-3 text-base
        focus:border-[#041E23] focus:ring-2 focus:ring-[#041E23]/10
        outline-none transition`}
        placeholder="traveler@example.com"
      />
    </div>

    {errors.email && (
      <span className="text-red-500 text-xs mt-1 font-semibold">
        {errors.email.message}
      </span>
    )}
  </div>

  {/* Password */}
  <div>
    <label className="block text-[10px] font-bold text-[#041E23]/60 uppercase tracking-wider mb-2">
      Password
    </label>

    <div className="relative">
      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
      <input
        {...register("password", {
          required: "Password required",
          minLength: { value: 6, message: "Minimum 6 characters" },
        })}
        type="password"
        className={`w-full bg-slate-50 border ${
          errors.password ? "border-red-400" : "border-slate-200"
        } rounded-xl pl-12 pr-4 py-3 text-base
        focus:border-[#041E23] focus:ring-2 focus:ring-[#041E23]/10
        outline-none transition`}
        placeholder="••••••••"
      />
    </div>

    {errors.password && (
      <span className="text-red-500 text-xs mt-1 font-semibold">
        {errors.password.message}
      </span>
    )}
  </div>

  {/* Confirm Password */}
  <div>
    <label className="block text-[10px] font-bold text-[#041E23]/60 uppercase tracking-wider mb-2">
      Confirm Password
    </label>

    <div className="relative">
      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
      <input
        {...register("confirmPassword", {
          required: "Confirm password",
          validate: (value) =>
            value === password || "Passwords do not match",
        })}
        type="password"
        className={`w-full bg-slate-50 border ${
          errors.confirmPassword ? "border-red-400" : "border-slate-200"
        } rounded-xl pl-12 pr-4 py-3 text-base
        focus:border-[#041E23] focus:ring-2 focus:ring-[#041E23]/10
        outline-none transition`}
        placeholder="••••••••"
      />
    </div>

    {errors.confirmPassword && (
      <span className="text-red-500 text-xs mt-1 font-semibold">
        {errors.confirmPassword.message}
      </span>
    )}
  </div>

  {/* Submit */}
  <button
    type="submit"
    className="w-full py-4 rounded-xl font-bold text-white text-lg
    bg-[#041E23] hover:bg-[#062c33] transition shadow-lg"
  >
    Sign Up
  </button>
</form>
      </div>

      <p className="text-center mt-6 text-slate-400 text-[10px] font-semibold uppercase tracking-widest">
        Secure encryption enabled
      </p>
    </div>
  </div>
);
}

export default Register;
