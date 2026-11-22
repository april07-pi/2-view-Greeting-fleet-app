/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import {
  FletSimulatorStage,
  SimulationState,
} from './components/FletSimulatorStage';
import {
  CodeAndChecklistDeck,
  DeckTab,
} from './components/CodeAndChecklistDeck';
import { MAIN_PY_SOURCE } from './data/fletSource';

const INITIAL_SIM_STATE: SimulationState = {
  route: '/',
  nameFieldValue: '',
  userName: '',
  dialogOpen: false,
  lastEvent: 'ft.run(main) -> route_change("/")',
};

export default function App() {
  const [sim, setSim] = useState<SimulationState>(INITIAL_SIM_STATE);
  const [activeTab, setActiveTab] = useState<DeckTab>('code');
  const [verifiedIds, setVerifiedIds] = useState<Record<string, boolean>>({
    'home-view': true,
    'route-change-run': true,
  });

  const handleDownloadMainPy = () => {
    const blob = new Blob([MAIN_PY_SOURCE], {
      type: 'text/x-python;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'main.py';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleNameFieldChange = (value: string) => {
    setSim((prev) => ({
      ...prev,
      nameFieldValue: value,
    }));
  };

  const handleContinueClick = () => {
    const trimmed = sim.nameFieldValue.trim();
    if (!trimmed) {
      setSim((prev) => ({
        ...prev,
        dialogOpen: true,
        lastEvent: 'continue_clicked -> page.show_dialog(empty_name_dialog)',
      }));
      setVerifiedIds((prev) => ({
        ...prev,
        'empty-alert': true,
      }));
      return;
    }

    setSim((prev) => ({
      ...prev,
      userName: trimmed,
      route: '/greeting',
      dialogOpen: false,
      lastEvent: 'async continue_clicked -> await page.push_route("/greeting")',
    }));
    setVerifiedIds((prev) => ({
      ...prev,
      'async-push-route': true,
      'greeting-view': true,
      'shared-variable': true,
    }));
  };

  const handleBackClick = () => {
    setSim((prev) => ({
      ...prev,
      route: '/',
      lastEvent: 'async back_clicked -> await page.push_route("/")',
    }));
  };

  const handleCloseDialog = () => {
    setSim((prev) => ({
      ...prev,
      dialogOpen: false,
      lastEvent: 'close_dialog -> page.pop_dialog()',
    }));
  };

  const handleReset = () => {
    setSim(INITIAL_SIM_STATE);
  };

  const handleQuickFill = (value: string) => {
    setSim((prev) => ({
      ...prev,
      route: '/',
      nameFieldValue: value,
      dialogOpen: false,
      lastEvent: `name_field.value = "${value}"`,
    }));
  };

  const jumpToDeckTab = (tab: DeckTab, targetId: string) => {
    setActiveTab(tab);
    requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Three-Zone Top Bar */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-[1280px] mx-auto px-6 py-4 flex items-center justify-between gap-8">
          <a
            href="#interactive-preview"
            className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
          >
            Two-View Greeting App
          </a>

          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"
          >
            <a
              href="#interactive-preview"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Interactive Preview
            </a>
            <button
              type="button"
              onClick={() => jumpToDeckTab('code', 'python-source')}
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Python Source
            </button>
            <button
              type="button"
              onClick={() => jumpToDeckTab('requirements', 'requirements')}
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Requirements
            </button>
            <button
              type="button"
              onClick={() => jumpToDeckTab('deliverables', 'deliverables')}
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Deliverables
            </button>
          </nav>

          <div className="shrink-0">
            <button
              type="button"
              onClick={handleDownloadMainPy}
              className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Download main.py
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-6 py-8">
        {/* Compact Editorial Context Header */}
        <div className="max-w-3xl mb-8">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-2">
            <span>Unit 4: Multi-View Apps, Forms &amp; Styling</span>
            <span aria-hidden="true">·</span>
            <span>Flet Python Workbench</span>
            <span aria-hidden="true">·</span>
            <span>Routes / and /greeting</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight text-balance">
            Two-View Flet Greeting App &amp; Deliverable
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
            Test empty-name <code className="text-xs font-mono bg-slate-200/70 px-1.5 py-0.5 rounded">AlertDialog</code> validation,
            async <code className="text-xs font-mono bg-slate-200/70 px-1.5 py-0.5 rounded">page.push_route</code> navigation,
            and shared state inside <code className="text-xs font-mono bg-slate-200/70 px-1.5 py-0.5 rounded">main</code>,
            then download <code className="text-xs font-mono bg-slate-200/70 px-1.5 py-0.5 rounded">main.py</code> and view PNGs.
          </p>
        </div>

        {/* Two-Zone Sandbox Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6">
            <FletSimulatorStage
              sim={sim}
              onNameFieldChange={handleNameFieldChange}
              onContinueClick={handleContinueClick}
              onBackClick={handleBackClick}
              onCloseDialog={handleCloseDialog}
              onReset={handleReset}
              onQuickFill={handleQuickFill}
            />
          </div>

          <div className="lg:col-span-6">
            <CodeAndChecklistDeck
              activeTab={activeTab}
              onTabChange={setActiveTab}
              verifiedIds={verifiedIds}
              sampleName={sim.userName || sim.nameFieldValue}
              onDownloadMainPy={handleDownloadMainPy}
            />
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white mt-12">
        <div className="max-w-[1280px] mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <span>Two-View Greeting App · Python Flet Deliverable</span>
          <span className="font-mono">greeting_app/main.py</span>
        </div>
      </footer>
    </div>
  );
}
