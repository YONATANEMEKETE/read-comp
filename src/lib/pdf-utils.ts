export async function extractFirstPageAsImage(
  pdfFile: File,
): Promise<{ file: File | null; numPages: number }> {
  try {
    // Dynamically import pdfjs-dist to avoid server-side issues
    const pdfjsLib = await import('pdfjs-dist');

    // Set worker source to cdn
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

    // 1. Read the file as an ArrayBuffer
    const arrayBuffer = await pdfFile.arrayBuffer();

    // 2. Load the PDF document
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;

    // 3. Get the first page
    const page = await pdf.getPage(1);

    // 4. Render the page to a canvas
    const viewport = page.getViewport({ scale: 1.5 }); // Scale 1.5 for better quality
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Could not get canvas context');
    }

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
      canvas,
    };

    await page.render(renderContext).promise;

    // 5. Convert canvas to Blob/File
    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve({ file: null, numPages });
            return;
          }
          const imageName = pdfFile.name.replace(/\.pdf$/i, '') + '.png';
          const imageFile = new File([blob], imageName, {
            type: 'image/png',
          });
          resolve({ file: imageFile, numPages });
        },
        'image/png',
        0.8, // Quality
      );
    });
  } catch (error) {
    console.error('Error extracting PDF thumbnail:', error);
    return { file: null, numPages: 0 };
  }
}
