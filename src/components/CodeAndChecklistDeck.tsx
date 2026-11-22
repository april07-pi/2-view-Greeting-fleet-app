import React, { useState } from 'react';
import {
  Check,
  CheckCircle2,
  Circle,
  Copy,
  Download,
  FileCode2,
  FolderOpen,
  Image as ImageIcon,
  Terminal,
} from 'lucide-react';
import {
  ASSIGNMENT_REQUIREMENTS,
  MAIN_PY_SOURCE,
  REQUIREMENTS_TXT_SOURCE,
} from '../data/fletSource';
import { downloadFletViewScreenshot } from '../utils/exportScreenshot';

export type DeckTab = 'code' | 'requirements' | 'deliverables';

interface CodeAndChecklistDeckProps {
  activeTab: DeckTab;
  onTabChange: (tab: DeckTab) => void;
  verifiedIds: Record<string, boolean>;
  sampleName: string;
  onDownloadMainPy: () => void;
}

function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export const CodeAndChecklistDeck: React.FC<CodeAndChecklistDeckProps> = ({
  activeTab,
  onTabChange,
  verifiedIds,
  sampleName,
  onDownloadMainPy,
}) => {
  const [copied, setCopied] = useState(false);
  const [highlightRange, setHighlightRange] = useState<[number, number] | null>(
    null
  );

  const lines = MAIN_PY_SOURCE.split('\n');
  const testedCount = ASSIGNMENT_REQUIREMENTS.filter(
    (req) => verifiedIds[req.id]
  ).length;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(MAIN_PY_SOURCE);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback ignored in restricted environments
    }
  };

  const handleInspectRequirement = (range: [number, number]) => {
    setHighlightRange(range);
    onTabChange('code');
  };

  return (
    <aside className="flex flex-col gap-4">
      {/* Segmented Control Bar */}
      <div className="flex items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label="Workbench reference tabs"
          className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'code'}
            onClick={() => onTabChange('code')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'code'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            main.py
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'requirements'}
            onClick={() => onTabChange('requirements')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'requirements'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Requirements ({testedCount}/{ASSIGNMENT_REQUIREMENTS.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'deliverables'}
            onClick={() => onTabChange('deliverables')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'deliverables'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Deliverables
          </button>
        </div>

        {activeTab === 'code' && (
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Tab Content Panel */}
      {activeTab === 'code' && (
        <div
          id="python-source"
          className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm"
        >
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/60 border-b border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <FileCode2 className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />
              <span className="font-mono text-slate-200">greeting_app/main.py</span>
            </div>
            <div className="flex items-center gap-3">
              {highlightRange && (
                <button
                  type="button"
                  onClick={() => setHighlightRange(null)}
                  className="text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
                >
                  Clear highlight (L{highlightRange[0]}–{highlightRange[1]})
                </button>
              )}
              <span className="font-mono tabular-nums">{lines.length} lines</span>
            </div>
          </div>

          <div className="overflow-x-auto max-h-[540px] overflow-y-auto py-3">
            <table className="w-full border-collapse text-xs font-mono leading-5">
              <tbody>
                {lines.map((line, index) => {
                  const lineNumber = index + 1;
                  const isHighlighted =
                    highlightRange !== null &&
                    lineNumber >= highlightRange[0] &&
                    lineNumber <= highlightRange[1];

                  return (
                    <tr
                      key={lineNumber}
                      className={
                        isHighlighted
                          ? 'bg-sky-500/15'
                          : 'hover:bg-slate-800/60 transition-colors'
                      }
                    >
                      <td className="select-none text-right pr-3 pl-4 py-0.5 text-slate-500 tabular-nums w-10 align-top">
                        {lineNumber}
                      </td>
                      <td className="pr-4 py-0.5 text-slate-100 whitespace-pre">
                        {line || ' '}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'requirements' && (
        <div
          id="requirements"
          className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100"
        >
          <div className="px-4 py-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-900">
              Assignment Checklist
            </span>
            <span className="text-xs text-slate-500 tabular-nums">
              {testedCount} of {ASSIGNMENT_REQUIREMENTS.length} verified interactively
            </span>
          </div>

          {ASSIGNMENT_REQUIREMENTS.map((item) => {
            const isVerified = Boolean(verifiedIds[item.id]);
            return (
              <div
                key={item.id}
                className="px-4 py-3.5 flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  {isVerified ? (
                    <CheckCircle2
                      className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0"
                      aria-label="Verified"
                    />
                  ) : (
                    <Circle
                      className="w-4 h-4 text-slate-300 mt-0.5 shrink-0"
                      aria-label="Pending test"
                    />
                  )}
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-600 leading-relaxed">
                      {item.detail}
                    </p>
                    <p className="mt-1 font-mono text-[11px] text-slate-500">
                      {item.codeHint}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleInspectRequirement(item.lines)}
                  className="px-2.5 py-1 text-xs font-medium text-sky-700 hover:bg-sky-50 border border-slate-200 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  L{item.lines[0]}–{item.lines[1]}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'deliverables' && (
        <div
          id="deliverables"
          className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100"
        >
          {/* Folder Structure */}
          <div className="p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <FolderOpen className="w-4 h-4 text-sky-600" aria-hidden="true" />
              <span>Greeting App Folder Structure</span>
            </div>
            <pre className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-800 leading-relaxed">
{`greeting_app/
├── main.py
└── requirements.txt`}
            </pre>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onDownloadMainPy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-md transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Download main.py</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  downloadTextFile('requirements.txt', REQUIREMENTS_TXT_SOURCE)
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Download requirements.txt</span>
              </button>
            </div>
          </div>

          {/* Local Run Commands */}
          <div className="p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Terminal className="w-4 h-4 text-slate-700" aria-hidden="true" />
              <span>Run Locally in Python</span>
            </div>
            <pre className="mt-3 p-3 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono leading-relaxed overflow-x-auto">
{`cd greeting_app
pip install -r requirements.txt
python main.py`}
            </pre>
          </div>

          {/* Submission Screenshots Export */}
          <div className="p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <ImageIcon className="w-4 h-4 text-sky-600" aria-hidden="true" />
              <span>Export View Screenshots for Submission</span>
            </div>
            <p className="mt-1 text-xs text-slate-600">
              Generate clean PNG captures of each required state using your current name ({sampleName.trim() || 'Alex'}).
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => downloadFletViewScreenshot('home', sampleName)}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md transition-colors cursor-pointer"
              >
                Home View (/) PNG
              </button>
              <button
                type="button"
                onClick={() =>
                  downloadFletViewScreenshot('greeting', sampleName)
                }
                className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md transition-colors cursor-pointer"
              >
                Greeting View (/greeting) PNG
              </button>
              <button
                type="button"
                onClick={() => downloadFletViewScreenshot('dialog', '')}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md transition-colors cursor-pointer"
              >
                Empty AlertDialog PNG
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
