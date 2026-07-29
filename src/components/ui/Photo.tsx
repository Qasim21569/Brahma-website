interface PhotoProps {
  src?: string;
  alt: string;
  className?: string;
  parallax?: boolean;
  grayscale?: boolean;
}

export function Photo({
  src,
  alt,
  className = "",
  parallax = false,
  grayscale = true,
}: PhotoProps) {
  const base = `object-cover w-full h-full transition-all duration-700 ${
    grayscale ? "grayscale opacity-90" : ""
  } ${className}`;

  if (!src) {
    return (
      <div
        className={`w-full h-full bg-stone-white flex items-center justify-center ${className}`}
      >
        <span className="font-label-caps text-label-caps text-on-surface-variant opacity-40">
          [PHOTO]
        </span>
      </div>
    );
  }

  return (
    <div
      className={`w-full h-full overflow-hidden ${className}`}
      data-parallax={parallax ? "0.15" : undefined}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className={base} data-alt={alt} />
    </div>
  );
}
