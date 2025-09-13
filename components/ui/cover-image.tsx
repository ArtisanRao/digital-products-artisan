import Image from "next/image";

type CoverImageProps = {
  src: string;
  alt: string;
  ratio?: "16/9" | "3/2" | "4/3" | "1/1";
  fit?: "contain" | "cover";
  hover?: boolean;
  paddingClass?: string;
  roundedClass?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

const ratioClass: Record<NonNullable<CoverImageProps["ratio"]>, string> = {
  "16/9": "aspect-[16/9]",
  "3/2": "aspect-[3/2]",
  "4/3": "aspect-[4/3]",
  "1/1": "aspect-square",
};

export default function CoverImage({
  src,
  alt,
  ratio = "3/2",
  fit = "contain",
  hover = true,
  paddingClass = "p-2",
  roundedClass = "rounded-xl",
  className = "",
  sizes = "(min-width:1024px) 25vw, (min-width:768px) 33vw, 100vw",
  priority = false,
}: CoverImageProps) {
  return (
    <div
      className={[
        "relative w-full overflow-hidden bg-white group/cover",
        ratioClass[ratio],
        paddingClass,
        roundedClass,
        className,
      ].join(" ")}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        draggable={false}
        className={[
          fit === "cover" ? "object-cover" : "object-contain",
          hover ? "transition-transform duration-300 group-hover/cover:scale-[1.02]" : "",
        ].join(" ")}
      />
      {hover && (
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/cover:opacity-100">
          <div className="absolute inset-0 ring-1 ring-inset ring-blue-500/10 rounded-md" />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-50/30 to-transparent" />
        </div>
      )}
    </div>
  );
}
