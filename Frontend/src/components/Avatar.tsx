const PALETTE = [
  "bg-indigo-100 text-indigo-700",
  "bg-violet-100 text-violet-700",
  "bg-sky-100 text-sky-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
];

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function colorFor(name: string) {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return PALETTE[hash % PALETTE.length];
}

interface AvatarProps {
  name: string;
  size?: "sm" | "md";
}

export default function Avatar({ name, size = "md" }: AvatarProps) {
  const dimensions = size === "sm" ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm";

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold ${dimensions} ${colorFor(
        name
      )}`}
      aria-hidden="true"
    >
      {initials(name) || "?"}
    </span>
  );
}
