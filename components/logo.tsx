import Link from "next/link"
import Image from "next/image"

interface LogoProps {
  className?: string
  showText?: boolean
  size?: "sm" | "md" | "lg"
}

export default function Logo({ className = "", showText = true, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
  }

  const textSizeClasses = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
  }

  return (
    <Link href="/" className={`flex items-center space-x-3 group ${className}`}>
      <div
        className={`${sizeClasses[size]} relative overflow-hidden group-hover:scale-110 transition-all duration-300`}
      >
        <Image
          src="/images/logo.png"
          alt="Digital Products Artisan Logo"
          width={size === "sm" ? 32 : size === "md" ? 40 : 56}
          height={size === "sm" ? 32 : size === "md" ? 40 : 56}
          className="w-full h-full object-contain group-hover:brightness-110 transition-all duration-300"
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-bold ${textSizeClasses[size]} bg-gradient-to-r from-blue-900 to-blue-800 bg-clip-text text-transparent leading-tight group-hover:from-blue-800 group-hover:to-blue-700 transition-all duration-300`}
          >
            DIGITAL PRODUCTS
          </span>
          <span
            className={`font-semibold ${size === "sm" ? "text-sm" : size === "md" ? "text-base" : "text-lg"} bg-gradient-to-r from-blue-900 to-blue-800 bg-clip-text text-transparent leading-tight -mt-1 group-hover:from-blue-800 group-hover:to-blue-700 transition-all duration-300`}
          >
            ARTISAN
          </span>
        </div>
      )}
    </Link>
  )
}
