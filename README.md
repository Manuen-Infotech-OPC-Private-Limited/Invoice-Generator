# Invoice-Generator: Tax Invoice Generator

A pure frontend React application that reproduces the standard Indian GST Tax Invoice template with 1:1 pixel accuracy.

## Features
- **100% Client-Side**: No database or external server required.
- **Accurate Template Replica**:
  - Exact layout with company details, vertical accent bar, and stylized logo
  - Invoice metadata grid (`#`, Invoice Date, Terms, Due Date, Place of Supply)
  - `Bill To` and `Ship To` grid
  - Line Items table with `#`, `Item & Description`, `HSN /SAC`, `Qty`, `Rate`, `CGST` (`%`, `Amt`), `SGST` (`%`, `Amt`), and `Amount`
  - Real-time calculations for:
    - Sub Total
    - CGST / SGST (or IGST for interstate transactions)
    - Total
    - Payment Made (shown in red as `(-) Amount`)
    - Balance Due
    - Total in MTs (or chosen unit)
    - Total In Words in Indian numbering format (Crores, Lakhs, Thousands, Paise)
  - Vehicle No, Thank You note, Terms & Conditions, and Authorized Signature box
  - Standard clean footer
- **Multiple Export Options**:
  - **Download PDF**: Direct PDF download with client-side canvas generation
  - **Print / Save**: Native browser print dialog formatted precisely for A4 paper with zero blurriness
- **Customization**:
  - Supports custom company logo upload
  - Configurable GST rates (18%, 12%, 28%, 5%, 0%)
  - Toggle between Intra-State (CGST + SGST) and Inter-State (IGST)
  - Add, remove, and reorder line items and terms & conditions

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:5174](http://localhost:5174) in your browser.

### 3. Build for Production
```bash
npm run build
```
The static build will be generated in the `dist` folder.
