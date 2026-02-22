export async function extractTextFromFile(file: File): Promise<string> {
    const extension = file.name.split('.').pop()?.toLowerCase();

    if (extension === 'pdf') {
        return extractTextFromPDF(file);
    } else if (extension === 'docx') {
        return extractTextFromDOCX(file);
    } else if (extension === 'txt') {
        return file.text();
    }

    throw new Error(`Unsupported file type: .${extension}. Please upload a PDF, DOCX, or TXT file.`);
}

async function extractTextFromPDF(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();

    // Dynamic import for pdfjs to avoid breaking SSR
    const pdfjsLib = await import('pdfjs-dist');

    // Configure the worker explicitly for the Next.js environment
    // Use the local node_modules version to ensure compatibility matching
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

    // Fallback if the worker can't be found (e.g if it wasn't copied to public dir)
    // We can also just use the pdf.worker.js locally from the package 
    if (typeof window !== 'undefined' && 'Worker' in window) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    }

    try {
        const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
        const pdf = await loadingTask.promise;

        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
                .map((item: any) => item.str)
                .join(' ');
            fullText += pageText + '\n';
        }

        return fullText.trim();
    } catch (err: any) {
        console.error('PDF extraction failed:', err);
        throw new Error(`Failed to parse PDF document: ${err.message || 'Unknown error'}`);
    }
}

async function extractTextFromDOCX(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();

    const mammoth = await import('mammoth');
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
}
