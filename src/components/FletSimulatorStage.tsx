import React, { useRef } from 'react';
import { ArrowLeft, Camera, RotateCcw } from 'lucide-react';
import { downloadFletViewScreenshot, ScreenshotTarget } from '../utils/exportScreenshot';

export interface SimulationState {
  route: '/' | '/greeting';
  nameFieldValue: string;
  userName: string;
  dialogOpen: boolean;
  lastEvent: string;
}

interface FletSimulatorStageProps {
  sim: SimulationState;
  onNameFieldChange: (value: string) => void;
  onContinueClick: () => void;
  onBackClick: () => void;
  onCloseDialog: () => void;
  onReset: () => void;
  onQuickFill: (value: string) => void;
}

export const FletSimulatorStage: React.FC<FletSimulatorStageProps> = ({
  sim,
  onNameFieldChange,
  onContinueClick,
  onBackClick,
  onCloseDialog,
  onReset,
  onQuickFill,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const currentScreenshotTarget: ScreenshotTarget = sim.dialogOpen
    ? 'dialog'
    : sim.route === '/greeting'
      ? 'greeting'
      : 'home';

  const handleCloseAndFocus = () => {
    onCloseDialog();
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onContinueClick();
    }
  };

  return (
    <section
      id="interactive-preview"
      aria-label="Interactive Flet App Simulator"
      className="flex flex-col gap-4"
    >
      {/* Stage Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span className="font-semibold text-slate-900">Live Flet Runtime</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono">ft.run(main)</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono">480 × 640</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onQuickFill('Thabo')}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Fill &ldquo;Thabo&rdquo;
          </button>
          <button
            type="button"
            onClick={() =>
              downloadFletViewScreenshot(
                currentScreenshotTarget,
                sim.userName || sim.nameFieldValue
              )
            }
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-sky-700 bg-sky-50 border border-sky-200 rounded-md hover:bg-sky-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Save View PNG</span>
          </button>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Simulated Desktop Flet Window */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {/* OS Window Titlebar */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-2" aria-hidden="true">
            <span className="w-3 h-3 rounded-full bg-rose-400" />
            <span className="w-3 h-3 rounded-full bg-amber-400" />
            <span className="w-3 h-3 rounded-full bg-emerald-400" />
          </div>

          <span className="text-xs font-semibold text-slate-800 tracking-tight truncate">
            Two-View Greeting App
          </span>

          <span className="font-mono text-xs text-slate-500 whitespace-nowrap shrink-0">
            route: {sim.route}
          </span>
        </div>

        {/* Flet Page Canvas */}
        <div className="relative min-h-[460px] bg-slate-50/40 flex flex-col">
          {/* AppBar for /greeting stack */}
          {sim.route === '/greeting' && (
            <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-200">
              <button
                type="button"
                onClick={onBackClick}
                aria-label="Back to home view"
                className="p-1.5 -ml-1 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-semibold text-slate-900">
                Greeting
              </span>
            </div>
          )}

          {/* Active ft.View Body */}
          {sim.route === '/' ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-full max-w-[320px] flex flex-col items-center gap-4">
                <h2 className="text-[26px] leading-tight font-bold text-slate-900 tracking-tight">
                  Two-View Greeting App
                </h2>
                <p className="text-sm text-slate-600">
                  Enter your name to receive a personalized greeting.
                </p>

                <div className="w-full pt-2 text-left">
                  <label
                    htmlFor="flet-name-field"
                    className="block text-xs font-medium text-sky-700 mb-1.5"
                  >
                    Your Name
                  </label>
                  <input
                    ref={inputRef}
                    id="flet-name-field"
                    type="text"
                    value={sim.nameFieldValue}
                    onChange={(e) => onNameFieldChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter your name"
                    autoComplete="off"
                    className="w-full px-3.5 py-2.5 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 transition-colors"
                  />
                </div>

                <button
                  type="button"
                  onClick={onContinueClick}
                  className="w-full py-2.5 px-5 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 active:scale-[0.99] rounded-full shadow-xs transition-all cursor-pointer"
                >
                  Continue
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-full max-w-[360px] flex flex-col items-center gap-6">
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight break-words">
                  Hello, {sim.userName}!
                </h2>

                <button
                  type="button"
                  onClick={onBackClick}
                  className="w-[180px] py-2.5 px-5 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 active:scale-[0.99] rounded-full shadow-xs transition-all cursor-pointer"
                >
                  Back
                </button>
              </div>
            </div>
          )}

          {/* Modal AlertDialog Overlay via page.show_dialog(...) */}
          {sim.dialogOpen && (
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="flet-dialog-title"
              className="absolute inset-0 bg-slate-950/40 flex items-center justify-center p-6"
            >
              <div className="w-full max-w-[320px] bg-white rounded-3xl p-6 shadow-xl border border-slate-200">
                <h3
                  id="flet-dialog-title"
                  className="text-lg font-semibold text-slate-900"
                >
                  Name Required
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Please enter your name before continuing.
                </p>
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={handleCloseAndFocus}
                    className="px-4 py-2 text-sm font-semibold text-sky-700 hover:bg-sky-50 rounded-full transition-colors cursor-pointer"
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Execution & Variable State Inspector */}
      <div className="bg-white border border-slate-200 rounded-xl px-4 py-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <span className="text-slate-500 block">page.route</span>
            <span className="font-mono font-medium text-slate-900">
              &quot;{sim.route}&quot;
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">user_name (inside main)</span>
            <span className="font-mono font-medium text-slate-900">
              {sim.userName ? `"${sim.userName}"` : '""'}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">page.views stack</span>
            <span className="font-mono font-medium text-slate-900">
              {sim.route === '/' ? '[View("/")]' : '[View("/"), View("/greeting")]'}
            </span>
          </div>
        </div>
        <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 text-xs text-slate-600">
          <span className="truncate">Last handler: {sim.lastEvent}</span>
          <span className="font-mono text-slate-500 whitespace-nowrap shrink-0">
            dialog: {sim.dialogOpen ? 'open' : 'closed'}
          </span>
        </div>
      </div>
    </section>
  );
};
