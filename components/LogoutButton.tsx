"use client";

import { LogOut } from "lucide-react";
import { logout } from "@/actions/authActions";

export default function LogoutButton() {
  return (
    <span className='flex items-center cursor-pointer' onClick={() => logout()}>
      <LogOut className='h-4 w-4 mr-2' />
      Logout
    </span>
  );
}
