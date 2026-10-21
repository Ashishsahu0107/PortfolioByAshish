import { useState, useRef } from "react";
import { Check } from "lucide-react";

// Web Audio API mechanical pull switch sound (click transient + spring snap)
function playSwitchSound(isTurningOn) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // High frequency mechanical click
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = isTurningOn ? "triangle" : "sine";
    osc.frequency.setValueAtTime(isTurningOn ? 1250 : 920, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.04);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);

    // Spring resonance snap
    const snapOsc = ctx.createOscillator();
    const snapGain = ctx.createGain();

    snapOsc.type = "sawtooth";
    snapOsc.frequency.setValueAtTime(260, now + 0.015);
    snapOsc.frequency.exponentialRampToValueAtTime(65, now + 0.08);

    snapGain.gain.setValueAtTime(0.22, now + 0.015);
    snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    snapOsc.connect(snapGain);
    snapGain.connect(ctx.destination);

    snapOsc.start(now + 0.015);
    snapOsc.stop(now + 0.08);
  } catch {
    // Audio context may be restricted before first user interaction
  }
}

export default function HangingLamp({ isLightOn, onToggle }) {
  const [pullY, setPullY] = useState(0); // Current dynamic cord stretch in px
  const [isDragging, setIsDragging] = useState(false);
  const [hasTriggeredThisDrag, setHasTriggeredThisDrag] = useState(false);
  const dragStartYRef = useRef(0);
  const knobRef = useRef(null);

  const BASE_CORD_LENGTH = 75; // Cord length from shade aperture
  const TRIGGER_THRESHOLD = 28; // Drag distance required to activate

  // Handle pointer down (mouse or touch)
  const handlePointerDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}

    dragStartYRef.current = e.clientY;
    setIsDragging(true);
    setHasTriggeredThisDrag(false);
  };

  // Handle pointer drag
  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const rawDelta = e.clientY - dragStartYRef.current;
    if (rawDelta < 0) {
      setPullY(0);
      return;
    }

    // Elastic resistance curve (diminishing stretch past threshold)
    const dampedY = Math.min(50, Math.pow(rawDelta, 0.85));
    setPullY(dampedY);

    if (dampedY >= TRIGGER_THRESHOLD && !hasTriggeredThisDrag) {
      setHasTriggeredThisDrag(true);
      if (navigator.vibrate) navigator.vibrate(15);
    }
  };

  // Handle pointer release
  const handlePointerUp = (e) => {
    if (!isDragging) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    const totalDrag = e.clientY - dragStartYRef.current;

    // Trigger toggle if dragged past threshold OR quick tap/click (< 8px total movement)
    if (hasTriggeredThisDrag || Math.abs(totalDrag) < 8) {
      const nextState = !isLightOn;
      playSwitchSound(nextState);
      onToggle();
    }

    // Spring back
    setIsDragging(false);
    setPullY(0);
    setHasTriggeredThisDrag(false);
  };

  const handlePointerCancel = () => {
    setIsDragging(false);
    setPullY(0);
    setHasTriggeredThisDrag(false);
  };

  // Cord origin coordinates (hanging from center inside lampshade opening)
  const cordOriginX = 186;
  const cordOriginY = 166;
  const currentCordLength = BASE_CORD_LENGTH + pullY;
  const knobY = cordOriginY + currentCordLength;

  return (
    <div className="relative select-none pointer-events-none flex items-center justify-center">
      {/* ============================================================ */}
      {/* AMBIENT LIGHT CONE & GLOW OVERLAY                            */}
      {/* ============================================================ */}
      <div
        className={`fixed inset-0 pointer-events-none transition-opacity duration-700 ease-out ${
          isLightOn ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background:
            "radial-gradient(ellipse 950px 850px at 30% 35%, rgba(254, 240, 138, 0.14) 0%, rgba(245, 158, 11, 0.07) 45%, rgba(217, 119, 6, 0.02) 75%, transparent 100%)",
        }}
      />

      {/* Secondary directional beam highlighting the right-hand login card */}
      <div
        className={`fixed inset-0 pointer-events-none transition-opacity duration-700 ease-out ${
          isLightOn ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background:
            "radial-gradient(circle 650px at 68% 50%, rgba(254, 240, 138, 0.08) 0%, rgba(245, 158, 11, 0.03) 55%, transparent 85%)",
        }}
      />

      {/* ============================================================ */}
      {/* ARCHITECT DESK LAMP SVG ILLUSTRATION                         */}
      {/* ============================================================ */}
      <div className="relative z-30 w-[300px] sm:w-[350px] md:w-[380px] h-[400px] sm:h-[450px]">
        <svg
          viewBox="0 0 340 420"
          className="w-full h-full overflow-visible filter drop-shadow-2xl"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Soft oval shadow under desk base */}
            <radialGradient id="deskShadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#000000" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>

            {/* Dark Metallic Base Gradient */}
            <linearGradient id="baseMetal" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#18181b" />
              <stop offset="35%" stopColor="#3f3f46" />
              <stop offset="65%" stopColor="#27272a" />
              <stop offset="100%" stopColor="#09090b" />
            </linearGradient>

            {/* Base Lip Rim Highlight */}
            <linearGradient id="baseRim" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#27272a" />
              <stop offset="40%" stopColor="#52525b" />
              <stop offset="70%" stopColor="#3f3f46" />
              <stop offset="100%" stopColor="#18181b" />
            </linearGradient>

            {/* Brass / Gold Pivot Joint Gradient */}
            <linearGradient id="brassJoint" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="25%" stopColor="#f59e0b" />
              <stop offset="65%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>

            {/* Arm Rod Metal Gradient */}
            <linearGradient id="armMetal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3f3f46" />
              <stop offset="50%" stopColor="#18181b" />
              <stop offset="100%" stopColor="#09090b" />
            </linearGradient>

            {/* Lampshade Outer Matte Black with Soft Specular Curve */}
            <radialGradient id="shadeExterior" cx="45%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#3f3f46" />
              <stop offset="45%" stopColor="#27272a" />
              <stop offset="85%" stopColor="#18181b" />
              <stop offset="100%" stopColor="#09090b" />
            </radialGradient>

            {/* Lampshade Inner Cavity Reflector */}
            <radialGradient id="shadeInteriorLit" cx="45%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="35%" stopColor="#fef9c3" stopOpacity="0.95" />
              <stop offset="70%" stopColor="#fef08a" stopOpacity="0.8" />
              <stop offset="95%" stopColor="#e2e8f0" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.95" />
            </radialGradient>

            <radialGradient id="shadeInteriorUnlit" cx="45%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#cbd5e1" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.75" />
            </radialGradient>

            {/* Brass Trim Rim for Lampshade Edge */}
            <linearGradient id="shadeBrassRim" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#b45309" />
              <stop offset="25%" stopColor="#fef08a" />
              <stop offset="55%" stopColor="#f59e0b" />
              <stop offset="85%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#92400e" />
            </linearGradient>

            {/* Volumetric Angled Light Beam from Lampshade Aperture */}
            <linearGradient id="volumetricLight" x1="30%" y1="0%" x2="90%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
              <stop offset="18%" stopColor="#fef08a" stopOpacity="0.32" />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.14" />
              <stop offset="85%" stopColor="#d97706" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </linearGradient>

            {/* Bulb Glow Halo Filter */}
            <filter id="bulbGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Shade Outer Rim Glow Filter (When lamp is ON) */}
            <filter id="shadeOuterHalo" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="10" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.8" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ========================================================== */}
          {/* 1. CAST VOLUMETRIC LIGHT BEAM (DIAGONAL TOWARDS RIGHT)     */}
          {/* ========================================================== */}
          <g
            className={`transition-opacity duration-700 ease-out ${
              isLightOn ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Broad Atmospheric Light Cone */}
            <polygon
              points="148,162 225,178 370,410 110,410"
              fill="url(#volumetricLight)"
              style={{
                filter: "blur(7px)",
              }}
            />

            {/* Core Intense Inner Cone */}
            <polygon
              points="160,165 215,175 350,400 160,400"
              fill="url(#volumetricLight)"
              opacity="0.75"
            />

            {/* Floating Dust Motes in Light Beam (Cinematic Atmosphere) */}
            <circle cx="210" cy="220" r="1.5" fill="#fef08a" opacity="0.7" />
            <circle cx="245" cy="265" r="1.2" fill="#fff" opacity="0.6" />
            <circle cx="195" cy="305" r="1.6" fill="#fef08a" opacity="0.5" />
            <circle cx="270" cy="330" r="1.4" fill="#fff" opacity="0.55" />
            <circle cx="230" cy="360" r="1.2" fill="#fef08a" opacity="0.4" />
            <circle cx="295" cy="245" r="1" fill="#fff" opacity="0.45" />
          </g>

          {/* ========================================================== */}
          {/* 2. BASE & DESK SHADOW                                      */}
          {/* ========================================================== */}
          {/* Soft Ground Shadow */}
          <ellipse cx="145" cy="392" rx="68" ry="14" fill="url(#deskShadow)" />

          {/* Base Rim Cylinder / Bevel */}
          <ellipse cx="145" cy="383" rx="50" ry="11" fill="url(#baseRim)" />
          <path
            d="M95 383 C95 391 117 396 145 396 C173 396 195 391 195 383 L195 386 C195 394 173 399 145 399 C117 399 95 394 95 386 Z"
            fill="url(#baseMetal)"
          />

          {/* Base Top Plate with Circular Metallic Specular */}
          <ellipse cx="145" cy="382" rx="47" ry="9.5" fill="url(#baseMetal)" stroke="#3f3f46" strokeWidth="1" />
          <ellipse cx="145" cy="382" rx="36" ry="7" fill="none" stroke="#27272a" strokeWidth="1" />

          {/* Base Center Stem Mount */}
          <ellipse cx="145" cy="381" rx="14" ry="4" fill="#18181b" stroke="#52525b" strokeWidth="1" />

          {/* ========================================================== */}
          {/* 3. LOWER ARM & ARTICULATED HINGE JOINTS                    */}
          {/* ========================================================== */}
          {/* Lower Arm Pivot Joint at Base */}
          <g>
            {/* Outer Joint Outer Gold/Brass Ring */}
            <circle cx="145" cy="371" r="10" fill="url(#brassJoint)" stroke="#92400e" strokeWidth="1" />
            {/* Joint Core Pin */}
            <circle cx="145" cy="371" r="5" fill="#18181b" />
            <circle cx="145" cy="371" r="2.5" fill="url(#brassJoint)" />
          </g>

          {/* Lower Arm Twin Parallel Rods (Leaning Left towards Elbow) */}
          <g>
            {/* Primary Rod */}
            <line x1="142" y1="368" x2="122" y2="258" stroke="url(#armMetal)" strokeWidth="4.5" strokeLinecap="round" />
            <line x1="142" y1="368" x2="122" y2="258" stroke="#52525b" strokeWidth="1.2" strokeLinecap="round" />

            {/* Secondary Parallel Strut */}
            <line x1="148" y1="371" x2="128" y2="261" stroke="url(#armMetal)" strokeWidth="3" strokeLinecap="round" />
            <line x1="148" y1="371" x2="128" y2="261" stroke="#3f3f46" strokeWidth="1" strokeLinecap="round" />

            {/* Arm Stabilizer Ring / Clip in middle */}
            <line x1="134" y1="316" x2="139" y2="317" stroke="url(#brassJoint)" strokeWidth="2.5" strokeLinecap="round" />
          </g>

          {/* Middle Elbow Joint */}
          <g>
            <circle cx="125" cy="257" r="10.5" fill="url(#brassJoint)" stroke="#92400e" strokeWidth="1" />
            <circle cx="125" cy="257" r="5.5" fill="#18181b" />
            <circle cx="125" cy="257" r="2.8" fill="url(#brassJoint)" />
          </g>

          {/* ========================================================== */}
          {/* 4. UPPER ARM (Extending from Elbow to Shade Socket)        */}
          {/* ========================================================== */}
          <g>
            {/* Primary Upper Rod */}
            <line x1="126" y1="254" x2="164" y2="166" stroke="url(#armMetal)" strokeWidth="4.5" strokeLinecap="round" />
            <line x1="126" y1="254" x2="164" y2="166" stroke="#52525b" strokeWidth="1.2" strokeLinecap="round" />

            {/* Secondary Upper Strut */}
            <line x1="128" y1="259" x2="168" y2="170" stroke="url(#armMetal)" strokeWidth="3" strokeLinecap="round" />

            {/* Arm Stabilizer Ring */}
            <line x1="146" y1="210" x2="149" y2="213" stroke="url(#brassJoint)" strokeWidth="2.5" strokeLinecap="round" />
          </g>

          {/* Shade Pivot Joint Bracket */}
          <g>
            <circle cx="166" cy="168" r="8" fill="url(#brassJoint)" stroke="#92400e" strokeWidth="1" />
            <circle cx="166" cy="168" r="3.5" fill="#18181b" />
          </g>

          {/* ========================================================== */}
          {/* 5. ARCHITECTURAL DOME LAMPSHADE (HEAD)                      */}
          {/* ========================================================== */}
          {/* Outer Soft Glow on Shade Top when ON (Matches Image 2) */}
          <path
            d="M138 163 C138 128 152 98 184 98 C216 98 230 134 230 172 Z"
            fill="none"
            stroke="#ffffff"
            strokeWidth="8"
            className={`transition-opacity duration-500 pointer-events-none ${
              isLightOn ? "opacity-35" : "opacity-0"
            }`}
            style={{ filter: "blur(8px)" }}
          />

          {/* Lampshade Outer Shell (Sleek Matte Black Dome) */}
          <path
            d="M141 161 C140 126 154 99 184 99 C215 99 229 133 229 171 C229 171 202 181 184 179 C164 177 141 161 141 161 Z"
            fill="url(#shadeExterior)"
            stroke="#27272a"
            strokeWidth="1.5"
          />

          {/* Specular Curved Sheen on Dome Exterior */}
          <path
            d="M152 145 C154 120 166 106 184 105"
            stroke="rgba(255, 255, 255, 0.28)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Lampshade Inner Cavity Reflector (Visible from tilted bottom) */}
          <ellipse
            cx="185"
            cy="170"
            rx="44"
            ry="14"
            transform="rotate(11 185 170)"
            fill={isLightOn ? "url(#shadeInteriorLit)" : "url(#shadeInteriorUnlit)"}
            className="transition-colors duration-300"
          />

          {/* Iconic Golden / Brass Rim Trim around Lampshade Aperture */}
          <ellipse
            cx="185"
            cy="170"
            rx="44"
            ry="14"
            transform="rotate(11 185 170)"
            fill="none"
            stroke="url(#shadeBrassRim)"
            strokeWidth="3.2"
          />
          <ellipse
            cx="185"
            cy="170"
            rx="43"
            ry="13.2"
            transform="rotate(11 185 170)"
            fill="none"
            stroke="#fef08a"
            strokeWidth="1"
            opacity="0.8"
          />

          {/* ========================================================== */}
          {/* 6. LIGHT BULB (Inside center of cavity)                    */}
          {/* ========================================================== */}
          {/* Intense Light Core Bloom when ON */}
          <circle
            cx="186"
            cy="162"
            r="16"
            fill="#ffffff"
            className={`transition-opacity duration-300 ${
              isLightOn ? "opacity-100" : "opacity-0"
            }`}
            style={{
              filter: "drop-shadow(0 0 10px #ffffff) drop-shadow(0 0 22px #fef08a)",
            }}
          />

          {/* Light Bulb Glass Body */}
          <circle
            cx="186"
            cy="163"
            r="8.5"
            fill={isLightOn ? "#ffffff" : "#f1f5f9"}
            stroke={isLightOn ? "#fde047" : "#94a3b8"}
            strokeWidth="1.5"
            className="transition-colors duration-300"
          />

          {/* Bulb Filament highlight */}
          {isLightOn && (
            <circle cx="186" cy="163" r="4.5" fill="#fffbeb" />
          )}

          {/* ========================================================== */}
          {/* 7. HANGING PULL CORD & PULL KNOB (Interactive)             */}
          {/* ========================================================== */}
          {/* Slender White/Silver Pull Cord */}
          <line
            x1={cordOriginX}
            y1={cordOriginY}
            x2={cordOriginX}
            y2={knobY}
            stroke={isLightOn ? "#ffffff" : "#e4e4e7"}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeDasharray={isLightOn ? "none" : "none"}
            className="transition-[y2] duration-75"
            style={{
              filter: isLightOn ? "drop-shadow(0 0 4px rgba(255,255,255,0.8))" : "none",
            }}
          />

          {/* Translucent Soft Glow Disc around the pull knob (Matches Image 2) */}
          <circle
            cx={cordOriginX}
            cy={knobY + 8}
            r="15"
            fill={isLightOn ? "rgba(254, 240, 138, 0.22)" : "rgba(255, 255, 255, 0.12)"}
            className="transition-all duration-300"
          />

          {/* Tear-drop / Bell-shaped Golden Brass Pull Knob */}
          <g transform={`translate(${cordOriginX - 6}, ${knobY})`}>
            {/* Top Collar */}
            <rect x="4.5" y="0" width="3" height="2" rx="0.8" fill="url(#brassJoint)" />
            {/* Teardrop Bell Body */}
            <path
              d="M6 2 C3.5 2 2 5.5 2 9 C2 12.5 3.8 14.5 6 14.5 C8.2 14.5 10 12.5 10 9 C10 5.5 8.5 2 6 2 Z"
              fill="url(#brassJoint)"
              stroke="#b45309"
              strokeWidth="0.8"
            />
            {/* Specular Highlight Line on Knob */}
            <path d="M4 6 C3.8 7.5 4.2 10.5 5.5 12" stroke="#ffffff" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
            {/* Bottom Tip Pearl */}
            <circle cx="6" cy="14.5" r="1.5" fill="#fef08a" />
          </g>
        </svg>

        {/* ============================================================ */}
        {/* INVISIBLE DRAG HIT-AREA FOR PULL CORD & KNOB                 */}
        {/* ============================================================ */}
        <div
          ref={knobRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          tabIndex={0}
          role="button"
          aria-label="Desk lamp pull cord switch: Drag down or click to turn light on or off"
          title="Grab and pull cord down to switch light"
          className="absolute z-50 pointer-events-auto cursor-grab active:cursor-grabbing focus:outline-hidden"
          style={{
            left: `${cordOriginX * (100 / 340)}%`,
            top: `${(knobY / 420) * 100}%`,
            transform: `translate(-50%, -20%) scale(${isDragging ? 1.15 : 1})`,
            transition: isDragging ? "none" : "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
            touchAction: "none",
            width: "56px",
            height: "56px",
          }}
        >
          {/* Subtle Halo Pulsing on Hover */}
          <div
            className={`size-full rounded-full transition-all flex items-center justify-center ${
              isDragging
                ? "bg-amber-400/35 ring-4 ring-amber-400/50 scale-110"
                : "hover:bg-amber-400/20"
            }`}
          />

          {/* Floating Instruction Pill (Guides user when light is OFF) */}
          {!isLightOn && !isDragging && (
            <div className="absolute left-10 top-1/2 -translate-y-1/2 whitespace-nowrap pointer-events-none animate-bounce">
              <div className="flex items-center gap-1.5 rounded-full bg-zinc-900/90 border border-amber-500/40 px-3 py-1 text-[11px] font-mono font-medium text-amber-300 shadow-xl backdrop-blur-md">
                <span className="size-2 rounded-full bg-amber-400 animate-ping inline-block" />
                <span>Pull cord to illuminate</span>
              </div>
            </div>
          )}

          {/* Dragging State Feedback */}
          {isDragging && (
            <div className="absolute left-10 top-1/2 -translate-y-1/2 whitespace-nowrap pointer-events-none">
              <div
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-mono font-bold transition-all ${
                  hasTriggeredThisDrag
                    ? "bg-amber-400 text-zinc-950 shadow-lg scale-105"
                    : "bg-zinc-800 text-zinc-300 border border-zinc-700"
                }`}
              >
                {hasTriggeredThisDrag ? (
                  <span className="inline-flex items-center gap-1">
                    <Check size={11} />
                    <span>Release to toggle</span>
                  </span>
                ) : (
                  "Pull down..."
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
