/**
 * Custom hand-drawn icon set: Media Zefanya.
 * Rounded, child-friendly line icons designed to replace stock emoji.
 * All icons inherit `currentColor` and accept standard SVG props.
 */
import { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = (props: IconProps) => ({
  width: "1em",
  height: "1em",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  ...props,
});

/* ===== Enam indra ===== */

/** Warna: mata */
export const IconEye = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M1.8 12S5.5 5.8 12 5.8 22.2 12 22.2 12 18.5 18.2 12 18.2 1.8 12 1.8 12Z" />
    <circle cx="12" cy="12" r="3.2" />
    <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);

/** Tekstur: telapak tangan */
export const IconHand = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M8 13V6.2a1.6 1.6 0 1 1 3.2 0V11" />
    <path d="M11.2 10.6V5.4a1.6 1.6 0 1 1 3.2 0V11" />
    <path d="M14.4 10.8V7.2a1.6 1.6 0 1 1 3.2 0v7.4c0 3.6-2.4 6.4-6 6.4-2.2 0-3.8-.8-5-2.4L4.6 15c-.7-1-.4-2.3.6-3 .8-.5 1.9-.3 2.5.5L8 13" />
  </svg>
);

/** Rasa: lidah */
export const IconTongue = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M3.5 10.5c2.6 4.2 5.6 6.3 8.5 6.3s5.9-2.1 8.5-6.3" />
    <path d="M9.2 16.2v1.6a2.8 2.8 0 0 0 5.6 0v-1.8" />
    <path d="M12 16.5v3.5" />
    <path d="M6 8.5c1.6-1 3.6-1.5 6-1.5s4.4.5 6 1.5" />
  </svg>
);

/** Aroma: hidung */
export const IconNose = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M13.8 3.2c-.4 3.4-1.4 5.9-3.8 8.3-1 1-1.6 2-1.6 3.1 0 2.1 2 3.7 4.6 3.7 1.6 0 3.2-.6 4.3-1.6" />
    <path d="M8.4 18.4c1.3 1.4 3.1 2 5 1.8" />
    <circle cx="10.6" cy="17.4" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

/** Bunyi: telinga + gelombang */
export const IconEar = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M8 9.2a4 4 0 1 1 8 0c0 2.4-2.4 3.2-2.4 5.4 0 1.5-1.1 2.6-2.6 2.6-1.4 0-2.5-1-2.6-2.3" />
    <path d="M11.4 9.4a1.7 1.7 0 0 1 3.3 0c0 1.4-1.5 2-1.5 3.1" />
    <path d="M19.8 6.5c1 1.6 1 3.4 0 5" />
    <path d="M21.8 4.5c1.7 2.6 1.7 5.4 0 8" />
  </svg>
);

/** Manfaat: bohlam */
export const IconBulb = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M12 3a6.2 6.2 0 0 0-3.6 11.3c.7.5 1.1 1.3 1.1 2.2h5c0-.9.4-1.7 1.1-2.2A6.2 6.2 0 0 0 12 3Z" />
    <path d="M9.5 19h5" />
    <path d="M10.3 21.5h3.4" />
  </svg>
);

/* ===== Aksesori cerita ===== */

/** Bintang penghargaan (isi penuh) */
export const IconStar = (props: IconProps) => (
  <svg {...base({ ...props, strokeWidth: 1.6 })}>
    <path
      d="M12 3.5l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L4.2 9.2l5.4-.8L12 3.5Z"
      fill="currentColor"
      stroke="none"
    />
  </svg>
);

/** Bunga lima kelopak */
export const IconFlower = (props: IconProps) => (
  <svg {...base(props)}>
    <circle cx="12" cy="12" r="2.4" />
    <path d="M12 9.6c-1.6-2.2-1.4-5 .3-6.6 1.7 1.6 1.9 4.4.3 6.6Z" />
    <path d="M14.3 10.9c2.4-1.1 4.1-3.6 3.7-5.9-2.3.4-4.5 2.4-4.9 4.8" />
    <path d="M14.3 13.1c2.4 1.1 4.6 1 6-.8-2-1.2-4.4-1.2-5.9 0" />
    <path d="M9.7 13.1c-2.4 1.1-4.1 3.6-3.7 5.9 2.3-.4 4.5-2.4 4.9-4.8" />
    <path d="M9.7 10.9c-2.4-1.1-4.6-1-6 .8 2 1.2 4.4 1.2 5.9 0" />
  </svg>
);

/** Buku terbuka */
export const IconBookOpen = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M12 6.8C10.4 5.4 8.3 4.7 5 4.7H3v13.4h2c3.3 0 5.4.7 7 2.1" />
    <path d="M12 6.8c1.6-1.4 3.7-2.1 7-2.1h2v13.4h-2c-3.3 0-5.4.7-7 2.1" />
    <path d="M12 6.8v13.4" />
  </svg>
);

/** Pensil */
export const IconPencil = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M4.2 19.8l1-4.1L16.7 4.2a2.1 2.1 0 0 1 3 3L8.3 18.8l-4.1 1Z" />
    <path d="M14.8 6.1l3.1 3.1" />
    <path d="M4.2 19.8l3.5-3.5" />
  </svg>
);

/** Peta gagasan: simpul pusat + cabang */
export const IconMindMap = (props: IconProps) => (
  <svg {...base(props)}>
    <circle cx="12" cy="12" r="2.8" />
    <circle cx="5" cy="5.5" r="2" />
    <circle cx="19" cy="5.5" r="2" />
    <circle cx="5" cy="18.5" r="2" />
    <circle cx="19" cy="18.5" r="2" />
    <path d="M9.9 10.1 6.6 7.1M14.1 10.1l3.3-3M9.9 13.9l-3.3 3M14.1 13.9l3.3 3" />
  </svg>
);

/** Robot kecil ramah */
export const IconRobot = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M12 2.8v2.4" />
    <circle cx="12" cy="2.4" r="1.1" fill="currentColor" stroke="none" />
    <rect x="4.8" y="5.2" width="14.4" height="11.6" rx="3.4" />
    <circle cx="9.3" cy="10.6" r="1.3" fill="currentColor" stroke="none" />
    <circle cx="14.7" cy="10.6" r="1.3" fill="currentColor" stroke="none" />
    <path d="M9.5 13.9c1.6 1.1 3.4 1.1 5 0" />
    <path d="M8.6 16.8v1.6c0 1.2 1.5 2.2 3.4 2.2s3.4-1 3.4-2.2v-1.6" />
  </svg>
);

/** Target/nilai */
export const IconTarget = (props: IconProps) => (
  <svg {...base(props)}>
    <circle cx="12" cy="12" r="8.6" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
  </svg>
);

/** Hati */
export const IconHeart = (props: IconProps) => (
  <svg {...base({ ...props, strokeWidth: 1.7 })}>
    <path
      d="M12 20s-7.4-4.4-7.4-9.5A4.1 4.1 0 0 1 12 7.8a4.1 4.1 0 0 1 7.4 2.7C19.4 15.6 12 20 12 20Z"
      fill="currentColor"
      stroke="none"
    />
  </svg>
);

/** Kunci */
export const IconKey = (props: IconProps) => (
  <svg {...base(props)}>
    <circle cx="8" cy="8.5" r="4.2" />
    <path d="M11 11.5 20 20.5" />
    <path d="M17.2 17.7l2-2" />
    <path d="M14.6 15.1l2-2" />
  </svg>
);
