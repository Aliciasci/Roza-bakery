import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "light";
type Size = "md" | "lg";

const base =
  "group/btn relative inline-flex select-none items-center justify-center gap-2.5 rounded-full font-sans font-semibold tracking-[0.02em] " +
  "transition-[transform,background-color,color,box-shadow,border-color] duration-300 ease-[var(--ease-soft)] " +
  "active:scale-[0.97] disabled:pointer-events-none disabled:opacity-45";

const variants: Record<Variant, string> = {
  primary:
    "bg-chocolate text-cream shadow-[0_1px_0_rgba(255,255,255,0.08)_inset,0_10px_24px_-14px_rgba(58,37,32,0.7)] hover:bg-[#2c1b17] hover:shadow-[0_14px_30px_-14px_rgba(58,37,32,0.8)]",
  secondary:
    "border border-chocolate/25 bg-transparent text-chocolate hover:border-chocolate hover:bg-chocolate/[0.03]",
  ghost: "text-chocolate underline-offset-[6px] hover:underline",
  light: "bg-cream text-chocolate hover:bg-white",
};

const sizes: Record<Size, string> = {
  md: "min-h-12 px-6 text-[0.875rem]",
  lg: "min-h-14 px-8 text-[0.9375rem]",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  /** Petite flèche animée au survol. */
  arrow?: boolean;
}

function Arrow() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      className="h-4 w-4 transition-transform duration-300 ease-[var(--ease-soft)] group-hover/btn:translate-x-1"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M3 10h13M11 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function buttonClasses({ variant = "primary", size = "md", className = "" }: Partial<CommonProps>) {
  return `${base} ${variants[variant]} ${sizes[size]} ${className}`;
}

export function ButtonLink({
  href,
  variant,
  size,
  className,
  children,
  arrow,
  ...rest
}: CommonProps & Omit<ComponentProps<typeof Link>, "className" | "children">) {
  return (
    <Link href={href} className={buttonClasses({ variant, size, className })} {...rest}>
      {children}
      {arrow && <Arrow />}
    </Link>
  );
}

export function Button({
  variant,
  size,
  className,
  children,
  arrow,
  type = "button",
  ...rest
}: CommonProps & Omit<ComponentProps<"button">, "className" | "children">) {
  return (
    <button type={type} className={buttonClasses({ variant, size, className })} {...rest}>
      {children}
      {arrow && <Arrow />}
    </button>
  );
}
