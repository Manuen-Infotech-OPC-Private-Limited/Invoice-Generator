import React, { useState, useRef } from 'react';
import {
  Building2,
  FileText,
  UserCheck,
  ShoppingCart,
  CreditCard,
  Plus,
  Trash2,
  Upload,
  RefreshCw,
  FileCheck,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Sliders,
  Lock
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export function InvoiceForm({ data, onChange, onLogoUpload, onResetToSample, onClear }) {
  const [activeSection, setActiveSection] = useState('meta'); // default to invoice metadata & items
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const toggleSection = (sec) => {
    setActiveSection(activeSection === sec ? null : sec);
  };

  // Company field updates
  const handleCompanyChange = (field, value) => {
    onChange({
      ...data,
      company: { ...data.company, [field]: value }
    });
  };

  // Process File upload
  const processFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (onLogoUpload) {
          onLogoUpload(reader.result);
        } else {
          onChange({
            ...data,
            company: {
              ...data.company,
              logoUrl: reader.result,
              useSampleLogo: false
            }
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveLogo = () => {
    onChange({
      ...data,
      company: {
        ...data.company,
        logoUrl: '',
        useSampleLogo: false
      }
    });
  };

  const handleUseSampleLogo = () => {
    onChange({
      ...data,
      company: {
        ...data.company,
        logoUrl: '',
        useSampleLogo: true
      }
    });
  };

  // Invoice meta updates
  const handleInvoiceChange = (field, value) => {
    onChange({
      ...data,
      invoice: { ...data.invoice, [field]: value }
    });
  };

  // Customer updates
  const handleCustomerBillToChange = (field, value) => {
    onChange({
      ...data,
      customer: {
        ...data.customer,
        billTo: { ...data.customer.billTo, [field]: value }
      }
    });
  };

  const handleCustomerShipToChange = (field, value) => {
    onChange({
      ...data,
      customer: {
        ...data.customer,
        shipTo: { ...data.customer.shipTo, [field]: value }
      }
    });
  };

  const handleShipToAddressChange = (index, value) => {
    const updatedLines = [...(data.customer.shipTo.addressLines || [])];
    updatedLines[index] = value;
    handleCustomerShipToChange('addressLines', updatedLines);
  };

  const addShipToAddressLine = () => {
    const updatedLines = [...(data.customer.shipTo.addressLines || []), ''];
    handleCustomerShipToChange('addressLines', updatedLines);
  };

  const removeShipToAddressLine = (index) => {
    const updatedLines = data.customer.shipTo.addressLines.filter((_, i) => i !== index);
    handleCustomerShipToChange('addressLines', updatedLines);
  };

  // Items manipulation
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...data.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: field === 'qty' || field === 'rate' || field === 'taxRate'
        ? (value === '' ? '' : Number(value))
        : value
    };
    onChange({ ...data, items: updatedItems });
  };

  const addItem = () => {
    const newItem = {
      id: Date.now().toString(),
      description: 'NEW PRODUCT / ITEM',
      hsnSac: '72141090',
      qty: 1.000,
      unit: data.items[0]?.unit || 'MTs',
      rate: 1000,
      taxRate: data.invoice.defaultTaxRate || 18
    };
    onChange({ ...data, items: [...data.items, newItem] });
  };

  const removeItem = (index) => {
    if (data.items.length <= 1) {
      alert('At least one item is required on the invoice.');
      return;
    }
    const updatedItems = data.items.filter((_, i) => i !== index);
    onChange({ ...data, items: updatedItems });
  };

  // Details updates
  const handleDetailsChange = (field, value) => {
    onChange({
      ...data,
      details: {
        ...data.details,
        [field]: field === 'paymentMade' ? (value === '' ? '' : Number(value)) : value
      }
    });
  };

  const handleTermChange = (index, value) => {
    const updatedTerms = [...data.details.termsAndConditions];
    updatedTerms[index] = value;
    handleDetailsChange('termsAndConditions', updatedTerms);
  };

  const addTerm = () => {
    const updatedTerms = [...data.details.termsAndConditions, ''];
    handleDetailsChange('termsAndConditions', updatedTerms);
  };

  const removeTerm = (index) => {
    const updatedTerms = data.details.termsAndConditions.filter((_, i) => i !== index);
    handleDetailsChange('termsAndConditions', updatedTerms);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden text-sm">
      {/* Quick Action Bar inside Editor */}
      <div className="bg-slate-50 border-b border-slate-200 p-3 sm:p-4 flex flex-wrap gap-2 justify-between items-center">
        <div className="font-semibold text-slate-800 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <span>Invoice Editor & Details</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onResetToSample}
            className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition flex items-center gap-1.5 shadow-sm"
            title="Load sample template data from Ram Steels"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
            <span>Load Sample (Ram Steels)</span>
          </button>
          <button
            type="button"
            onClick={onClear}
            className="px-2.5 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition flex items-center gap-1.5 shadow-sm"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        {/* Section 1: Company Profile (Constant / Fixed for Ram Steels) */}
        <div>
          <button
            type="button"
            onClick={() => toggleSection('company')}
            className="w-full px-4 py-3 bg-slate-50/70 hover:bg-slate-100/60 flex items-center justify-between text-left transition font-semibold text-slate-800"
          >
            <div className="flex items-center gap-2.5">
              <Building2 className="w-4 h-4 text-amber-600" />
              <span>1. Company Profile (Ram Steels)</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-normal text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full ml-1.5">
                <Lock className="w-3 h-3 text-emerald-600" /> Constant
              </span>
            </div>
            {activeSection === 'company' ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
          </button>

          {activeSection === 'company' && (
            <div className="p-4 space-y-3">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-3">
                    {data.company.logoUrl && (
                      <div className="h-10 w-24 bg-white border border-slate-200 rounded p-1 flex items-center justify-center">
                        <img
                          src={data.company.logoUrl}
                          alt="Ram Steels Logo"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    )}
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Company Name</span>
                      <h3 className="font-bold text-sm text-slate-900">{data.company.name}</h3>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-md flex items-center gap-1 font-medium shadow-xs">
                    <Lock className="w-3 h-3 text-emerald-600" /> Fixed / Non-editable
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700 pt-1">
                  <div>
                    <span className="text-slate-500 block text-[10px] font-semibold uppercase">Registered Address</span>
                    <p className="font-medium text-slate-900 mt-0.5">{data.company.addressLine1}</p>
                    <p className="font-medium text-slate-900">{data.company.addressLine2}</p>
                    <p className="font-medium text-slate-900">{data.company.cityStatePin}, {data.company.country}</p>
                  </div>
                  <div className="space-y-1.5">
                    <div>
                      <span className="text-slate-500 block text-[10px] font-semibold uppercase">Phone</span>
                      <span className="font-medium text-slate-900">{data.company.phone}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] font-semibold uppercase">Email</span>
                      <span className="font-medium text-slate-900">{data.company.email}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] font-semibold uppercase">GSTIN</span>
                      <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 inline-block">
                        {data.company.gstin}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Invoice Metadata & Taxes */}
        <div>
          <button
            type="button"
            onClick={() => toggleSection('meta')}
            className="w-full px-4 py-3 bg-slate-50/70 hover:bg-slate-100/60 flex items-center justify-between text-left transition font-semibold text-slate-800"
          >
            <div className="flex items-center gap-2.5">
              <FileCheck className="w-4 h-4 text-blue-600" />
              <span>2. Invoice Details & Dates</span>
            </div>
            {activeSection === 'meta' ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
          </button>

          {activeSection === 'meta' && (
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Invoice Number (#)
                </label>
                <input
                  type="text"
                  value={data.invoice.invoiceNumber}
                  onChange={(e) => handleInvoiceChange('invoiceNumber', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Place Of Supply
                </label>
                <input
                  type="text"
                  value={data.invoice.placeOfSupply}
                  onChange={(e) => handleInvoiceChange('placeOfSupply', e.target.value)}
                  placeholder="e.g. Andhra Pradesh (37)"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Invoice Date
                </label>
                <input
                  type="date"
                  value={data.invoice.invoiceDate}
                  onChange={(e) => handleInvoiceChange('invoiceDate', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={data.invoice.dueDate}
                  onChange={(e) => handleInvoiceChange('dueDate', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Terms
                </label>
                <input
                  type="text"
                  value={data.invoice.terms}
                  onChange={(e) => handleInvoiceChange('terms', e.target.value)}
                  placeholder="e.g. Due on Receipt, Net 15, Net 30"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  GST Mode
                </label>
                <select
                  value={data.invoice.taxType}
                  onChange={(e) => handleInvoiceChange('taxType', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none font-medium"
                >
                  <option value="CGST_SGST">Intra-State (CGST + SGST split)</option>
                  <option value="IGST">Inter-State (IGST single column)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Section 3: Customer (Bill To & Ship To) */}
        <div>
          <button
            type="button"
            onClick={() => toggleSection('customer')}
            className="w-full px-4 py-3 bg-slate-50/70 hover:bg-slate-100/60 flex items-center justify-between text-left transition font-semibold text-slate-800"
          >
            <div className="flex items-center gap-2.5">
              <UserCheck className="w-4 h-4 text-indigo-600" />
              <span>3. Customer Information (Bill To & Ship To)</span>
            </div>
            {activeSection === 'customer' ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
          </button>

          {activeSection === 'customer' && (
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Bill To */}
              <div className="p-3 bg-slate-50/60 rounded-lg border border-slate-200 space-y-2">
                <span className="font-semibold text-xs text-slate-800 block">Bill To</span>
                <div>
                  <label className="block text-[11px] text-slate-600 mb-0.5">Name / Company</label>
                  <input
                    type="text"
                    value={data.customer.billTo.name}
                    onChange={(e) => handleCustomerBillToChange('name', e.target.value)}
                    placeholder="e.g. SRI RAM GARU"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 mb-0.5">Address (Optional)</label>
                  <textarea
                    rows={3}
                    value={data.customer.billTo.address}
                    onChange={(e) => handleCustomerBillToChange('address', e.target.value)}
                    placeholder="Street, City, GSTIN, etc."
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Ship To */}
              <div className="p-3 bg-slate-50/60 rounded-lg border border-slate-200 space-y-2">
                <span className="font-semibold text-xs text-slate-800 block">Ship To</span>
                <div>
                  <label className="block text-[11px] text-slate-600 mb-0.5">Recipient / Site Name</label>
                  <input
                    type="text"
                    value={data.customer.shipTo.name}
                    onChange={(e) => handleCustomerShipToChange('name', e.target.value)}
                    placeholder="e.g. MALLARAM"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 mb-0.5">Address Lines</label>
                  <div className="space-y-1">
                    {data.customer.shipTo.addressLines?.map((line, idx) => (
                      <div key={idx} className="flex gap-1">
                        <input
                          type="text"
                          value={line}
                          onChange={(e) => handleShipToAddressChange(idx, e.target.value)}
                          placeholder={`Address line ${idx + 1}`}
                          className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => removeShipToAddressLine(idx)}
                          className="p-1 text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addShipToAddressLine}
                      className="text-[11px] text-blue-600 hover:underline pt-1 flex items-center gap-1 font-medium"
                    >
                      <Plus className="w-3 h-3" /> Add line
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 4: Line Items Table */}
        <div>
          <button
            type="button"
            onClick={() => toggleSection('items')}
            className="w-full px-4 py-3 bg-slate-50/70 hover:bg-slate-100/60 flex items-center justify-between text-left transition font-semibold text-slate-800"
          >
            <div className="flex items-center gap-2.5">
              <ShoppingCart className="w-4 h-4 text-emerald-600" />
              <span>4. Line Items & Rates ({data.items.length})</span>
            </div>
            {activeSection === 'items' ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
          </button>

          {activeSection === 'items' && (
            <div className="p-4 space-y-4">
              <div className="space-y-3">
                {data.items.map((item, index) => {
                  const qty = Number(item.qty) || 0;
                  const rate = Number(item.rate) || 0;
                  const itemTaxable = Math.round(qty * rate * 100) / 100;
                  const taxRate = Number(item.taxRate) || 0;
                  const taxAmt = Math.round(itemTaxable * (taxRate / 100) * 100) / 100;

                  return (
                    <div
                      key={item.id}
                      className="p-3 bg-slate-50/70 rounded-lg border border-slate-200 space-y-2 relative group"
                    >
                      <div className="flex justify-between items-center pb-1 border-b border-slate-200/80">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center">
                            #{index + 1}
                          </span>
                          <span className="font-semibold text-slate-800 text-xs truncate max-w-[200px]">
                            {item.description || 'Item Name'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-slate-600">
                            Taxable: <strong className="text-slate-900 font-mono">₹{formatCurrency(itemTaxable, false)}</strong>
                          </span>
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 sm:gap-3">
                        {/* Description */}
                        <div className="col-span-2 sm:col-span-3">
                          <label className="block text-[11px] font-medium text-slate-600 mb-1">
                            Item & Description
                          </label>
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                            placeholder="e.g. 12MM MS REBAR"
                            className="w-full px-2.5 py-2 sm:py-1.5 text-sm sm:text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none"
                          />
                        </div>

                        {/* HSN/SAC */}
                        <div className="col-span-1 sm:col-span-1">
                          <label className="block text-[11px] font-medium text-slate-600 mb-1">
                            HSN / SAC
                          </label>
                          <input
                            type="text"
                            value={item.hsnSac}
                            onChange={(e) => handleItemChange(index, 'hsnSac', e.target.value)}
                            placeholder="72141090"
                            className="w-full px-2 py-2 sm:py-1.5 text-sm sm:text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none text-center"
                          />
                        </div>

                        {/* Unit */}
                        <div className="col-span-1 sm:col-span-1">
                          <label className="block text-[11px] font-medium text-slate-600 mb-1">
                            Unit
                          </label>
                          <input
                            type="text"
                            value={item.unit}
                            onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                            placeholder="MTs"
                            className="w-full px-2 py-2 sm:py-1.5 text-sm sm:text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none text-center uppercase"
                          />
                        </div>

                        {/* Qty */}
                        <div className="col-span-1 sm:col-span-1">
                          <label className="block text-[11px] font-medium text-slate-600 mb-1">
                            Quantity
                          </label>
                          <input
                            type="number"
                            step="any"
                            value={item.qty}
                            onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                            className="w-full px-2 py-2 sm:py-1.5 text-sm sm:text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none text-right font-mono"
                          />
                        </div>

                        {/* Rate */}
                        <div className="col-span-1 sm:col-span-2">
                          <label className="block text-[11px] font-medium text-slate-600 mb-1">
                            Rate (₹)
                          </label>
                          <input
                            type="number"
                            step="any"
                            value={item.rate}
                            onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                            placeholder="61016.95"
                            className="w-full px-2.5 py-2 sm:py-1.5 text-sm sm:text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none text-right font-mono"
                          />
                        </div>

                        {/* Tax Rate % */}
                        <div className="col-span-2 sm:col-span-2">
                          <label className="block text-[11px] font-medium text-slate-600 mb-1">
                            Total GST Rate (%)
                          </label>
                          <select
                            value={item.taxRate}
                            onChange={(e) => handleItemChange(index, 'taxRate', e.target.value)}
                            className="w-full px-2 py-2 sm:py-1.5 text-sm sm:text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none"
                          >
                            <option value="18">18% (9% CGST + 9% SGST)</option>
                            <option value="12">12% (6% CGST + 6% SGST)</option>
                            <option value="28">28% (14% CGST + 14% SGST)</option>
                            <option value="5">5% (2.5% CGST + 2.5% SGST)</option>
                            <option value="0">0% (Exempt / Nil)</option>
                          </select>
                        </div>

                        {/* Tax Computed display */}
                        <div className="col-span-2 sm:col-span-1 flex flex-col justify-end text-right pb-1 text-xs text-slate-600">
                          <span>GST Amt: <strong className="font-mono text-slate-900">₹{formatCurrency(taxAmt, false)}</strong></span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={addItem}
                className="w-full py-2 border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/50 text-blue-600 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Another Line Item</span>
              </button>
            </div>
          )}
        </div>

        {/* Section 5: Payment, Vehicle No, & Terms */}
        <div>
          <button
            type="button"
            onClick={() => toggleSection('details')}
            className="w-full px-4 py-3 bg-slate-50/70 hover:bg-slate-100/60 flex items-center justify-between text-left transition font-semibold text-slate-800"
          >
            <div className="flex items-center gap-2.5">
              <CreditCard className="w-4 h-4 text-purple-600" />
              <span>5. Payments, Vehicle & Terms</span>
            </div>
            {activeSection === 'details' ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
          </button>

          {activeSection === 'details' && (
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Payment Made (₹)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={data.details.paymentMade}
                    onChange={(e) => handleDetailsChange('paymentMade', e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none font-mono text-red-600 font-semibold"
                  />
                  <span className="text-[10px] text-slate-500">
                    Will show as red <strong>(-) Amount</strong> in summary
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Vehicle Number
                  </label>
                  <input
                    type="text"
                    value={data.details.vehicleNo}
                    onChange={(e) => handleDetailsChange('vehicleNo', e.target.value)}
                    placeholder="e.g. AP39UM7687"
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Thank You Message
                  </label>
                  <input
                    type="text"
                    value={data.details.thankYouMessage}
                    onChange={(e) => handleDetailsChange('thankYouMessage', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Authorized Signatory Label
                  </label>
                  <input
                    type="text"
                    value={data.details.authorizedSignatory}
                    onChange={(e) => handleDetailsChange('authorizedSignatory', e.target.value)}
                    placeholder="Authorized Signature"
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Terms & Conditions list */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Terms & Conditions Lines
                </label>
                <div className="space-y-1.5">
                  {data.details.termsAndConditions?.map((term, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={term}
                        onChange={(e) => handleTermChange(idx, e.target.value)}
                        className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeTerm(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addTerm}
                    className="text-xs text-blue-600 hover:underline pt-1 flex items-center gap-1 font-medium"
                  >
                    <Plus className="w-3 h-3" /> Add Condition
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
