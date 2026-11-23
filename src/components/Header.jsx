import React from 'react';
import { Download, Printer, Eye, Edit3, Layout } from 'lucide-react';

export function Header({
  onDownloadPDF,
  onPrint,
  isDownloading,
  viewMode,
  setViewMode
}) {
  return (
    <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand without the gradient sparkle icon */}
        <div className="flex items-center">
          <div>
            <h1 className="text-sm sm:text-lg font-bold text-slate-900 leading-tight tracking-tight">
              Tax Invoice Generator
            </h1>
            <p className="text-[10px] sm:text-[11px] text-slate-500 hidden md:block">
              GST Compliant • Instant PDF Download
            </p>
          </div>
        </div>

        {/* View Mode Switcher for Desktop (>= 1024px) */}
        <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-medium">
          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition ${viewMode === 'split'
                ? 'bg-white text-blue-600 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>Side-by-Side</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('edit')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition ${viewMode === 'edit'
                ? 'bg-white text-blue-600 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Editor Only</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('preview')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition ${viewMode === 'preview'
                ? 'bg-white text-blue-600 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview Only</span>
          </button>
        </div>

        {/* Mobile & Tablet View Toggle (< 1024px) */}
        <div className="flex lg:hidden items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-medium">
          <button
            type="button"
            onClick={() => setViewMode('edit')}
            className={`px-2.5 sm:px-3 py-1 rounded-md flex items-center gap-1 transition ${viewMode === 'edit'
                ? 'bg-white text-blue-600 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('preview')}
            className={`px-2.5 sm:px-3 py-1 rounded-md flex items-center gap-1 transition ${viewMode === 'preview'
                ? 'bg-white text-blue-600 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Print Button (Icon on mobile, text on sm+) */}
          <button
            type="button"
            onClick={onPrint}
            className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 active:bg-slate-100 transition shadow-xs flex items-center gap-1.5"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600" />
            <span className="hidden sm:inline">Print</span>
          </button>

          {/* Download PDF Button */}
          <button
            type="button"
            onClick={onDownloadPDF}
            disabled={isDownloading}
            className={`px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg transition shadow-xs flex items-center gap-1.5 ${isDownloading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            title="Download PDF directly"
          >
            <Download className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isDownloading ? 'animate-bounce' : ''}`} />
            <span>{isDownloading ? 'Saving...' : 'PDF'}</span>
            <span className="hidden sm:inline">{!isDownloading && 'Download'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
