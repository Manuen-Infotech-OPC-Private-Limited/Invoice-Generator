import React, { useState, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { InvoiceForm } from './components/InvoiceForm';
import { InvoicePreview } from './components/InvoicePreview';
import { initialInvoiceData, CONSTANT_COMPANY_DETAILS } from './data/initialData';
import { downloadInvoicePDF } from './utils/pdfGenerator';
import { CheckCircle2, AlertCircle, Eye, Edit3, Download } from 'lucide-react';

const STORAGE_KEY = 'tax_invoice_data_draft';

export function App() {
  const [invoiceData, setInvoiceData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          company: CONSTANT_COMPANY_DETAILS // Company details are permanently constant as Ram Steels
        };
      }
    } catch (e) {
      console.warn('Failed to read from localStorage', e);
    }
    return initialInvoiceData;
  });

  const [viewMode, setViewMode] = useState(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      return 'edit';
    }
    return 'split';
  }); // 'split' | 'edit' | 'preview'
  const [isDownloading, setIsDownloading] = useState(false);
  const [toast, setToast] = useState(null);
  const previewRef = useRef(null);

  // Auto-save draft to localStorage (client-side only, no database)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(invoiceData));
    } catch (e) {
      console.warn('Could not persist to localStorage', e);
    }
  }, [invoiceData]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleResetToSample = () => {
    if (window.confirm('Reset all fields to the Ram Steels sample invoice?')) {
      setInvoiceData(initialInvoiceData);
      showToast('Loaded sample Ram Steels invoice data!');
    }
  };

  const handleClear = () => {
    if (window.confirm('Clear all invoice fields? (Company details will remain constant)')) {
      setInvoiceData({
        company: CONSTANT_COMPANY_DETAILS,
        invoice: {
          invoiceNumber: 'INV-000001',
          invoiceDate: new Date().toISOString().split('T')[0],
          terms: 'Due on Receipt',
          dueDate: new Date().toISOString().split('T')[0],
          placeOfSupply: '',
          taxType: 'CGST_SGST',
          defaultTaxRate: 18
        },
        customer: {
          billTo: {
            name: '',
            address: ''
          },
          shipTo: {
            name: '',
            addressLines: ['']
          }
        },
        items: [
          {
            id: '1',
            description: '',
            hsnSac: '',
            qty: 1,
            unit: 'MTs',
            rate: 0,
            taxRate: 18
          }
        ],
        details: {
          vehicleNo: '',
          thankYouMessage: 'Thank you for your business!',
          termsAndConditions: [
            'Payment due upon receipt',
            'Subject to jurisdiction'
          ],
          authorizedSignatory: 'Authorized Signature',
          paymentMade: 0
        }
      });
      showToast('Form cleared.');
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setIsDownloading(true);
      await downloadInvoicePDF('invoice-print-area', invoiceData.invoice.invoiceNumber || 'INV-000001');
      showToast('Invoice PDF downloaded successfully!');
    } catch (error) {
      console.error(error);
      showToast('Failed to generate PDF. You can also use the "Print / Save" button.', 'error');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleLogoUpload = (logoDataUrl) => {
    setInvoiceData((prev) => ({
      ...prev,
      company: {
        ...prev.company,
        logoUrl: logoDataUrl,
        useSampleLogo: false
      }
    }));
    showToast('Company logo updated!');
  };

  const handlePrint = () => {
    const originalTitle = document.title;
    // Set clean, professional print document title (used by browser print header)
    document.title = invoiceData.invoice?.invoiceNumber
      ? `Tax Invoice - ${invoiceData.invoice.invoiceNumber}`
      : 'Tax Invoice';

    window.print();

    // Restore page title after print dialog closes
    setTimeout(() => {
      document.title = originalTitle || 'Tax Invoice';
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <Header
        onDownloadPDF={handleDownloadPDF}
        onPrint={handlePrint}
        isDownloading={isDownloading}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="no-print fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 bg-slate-900 text-white text-xs rounded-xl shadow-xl transition-all animate-fade-in border border-slate-700">
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-3 sm:p-6 pb-24 lg:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Form Editor Column */}
          {(viewMode === 'split' || viewMode === 'edit') && (
            <div className={`no-print ${viewMode === 'split' ? 'lg:col-span-5' : 'lg:col-span-12'}`}>
              <div className="sticky top-20">
                <InvoiceForm
                  data={invoiceData}
                  onChange={setInvoiceData}
                  onLogoUpload={handleLogoUpload}
                  onResetToSample={handleResetToSample}
                  onClear={handleClear}
                />
              </div>
            </div>
          )}

          {/* Live Preview Column */}
          {(viewMode === 'split' || viewMode === 'preview') && (
            <div className={`${viewMode === 'split' ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden no-print mb-4 p-3 flex justify-between items-center text-xs text-slate-600">
                <div className="font-semibold text-slate-800 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Live Invoice Template Preview (Exact A4 Replica)</span>
                </div>
                <div className="text-slate-500 hidden sm:block">
                  Updates automatically in real time as you type
                </div>
              </div>

              {/* Render The Template */}
              <div className="rounded-xl overflow-hidden shadow-md">
                <InvoicePreview ref={previewRef} data={invoiceData} onLogoUpload={handleLogoUpload} />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Floating Bottom Action Bar for Mobile & Tablet */}
      <div className="no-print lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-2.5 px-4 z-40 flex items-center justify-between gap-3 shadow-xl">
        {viewMode === 'edit' ? (
          <>
            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <Eye className="w-4 h-4 text-blue-600" />
              <span>Preview Invoice</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="flex-1 py-2.5 px-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'Saving...' : 'Download PDF'}</span>
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setViewMode('edit')}
              className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <Edit3 className="w-4 h-4 text-blue-600" />
              <span>Edit Details</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="flex-1 py-2.5 px-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'Saving...' : 'Download PDF'}</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
