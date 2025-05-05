'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

interface NavItemProps {
  href: string;
  icon: string;
  label: string;
  isActive: boolean;
}

const NavItem = ({ href, icon, label, isActive }: NavItemProps) => {
  return (
    <Link href={href} className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
      isActive ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
    }`}>
      <Image 
        src={icon} 
        alt={`${label} icon`} 
        width={20} 
        height={20} 
        className="opacity-80"
      />
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
};

export function Navbar() {
  const pathname = usePathname();
  
  const navItems = [
    { href: '/', label: 'Dashboard', icon: '/globe.svg' },
    { href: '/media-items', label: 'Media Items', icon: '/window.svg' },
    { href: '/workspaces', label: 'Workspaces', icon: '/file.svg' },
  ];
  
  return (
    <aside className="bg-gray-900 w-64 min-h-screen p-4 fixed left-0 top-0">
      <div className="mb-8 px-2">
        <h1 className="text-xl font-bold text-white">ADWrap</h1>
        <p className="text-sm text-gray-400">Media Management</p>
      </div>
      
      <nav className="space-y-1">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isActive={pathname === item.href}
          />
        ))}
      </nav>
    </aside>
  );
}