import Link from "next/link"
import Image from "next/image"

interface LogoProps {
  className?: string
  showText?: boolean
  size?: "sm" | "md" | "lg"
}

export default function Logo({ className = "", size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
  }

  return (
    <Link href="/" className={`flex items-center space-x-3 group ${className}`}>
      <div
        className={`${sizeClasses[size]} relative overflow-hidden group-hover:scale-110 transition-all duration-300`}
      >
        <Image
          src="/images/logo-new.png"
          alt="Digital Products Artisan Logo"
          width={size === "sm" ? 32 : size === "md" ? 40 : 56}
          height={size === "sm" ? 32 : size === "md" ? 40 : 56}
          className="w-full h-full object-contain group-hover:brightness-110 transition-all duration-300"
        />
      </div>
    </Link>
  )
}
