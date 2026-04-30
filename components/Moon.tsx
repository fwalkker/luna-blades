type Props = {
  size?: number;
  className?: string;
  phase?: "full" | "crescent" | "eclipse";
};

export default function Moon({ size = 220, className = "", phase = "crescent" }: Props) {
  const id = `m-${phase}-${size}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={className}
      aria-hidden
    >
      <defs>
        <radialGradient id={`${id}-glow`} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#E8ECF1" stopOpacity="0.18" />
          <stop offset="60%" stopColor="#8AA0C8" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-surface`} cx="40%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#D9DEE8" />
          <stop offset="60%" stopColor="#9BA5BB" />
          <stop offset="100%" stopColor="#3E4659" />
        </radialGradient>
        <radialGradient id={`${id}-shadow`} cx="80%" cy="50%" r="80%">
          <stop offset="40%" stopColor="#0A0E14" stopOpacity="0" />
          <stop offset="80%" stopColor="#0A0E14" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#0A0E14" stopOpacity="1" />
        </radialGradient>
      </defs>
      {/* Atmospheric halo */}
      <circle cx="100" cy="100" r="100" fill={`url(#${id}-glow)`} />
      {/* Moon surface */}
      <circle cx="100" cy="100" r="62" fill={`url(#${id}-surface)`} />
      {/* Craters */}
      <g fill="#5C667A" opacity="0.55">
        <circle cx="78" cy="84" r="6" />
        <circle cx="110" cy="76" r="3.5" />
        <circle cx="88" cy="116" r="5" />
        <circle cx="120" cy="120" r="4" />
        <circle cx="68" cy="105" r="2.5" />
        <circle cx="135" cy="92" r="2" />
        <circle cx="100" cy="98" r="3" />
      </g>
      <g fill="#2A3142" opacity="0.4">
        <circle cx="78" cy="84" r="2.4" />
        <circle cx="88" cy="116" r="2" />
        <circle cx="120" cy="120" r="1.6" />
      </g>
      {/* Phase shadow */}
      {phase === "crescent" && <circle cx="100" cy="100" r="62" fill={`url(#${id}-shadow)`} />}
      {phase === "eclipse" && <circle cx="100" cy="100" r="62" fill="#0A0E14" />}
      {/* Outer hairline ring */}
      <circle cx="100" cy="100" r="62" fill="none" stroke="rgba(232,236,241,0.12)" strokeWidth="0.5" />
    </svg>
  );
}
