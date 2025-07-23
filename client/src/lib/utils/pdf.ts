import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PDFConversionOptions {
  format: 'A4' | 'A3' | 'Letter';
  orientation: 'portrait' | 'landscape';
  fontSize: number;
  margin: number;
}

export interface PDFResult {
  success: boolean;
  error?: string;
  blob?: Blob;
}

export async function convertTextToPDF(
  text: string, 
  options: PDFConversionOptions
): Promise<PDFResult> {
  try {
    const pdf = new jsPDF({
      orientation: options.orientation,
      unit: 'mm',
      format: options.format
    });

    // Set font and size
    pdf.setFontSize(options.fontSize);
    
    // Get page dimensions
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const lineHeight = options.fontSize * 0.352778; // Convert points to mm
    const maxWidth = pageWidth - (options.margin * 2);
    const maxHeight = pageHeight - (options.margin * 2);

    // Split text into lines that fit the page width
    const lines = pdf.splitTextToSize(text, maxWidth);
    
    let currentY = options.margin + lineHeight;
    let pageNumber = 1;

    for (let i = 0; i < lines.length; i++) {
      // Check if we need a new page
      if (currentY + lineHeight > pageHeight - options.margin) {
        pdf.addPage();
        currentY = options.margin + lineHeight;
        pageNumber++;
      }

      pdf.text(lines[i], options.margin, currentY);
      currentY += lineHeight;
    }

    // Add page numbers
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.text(
        `Page ${i} of ${totalPages}`,
        pageWidth - options.margin - 20,
        pageHeight - 5
      );
    }

    const blob = pdf.output('blob');
    return { success: true, blob };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function convertHTMLToPDF(
  htmlContent: string,
  options: PDFConversionOptions
): Promise<PDFResult> {
  try {
    // Create a temporary div to render HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    tempDiv.style.cssText = `
      position: absolute;
      left: -9999px;
      top: -9999px;
      width: 800px;
      padding: 20px;
      font-family: Arial, sans-serif;
      font-size: ${options.fontSize}px;
      line-height: 1.5;
      color: #000;
      background: #fff;
    `;
    document.body.appendChild(tempDiv);

    // Convert HTML to canvas
    const canvas = await html2canvas(tempDiv, {
      width: 800,
      height: tempDiv.scrollHeight,
      scale: 2,
      useCORS: true,
      allowTaint: true
    });

    document.body.removeChild(tempDiv);

    // Create PDF from canvas
    const pdf = new jsPDF({
      orientation: options.orientation,
      unit: 'mm',
      format: options.format
    });

    const imgWidth = pdf.internal.pageSize.getWidth() - (options.margin * 2);
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const pageHeight = pdf.internal.pageSize.getHeight() - (options.margin * 2);

    let heightLeft = imgHeight;
    let position = options.margin;

    // Add first page
    pdf.addImage(
      canvas.toDataURL('image/png'),
      'PNG',
      options.margin,
      position,
      imgWidth,
      imgHeight
    );
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight + options.margin;
      pdf.addPage();
      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        options.margin,
        position,
        imgWidth,
        imgHeight
      );
      heightLeft -= pageHeight;
    }

    const blob = pdf.output('blob');
    return { success: true, blob };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export function downloadPDF(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export const sampleText = `# Sample Document

This is a sample document to demonstrate the PDF conversion functionality.

## Features

The PDF converter supports:
- **Text to PDF conversion** with customizable formatting
- **HTML to PDF conversion** with styling preservation
- Multiple page formats (A4, A3, Letter)
- Portrait and landscape orientations
- Adjustable font sizes and margins
- Automatic page numbering

## Sample Content

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.

### Lists

1. First item
2. Second item
3. Third item

- Bullet point one
- Bullet point two
- Bullet point three

### Code Example

\`\`\`javascript
function greet(name) {
  return "Hello, " + name + "!";
}
\`\`\`

This sample demonstrates various formatting options that can be converted to PDF format.`;

export const sampleHTML = `
<h1>Sample HTML Document</h1>
<p>This is a sample HTML document with <strong>bold text</strong> and <em>italic text</em>.</p>
<h2>Features</h2>
<ul>
  <li>HTML to PDF conversion</li>
  <li>Preserves styling and formatting</li>
  <li>Supports images and complex layouts</li>
</ul>
<p style="color: #007bff; font-size: 18px;">This text has custom styling that will be preserved in the PDF.</p>
<blockquote style="border-left: 4px solid #ddd; padding-left: 16px; margin: 16px 0; color: #666;">
  This is a blockquote that demonstrates how HTML styling is maintained in the PDF conversion.
</blockquote>
`;