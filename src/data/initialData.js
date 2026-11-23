import ramSteelsLogo from '../assets/ram-steels-logo.png';

// Constant Company Details (Fixed for Ram Steels)
export const CONSTANT_COMPANY_DETAILS = {
  name: "RAM STEELS",
  logoUrl: ramSteelsLogo,
  useSampleLogo: false,
  logoHeight: 65,
  addressLine1: "DNO : 5-97-12, Ram Steels, Ground Floor",
  addressLine2: "1st Lane, Lakshmipuram",
  cityStatePin: "Guntur Andhra Pradesh 522002",
  country: "India",
  phone: "91-9701122555",
  email: "operations.ramsteels@gmail.com",
  gstin: "37PYIPS0358Q1Z6"
};

export const initialInvoiceData = {
  // Fixed Company Information
  company: CONSTANT_COMPANY_DETAILS,

  // Invoice Details
  invoice: {
    invoiceNumber: "INV-000006",
    invoiceDate: "2026-09-24", // 24/09/2026
    terms: "Due on Receipt",
    dueDate: "2026-09-24", // 24/09/2026
    placeOfSupply: "Andhra Pradesh (37)",
    taxType: "CGST_SGST", // "CGST_SGST" or "IGST"
    defaultTaxRate: 18 // 9% CGST + 9% SGST
  },

  // Customer Information
  customer: {
    billTo: {
      name: "SRI RAM GARU",
      address: ""
    },
    shipTo: {
      name: "MALLARAM",
      addressLines: [
        "Lakshmipuram",
        "Guntur",
        "522002",
        "India"
      ]
    }
  },

  // Line items matching the exact image
  items: [
    {
      id: "1",
      description: "6 MM MS REBAR",
      hsnSac: "72141090",
      qty: 0.164,
      unit: "MTs",
      rate: 61016.95,
      taxRate: 18 // 9% CGST + 9% SGST
    },
    {
      id: "2",
      description: "12MM MS REBAR",
      hsnSac: "72141090",
      qty: 0.274,
      unit: "MTs",
      rate: 59322.03,
      taxRate: 18
    },
    {
      id: "3",
      description: "BINDING WIRE A",
      hsnSac: "721710",
      qty: 0.025,
      unit: "MTs",
      rate: 80508.47,
      taxRate: 18
    },
    {
      id: "4",
      description: "10MM JSWONE REBAR",
      hsnSac: "72141090",
      qty: 0.450,
      unit: "MTs",
      rate: 55500.00,
      taxRate: 18
    }
  ],

  // Extra Details & Disclaimers
  details: {
    vehicleNo: "AP39UM7687",
    thankYouMessage: "Thank you for your business! We appreciate your Trust in Ram Steels.",
    termsAndConditions: [
      "Unloading Client's Scope",
      "Advance Payment",
      "Weight Tolerance +/- 5Kgs per ton should be permitted."
    ],
    authorizedSignatory: "Authorized Signature",
    paymentMade: 62833.51 // Matches image
  }
};
