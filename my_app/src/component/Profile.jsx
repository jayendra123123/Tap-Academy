import React from 'react';

export const Profile = ({ user, logout }) => {
  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-black uppercase tracking-wide">Profile</h1>
        <div className="text-sm text-black/70">Member details</div>
      </header>

      <div className="bg-white border border-black rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center text-white text-3xl font-bold">{user.name?.charAt(0) ?? '?'}</div>
          <div>
            <h2 className="text-2xl font-extrabold text-black">{user.name}</h2>
            <p className="text-sm text-black/70">{user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-black uppercase">Employee ID</label>
            <div className="py-2 text-black font-medium">{user.employeeId}</div>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-black uppercase">Email</label>
            <div className="py-2 text-black font-medium">{user.email}</div>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-black uppercase">Department</label>
            <div className="py-2 text-black font-medium">{user.department}</div>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-black uppercase">Role</label>
            <div className="py-2 text-black font-medium">{user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}</div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button className="px-4 py-2 bg-black text-white rounded-md font-semibold hover:opacity-90 transition">Edit Profile</button>
          <button 
            onClick={logout}
            className="px-4 py-2 border border-red-500 text-red-600 rounded-md font-semibold hover:bg-red-500 hover:text-white transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default {
  Profile
};
