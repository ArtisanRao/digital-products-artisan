"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const handleDropdownClick = (menu: string) => {
    setOpenDropdown((prev) => (prev === menu ? null : menu));
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setOpenDropdown(null);
  };

  const menuItems = [
    { label: "Products", href: "/products" },
    { label: "Bundles", href: "/bundles" },
    { label: "Categories", href: "/categories" },
    { label: "About", href: "/about" },
    {
      label: "Support",
      href: "#",
      submenu: [
        { label: "FAQ", href: "/support/faq" },
        { label: "Contact Us", href: "/support/contact" },
      ],
    },
  ];

  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between h-16 px-4 gap-4 lg:gap-6">
        {/* Logo */}
        <Link href="/" onClick={closeMenu} className="flex items-center">
          <Image
            src="/images/logo.jpg"
            alt="Logo"
            width={120}
            height={35}
            className="object-contain"
            priority
          />
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center gap-6">
          {menuItems.map((item) => (
            <div key={item.label} className="relative group">
              <Link
                href={item.href}
                className={`hover:text-blue-600 ${
                  pathname === item.href ? "text-blue-600 font-semibold" : ""
                }`}
              >
                {item.label}
              </Link>
              {item.submenu && (
                <div className="absolute left-0 mt-2 hidden w-40 bg-white shadow-lg group-hover:block z-50">
                  {item.submenu.map((sub) => (
                    <Link
                      key={sub.label}
                      href={sub.href}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Mobile quick nav between logo & menu toggle */}
        <div className="flex lg:hidden items-center gap-3">
          {menuItems
            .filter((item) => item.label !== "Bundles") /* optional: hide Bundles on mobile */
            .map((item) => (
              <Link
                key={item.label}
                href={item.href === "#" ? "/support" : item.href}
                className="mobile-link"
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            ))}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={toggleMenu}
          className="lg:hidden text-gray-700 focus:outline-none ml-4"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="flex flex-col">
            {menuItems
              .filter(
                (item) =>
                  ["Products", "Bundles", "Categories", "About", "Support"].includes(
                    item.label
                  )
              )
              .map((item) => (
                <div key={item.label} className="border-b border-gray-100">
                  <button
                    onClick={() =>
                      item.submenu
                        ? handleDropdownClick(item.label)
                        : closeMenu()
                    }
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 flex justify-between items-center"
                  >
                    <Link
                      href={item.href}
                      onClick={!item.submenu ? closeMenu : undefined}
                      className="flex-1"
                    >
                      {item.label}
                    </Link>
                    {item.submenu && (
                      <span>{openDropdown === item.label ? "▲" : "▼"}</span>
                    )}
                  </button>
                  {item.submenu && openDropdown === item.label && (
                    <div className="bg-gray-50">
                      {item.submenu.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          onClick={closeMenu}
                          className="block px-6 py-2 hover:bg-gray-100"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </header>
  );
}
