import { motion } from "framer-motion";

const tailVariants = {
  initial: { rotate: -6, scale: 1 },
  wave: {
    rotate: [0, -8, 2, -6, 0],
    transition: {
      repeat: Infinity,
      repeatDelay: 0.4,
      duration: 2.2,
      ease: "easeInOut",
    },
  },
};

export default function FoxGlyph() {
  return (
    <motion.svg
      width="100%"
      height="100%"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial="initial"
      animate="wave"
      variants={tailVariants}
    >
      <defs>
        <linearGradient id="foxGradient" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
          <stop stopColor="#769AC5" />
          <stop offset="1" stopColor="#F4D29A" />
        </linearGradient>
        <radialGradient id="orb" cx="0.5" cy="0.5" r="0.7">
          <stop stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="96" fill="#111a25" stroke="url(#foxGradient)" strokeWidth="6" opacity="0.55" />
      <circle cx="75" cy="60" r="25" fill="url(#orb)" opacity="0.6" />
      <path
        d="M34 96.5c28-46 86-52 134 0-34 22-40 52-67 52s-45.5-30-67-52Z"
        fill="url(#foxGradient)"
        opacity="0.9"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="4"
      />
      <path
        d="M70 70c16-12 42-12 58 0 8 7 12 18 10 28-2 10-10 20-24 28-6 3-12 5-18 5s-12-2-18-5c-14-8-22-18-24-28-2-10 2-21 10-28Z"
        fill="#0e1228"
        stroke="url(#foxGradient)"
        strokeWidth="4"
      />
      <motion.path
        d="M152 115c-10 10-18 22-26 32-8 10-24 10-32 0-3-4-4.5-10-2.2-15 2.4-4.9 7.7-8 13.2-8h10c14 0 26.5-4 37-9Z"
        fill="url(#foxGradient)"
        opacity="0.9"
        variants={tailVariants}
      />
      <circle cx="86" cy="92" r="5" fill="#f6fbff" />
      <circle cx="116" cy="92" r="5" fill="#f6fbff" />
      <path d="M90 116c6 4 14 4 20 0" stroke="#e8edff" strokeWidth="3" strokeLinecap="round" />
    </motion.svg>
  );
}
