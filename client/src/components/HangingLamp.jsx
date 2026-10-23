import { useState, useRef, useEffect } from "react";
import { Check, Move } from "lucide-react";
import { LOGIN_THEMES } from "./loginThemes";

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

export default function HangingLamp({
  isLightOn,
  onToggle,
  theme = LOGIN_THEMES[0],
}) {
  // Pull cord stretch state
  const [pullY, setPullY] = useState(0);
  const [isCordDragging, setIsCordDragging] = useState(false);
  const [hasTriggeredThisDrag, setHasTriggeredThisDrag] = useState(false);
  const cordDragStartYRef = useRef(0);
  const knobRef = useRef(null);

  // Lamp freeform drag-and-drop state before lighting
  const [lampOffset, setLampOffset] = useState({ x: 0, y: 0 });
  const [isLampDragging, setIsLampDragging] = useState(false);
  const lampDragRef = useRef({ startX: 0, startY: 0, origX: 0, origY: 0 });

  const BASE_CORD_LENGTH = 75; // Cord length from shade aperture
  const TRIGGER_THRESHOLD = 28; // Drag distance required to activate

  // Whenever lamp is lit, smoothly snap back to original resting position (x:0, y:0)!
  useEffect(() => {
    if (isLightOn) {
      setLampOffset({ x: 0, y: 0 });
      setIsLampDragging(false);
    }
  }, [isLightOn]);

  // Handle Lamp Freeform Dragging (only allowed before lamp is lit)
  const handleLampPointerDown = (e) => {
    if (isLightOn) return; // Locked to original position while lit
    if (e.target.closest("[data-cord-switch]")) return; // Cord handles its own pointer events

    e.preventDefault();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}

    lampDragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: lampOffset.x,
      origY: lampOffset.y,
    };
    setIsLampDragging(true);
  };

  const handleLampPointerMove = (e) => {
    if (!isLampDragging || isLightOn) return;
    const dx = e.clientX - lampDragRef.current.startX;
    const dy = e.clientY - lampDragRef.current.startY;
    setLampOffset({
      x: lampDragRef.current.origX + dx,
      y: lampDragRef.current.origY + dy,
    });
  };

  const handleLampPointerUp = (e) => {
    if (!isLampDragging) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    setIsLampDragging(false);
  };

  // Handle Pull Cord Interaction
  const handleCordPointerDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}

    cordDragStartYRef.current = e.clientY;
    setIsCordDragging(true);
    setHasTriggeredThisDrag(false);
  };

  const handleCordPointerMove = (e) => {
    if (!isCordDragging) return;
    const rawDelta = e.clientY - cordDragStartYRef.current;
    if (rawDelta < 0) {
      setPullY(0);
      return;
    }

    // Elastic resistance curve
    const dampedY = Math.min(50, Math.pow(rawDelta, 0.85));
    setPullY(dampedY);

    if (dampedY >= TRIGGER_THRESHOLD && !hasTriggeredThisDrag) {
      setHasTriggeredThisDrag(true);
      if (navigator.vibrate) navigator.vibrate(15);
    }
  };

  const handleCordPointerUp = (e) => {
    if (!isCordDragging) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    const totalDrag = e.clientY - cordDragStartYRef.current;

    // Trigger toggle if dragged past threshold OR quick tap/click (< 8px total movement)
    if (hasTriggeredThisDrag || Math.abs(totalDrag) < 8) {
      const nextState = !isLightOn;
      playSwitchSound(nextState);
      onToggle();
    }

    // Spring back cord
    setIsCordDragging(false);
    setPullY(0);
    setHasTriggeredThisDrag(false);
  };

  const handleCordPointerCancel = () => {
    setIsCordDragging(false);
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
          background: theme.ambientGlow,
        }}
      />

      {/* Secondary directional beam highlighting the right-hand login card */}
      <div
        className={`fixed inset-0 pointer-events-none transition-opacity duration-700 ease-out ${
          isLightOn ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background: theme.secondaryGlow,
        }}
      />

      {/* ============================================================ */}
      {/* ARCHITECT DESK LAMP FIXTURE (DRAGGABLE BEFORE LIGHTING)       */}
      {/* ============================================================ */}
      <div
        onPointerDown={handleLampPointerDown}
        onPointerMove={handleLampPointerMove}
        onPointerUp={handleLampPointerUp}
        onPointerCancel={handleLampPointerUp}
        className="relative z-30 w-[300px] sm:w-[350px] md:w-[380px] h-[400px] sm:h-[450px] pointer-events-auto select-none"
        style={{
          transform: `translate3d(${lampOffset.x}px, ${lampOffset.y}px, 0)`,
          transition: isLampDragging
            ? "none"
            : "transform 0.75s cubic-bezier(0.16, 1, 0.3, 1)",
          cursor: isLightOn ? "default" : isLampDragging ? "grabbing" : "grab",
          touchAction: "none",
        }}
      >
        {/* Floating Drag Hint (Visible when lamp is UNLIT to guide user) */}
        {!isLightOn && (
          <div
            className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none transition-all duration-200 z-40"
            style={{ opacity: isLampDragging ? 0.95 : 0.75 }}
          >
            <div className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900/90 border border-zinc-700/80 px-3 py-1 text-[11px] font-mono text-zinc-200 shadow-xl backdrop-blur-md">
              <Move size={11} style={{ color: theme.glow }} />
              <span>
                {isLampDragging ? "Moving lamp..." : "Drag lamp anywhere"}
              </span>
            </div>
          </div>
        )}

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

            {/* Dynamic Joint Color Gradient (Adapts to Active Theme) */}
            <linearGradient id="brassJoint" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={theme.lampTrimLight || "#fef08a"} />
              <stop offset="35%" stopColor={theme.lampTrim || "#f59e0b"} />
              <stop offset="75%" stopColor="#3f3f46" />
              <stop offset="100%" stopColor="#18181b" />
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
              <stop offset="35%" stopColor={theme.lightSoft} stopOpacity="0.95" />
              <stop offset="70%" stopColor={theme.glow} stopOpacity="0.8" />
              <stop offset="95%" stopColor="#e2e8f0" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.95" />
            </radialGradient>

            <radialGradient id="shadeInteriorUnlit" cx="45%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#cbd5e1" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.75" />
            </radialGradient>

            {/* Dynamic Trim Rim for Lampshade Edge */}
            <linearGradient id="shadeBrassRim" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#27272a" />
              <stop offset="25%" stopColor={theme.lampTrimLight || "#fef08a"} />
              <stop offset="55%" stopColor={theme.lampTrim || "#f59e0b"} />
              <stop offset="85%" stopColor="#3f3f46" />
              <stop offset="100%" stopColor="#18181b" />
            </linearGradient>

            {/* Volumetric Angled Light Beam from Lampshade Aperture */}
            <linearGradient id="volumetricLight" x1="30%" y1="0%" x2="90%" y2="100%">
              <stop offset="0%" stopColor={theme.beamGradient.stop0} />
              <stop offset="18%" stopColor={theme.beamGradient.stop1} />
              <stop offset="50%" stopColor={theme.beamGradient.stop2} />
              <stop offset="85%" stopColor={theme.beamGradient.stop3} />
              <stop offset="100%" stopColor={theme.beamGradient.stop4} />
            </linearGradient>
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

            {/* Floating Dust Motes in Light Beam (Themed Atmosphere) */}
            <circle cx="210" cy="220" r="1.5" fill={theme.lightSoft} opacity="0.75" />
            <circle cx="245" cy="265" r="1.2" fill="#fff" opacity="0.6" />
            <circle cx="195" cy="305" r="1.6" fill={theme.glow} opacity="0.6" />
            <circle cx="270" cy="330" r="1.4" fill="#fff" opacity="0.55" />
            <circle cx="230" cy="360" r="1.2" fill={theme.lightSoft} opacity="0.5" />
            <circle cx="295" cy="245" r="1" fill="#fff" opacity="0.45" />
          </g>

          {/* ========================================================== */}
          {/* 2. BASE & DESK SHADOW                                      */}
          {/* ========================================================== */}
          <ellipse cx="145" cy="392" rx="68" ry="14" fill="url(#deskShadow)" />
          <ellipse cx="145" cy="383" rx="50" ry="11" fill="url(#baseRim)" />
          <path
            d="M95 383 C95 391 117 396 145 396 C173 396 195 391 195 383 L195 386 C195 394 173 399 145 399 C117 399 95 394 95 386 Z"
            fill="url(#baseMetal)"
          />
          <ellipse cx="145" cy="382" rx="47" ry="9.5" fill="url(#baseMetal)" stroke="#3f3f46" strokeWidth="1" />
          <ellipse cx="145" cy="382" rx="36" ry="7" fill="none" stroke="#27272a" strokeWidth="1" />
          <ellipse cx="145" cy="381" rx="14" ry="4" fill="#18181b" stroke="#52525b" strokeWidth="1" />

          {/* ========================================================== */}
          {/* 3. LOWER ARM & ARTICULATED HINGE JOINTS                    */}
          {/* ========================================================== */}
          <g>
            <circle cx="145" cy="371" r="10" fill="url(#brassJoint)" stroke="#27272a" strokeWidth="1" />
            <circle cx="145" cy="371" r="5" fill="#18181b" />
            <circle cx="145" cy="371" r="2.5" fill="url(#brassJoint)" />
          </g>

          <g>
            <line x1="142" y1="368" x2="122" y2="258" stroke="url(#armMetal)" strokeWidth="4.5" strokeLinecap="round" />
            <line x1="142" y1="368" x2="122" y2="258" stroke="#52525b" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="148" y1="371" x2="128" y2="261" stroke="url(#armMetal)" strokeWidth="3" strokeLinecap="round" />
            <line x1="148" y1="371" x2="128" y2="261" stroke="#3f3f46" strokeWidth="1" strokeLinecap="round" />
            <line x1="134" y1="316" x2="139" y2="317" stroke="url(#brassJoint)" strokeWidth="2.5" strokeLinecap="round" />
          </g>

          <g>
            <circle cx="125" cy="257" r="10.5" fill="url(#brassJoint)" stroke="#27272a" strokeWidth="1" />
            <circle cx="125" cy="257" r="5.5" fill="#18181b" />
            <circle cx="125" cy="257" r="2.8" fill="url(#brassJoint)" />
          </g>

          {/* ========================================================== */}
          {/* 4. UPPER ARM (Extending from Elbow to Shade Socket)        */}
          {/* ========================================================== */}
          <g>
            <line x1="126" y1="254" x2="164" y2="166" stroke="url(#armMetal)" strokeWidth="4.5" strokeLinecap="round" />
            <line x1="126" y1="254" x2="164" y2="166" stroke="#52525b" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="128" y1="259" x2="168" y2="170" stroke="url(#armMetal)" strokeWidth="3" strokeLinecap="round" />
            <line x1="146" y1="210" x2="149" y2="213" stroke="url(#brassJoint)" strokeWidth="2.5" strokeLinecap="round" />
          </g>

          <g>
            <circle cx="166" cy="168" r="8" fill="url(#brassJoint)" stroke="#27272a" strokeWidth="1" />
            <circle cx="166" cy="168" r="3.5" fill="#18181b" />
          </g>

          {/* ========================================================== */}
          {/* 5. ARCHITECTURAL DOME LAMPSHADE (HEAD)                      */}
          {/* ========================================================== */}
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

          <path
            d="M141 161 C140 126 154 99 184 99 C215 99 229 133 229 171 C229 171 202 181 184 179 C164 177 141 161 141 161 Z"
            fill="url(#shadeExterior)"
            stroke="#27272a"
            strokeWidth="1.5"
          />

          <path
            d="M152 145 C154 120 166 106 184 105"
            stroke="rgba(255, 255, 255, 0.28)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          <ellipse
            cx="185"
            cy="170"
            rx="44"
            ry="14"
            transform="rotate(11 185 170)"
            fill={isLightOn ? "url(#shadeInteriorLit)" : "url(#shadeInteriorUnlit)"}
            className="transition-colors duration-300"
          />

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
            stroke={theme.lampTrimLight || "#fef08a"}
            strokeWidth="1"
            opacity="0.8"
          />

          {/* ========================================================== */}
          {/* 6. LIGHT BULB (Inside center of cavity)                    */}
          {/* ========================================================== */}
          <circle
            cx="186"
            cy="162"
            r="16"
            fill="#ffffff"
            className={`transition-opacity duration-300 ${
              isLightOn ? "opacity-100" : "opacity-0"
            }`}
            style={{
              filter: `drop-shadow(0 0 10px #ffffff) drop-shadow(0 0 24px ${theme.glow})`,
            }}
          />

          <circle
            cx="186"
            cy="163"
            r="8.5"
            fill={isLightOn ? "#ffffff" : "#f1f5f9"}
            stroke={isLightOn ? theme.glow : "#94a3b8"}
            strokeWidth="1.5"
            className="transition-colors duration-300"
          />

          {isLightOn && (
            <circle cx="186" cy="163" r="4.5" fill="#fffbeb" />
          )}

          {/* ========================================================== */}
          {/* 7. HANGING PULL CORD & PULL KNOB (Interactive)             */}
          {/* ========================================================== */}
          <line
            x1={cordOriginX}
            y1={cordOriginY}
            x2={cordOriginX}
            y2={knobY}
            stroke={isLightOn ? "#ffffff" : "#e4e4e7"}
            strokeWidth="1.8"
            strokeLinecap="round"
            className="transition-[y2] duration-75"
            style={{
              filter: isLightOn
                ? `drop-shadow(0 0 4px ${theme.glow})`
                : "none",
            }}
          />

          {/* Soft Glow Disc around the pull knob */}
          <circle
            cx={cordOriginX}
            cy={knobY + 8}
            r="15"
            fill={isLightOn ? theme.cordKnobGlow : "rgba(255, 255, 255, 0.12)"}
            className="transition-all duration-300"
          />

          {/* Tear-drop / Bell-shaped Golden Brass Pull Knob */}
          <g transform={`translate(${cordOriginX - 6}, ${knobY})`}>
            <rect x="4.5" y="0" width="3" height="2" rx="0.8" fill="url(#brassJoint)" />
            <path
              d="M6 2 C3.5 2 2 5.5 2 9 C2 12.5 3.8 14.5 6 14.5 C8.2 14.5 10 12.5 10 9 C10 5.5 8.5 2 6 2 Z"
              fill="url(#brassJoint)"
              stroke="#27272a"
              strokeWidth="0.8"
            />
            <path d="M4 6 C3.8 7.5 4.2 10.5 5.5 12" stroke="#ffffff" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
            <circle cx="6" cy="14.5" r="1.5" fill={theme.lampTrimLight || "#fef08a"} />
          </g>
        </svg>

        {/* ============================================================ */}
        {/* DRAG HIT-AREA FOR PULL CORD & KNOB                           */}
        {/* ============================================================ */}
        <div
          ref={knobRef}
          data-cord-switch="true"
          onPointerDown={handleCordPointerDown}
          onPointerMove={handleCordPointerMove}
          onPointerUp={handleCordPointerUp}
          onPointerCancel={handleCordPointerCancel}
          tabIndex={0}
          role="button"
          aria-label="Desk lamp pull cord switch: Drag down or click to turn light on or off"
          title="Pull cord down or click to switch light"
          className="absolute z-50 pointer-events-auto cursor-grab active:cursor-grabbing focus:outline-hidden"
          style={{
            left: `${cordOriginX * (100 / 340)}%`,
            top: `${(knobY / 420) * 100}%`,
            transform: `translate(-50%, -20%) scale(${isCordDragging ? 1.15 : 1})`,
            transition: isCordDragging
              ? "none"
              : "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
            touchAction: "none",
            width: "56px",
            height: "56px",
          }}
        >
          {/* Subtle Halo Pulsing on Hover */}
          <div
            className={`size-full rounded-full transition-all flex items-center justify-center ${
              isCordDragging
                ? "ring-4 scale-110"
                : "hover:bg-white/10"
            }`}
            style={{
              backgroundColor: isCordDragging ? theme.cordKnobGlow : undefined,
              boxShadow: isCordDragging ? `0 0 12px ${theme.glow}` : undefined,
            }}
          />

          {/* Floating Instruction Pill (Guides user when light is OFF) */}
          {!isLightOn && !isCordDragging && (
            <div className="absolute left-10 top-1/2 -translate-y-1/2 whitespace-nowrap pointer-events-none animate-bounce">
              <div
                className="flex items-center gap-1.5 rounded-full bg-zinc-900/90 border px-3 py-1 text-[11px] font-mono font-medium shadow-xl backdrop-blur-md"
                style={{
                  borderColor: theme.cardBorder.replace("border-", ""),
                  color: theme.glow,
                }}
              >
                <span
                  className="size-2 rounded-full animate-ping inline-block"
                  style={{ backgroundColor: theme.glow }}
                />
                <span>Pull cord to illuminate</span>
              </div>
            </div>
          )}

          {/* Dragging State Feedback */}
          {isCordDragging && (
            <div className="absolute left-10 top-1/2 -translate-y-1/2 whitespace-nowrap pointer-events-none">
              <div
                className="rounded-full px-2.5 py-0.5 text-[10px] font-mono font-bold transition-all shadow-lg"
                style={{
                  backgroundColor: hasTriggeredThisDrag ? theme.glow : "#27272a",
                  color: hasTriggeredThisDrag ? "#09090b" : "#e4e4e7",
                }}
              >
                {hasTriggeredThisDrag ? (
                  <span className="inline-flex items-center gap-1">
                    <Check size={11} />
                    <span>Release to snap back & light up</span>
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
