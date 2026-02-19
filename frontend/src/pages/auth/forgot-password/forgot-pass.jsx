import React from "react";
import { useForm } from "react-hook-form";
import { Mail, ArrowLeft, Send } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "@/components/logo";

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log("Reset link requested for:", data.email);
    alert("If an account exists, a reset link has been sent!");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F8FAF9] px-6 py-10">
      <div className="w-full max-w-[440px]">
        
        {/* Card containing everything */}
        <div className="bg-white rounded-[2rem] border-2 border-[#041E23] p-8 md:p-10 shadow-[8px_8px_0px_0px_rgba(4,30,35,0.05)] relative overflow-hidden">
          
          {/* Internal Back Button - Moved inside the top of the card */}
          <div className="mb-8">
            <Link 
              to="/login" 
              className="inline-flex items-center  hover:text-amber-400 gap-2 px-5 py-3 rounded-xl font-bold text-white bg-[#041E23] hover:bg-[#062c33] transition-all shadow-sm group text-sm"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform " />
             Back to Login  
            </Link>
          </div>

          {/* Logo & Header */}
          <div className="text-center mb-8">
            <Logo containerSize="w-14 h-14" iconSize={32} className="mx-auto" />
            <h2 className="text-3xl font-black text-[#041E23] mt-6 mb-2 tracking-tight">
              Reset Password
            </h2>
            <p className="text-slate-500 font-medium text-sm px-2">
              Enter your email and we'll send you a link to get back into your account.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-[10px] font-black text-[#041E23]/50 uppercase tracking-[0.15em] mb-2 ml-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  {...register("email", { 
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" }
                  })}
                  type="email"
                  className={`w-full bg-slate-50 border-2 ${errors.email ? 'border-red-400' : 'border-slate-100'} rounded-xl px-12 py-3.5 text-base focus:border-[#041E23] focus:ring-4 focus:ring-[#041E23]/5 outline-none transition-all placeholder:text-slate-300`}
                  placeholder="traveler@example.com"
                />
              </div>
              {errors.email && (
                <span className="text-red-500 text-xs mt-2 ml-1 font-bold">
                  {errors.email.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl font-bold text-white bg-[#041E23] hover:bg-[#062c33] transition-all flex items-center justify-center gap-2 group shadow-lg shadow-[#041E23]/10 hover:text-amber-400"
            >
              Send Reset Link
              <Send size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </form>
        </div>

        {/* Footer text remains outside for better visual breathing room */}
        <p className="text-center mt-8 text-slate-400 text-xs font-semibold uppercase tracking-widest leading-none">
          Secure encryption enabled
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;





