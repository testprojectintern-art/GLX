import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { VehicleItem } from './types';

export interface QuotationPdfData {
  quotationRef: string;
  date: string;
  customerName: string;
  customerPhone: string;
  customerCity?: string;
  vehicle: VehicleItem;
  selectedOptions: string[];
  estimatedTotal: number;
  customerNotes?: string;
  logoBase64?: string;
}

function formatLKR(amount: number) {
  return 'Rs. ' + (amount || 0).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Helper to fetch logo as base64 in browser
async function fetchLogoBase64(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  try {
    const res = await fetch('/logo.jpg');
    if (!res.ok) return null;
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.error('Failed to load logo for PDF:', err);
    return null;
  }
}

export async function generateQuotationPdf(data: QuotationPdfData) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 12;
  const contentWidth = pageWidth - (margin * 2);

  // Load logo base64 if not provided
  let logoImg = data.logoBase64;
  if (!logoImg) {
    logoImg = (await fetchLogoBase64()) || undefined;
  }

  // =========================================================================
  // 1. TOP HEADER & BRAND LETTERHEAD (Y: 10mm -> 32mm)
  // =========================================================================
  if (logoImg) {
    try {
      doc.addImage(logoImg, 'JPEG', margin, 10, 20, 20);
    } catch (e) {
      console.warn('Could not render logo image:', e);
    }
  }

  const headerTextX = logoImg ? margin + 24 : margin;
  const remainingWidth = pageWidth - margin - headerTextX;
  const colWidth = remainingWidth / 3;

  // Col 1: Head Office
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('GLX Industries (Pvt) Ltd', headerTextX, 14.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(71, 85, 105);
  doc.text('No.14, Negombo Road,', headerTextX, 19);
  doc.text('Thudella, Ja-Ela,', headerTextX, 23);
  doc.text('Sri Lanka. (11350)', headerTextX, 27);

  // Col 2: Factory Workshop
  const col2X = headerTextX + colWidth;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('GLX TRUCK BODY ENGINEERS', col2X, 14.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.2);
  doc.setTextColor(100, 116, 139);
  doc.text('ALUMINIUM, STEEL & FREEZER BOXES', col2X, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(71, 85, 105);
  doc.text('No.2020/3L, 2, Seeduwa Road,', col2X, 22.5);
  doc.text('Kotugoda, Ja-Ela. (11390)', col2X, 26.5);

  // Col 3: Contacts & Hotlines
  const col3X = col2X + colWidth;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(30, 41, 59);
  doc.text('Mobile : 077 226 8608 / 071 666 6888', col3X, 14.5);
  doc.text('Tel    : 011 740 4446 / 011 223 4567', col3X, 18.5);
  doc.text('Email  : info@glxindustries.lk', col3X, 22.5);
  doc.text('Web    : www.glxindustries.lk', col3X, 26.5);

  // Header Divider
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.line(margin, 32.5, pageWidth - margin, 32.5);

  // =========================================================================
  // 2. DOCUMENT TITLE & CUSTOMER METADATA CARD (Y: 35mm -> 56mm)
  // =========================================================================
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('OFFICIAL COMMERCIAL VEHICLE BODY QUOTATION', pageWidth / 2, 38, { align: 'center' });

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, 41.5, contentWidth, 18, 1, 1, 'FD');

  // Customer Details (Left)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('CUSTOMER / VEHICLE OWNER', margin + 4, 46);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(data.customerName || 'Valued Client', margin + 4, 51);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Contact: ${data.customerPhone || 'N/A'}${data.customerCity ? ` | ${data.customerCity}` : ''}`, margin + 4, 55.5);

  // Quotation Meta Details (Right)
  const metaRightX = pageWidth - margin - 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Quotation No : `, metaRightX - 44, 46);
  doc.setTextColor(15, 23, 42);
  doc.text(data.quotationRef, metaRightX, 46, { align: 'right' });

  doc.setTextColor(71, 85, 105);
  doc.text(`Branch / Date: `, metaRightX - 44, 51);
  doc.setTextColor(15, 23, 42);
  doc.text(`JA-ELA | ${data.date}`, metaRightX, 51, { align: 'right' });

  doc.setTextColor(71, 85, 105);
  doc.text(`Validity     : `, metaRightX - 44, 55.5);
  doc.setTextColor(217, 119, 6);
  doc.text(`14 Days from issue`, metaRightX, 55.5, { align: 'right' });

  // =========================================================================
  // 3. SPECIFICATIONS & ITEMS TABLE (Y: 62.5mm)
  // =========================================================================
  const specs = data.vehicle.specs;
  const optionsText = data.selectedOptions.length > 0 
    ? `• Custom Options        : ${data.selectedOptions.join(', ')}\n`
    : '';

  const specsDetailText = 
    `• Chassis Compatibility : ${specs.chassisCompatibility}\n` +
    `• Sheet Material        : ${specs.sheetMaterial}\n` +
    `• Floor Deck Plate      : ${specs.floorPlate}\n` +
    `• Paint & Surface Finish: ${specs.paintFinish}\n` +
    `• Body Dimensions       : ${specs.dimensions} (Configured to Vehicle)\n` +
    optionsText +
    `• Build Origin          : 100% MADE IN GLX SRI LANKA\n` +
    `• Structural Warranty   : 10-Year Japan Model (Frame, Main Runners & Joint Guarantee)`;

  autoTable(doc, {
    startY: 62.5,
    head: [['DESCRIPTION', 'RATE', 'QTY', 'AMOUNT']],
    body: [
      [
        {
          content: `${data.vehicle.name.toUpperCase()}\n${specsDetailText}`,
          styles: { fontStyle: 'normal' }
        },
        formatLKR(data.estimatedTotal),
        '1',
        formatLKR(data.estimatedTotal)
      ]
    ],
    theme: 'grid',
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'left',
    },
    columnStyles: {
      0: { cellWidth: 114, fontSize: 7.2, textColor: [30, 41, 59] },
      1: { cellWidth: 26, halign: 'right', fontSize: 7.5, fontStyle: 'bold', textColor: [15, 23, 42] },
      2: { cellWidth: 12, halign: 'center', fontSize: 7.5, textColor: [15, 23, 42] },
      3: { cellWidth: 34, halign: 'right', fontSize: 8, fontStyle: 'bold', textColor: [15, 23, 42] }
    },
    styles: {
      cellPadding: 2.5,
      lineColor: [203, 213, 225],
      lineWidth: 0.3,
    },
    margin: { left: margin, right: margin }
  });

  const tableFinalY = (doc as any).lastAutoTable.finalY + 4;

  // =========================================================================
  // 4. BANK DETAILS & PRICING TOTALS SUMMARY (Y: ~148mm)
  // =========================================================================
  const leftBoxWidth = 98;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, tableFinalY, leftBoxWidth, 29, 1, 1, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('BANK DETAILS FOR DIRECT PAYMENTS:', margin + 3.5, tableFinalY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(51, 65, 85);
  doc.text('Account Name : GLX TRUCK BODY ENGINEERS', margin + 3.5, tableFinalY + 10);
  doc.text('Account No   : 100600002717', margin + 3.5, tableFinalY + 14.5);
  doc.text('Bank & Branch: Nations Trust Bank — Ja-Ela Branch', margin + 3.5, tableFinalY + 19);
  doc.setTextColor(100, 116, 139);
  doc.text('Forward deposit slips to WhatsApp 077 226 8608 or info@glxindustries.lk', margin + 3.5, tableFinalY + 24.5);

  // Right Totals Box
  const rightBoxX = pageWidth - margin - 80;
  const rightBoxWidth = 80;
  const advanceAmount = data.estimatedTotal * 0.70;
  const balanceAmount = data.estimatedTotal * 0.30;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(rightBoxX, tableFinalY, rightBoxWidth, 29, 1, 1, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(71, 85, 105);
  doc.text('ITEMS SUB TOTAL :', rightBoxX + 3.5, tableFinalY + 5.5);
  doc.text(formatLKR(data.estimatedTotal), rightBoxX + rightBoxWidth - 3.5, tableFinalY + 5.5, { align: 'right' });

  doc.text('SPECIAL DISCOUNT :', rightBoxX + 3.5, tableFinalY + 10);
  doc.text('Rs. 0.00', rightBoxX + rightBoxWidth - 3.5, tableFinalY + 10, { align: 'right' });

  doc.setDrawColor(203, 213, 225);
  doc.line(rightBoxX + 3.5, tableFinalY + 12.5, rightBoxX + rightBoxWidth - 3.5, tableFinalY + 12.5);

  // Grand Total
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('GRAND TOTAL :', rightBoxX + 3.5, tableFinalY + 17);
  doc.setTextColor(30, 58, 138);
  doc.text(formatLKR(data.estimatedTotal), rightBoxX + rightBoxWidth - 3.5, tableFinalY + 17, { align: 'right' });

  // Advance (70%)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(217, 119, 6);
  doc.text('70% ADVANCE REQ :', rightBoxX + 3.5, tableFinalY + 22);
  doc.text(formatLKR(advanceAmount), rightBoxX + rightBoxWidth - 3.5, tableFinalY + 22, { align: 'right' });

  // Balance (30%)
  doc.setTextColor(16, 185, 129);
  doc.text('30% ON COMPLETION :', rightBoxX + 3.5, tableFinalY + 26.5);
  doc.text(formatLKR(balanceAmount), rightBoxX + rightBoxWidth - 3.5, tableFinalY + 26.5, { align: 'right' });

  // =========================================================================
  // 5. CONDITION OF PAYMENTS & DELIVERY TERMS (Y: ~182mm)
  // =========================================================================
  const termsY = tableFinalY + 32.5;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, termsY, contentWidth, 19, 1, 1, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('CONDITION OF PAYMENTS & WORKSHOP DELIVERY TERMS:', margin + 3.5, termsY + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(51, 65, 85);
  doc.text('a). 70% Advance Payment required with the confirmation of the order.', margin + 3.5, termsY + 9);
  doc.text('b). Balance 30% Payment strictly upon full fabrication completion & final inspection.', margin + 3.5, termsY + 13);
  doc.text(`c). Delivery / Turnaround : ${data.vehicle.leadTime || '5 - 10 Working Days'} following vehicle chassis handover at workshop.`, margin + 3.5, termsY + 17);

  // =========================================================================
  // 6. OFFICIAL SIGNATURES SECTION DOCKED AT THE BOTTOM (Y: 248mm)
  // =========================================================================
  const sigY = 248; // Docked firmly above bottom footer
  const sigBoxWidth = (contentWidth - 16) / 3;

  // 1. Prepared By
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.line(margin, sigY + 12, margin + sigBoxWidth, sigY + 12);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Prepared By', margin + (sigBoxWidth / 2), sigY + 16.5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(100, 116, 139);
  doc.text('Sales / Commercial Department', margin + (sigBoxWidth / 2), sigY + 20.5, { align: 'center' });

  // 2. Authorized Signature
  const sig2X = margin + sigBoxWidth + 8;
  doc.setDrawColor(203, 213, 225);
  doc.line(sig2X, sigY + 12, sig2X + sigBoxWidth, sigY + 12);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Authorized Signature', sig2X + (sigBoxWidth / 2), sigY + 16.5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(100, 116, 139);
  doc.text('GLX Industries Management', sig2X + (sigBoxWidth / 2), sigY + 20.5, { align: 'center' });

  // 3. Customer Acceptance
  const sig3X = sig2X + sigBoxWidth + 8;
  doc.setDrawColor(203, 213, 225);
  doc.line(sig3X, sigY + 12, sig3X + sigBoxWidth, sigY + 12);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Customer Acceptance', sig3X + (sigBoxWidth / 2), sigY + 16.5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(100, 116, 139);
  doc.text('Signature & Official Seal', sig3X + (sigBoxWidth / 2), sigY + 20.5, { align: 'center' });

  // =========================================================================
  // 7. BOTTOM DOCKED FOOTER (Y: 284mm)
  // =========================================================================
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.setDrawColor(203, 213, 225);
  doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
  doc.text('GLX INDUSTRIES (PVT) LTD — Kotugoda & Thudella, Ja-Ela, Sri Lanka | Commercial Vehicle Body Engineering', margin, pageHeight - 7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('PAGE 1 / 1', pageWidth - margin, pageHeight - 7.5, { align: 'right' });

  // Automatically trigger download
  doc.save(`${data.quotationRef || 'GLX-Quotation'}.pdf`);

  return doc;
}
