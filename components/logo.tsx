import Link from "next/link"

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
        className={`${sizeClasses[size]} bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 rounded-2xl flex items-center justify-center shadow-xl relative overflow-hidden group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105`}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-transparent"></div>
        <div className="absolute top-0 right-0 w-6 h-6 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-y-2 translate-x-2"></div>

        {/* Main logo design - stylized "DPA" with geometric elements */}
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 32 32" className="w-full h-full text-white" fill="currentColor">
            {/* Letter "D" */}
            <path d="M4 6h6c4 0 7 3 7 7v6c0 4-3 7-7 7H4V6zm2 2v18h4c2.8 0 5-2.2 5-5v-6c0-2.8-2.2-5-5-5H6z" />

            {/* Letter "P" overlapping */}
            <path d="M14 6h6c3 0 5 2 5 5s-2 5-5 5h-4v6h-2V6zm2 2v6h4c1.7 0 3-1.3 3-3s-1.3-3-3-3h-4z" opacity="0.9" />

            {/* Letter "A" */}
            <path d="M22 6l4 16h-2l-1-4h-4l-1 4h-2l4-16h2zm0 4l-1.5 6h3L22 10z" opacity="0.8" />

            {/* Decorative dots */}
            <circle cx="8" cy="4" r="1" opacity="0.6" />
            <circle cx="24" cy="4" r="1" opacity="0.6" />
            <circle cx="16" cy="28" r="1" opacity="0.6" />
          </svg>
        </div>

        {/* Shine effect */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:via-white/60 transition-all duration-300"></div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-bold ${textSizeClasses[size]} bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent leading-tight group-hover:from-blue-800 group-hover:to-blue-600 transition-all duration-300`}
          >
            Digital Products
          </span>
          <span
            className={`font-semibold ${size === "sm" ? "text-sm" : size === "md" ? "text-base" : "text-lg"} bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent leading-tight -mt-1 group-hover:from-blue-500 group-hover:to-blue-400 transition-all duration-300`}
          >
            Artisan
          </span>
        </div>
      )}
    </Link>
  )
}
