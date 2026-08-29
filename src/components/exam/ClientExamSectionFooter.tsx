import React, { useEffect, useState } from "react";

const formatFooterClock = (date: Date, includeSeconds = false) =>
  new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: includeSeconds ? "2-digit" : undefined,
    hour12: false,
  }).format(date);

export interface ClientExamFooterSection {
  label: string;
  items: number[];
  completedItems?: number[];
}

export interface ClientExamSectionFooterProps {
  sections: ClientExamFooterSection[];
  activeItem: number;
  onItemSelect: (item: number) => void;
  flaggedItems?: Set<number> | number[];
  onPreviousItem?: () => void;
  onNextItem?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
  itemNoun?: string;
  showNavigationArrows?: boolean;
  showSystemBar?: boolean;
  soundEnabled?: boolean;
  soundActive?: boolean;
  soundVolume?: number;
  onSoundToggle?: () => void;
  onSoundVolumeChange?: (volume: number) => void;
  onExit?: () => void;
}

const ClientExamSectionFooter: React.FC<ClientExamSectionFooterProps> = ({
  sections,
  activeItem,
  onItemSelect,
  flaggedItems,
  itemNoun = "Question",
  showSystemBar = true,
  soundEnabled = false,
  soundVolume = 1,
  onSoundVolumeChange,
  onExit,
}) => {
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [clockNow, setClockNow] = useState(() => new Date());

  useEffect(() => {
    let timeoutId: number | undefined;

    const syncClock = () => {
      const now = new Date();
      setClockNow(now);
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(syncClock, 1000 - now.getMilliseconds());
    };

    const syncVisibleClock = () => {
      if (!document.hidden) syncClock();
    };

    syncClock();
    window.addEventListener("focus", syncClock);
    document.addEventListener("visibilitychange", syncVisibleClock);

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("focus", syncClock);
      document.removeEventListener("visibilitychange", syncVisibleClock);
    };
  }, []);

  const currentTime = formatFooterClock(clockNow);

  const flaggedSet = new Set<number>(
    Array.isArray(flaggedItems)
      ? flaggedItems
      : flaggedItems instanceof Set
        ? Array.from(flaggedItems)
        : []
  );

  const activeSection =
    sections.find((section) => section.items.includes(activeItem)) ??
    sections[0];

  const handleExitClick = () => {
    if (onExit) {
      onExit();
    } else {
      setShowExitConfirm(true);
    }
  };

  return (
    <footer
      style={{
        position: "relative",
        zIndex: 50,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        userSelect: "none",
        fontFamily: "Arial, Helvetica, sans-serif",
        boxSizing: "border-box",
        flexShrink: 0,
        background: "#ffffff",
      }}
    >
      {/* =========================================================
          TIER 1: PARTS & QUESTIONS TRACK BAR
      ========================================================= */}
      <div
        style={{
          width: "100%",
          height: 70,
          minHeight: 70,
          background: "#ffffff",
          borderTop: "1px solid #e0e0e0",
          boxSizing: "border-box",
          overflowX: "auto",
          overflowY: "hidden",
          scrollbarWidth: "thin",
        }}
      >
        <div
          style={{
            width: "100%",
            minWidth: sections.length >= 4 ? 1160 : 900,
            height: "100%",
            display: "grid",
            gridTemplateColumns: `repeat(${Math.max(sections.length, 1)}, minmax(0, 1fr))`,
            alignItems: "center",
            gap: sections.length >= 4 ? 26 : 42,
            padding: "8px clamp(20px, 3vw, 58px) 9px",
            boxSizing: "border-box",
          }}
        >
          {sections.map((section) => {
            const isActive = section === activeSection;
            const completedSet = new Set(section.completedItems ?? []);
            const completedCount = completedSet.size;
            const isComplete =
              section.items.length > 0 && completedCount === section.items.length;
            const hasFlaggedItem = section.items.some((item) =>
              flaggedSet.has(item)
            );

            return (
              <div
                key={section.label}
                onClick={
                  !isActive
                    ? () => onItemSelect(section.items[0])
                    : undefined
                }
                style={{
                  position: "relative",
                  height: "100%",
                  display: "flex",
                  minWidth: 0,
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: 6,
                  alignItems: "center",
                  boxSizing: "border-box",
                  cursor: isActive ? "default" : "pointer",
                  background: "#ffffff",
                  whiteSpace: "nowrap",
                }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    position: "relative",
                    width: "100%",
                    display: isComplete ? "block" : "grid",
                    boxSizing: "border-box",
                    paddingLeft: isActive ? 56 : 0,
                    gridTemplateColumns: isComplete
                      ? undefined
                      : `repeat(${Math.max(section.items.length, 1)}, minmax(0, 1fr))`,
                    gap: isComplete ? undefined : 3,
                  }}
                >
                  {isComplete ? (
                    <span
                      style={{
                        position: "relative",
                        display: "block",
                        width: "100%",
                        height: 4,
                        borderRadius: 1,
                        background: "#49a818",
                      }}
                    >
                      {isActive
                        ? section.items.map((item, itemIndex) =>
                            flaggedSet.has(item) ? (
                              <svg
                                key={item}
                                width="10"
                                height="14"
                                viewBox="0 0 10 14"
                                style={{
                                  position: "absolute",
                                  top: 2,
                                  left: `${((itemIndex + 0.5) / section.items.length) * 100}%`,
                                  zIndex: 2,
                                  transform: "translateX(-50%)",
                                }}
                              >
                                <path
                                  d="M0 0h10v14l-5-3.5L0 14V0z"
                                  fill="#ef4444"
                                />
                              </svg>
                            ) : null
                          )
                        : hasFlaggedItem
                          ? (
                              <svg
                                width="10"
                                height="14"
                                viewBox="0 0 10 14"
                                style={{
                                  position: "absolute",
                                  top: 2,
                                  left: "50%",
                                  zIndex: 2,
                                  transform: "translateX(-50%)",
                                }}
                              >
                                <path
                                  d="M0 0h10v14l-5-3.5L0 14V0z"
                                  fill="#ef4444"
                                />
                              </svg>
                            )
                          : null}
                    </span>
                  ) : (
                    section.items.map((item) => {
                      const isFlagged = flaggedSet.has(item);
                      return (
                        <span
                          key={item}
                          style={{
                            position: "relative",
                            display: "block",
                            height: 3,
                            borderRadius: 1,
                            background: completedSet.has(item)
                              ? "#49a818"
                              : "#dedede",
                          }}
                        >
                          {isFlagged ? (
                            <svg
                              width="10"
                              height="14"
                              viewBox="0 0 10 14"
                              style={{
                                position: "absolute",
                                top: 1,
                                left: "50%",
                                zIndex: 2,
                                transform: "translateX(-50%)",
                              }}
                            >
                              <path
                                d="M0 0h10v14l-5-3.5L0 14V0z"
                                fill="#ef4444"
                              />
                            </svg>
                          ) : null}
                        </span>
                      );
                    })
                  )}
                </div>

                {isActive ? (
                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      alignItems: "center",
                      gap: 8,
                      minWidth: 0,
                    }}
                  >
                    <span
                      style={{
                        width: 48,
                        flexShrink: 0,
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#1a1a1a",
                        lineHeight: 1,
                      }}
                    >
                      {section.label}
                    </span>

                    <div
                      style={{
                        display: "grid",
                        minWidth: 0,
                        flex: 1,
                        gridTemplateColumns: `repeat(${Math.max(section.items.length, 1)}, minmax(22px, 1fr))`,
                        alignItems: "center",
                      }}
                    >
                      {section.items.map((item) => {
                        const isCurrent = activeItem === item;
                        const isComplete = completedSet.has(item);
                        const isFlagged = flaggedSet.has(item);

                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              onItemSelect(item);
                            }}
                            aria-current={isCurrent ? "step" : undefined}
                            aria-label={`${itemNoun} ${item}${
                              isComplete ? ", answered" : ""
                            }${isFlagged ? ", flagged" : ""}`}
                            style={{
                              width: 24,
                              height: 26,
                              padding: 0,
                              margin: "0 auto",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              boxSizing: "border-box",
                              border: isCurrent
                                ? "1.5px solid #168bd2"
                                : "1.5px solid transparent",
                              borderRadius: 2,
                              outline: "none",
                              background: "#ffffff",
                              color: "#151515",
                              fontSize: 12.5,
                              fontWeight: isCurrent ? 700 : 400,
                              lineHeight: 1,
                              cursor: "pointer",
                            }}
                          >
                            {item}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : isComplete ? (
                  <div
                    aria-label={`${section.label} complete`}
                    style={{
                      display: "flex",
                      minHeight: 26,
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 4,
                      color: "#3f9917",
                      lineHeight: 1,
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="m3 8.3 3.1 3.1L13 4.7"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span style={{ fontSize: 13, fontWeight: 400, color: "#1f1f1f" }}>
                      {section.label}
                    </span>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      minHeight: 26,
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                      color: "#222222",
                      lineHeight: 1,
                    }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 700 }}>
                      {section.label}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 400, color: "#666666" }}>
                      {completedCount} of {section.items.length}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================
          TIER 2: LEXORA ASSESSMENT SYSTEM BOTTOM BAR
          (Side gaps on left and right, NO bottom gap, straight corners)
      ========================================================= */}
      {showSystemBar && (
        <div
          style={{
            width: "100%",
            paddingLeft: "clamp(20px, 3vw, 58px)",
            paddingRight: "clamp(20px, 3vw, 58px)",
            paddingBottom: 0,
            paddingTop: 0,
            boxSizing: "border-box",
            background: "#ffffff",
          }}
        >
          <div
            style={{
              width: "100%",
              height: 86,
              minHeight: 86,
              background: "#e7e7e7",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingLeft: "clamp(24px, 2.25vw, 44px)",
              paddingRight: "clamp(24px, 2.25vw, 44px)",
              boxSizing: "border-box",
            }}
          >
            {/* Left: Lexora Assessment brand */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 23,
                  height: 23,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="23" height="23" viewBox="0 0 48 48" fill="none">
                  <path
                    fill="#ed1c24"
                    d="M20.4 7.6c4-2.2 8.7-3.1 13.2-2.1 8.2 1.7 13.2 8.8 13.2 17v21.1h-8.2v-8.2c-3.7 5.3-9.5 8.4-16 8.5l6.9-8.4c5.4-2 9.1-7.2 9.1-13.1 0-7.8-6.3-12.9-13.3-10.8-1.8.5-3.4 1.4-4.9 2.5V7.6Z"
                  />
                  <path
                    fill="#111111"
                    d="M5.2 5.3h8.2v21.2c0 4.7 1.9 8.7 5.8 11.5l10.6-11.2c3-3.2 7.7-3.7 11.2-.9L20.5 46C10.8 42.8 5.2 35.7 5.2 26.4V5.3Z"
                  />
                </svg>
              </span>
              <span style={{ display: "inline-flex", alignItems: "baseline", gap: 5 }}>
                <span
                  style={{
                    fontSize: 26,
                    fontWeight: 700,
                    color: "#4a4a4a",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Lexora
                </span>
                <span
                  style={{
                    fontSize: 26,
                    fontWeight: 400,
                    color: "#777777",
                    letterSpacing: "-0.01em",
                  }}
                >
                  assessment
                </span>
              </span>
            </div>

            {/* Right: Clock, Battery, WiFi, Sound, Exit */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "clamp(18px, 1.65vw, 32px)",
              }}
            >
              {/* Digital Clock */}
              <time
                dateTime={clockNow.toISOString()}
                title={`Current local time: ${formatFooterClock(clockNow, true)}`}
                aria-label={`Current local time ${formatFooterClock(clockNow, true)}`}
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: "#111111",
                  fontFamily: "'Courier New', Courier, monospace",
                  fontVariantNumeric: "tabular-nums",
                  letterSpacing: "0.04em",
                }}
              >
                {currentTime}
              </time>

              {/* Battery Icon */}
              <svg
                width="36"
                height="20"
                viewBox="0 0 28 14"
                fill="none"
              >
                <rect
                  x="0.75"
                  y="0.75"
                  width="22.5"
                  height="12.5"
                  rx="2"
                  stroke="#374151"
                  strokeWidth="1.5"
                />
                <path
                  d="M25.5 4.5V9.5"
                  stroke="#374151"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <rect x="2.5" y="2.5" width="13" height="9" rx="1" fill="#374151" />
              </svg>

              {/* WiFi Icon */}
              <svg
                width="36"
                height="26"
                viewBox="0 0 22 17"
                fill="none"
              >
                <path
                  d="M1 4.5C6 -0.5 16 -0.5 21 4.5"
                  stroke="#374151"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <path
                  d="M4.5 8C8.5 4.5 13.5 4.5 17.5 8"
                  stroke="#374151"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <path
                  d="M8 11.5C9.5 10.2 12.5 10.2 14 11.5"
                  stroke="#374151"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <circle cx="11" cy="15" r="1.3" fill="#374151" />
              </svg>

              {/* Listening controls audio; other modules show a disabled system icon. */}
              <div style={{ position: "relative", display: "inline-flex" }}>
                {soundEnabled && showVolumeControl ? (
                  <div
                    role="group"
                    aria-label="Listening volume"
                    style={{
                      position: "absolute",
                      right: "calc(100% + 12px)",
                      top: "50%",
                      zIndex: 5,
                      width: 220,
                      transform: "translateY(-50%)",
                      display: "flex",
                      alignItems: "center",
                      gap: 9,
                      padding: "9px 11px",
                      background: "#ffffff",
                      border: "1px solid #c4c4c4",
                      borderRadius: 2,
                      boxShadow: "0 5px 14px rgba(0, 0, 0, 0.14)",
                    }}
                  >
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#333333" }}>
                      Volume
                    </span>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={soundVolume}
                      onInput={(event) =>
                        onSoundVolumeChange?.(Number(event.currentTarget.value))
                      }
                      aria-label="Listening volume level"
                      className="h-1 w-[108px] cursor-pointer appearance-none rounded-full bg-[#a9a9a9] outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-black [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black"
                    />
                    <span
                      aria-live="polite"
                      style={{ width: 30, fontSize: 12, color: "#555555", textAlign: "right" }}
                    >
                      {Math.round(soundVolume * 100)}%
                    </span>
                  </div>
                ) : null}
                <button
                  type="button"
                  onClick={() => {
                    if (!soundEnabled) return;
                    setShowVolumeControl((current) => !current);
                  }}
                  disabled={!soundEnabled}
                  aria-expanded={soundEnabled ? showVolumeControl : undefined}
                  aria-label={
                    soundEnabled
                      ? "Adjust listening volume"
                      : "Sound control unavailable for this test section"
                  }
                  className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                style={{
                  width: 54,
                  height: 54,
                  padding: 0,
                  border: "none",
                  borderRadius: 2,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "transparent",
                  color: soundEnabled ? "#111111" : "#888888",
                  cursor: soundEnabled ? "pointer" : "default",
                  opacity: soundEnabled ? 1 : 0.68,
                }}
              >
                  <svg
                  width="31"
                  height="27"
                  viewBox="0 0 22 18"
                  fill="none"
                  aria-hidden="true"
                >
                  <path d="M0 6H4.5L9.5 1.5V16.5L4.5 12H0V6Z" fill="currentColor" />
                  {soundVolume === 0 ? (
                    <path d="M13.5 5 20 13M20 5l-6.5 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  ) : (
                    <>
                      <path
                        d="M13.5 5C15.5 6.8 15.5 11.2 13.5 13"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      {soundVolume > 0.45 ? <path
                        d="M17 2.5C21 5.5 21 12.5 17 15.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      /> : null}
                    </>
                  )}
                </svg>
                </button>
              </div>

              {/* Exit — bold text */}
              <button
                type="button"
                onClick={handleExitClick}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: 28,
                  fontWeight: 400,
                  color: "#111111",
                  padding: "6px 2px",
                  cursor: "pointer",
                  outline: "none",
                  marginLeft: 8,
                }}
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: 8,
              maxWidth: 400,
              width: "100%",
              padding: 24,
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
              fontFamily: "Arial, Helvetica, sans-serif",
            }}
          >
            <h3
              style={{
                margin: "0 0 12px 0",
                fontSize: 18,
                fontWeight: 700,
                color: "#111827",
              }}
            >
              Exit Assessment?
            </h3>
            <p
              style={{
                margin: "0 0 20px 0",
                fontSize: 14,
                color: "#4b5563",
                lineHeight: 1.5,
              }}
            >
              Are you sure you want to exit? Your answers so far have been saved.
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
              }}
            >
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 4,
                  border: "1px solid #d1d5db",
                  background: "#ffffff",
                  color: "#374151",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowExitConfirm(false);
                  window.history.back();
                }}
                style={{
                  padding: "8px 16px",
                  borderRadius: 4,
                  border: "none",
                  background: "#dc2626",
                  color: "#ffffff",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Exit Test
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default ClientExamSectionFooter;
