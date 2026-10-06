import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const CalendarIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="3.5" y="5" width="17" height="15" rx="2" />
    <path d="M3.5 9.5h17M8 3v4M16 3v4" />
    <path d="M8 13.5h.01M12 13.5h.01M16 13.5h.01M8 16.5h.01M12 16.5h.01" strokeWidth="2" />
  </svg>
);

export const StoreIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M4 10v10h16V10" />
    <path d="M3 10l1.5-5h15L21 10c0 1.7-1.3 2.5-2.6 2.5S16 11.7 16 10c0 1.7-1.3 2.5-2.7 2.5-1.3 0-2.6-.8-2.6-2.5 0 1.7-1.3 2.5-2.6 2.5S5.5 11.7 5.5 10" />
    <path d="M10 20v-4.5h4V20" />
  </svg>
);

export const HandIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 21c-4 0-7-2.7-7-6.5V9.5a1.5 1.5 0 0 1 3 0V12" />
    <path d="M8 11V5.5a1.5 1.5 0 0 1 3 0V11M11 10.5V4.5a1.5 1.5 0 0 1 3 0v6M14 10.5V6a1.5 1.5 0 0 1 3 0v8.5C17 18.3 15 21 12 21" />
  </svg>
);

export const HeartIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10Z" />
  </svg>
);

export const CheckIcon = (p: IconProps) => (
  <svg {...base} strokeWidth={2} {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

export const ArrowLeftIcon = (p: IconProps) => (
  <svg {...base} strokeWidth={1.6} {...p}>
    <path d="M19 12H5M10 7l-5 5 5 5" />
  </svg>
);

export const ArrowRightIcon = (p: IconProps) => (
  <svg {...base} strokeWidth={1.6} {...p}>
    <path d="M5 12h14M14 7l5 5-5 5" />
  </svg>
);

export const ChevronIcon = (p: IconProps) => (
  <svg {...base} strokeWidth={1.6} {...p}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export const PlusIcon = (p: IconProps) => (
  <svg {...base} strokeWidth={1.6} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const MinusIcon = (p: IconProps) => (
  <svg {...base} strokeWidth={1.6} {...p}>
    <path d="M5 12h14" />
  </svg>
);

export const CloseIcon = (p: IconProps) => (
  <svg {...base} strokeWidth={1.6} {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const RestartIcon = (p: IconProps) => (
  <svg {...base} strokeWidth={1.6} {...p}>
    <path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3" />
    <path d="M4.5 4.5v3.8h3.8" />
  </svg>
);

export const ImageIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
    <circle cx="9" cy="10" r="1.6" />
    <path d="M20.5 15.5l-4.5-4.5-8.5 8.5" />
  </svg>
);

export const InstagramIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r=".6" fill="currentColor" />
  </svg>
);

export const MailIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
    <path d="M4 7l8 6 8-6" />
  </svg>
);

export const PhoneIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 5.5a2 2 0 0 1 2-2Z" />
  </svg>
);

export const PinIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.3" />
  </svg>
);

export const SparkIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" />
  </svg>
);

export const LeafIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15" />
    <path d="M5 19c3-4 6-7 10-9" />
  </svg>
);

export const WhiskIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M14 10 4 20" />
    <path d="M14 10c-1.5-3.5.5-7 3.5-7.5 2.5-.4 4.4 1.5 4 4-.5 3-4 5-7.5 3.5Z" />
    <path d="M14.5 9.5c.5-2.5 2.5-5 5-6" />
  </svg>
);

export const EyeIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
    <circle cx="12" cy="12" r="2.8" />
  </svg>
);
