import Image, { type ImageProps } from "next/image";

type CinematicImageProps = Omit<ImageProps, "quality"> & {
  quality?: number;
  grade?: "soft" | "rich" | "vivid";
};

const gradeClass: Record<NonNullable<CinematicImageProps["grade"]>, string> = {
  soft: "cinematic-grade-soft",
  rich: "cinematic-grade-rich",
  vivid: "cinematic-grade-vivid",
};

/** High-quality image with subtle cinematic color grading. */
export default function CinematicImage({
  className = "",
  quality = 92,
  grade = "rich",
  alt,
  fill,
  ...props
}: CinematicImageProps) {
  const image = (
    <Image
      alt={alt}
      quality={quality}
      fill={fill}
      className={`cinematic-photo ${gradeClass[grade]} ${className}`.trim()}
      {...props}
    />
  );

  if (fill) {
    return <div className="relative size-full">{image}</div>;
  }

  return image;
}
