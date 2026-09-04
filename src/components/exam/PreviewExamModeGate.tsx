import React, { useCallback, useEffect, useRef, useState } from "react";
import { FiMaximize2, FiShield } from "react-icons/fi";

interface PreviewExamModeGateProps {
  enabled: boolean;
}

type WebkitDocument = Document & {
  webkitExitFullscreen?: () => Promise<void> | void;
  webkitFullscreenElement?: Element | null;
};

type WebkitElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};

const isBlockedExamShortcut = (event: KeyboardEvent) => {
  const key = event.key.toLowerCase();
  const commandKey = event.ctrlKey || event.metaKey;

  if (key === "f12") return true;
  if (commandKey && ["f", "p", "s", "u"].includes(key)) return true;
  if (commandKey && event.shiftKey && ["c", "i", "j", "k"].includes(key)) {
    return true;
  }
  if (event.metaKey && event.altKey && ["c", "i", "j", "u"].includes(key)) {
    return true;
  }

  return false;
};

const getFullscreenElement = () => {
  const fullscreenDocument = document as WebkitDocument;
  return document.fullscreenElement ?? fullscreenDocument.webkitFullscreenElement ?? null;
};

const PreviewExamModeGate: React.FC<PreviewExamModeGateProps> = ({ enabled }) => {
  const [fullscreenPromptVisible, setFullscreenPromptVisible] = useState(false);
  const [fullscreenSupported, setFullscreenSupported] = useState(true);
  const enterButtonRef = useRef<HTMLButtonElement | null>(null);
  const enteredFullscreenRef = useRef(false);

  const enterFullscreen = useCallback(async () => {
    if (!enabled || typeof document === "undefined") return;

    const root = document.documentElement as WebkitElement;
    const requestFullscreen =
      document.fullscreenEnabled !== false ? root.requestFullscreen?.bind(root) : undefined;
    const requestWebkitFullscreen = root.webkitRequestFullscreen?.bind(root);

    if (getFullscreenElement()) {
      setFullscreenPromptVisible(false);
      return;
    }

    if (!requestFullscreen && !requestWebkitFullscreen) {
      setFullscreenSupported(false);
      setFullscreenPromptVisible(false);
      return;
    }

    try {
      if (requestFullscreen) {
        await requestFullscreen({ navigationUI: "hide" });
      } else {
        await Promise.resolve(requestWebkitFullscreen?.());
      }
      enteredFullscreenRef.current = true;
      setFullscreenPromptVisible(false);
    } catch {
      setFullscreenPromptVisible(true);
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled || typeof document === "undefined") return;

    const blockContextMenu = (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
    };
    const blockBrowserShortcut = (event: KeyboardEvent) => {
      if (!isBlockedExamShortcut(event)) return;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    };

    document.addEventListener("contextmenu", blockContextMenu, true);
    window.addEventListener("keydown", blockBrowserShortcut, true);

    return () => {
      document.removeEventListener("contextmenu", blockContextMenu, true);
      window.removeEventListener("keydown", blockBrowserShortcut, true);
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled || typeof document === "undefined") return;

    const root = document.documentElement as WebkitElement;
    const fullscreenDocument = document as WebkitDocument;
    const supported = Boolean(
      (document.fullscreenEnabled !== false && root.requestFullscreen) ||
        root.webkitRequestFullscreen,
    );
    setFullscreenSupported(supported);

    if (!supported) {
      setFullscreenPromptVisible(false);
      return;
    }

    const handleFullscreenChange = () => {
      const isFullscreen = Boolean(getFullscreenElement());
      if (isFullscreen) enteredFullscreenRef.current = true;
      setFullscreenPromptVisible(!isFullscreen);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    void enterFullscreen();

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);

      if (enteredFullscreenRef.current && getFullscreenElement() === root) {
        const exitFullscreen = document.exitFullscreen?.bind(document);
        const exitWebkitFullscreen = fullscreenDocument.webkitExitFullscreen?.bind(document);
        void Promise.resolve(exitFullscreen ? exitFullscreen() : exitWebkitFullscreen?.()).catch(
          () => undefined,
        );
      }
    };
  }, [enabled, enterFullscreen]);

  useEffect(() => {
    if (!fullscreenPromptVisible) return;
    enterButtonRef.current?.focus();
  }, [fullscreenPromptVisible]);

  if (!enabled || !fullscreenSupported || !fullscreenPromptVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#071017]/95 px-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-fullscreen-title"
      aria-describedby="preview-fullscreen-description"
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        event.preventDefault();
        enterButtonRef.current?.focus();
      }}
    >
      <div className="w-full max-w-md rounded-2xl border border-white/15 bg-white px-7 py-8 text-center shadow-[0_24px_70px_rgba(0,0,0,0.45)] sm:px-9">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-700">
          <FiShield aria-hidden="true" className="h-6 w-6" />
        </div>
        <h2 id="preview-fullscreen-title" className="text-2xl font-bold tracking-tight text-slate-950">
          Full screen required
        </h2>
        <p
          id="preview-fullscreen-description"
          className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-600"
        >
          Your browser needs one confirmation to open the focused Lexora test view.
        </p>
        <button
          ref={enterButtonRef}
          type="button"
          onClick={() => void enterFullscreen()}
          className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-red-700 px-5 py-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(185,28,28,0.24)] transition-colors hover:bg-red-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-200"
        >
          <FiMaximize2 aria-hidden="true" className="h-5 w-5" />
          Enter full screen
        </button>
        <p className="mt-4 text-xs leading-5 text-slate-500">
          Leaving full screen pauses access until you enter it again.
        </p>
      </div>
    </div>
  );
};

export default PreviewExamModeGate;
