
"use client"

import { SignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs";
import { useState } from "react";
import SelectCompany from "./SelectCompany";
import DisplayPDF from "./DisplayPDF";
import RefineForm from "./RefineForm";

export default function Home() {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfReady, setPdfReady] = useState(false);

  const handleSetSelectedCompany = (companyId: string) => {
    console.log("Setting selected company:", companyId);
    setSelectedCompany(companyId);
  };

  const handleSetPdfLoading = (loading: boolean) => {
    console.log("Setting pdf loading:", loading);
    setPdfLoading(loading);
  };

  const handleSetPdfReady = (ready: boolean) => {
    console.log("Setting pdf ready:", ready);
    setPdfReady(ready);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-white">
      <div className="absolute top-4 right-4">
        <SignIn />
      </div>
      <main className="flex flex-row gap-[32px] row-start-2 items-start sm:items-start w-full">      
        <div className="w-1/2">
          <SelectCompany
            setSelectedCompany={handleSetSelectedCompany}
            pdfLoading={pdfLoading}
            setPdfLoading={handleSetPdfLoading}
            setPdfReady={handleSetPdfReady}
          />
          {selectedCompany && !pdfLoading && pdfReady ? (
            <RefineForm
              selectedCompany={selectedCompany}
              setPdfLoading={handleSetPdfLoading}
              pdfReady={pdfReady}
              setPdfReady={handleSetPdfReady}
            />
          ) : null}
        </div>
        <div className="border-l-2 border-[#ff6d63] h-full"></div>
        <div className="w-1/2 pl-4 justify-center">
          <h1 className="text-2xl font-bold text-[#ff6d63]">PDF</h1>
          {selectedCompany ? (
            <DisplayPDF 
              selectedCompany={selectedCompany}
              pdfLoading={pdfLoading}
              pdfReady={pdfReady}
            />
          ) : null}
        </div>
      </main>
    </div>
  );
}
