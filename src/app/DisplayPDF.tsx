"use client";

import { useEffect, useState } from "react";

const DisplayPDF = ({ selectedCompany, pdfLoading, pdfReady }: { selectedCompany: string, pdfLoading: boolean, pdfReady: boolean }) => {
    const pdfUrl = `/pdfs/${selectedCompany}.pdf`; // Direct URL to the PDF

    useEffect(() => {
        const fetchPDF = async () => {
            try {
                console.log("Fetching PDF from route:", pdfUrl);
                const response = await fetch(pdfUrl);
                console.log("Response status:", response.status);
                console.log("Response type:", response.headers.get("Content-Type"));

                if (!response.ok) {
                    console.log(`Failed to fetch PDF. Retrying...`);
                    setTimeout(() => fetchPDF(), 10000);
                    return;
                }
                // No need to create a blob, we can use the URL directly
                console.log("PDF URL:", pdfUrl);
            } catch (error) {
                console.error("Error fetching PDF:", error);
            }
        };
        if (pdfReady) {
            fetchPDF();
        }
    }, [selectedCompany, pdfLoading, pdfReady]);

    return (
        <div className="container mx-auto p-4">
            {pdfLoading || !pdfReady ? (
                <div className="flex items-center justify-center p-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff6d63]"></div>
                </div>
            ) : (
                <div className="pdf-container">
                    <iframe
                        src={pdfUrl} // Use the direct URL here
                        width="100%"
                        height="600px"
                        title="PDF Viewer"
                        className="border-none"
                    />
                </div>
            )}
        </div>
    );
};

export default DisplayPDF;
