import * as pdfjsLib from 'pdfjs-dist';
import PptxGenJS from 'pptxgenjs';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface PdfToPptOptions {
  slideLayout: 'text-only' | 'title-content' | 'image-text';
  extractImages: boolean;
  maxSlides: number;
}

export interface ConversionResult {
  success: boolean;
  error?: string;
  slideCount?: number;
}

export async function convertPdfToPpt(
  file: File,
  options: PdfToPptOptions
): Promise<ConversionResult> {
  try {
    // Read PDF file
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    const totalPages = Math.min(pdf.numPages, options.maxSlides);
    
    // Create PowerPoint presentation
    const pptx = new PptxGenJS();
    
    // Set presentation properties
    pptx.author = 'FileConverterBox';
    pptx.company = 'FileConverterBox';
    pptx.subject = `Converted from ${file.name}`;
    pptx.title = file.name.replace('.pdf', '');

    // Process each page
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      try {
        const page = await pdf.getPage(pageNum);
        
        // Extract text content
        const textContent = await page.getTextContent();
        const textItems = textContent.items
          .filter((item: any) => item.str && item.str.trim())
          .map((item: any) => ({
            text: item.str,
            x: item.transform[4],
            y: item.transform[5],
            fontSize: item.height || 12
          }));

        if (textItems.length === 0) {
          continue; // Skip empty pages
        }

        // Create slide
        const slide = pptx.addSlide();
        
        // Sort text items by position (top to bottom, left to right)
        textItems.sort((a, b) => {
          const yDiff = b.y - a.y; // Reverse Y (PDF coordinates)
          if (Math.abs(yDiff) > 10) return yDiff > 0 ? 1 : -1;
          return a.x - b.x;
        });

        // Group text into paragraphs and find potential titles
        const paragraphs = groupTextIntoParagraphs(textItems);
        
        if (options.slideLayout === 'title-content') {
          // Use first paragraph as title, rest as content
          const title = paragraphs[0]?.text || `Slide ${pageNum}`;
          const content = paragraphs.slice(1).map(p => p.text).join('\n\n');
          
          slide.addText(title, {
            x: 0.5,
            y: 0.5,
            w: 9,
            h: 1,
            fontSize: 24,
            bold: true,
            color: '363636'
          });
          
          if (content) {
            slide.addText(content, {
              x: 0.5,
              y: 2,
              w: 9,
              h: 5,
              fontSize: 14,
              color: '363636',
              valign: 'top'
            });
          }
        } else if (options.slideLayout === 'text-only') {
          // All text as content
          const allText = paragraphs.map(p => p.text).join('\n\n');
          
          slide.addText(allText, {
            x: 0.5,
            y: 0.5,
            w: 9,
            h: 6.5,
            fontSize: 12,
            color: '363636',
            valign: 'top'
          });
        } else { // image-text
          // Try to extract images if requested
          if (options.extractImages) {
            try {
              const operatorList = await page.getOperatorList();
              // This is a simplified approach - full image extraction is complex
              // For now, we'll focus on text with placeholder for images
            } catch (imgError) {
              console.warn('Could not extract images from page', pageNum);
            }
          }
          
          // Add text content
          const allText = paragraphs.map(p => p.text).join('\n\n');
          slide.addText(allText, {
            x: 0.5,
            y: 0.5,
            w: 9,
            h: 6.5,
            fontSize: 12,
            color: '363636',
            valign: 'top'
          });
        }
        
        // Add page number
        slide.addText(`Page ${pageNum}`, {
          x: 8.5,
          y: 7,
          w: 1,
          h: 0.3,
          fontSize: 10,
          color: '666666',
          align: 'right'
        });
        
      } catch (pageError) {
        console.warn(`Error processing page ${pageNum}:`, pageError);
        continue;
      }
    }

    // Generate and download the PowerPoint file
    const fileName = file.name.replace('.pdf', '.pptx');
    await pptx.writeFile({ fileName });
    
    return {
      success: true,
      slideCount: totalPages
    };
    
  } catch (error) {
    console.error('PDF to PPT conversion error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

function groupTextIntoParagraphs(textItems: any[]): { text: string; avgFontSize: number }[] {
  if (textItems.length === 0) return [];
  
  const paragraphs: { text: string; avgFontSize: number }[] = [];
  let currentParagraph = '';
  let currentFontSizes: number[] = [];
  
  for (let i = 0; i < textItems.length; i++) {
    const item = textItems[i];
    const nextItem = textItems[i + 1];
    
    currentParagraph += item.text;
    currentFontSizes.push(item.fontSize);
    
    // Check if this is end of paragraph
    const isEndOfParagraph = !nextItem || 
      (nextItem.y < item.y - 20) || // Significant vertical gap
      item.text.endsWith('.') || 
      item.text.endsWith('!') || 
      item.text.endsWith('?');
    
    if (isEndOfParagraph || i === textItems.length - 1) {
      if (currentParagraph.trim()) {
        const avgFontSize = currentFontSizes.reduce((a, b) => a + b, 0) / currentFontSizes.length;
        paragraphs.push({
          text: currentParagraph.trim(),
          avgFontSize
        });
        currentParagraph = '';
        currentFontSizes = [];
      }
    } else if (nextItem && Math.abs(nextItem.y - item.y) < 5) {
      // Same line, add space
      currentParagraph += ' ';
    } else {
      // New line
      currentParagraph += '\n';
    }
  }
  
  return paragraphs;
}