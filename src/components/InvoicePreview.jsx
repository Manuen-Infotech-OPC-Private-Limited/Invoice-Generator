import React from 'react';
import { formatCurrency, formatDate } from '../utils/formatters';
import { numberToIndianCurrencyWords } from '../utils/numberToWords';

export const InvoicePreview = React.forwardRef(({ data, onLogoUpload }, ref) => {
  const { company, invoice, customer, items, details } = data;
  const fileInputRef = React.useRef(null);

  const isIGST = invoice.taxType === 'IGST';

  const handlePreviewLogoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && onLogoUpload) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onLogoUpload(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Calculations
  const calculatedItems = items.map((item, index) => {
    const qty = Number(item.qty) || 0;
    const rate = Number(item.rate) || 0;
    const taxableAmount = Math.round((qty * rate) * 100) / 100;
    const taxRate = Number(item.taxRate) || 0;

    let cgstRate = 0;
    let cgstAmount = 0;
    let sgstRate = 0;
    let sgstAmount = 0;
    let igstRate = 0;
    let igstAmount = 0;

    if (isIGST) {
      igstRate = taxRate;
      igstAmount = Math.round((taxableAmount * (igstRate / 100)) * 100) / 100;
    } else {
      cgstRate = taxRate / 2;
      sgstRate = taxRate / 2;
      cgstAmount = Math.round((taxableAmount * (cgstRate / 100)) * 100) / 100;
      sgstAmount = Math.round((taxableAmount * (sgstRate / 100)) * 100) / 100;
    }

    return {
      ...item,
      slNo: index + 1,
      qty,
      rate,
      taxableAmount,
      cgstRate,
      cgstAmount,
      sgstRate,
      sgstAmount,
      igstRate,
      igstAmount
    };
  });

  const subTotal = calculatedItems.reduce((acc, item) => acc + item.taxableAmount, 0);
  const totalCGST = calculatedItems.reduce((acc, item) => acc + item.cgstAmount, 0);
  const totalSGST = calculatedItems.reduce((acc, item) => acc + item.sgstAmount, 0);
  const totalIGST = calculatedItems.reduce((acc, item) => acc + item.igstAmount, 0);

  const grandTotal = isIGST
    ? subTotal + totalIGST
    : subTotal + totalCGST + totalSGST;

  const paymentMade = Number(details.paymentMade) || 0;
  const balanceDue = Math.max(0, grandTotal - paymentMade);

  // Group total units (e.g. MTs)
  const primaryUnit = items[0]?.unit || 'MTs';
  const totalQuantity = items.reduce((acc, item) => acc + (Number(item.qty) || 0), 0);

  // Words
  const amountInWords = numberToIndianCurrencyWords(grandTotal);

  // Responsive mobile/tablet fit-to-screen scaling
  const outerContainerRef = React.useRef(null);
  const scrollWrapperRef = React.useRef(null);
  const [scale, setScale] = React.useState(1);
  const [autoFit, setAutoFit] = React.useState(true);

  React.useEffect(() => {
    const updateScale = () => {
      if (!outerContainerRef.current) return;
      const availableWidth = outerContainerRef.current.clientWidth - 20;
      const a4WidthPx = 794; // approx width of 210mm
      if (autoFit && availableWidth < a4WidthPx) {
        setScale(Math.max(0.35, availableWidth / a4WidthPx));
      } else {
        setScale(1);
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [autoFit]);

  const handleToggleFit = () => {
    setAutoFit((prev) => {
      const next = !prev;
      if (!next && scrollWrapperRef.current) {
        setTimeout(() => {
          if (scrollWrapperRef.current) {
            scrollWrapperRef.current.scrollLeft = 0;
          }
        }, 50);
      }
      return next;
    });
  };

  return (
    <div ref={outerContainerRef} className="invoice-preview-outer w-full flex flex-col bg-slate-200/60 p-2 sm:p-6 print:p-0 print:bg-white print:m-0 print:w-full">
      {/* Mobile/Tablet Zoom Bar */}
      <div className="no-print w-full flex justify-between items-center bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-300 text-xs mb-3 shadow-xs">
        <span className="text-slate-700 font-medium flex items-center gap-1.5">
          <span>Preview Zoom:</span>
          <strong className="text-slate-900">{Math.round(scale * 100)}%</strong>
          {scale < 1 ? (
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-medium">Fit to Screen</span>
          ) : (
            <span className="text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 font-medium">100% Size</span>
          )}
        </span>
        <button
          type="button"
          onClick={handleToggleFit}
          className="px-3 py-1 text-xs font-semibold rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition shadow-xs"
        >
          {autoFit ? 'View 100% (Scroll)' : 'Fit to Screen'}
        </button>
      </div>

      {/* Horizontal Scroll Area - No negative overflow cutoffs */}
      <div
        ref={scrollWrapperRef}
        className="invoice-preview-scroll w-full overflow-x-auto pb-4 print:pb-0 print:overflow-visible print:w-full"
      >
        <div
          style={{
            width: scale < 1 ? `${Math.round(794 * scale)}px` : undefined,
            height: scale < 1 ? `${Math.round(1123 * scale)}px` : undefined,
            position: scale < 1 ? 'relative' : undefined,
            minWidth: scale < 1 ? undefined : '794px'
          }}
          className={`invoice-preview-scaler ${scale < 1 ? 'mx-auto' : 'w-max mx-auto'} print:w-full print:max-w-full print:static print:transform-none print:m-0`}
        >
          <div
            ref={ref}
            id="invoice-print-area"
            className="invoice-container bg-white text-[#111] shadow-xl print:shadow-none p-6 sm:p-8 print:p-5 flex flex-col justify-between font-sans text-[11px] leading-[1.35] border border-gray-400 print:border-gray-500 box-border flex-shrink-0"
            style={{
              width: '794px',
              minHeight: '1123px',
              transform: scale < 1 ? `scale(${scale})` : 'none',
              transformOrigin: 'top left',
              position: scale < 1 ? 'absolute' : 'relative',
              top: 0,
              left: 0
            }}
          >
            <div>
              {/* Top Section: Logo, Company Info, and TAX INVOICE title */}
              <div className="flex justify-between items-start pb-4 border-b border-gray-400">
                <div className="flex items-stretch">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {/* Logo Area: Constant RAM STEELS Logo */}
                  {company.logoUrl ? (
                    <div className="flex-shrink-0 flex items-center justify-center mr-3.5 relative">
                      <img
                        src={company.logoUrl}
                        alt="Company Logo"
                        style={{ maxHeight: `${company.logoHeight || 60}px` }}
                        className="w-auto max-w-[200px] object-contain block"
                      />
                    </div>
                  ) : (
                    /* Stylized RAM STEELS Logo recreation */
                    <div className="flex-shrink-0 flex flex-col items-center justify-center mr-3.5 min-w-[130px]">
                      <div className="flex items-center space-x-1">
                        <span className="text-2xl font-black tracking-tight text-gray-900">R</span>
                        <div className="relative inline-block">
                          <span className="text-2xl font-black tracking-tight text-gray-900">A</span>
                          <div className="absolute top-[8px] left-[4px] w-2.5 h-1.5 bg-red-600 clip-triangle"></div>
                        </div>
                        <span className="text-2xl font-black tracking-tight text-gray-900">M</span>
                      </div>
                      <div className="w-full flex items-center justify-center my-0.5">
                        <div className="h-[1px] bg-red-600 flex-grow"></div>
                        <span className="text-[9px] font-bold tracking-[0.25em] px-1 text-gray-800 uppercase">
                          STEELS
                        </span>
                        <div className="h-[1px] bg-red-600 flex-grow"></div>
                      </div>
                      {/* Rebar graphic */}
                      <div className="w-full h-1.5 bg-gray-600 my-0.5 rounded-sm relative overflow-hidden flex items-center">
                        <div className="w-full h-[2px] bg-gray-400 border-t border-b border-gray-700"></div>
                      </div>
                      <span className="text-[5.5px] tracking-wider text-gray-500 font-semibold uppercase mt-0.5">
                        STRENGTH THAT BUILDS TOMORROW
                      </span>
                    </div>
                  )}

                  {/* Green vertical divider line: stretches seamlessly according to content height */}
                  <div className="w-[3px] bg-[#16a34a] flex-shrink-0 self-stretch min-h-[60px]"></div>

                  {/* Company Details */}
                  <div className="text-[11px] text-gray-800 leading-tight ml-3.5 flex flex-col justify-center">
                    <div className="font-bold text-[13px] text-black uppercase tracking-wide">
                      {company.name}
                    </div>
                    {company.addressLine1 && <div>{company.addressLine1}</div>}
                    {company.addressLine2 && <div>{company.addressLine2}</div>}
                    {company.cityStatePin && <div>{company.cityStatePin}</div>}
                    {company.country && <div>{company.country}</div>}
                    {company.phone && <div>{company.phone}</div>}
                    {company.email && <div>{company.email}</div>}
                    {company.gstin && (
                      <div className="font-semibold text-gray-900 mt-0.5">
                        GSTIN: {company.gstin}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: TAX INVOICE Title */}
                <div className="text-right flex-shrink-0 whitespace-nowrap pl-4">
                  <h1 className="text-2xl font-bold tracking-tight text-gray-900 uppercase">
                    TAX INVOICE
                  </h1>
                </div>
              </div>

              {/* Invoice Meta Grid */}
              <div className="grid grid-cols-2 border-b border-gray-400 text-[11px]">
                {/* Left Box: #, Invoice Date, Terms, Due Date */}
                <div className="p-2 border-r border-gray-400 space-y-1">
                  <div className="grid grid-cols-[100px_10px_1fr] items-center">
                    <span className="text-gray-700 font-medium">#</span>
                    <span>:</span>
                    <span className="font-semibold text-black">{invoice.invoiceNumber}</span>
                  </div>
                  <div className="grid grid-cols-[100px_10px_1fr] items-center">
                    <span className="text-gray-700">Invoice Date</span>
                    <span>:</span>
                    <span className="font-medium text-black">{formatDate(invoice.invoiceDate)}</span>
                  </div>
                  <div className="grid grid-cols-[100px_10px_1fr] items-center">
                    <span className="text-gray-700">Terms</span>
                    <span>:</span>
                    <span className="text-black">{invoice.terms}</span>
                  </div>
                  <div className="grid grid-cols-[100px_10px_1fr] items-center">
                    <span className="text-gray-700">Due Date</span>
                    <span>:</span>
                    <span className="text-black">{formatDate(invoice.dueDate)}</span>
                  </div>
                </div>

                {/* Right Box: Place of Supply */}
                <div className="p-2 space-y-1">
                  <div className="grid grid-cols-[110px_10px_1fr] items-start">
                    <span className="text-gray-700">Place Of Supply</span>
                    <span>:</span>
                    <span className="font-medium text-black">{invoice.placeOfSupply}</span>
                  </div>
                </div>
              </div>

              {/* Bill To & Ship To Grid */}
              <div className="grid grid-cols-2 border-b border-gray-400 text-[11px]">
                {/* Bill To */}
                <div className="p-2 border-r border-gray-400">
                  <div className="text-gray-600 text-[10px] mb-1">Bill To</div>
                  <div className="font-bold text-[11px] text-black">
                    {customer.billTo.name}
                  </div>
                  {customer.billTo.address && (
                    <div className="text-gray-800 whitespace-pre-line mt-0.5">
                      {customer.billTo.address}
                    </div>
                  )}
                </div>

                {/* Ship To */}
                <div className="p-2">
                  <div className="text-gray-600 text-[10px] mb-1">Ship To</div>
                  <div className="font-medium text-[11px] text-black">
                    {customer.shipTo.name}
                  </div>
                  {customer.shipTo.addressLines && customer.shipTo.addressLines.length > 0 && (
                    <div className="text-gray-800 leading-tight">
                      {customer.shipTo.addressLines.map((line, idx) => (
                        <div key={idx}>{line}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Table of Line Items (HTML table with border-collapse prevents any header line collision) */}
              <div className="border-b border-gray-400">
                <table className="w-full border-collapse table-fixed">
                  <thead>
                    {/* Header Row 1 */}
                    <tr className="bg-gray-50/70 border-b border-gray-400 text-gray-800 text-[10px] font-bold">
                      <th rowSpan={2} className="w-[32px] border-r border-gray-400 py-1.5 px-0.5 text-center align-middle font-bold">
                        #
                      </th>
                      <th rowSpan={2} className="border-r border-gray-400 py-1.5 px-2 text-left align-middle font-bold">
                        Item & Description
                      </th>
                      <th rowSpan={2} className="w-[68px] border-r border-gray-400 py-1.5 px-1 text-center align-middle font-bold">
                        HSN /SAC
                      </th>
                      <th rowSpan={2} className="w-[60px] border-r border-gray-400 py-1.5 pr-2 text-right align-middle font-bold">
                        Qty
                      </th>
                      <th rowSpan={2} className="w-[88px] border-r border-gray-400 py-1.5 pr-2 text-right align-middle font-bold">
                        Rate
                      </th>

                      {isIGST ? (
                        <th colSpan={2} className="border-r border-b border-gray-400 py-1 text-center font-bold text-[10px]">
                          IGST
                        </th>
                      ) : (
                        <>
                          <th colSpan={2} className="border-r border-b border-gray-400 py-1 text-center font-bold text-[10px]">
                            CGST
                          </th>
                          <th colSpan={2} className="border-r border-b border-gray-400 py-1 text-center font-bold text-[10px]">
                            SGST
                          </th>
                        </>
                      )}

                      <th rowSpan={2} className="w-[96px] py-1.5 pr-2 text-right align-middle font-bold">
                        Amount
                      </th>
                    </tr>

                    {/* Header Row 2 (Subheaders: % and Amt) */}
                    <tr className="bg-gray-50/70 border-b border-gray-400 text-gray-800 text-[9px] font-bold">
                      {isIGST ? (
                        <>
                          <th className="w-[36px] border-r border-gray-400 py-1 text-center align-middle font-bold">
                            %
                          </th>
                          <th className="w-[74px] border-r border-gray-400 py-1 pr-2 text-right align-middle font-bold">
                            Amt
                          </th>
                        </>
                      ) : (
                        <>
                          <th className="w-[36px] border-r border-gray-400 py-1 text-center align-middle font-bold">
                            %
                          </th>
                          <th className="w-[72px] border-r border-gray-400 py-1 pr-2 text-right align-middle font-bold">
                            Amt
                          </th>
                          <th className="w-[36px] border-r border-gray-400 py-1 text-center align-middle font-bold">
                            %
                          </th>
                          <th className="w-[72px] border-r border-gray-400 py-1 pr-2 text-right align-middle font-bold">
                            Amt
                          </th>
                        </>
                      )}
                    </tr>
                  </thead>

                  <tbody>
                    {calculatedItems.map((item) => (
                      <tr key={item.id} className="border-b border-gray-300 text-[10px] hover:bg-gray-50/40">
                        <td className="w-[32px] border-r border-gray-400 py-1.5 px-0.5 text-center text-gray-800 align-middle">
                          {item.slNo}
                        </td>
                        <td className="border-r border-gray-400 py-1.5 px-2 text-left font-medium text-gray-900 leading-tight align-middle">
                          {item.description}
                        </td>
                        <td className="w-[68px] border-r border-gray-400 py-1.5 px-1 text-center text-gray-700 align-middle">
                          {item.hsnSac}
                        </td>
                        <td className="w-[60px] border-r border-gray-400 py-1.5 pr-2 text-right text-gray-900 leading-tight align-middle">
                          <div>{item.qty.toFixed(3)}</div>
                          <div className="text-[9px] text-gray-600">{item.unit}</div>
                        </td>
                        <td className="w-[88px] border-r border-gray-400 py-1.5 pr-2 text-right text-gray-900 font-mono text-[9.5px] align-middle">
                          {formatCurrency(item.rate, false, 2)}
                        </td>

                        {isIGST ? (
                          <>
                            <td className="w-[36px] border-r border-gray-400 py-1.5 text-center text-gray-800 align-middle">
                              {item.igstRate}%
                            </td>
                            <td className="w-[74px] border-r border-gray-400 py-1.5 pr-2 text-right text-gray-900 font-mono text-[9.5px] align-middle">
                              {formatCurrency(item.igstAmount, false, 2)}
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="w-[36px] border-r border-gray-400 py-1.5 text-center text-gray-800 align-middle">
                              {item.cgstRate}%
                            </td>
                            <td className="w-[72px] border-r border-gray-400 py-1.5 pr-2 text-right text-gray-900 font-mono text-[9.5px] align-middle">
                              {formatCurrency(item.cgstAmount, false, 2)}
                            </td>
                            <td className="w-[36px] border-r border-gray-400 py-1.5 text-center text-gray-800 align-middle">
                              {item.sgstRate}%
                            </td>
                            <td className="w-[72px] border-r border-gray-400 py-1.5 pr-2 text-right text-gray-900 font-mono text-[9.5px] align-middle">
                              {formatCurrency(item.sgstAmount, false, 2)}
                            </td>
                          </>
                        )}

                        <td className="w-[96px] py-1.5 pr-2 text-right text-gray-950 font-mono font-medium text-[9.5px] align-middle">
                          {formatCurrency(item.taxableAmount, false, 2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Bottom Split Section: Total in MTs, Words, Vehicle, T&C on left | Totals & Signature on right */}
              <div className="grid grid-cols-[1fr_240px] border-b border-gray-400">
                {/* Left Column */}
                <div className="p-2 border-r border-gray-400 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="font-medium text-[11px] text-black">
                      Total in {primaryUnit} {totalQuantity.toFixed(3)}
                    </div>

                    <div className="mt-2 text-[10px]">
                      <div className="text-gray-700">Total In Words</div>
                      <div className="italic font-bold text-gray-900 mt-0.5 leading-snug">
                        {amountInWords}
                      </div>
                    </div>

                    {details.vehicleNo && (
                      <div className="mt-3 text-[10px]">
                        <div className="text-gray-700">Vehicle No</div>
                        <div className="font-medium text-black">{details.vehicleNo}</div>
                      </div>
                    )}
                  </div>

                  {/* Thank you note & Terms */}
                  <div className="text-[10px] space-y-2 pt-2">
                    {details.thankYouMessage && (
                      <div className="text-gray-800">
                        {details.thankYouMessage}
                      </div>
                    )}

                    {details.termsAndConditions && details.termsAndConditions.length > 0 && (
                      <div>
                        <div className="font-semibold text-gray-900 mb-0.5">
                          Terms & Conditions
                        </div>
                        <div className="text-gray-700 leading-tight">
                          {details.termsAndConditions.map((term, i) => (
                            <div key={i}>{term}</div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Financial Summary & Signature */}
                <div className="flex flex-col justify-between">
                  {/* Summary Table */}
                  <div className="text-[10px] p-2 space-y-1.5 border-b border-gray-400">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Sub Total</span>
                      <span className="font-mono text-gray-900">{formatCurrency(subTotal, false, 2)}</span>
                    </div>

                    {isIGST ? (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">IGST ({calculatedItems[0]?.igstRate || 18}%)</span>
                        <span className="font-mono text-gray-900">{formatCurrency(totalIGST, false, 2)}</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">CGST9 (9%)</span>
                          <span className="font-mono text-gray-900">{formatCurrency(totalCGST, false, 2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">SGST9 (9%)</span>
                          <span className="font-mono text-gray-900">{formatCurrency(totalSGST, false, 2)}</span>
                        </div>
                      </>
                    )}

                    <div className="flex justify-between items-center pt-1 border-t border-gray-300 font-bold text-[11px]">
                      <span className="text-black">Total</span>
                      <span className="font-mono text-black font-semibold">₹{formatCurrency(grandTotal, false, 2)}</span>
                    </div>

                    <div className="flex justify-between items-center text-red-600 font-medium">
                      <span>Payment Made</span>
                      <span className="font-mono">(-) {formatCurrency(paymentMade, false, 2)}</span>
                    </div>

                    <div className="flex justify-between items-center pt-1 border-t border-gray-300 font-bold text-[11px]">
                      <span className="text-black">Balance Due</span>
                      <span className="font-mono text-black">₹{formatCurrency(balanceDue, false, 2)}</span>
                    </div>
                  </div>

                  {/* Signature Box */}
                  <div className="p-2 h-20 flex flex-col justify-end items-center text-center">
                    <div className="text-[10px] text-gray-700 border-t border-gray-300 pt-1 w-full text-center">
                      {details.authorizedSignatory || 'Authorized Signature'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

InvoicePreview.displayName = 'InvoicePreview';
