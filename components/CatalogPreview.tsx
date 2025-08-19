import React, { useState, useEffect, useMemo } from 'react';
import { CatalogItem } from '../types';
import Icon from './Icon';
import Loader from './Loader';

// Declare third-party libraries for TypeScript
declare var jspdf: any;
declare var html2canvas: any;

interface CatalogPreviewProps {
  htmlContent: string;
  items: CatalogItem[];
  onBack: () => void;
}

const CatalogPreview: React.FC<CatalogPreviewProps> = ({ htmlContent, items, onBack }) => {
  const [pages, setPages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadMessage, setDownloadMessage] = useState('Downloading...');

  const processedHtml = useMemo(() => {
    let currentHtml = htmlContent;
    items.forEach((item, index) => {
        const srcPlaceholder = new RegExp(`PRODUCT_IMAGE_${index + 1}_URL`, 'gi');
        const stylePlaceholder = new RegExp(`PRODUCT_IMAGE_${index + 1}_STYLE_PLACEHOLDER`, 'gi');

        currentHtml = currentHtml.replace(srcPlaceholder, item.objectURL);
        
        const itemEnhancement = item.enhancement;
        let styleAttr = '';
        if (itemEnhancement) {
            styleAttr = `style="filter: ${itemEnhancement.filterCss}; clip-path: url(#${itemEnhancement.clipPathId});"`;
        }
        currentHtml = currentHtml.replace(stylePlaceholder, styleAttr);
    });
    return currentHtml;
  }, [htmlContent, items]);
  
  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(processedHtml, 'text/html');
    const pageElements = doc.querySelectorAll('.catalog-page');
    const pageHtmls = Array.from(pageElements).map(el => el.outerHTML);
    setPages(pageHtmls);
    setCurrentPage(0);
  }, [processedHtml]);

  const handleDownloadPdf = async () => {
    if (pages.length === 0) return;
    setIsDownloading(true);

    const printContainer = document.createElement('div');
    printContainer.style.position = 'fixed';
    printContainer.style.left = '-9999px';
    printContainer.style.top = '0';

    // Add SVG defs to the container so they are available for rendering
    const svgDefs = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgDefs.style.width = '0';
    svgDefs.style.height = '0';
    svgDefs.style.position = 'absolute';
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    items.forEach(item => {
        if(item.enhancement) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = item.enhancement.clipPathSvg;
            const clipPath = tempDiv.firstChild;
            if (clipPath) {
                defs.appendChild(clipPath);
            }
        }
    });
    svgDefs.appendChild(defs);
    printContainer.appendChild(svgDefs);
    
    document.body.appendChild(printContainer);

    try {
      const { jsPDF } = jspdf;
      let pdf: any;
      
      for (let i = 0; i < pages.length; i++) {
        setDownloadMessage(`Generating page ${i + 1} of ${pages.length}...`);
        
        const pageHtml = pages[i];
        const pageElement = document.createElement('div');
        pageElement.style.width = '850px'; 
        pageElement.innerHTML = pageHtml;
        printContainer.appendChild(pageElement);

        const canvas = await html2canvas(pageElement, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: null, // Make background transparent
          windowWidth: pageElement.scrollWidth,
          windowHeight: pageElement.scrollHeight
        });

        printContainer.removeChild(pageElement);

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        
        if (i === 0) {
            pdf = new jsPDF({
                orientation: imgWidth > imgHeight ? 'l' : 'p',
                unit: 'px',
                format: [imgWidth, imgHeight]
            });
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        } else {
            pdf.addPage([imgWidth, imgHeight], imgWidth > imgHeight ? 'l' : 'p');
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        }
      }
      
      pdf.save('ai-catalog.pdf');

    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Sorry, there was an error creating the PDF. Please try again.");
    } finally {
        document.body.removeChild(printContainer);
        setIsDownloading(false);
        setDownloadMessage('Downloading...');
    }
  };

  const goToNextPage = () => {
      setCurrentPage(prev => Math.min(prev + 1, pages.length - 1));
  }

  const goToPrevPage = () => {
      setCurrentPage(prev => Math.max(prev - 1, 0));
  }
  
  if (pages.length === 0) {
      return (
          <div className="w-full text-center p-8 text-gray-600">
              <Loader message="Parsing catalog pages..." />
          </div>
      )
  }

  return (
    <div className="w-full">
        {/* SVG definitions for clip-path */}
        <svg width="0" height="0" style={{ position: 'absolute' }}>
            <defs>
                {items.map(item => item.enhancement ? (
                    <g key={item.id} dangerouslySetInnerHTML={{ __html: item.enhancement.clipPathSvg }} />
                ) : null)}
            </defs>
        </svg>

        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Your Catalog is Ready!</h2>
            <div className="flex gap-2">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                    <Icon icon="arrow-left" className="w-5 h-5"/>
                    Go Back
                </button>
                <button
                    onClick={handleDownloadPdf}
                    disabled={isDownloading}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-indigo-300 min-w-[180px]"
                >
                    {isDownloading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                            <span>{downloadMessage}</span>
                        </>
                    ) : (
                        <>
                            <Icon icon="download" className="w-5 h-5" />
                            <span>Download PDF</span>
                        </>
                    )}
                </button>
            </div>
        </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        <div className="relative w-full max-w-4xl mx-auto">
            <div className="relative">
                {/* Sizer div to dynamically set the container height based on the current page's content */}
                <div
                    className="opacity-0 pointer-events-none"
                    aria-hidden="true"
                    dangerouslySetInnerHTML={{ __html: pages[currentPage] }}
                />

                {/* Absolutely positioned pages for fade transitions */}
                {pages.map((pageHtml, index) => (
                    <div
                        key={index}
                        className={`transition-opacity duration-500 ease-in-out absolute top-0 left-0 w-full h-full ${
                        currentPage === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                        aria-hidden={currentPage !== index}
                    >
                        <div dangerouslySetInnerHTML={{ __html: pageHtml }} />
                    </div>
                ))}
            </div>
        </div>
        
        {pages.length > 1 && (
            <div className="flex justify-center items-center mt-4 gap-4">
                <button 
                    onClick={goToPrevPage} 
                    disabled={currentPage === 0}
                    className="p-2 rounded-full bg-white shadow-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    aria-label="Previous Page"
                >
                    <Icon icon="arrow-left" className="w-6 h-6 text-gray-700" />
                </button>

                <span className="font-semibold text-gray-700">
                    Page {currentPage + 1} of {pages.length}
                </span>

                <button 
                    onClick={goToNextPage}
                    disabled={currentPage === pages.length - 1}
                    className="p-2 rounded-full bg-white shadow-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    aria-label="Next Page"
                >
                    <Icon icon="arrow-right" className="w-6 h-6 text-gray-700" />
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default CatalogPreview;