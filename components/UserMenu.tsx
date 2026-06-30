"use client";

// components/UserMenu.tsx
// Menu utilisateur avec déconnexion (composant client car signOut nécessite une interaction)

import { signOut } from "next-auth/react";
import { LogOut, User } from "lucide-react";
import { useState } from "react";

interface UserMenuProps {
  name: string | null;
  email: string | null;
}

export default function UserMenu({ name, email }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-gray-300 hover:bg-gray-800 transition-colors text-left"
      >
        <div className="w-7 h-7 bg-gradient-to-br from-orange-500 to-violet-600 rounded-full flex items-center justify-center shrink-0">
          <User className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium truncate">{name || "Mon compte"}</p>
          <p className="text-xs text-gray-500 truncate">{email}</p>
        </div>
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-xl">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-400 hover:bg-gray-700 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Se déconnecter
          </button>
        </div>
      )}
    </div>
  );
}
