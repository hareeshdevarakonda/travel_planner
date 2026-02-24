import React from 'react';
import { Camera, Globe, Github, Instagram, MessageSquare, Save, X } from 'lucide-react';

const SettingsPage = () => {
  return (
    <div className="flex min-h-screen bg-[#F8F9FA] text-[#0A0A0A] font-sans">
      {/* Sidebar - Matching Odyssey Theme */}
 

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="mb-10">
          <h1 className="text-5xl font-black mb-2 tracking-tight">Account <span className="text-gray-400">Settings</span></h1>
          <p className="text-gray-500 font-medium">Manage your explorer profile and connected services.</p>
        </header>

        <div className="max-w-4xl bg-white rounded-[32px] shadow-sm border border-gray-100 p-10">
          {/* Avatar Section */}
          <section className="mb-10">
            <h3 className="text-lg font-bold mb-4 uppercase tracking-widest text-gray-400">Avatar</h3>
            <div className="relative w-24 h-24">
              <img 
                src="https://via.placeholder.com/150" 
                alt="Profile" 
                className="rounded-2xl object-cover w-full h-full border-4 border-[#F9D312]"
              />
              <button className="absolute -bottom-2 -right-2 bg-black text-white p-2 rounded-full border-2 border-white">
                <Camera size={16} />
              </button>
            </div>
          </section>

          {/* Form Grid */}
          <div className="grid grid-cols-2 gap-6 mb-10">
            {[
              { label: 'Display Name', placeholder: 'Enter Nickname' },
              { label: 'Full Name', placeholder: 'Enter FullName' },
              { label: 'Email', placeholder: 'Enter Email' },
              { label: 'Phone Number', placeholder: 'Phone Number' },
            ].map((field) => (
              <div key={field.label} className="flex flex-col gap-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">{field.label}</label>
                <input 
                  type="text" 
                  placeholder={field.placeholder}
                  className="bg-gray-50 border-2 border-transparent focus:border-[#F9D312] focus:bg-white outline-none p-4 rounded-xl transition-all font-medium"
                />
              </div>
            ))}
          </div>

          {/* Linked Accounts - High Contrast Style */}
          <section className="mb-10">
            <h3 className="text-lg font-bold mb-6 uppercase tracking-widest text-gray-400">Linked Accounts</h3>
            <div className="space-y-4">
              {[
                { name: 'Google', icon: <Globe size={20}/>, color: 'text-blue-500' },
                { name: 'Github', icon: <Github size={20}/>, color: 'text-black' },
                { name: 'Instagram', icon: <Instagram size={20}/>, color: 'text-pink-500' },
                { name: 'Discord', icon: <MessageSquare size={20}/>, color: 'text-indigo-500' },
              ].map((acc) => (
                <div key={acc.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className={`${acc.color}`}>{acc.icon}</div>
                    <span className="font-bold">Sign in with {acc.name}</span>
                  </div>
                  <button className="px-6 py-2 border-2 border-black rounded-full font-black text-xs uppercase hover:bg-black hover:text-white transition-all">
                    Connect
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Footer Actions */}
          <footer className="flex justify-end gap-4 pt-6 border-t border-gray-100">
            <button className="px-8 py-3 rounded-xl font-bold text-gray-400 hover:text-black transition-colors">
              Cancel
            </button>
            <button className="px-10 py-3 bg-[#F9D312] rounded-xl font-black uppercase tracking-widest shadow-lg shadow-yellow-200 hover:scale-105 transition-transform">
              Save Changes
            </button>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;