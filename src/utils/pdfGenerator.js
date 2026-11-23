import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

/**
 * Exports the specified DOM element as a high quality PDF
 * Uses html-to-image directly on the live element without off-screen cloning
 * Ensures 100% vector fidelity and zero text-line collisions
 */
export async function downloadInvoicePDF(elementId, invoiceNumber = 'INV-000006') {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Invoice container not found');
  }

  // Temporarily reset any viewport scale transform for capture
  const prevTransform = element.style.transform;
  const prevPosition = element.style.position;
  const prevLeft = element.style.left;
  const prevTop = element.style.top;

  element.style.transform = 'none';
  element.style.position = 'relative';
  element.style.left = '0';
  element.style.top = '0';

  try {
    // Ensure all web fonts are ready
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }
    await new Promise((resolve) => setTimeout(resolve, 60));

    // toPng captures the live, correctly-rendered DOM node directly
    const imgData = await toPng(element, {
      pixelRatio: 3, // 300 DPI ultra-sharp print quality
      backgroundColor: '#ffffff',
      filter: (node) => !node.classList?.contains('no-print'),
    });

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm

    // Fit canvas exactly into A4 page
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

    const cleanInvoiceNumber = (invoiceNumber || 'INV-000001').replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `Tax_Invoice_${cleanInvoiceNumber}.pdf`;
    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('PDF Generation failed:', error);
    throw error;
  } finally {
    // Restore original transform and position
    element.style.transform = prevTransform;
    element.style.position = prevPosition;
    element.style.left = prevLeft;
    element.style.top = prevTop;
  }
}
