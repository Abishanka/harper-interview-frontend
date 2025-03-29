"use client";

import { useEffect, useState } from "react";

const SelectCompany = ({
    setSelectedCompany,
    pdfLoading,
    setPdfLoading,
    setPdfReady,
}: {
    setSelectedCompany: (companyId: string) => void;
    pdfLoading: boolean;
    setPdfLoading: (pdfLoading: boolean) => void;
    setPdfReady: (pdfReady: boolean) => void;
}) => {
    const [companies, setCompanies] = useState<
        Array<{ id: string; company_name: string }>
    >([]);
    const [selectedCompany_, setSelectedCompany_] = useState("");
    const [companyListLoading, setCompanyListLoading] = useState(true);
    const [pdfLoading_, setPdfLoading_] = useState(pdfLoading);

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    useEffect(() => {
        const fetchCompanies = async () => {
            setCompanyListLoading(true);
            try {
                const response = await fetch(
                    `/api/fetch-company-list`, // Changed to relative path
                    {
                        method: "GET",
                    },
                );
                const data = await response.json();
                if (!response.ok || !Array.isArray(data)) {
                    throw new Error("Failed to fetch companies");
                }
                setCompanies(data);
                setCompanyListLoading(false);
            } catch (error) {
                console.error("Error fetching companies:", error);
                setCompanies([]);
            } finally {
            }
        };

        fetchCompanies();
    }, []);

    const handleFetchData = async () => {
        setPdfLoading_(true);
        setPdfLoading(true);
        setPdfReady(false);

        try {
            const response = await fetch(
                `/api/generate-form?company_id=${selectedCompany_}`,
                {
                    method: "GET",
                },
            );
            if (!response.ok) {
                console.error("Network response was not ok");
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            console.log("Fetched data for company:", data);
            startPolling();
        } catch (error) {
            console.error("Error fetching company data:", error);
            setPdfLoading(false);
            setPdfLoading_(false);
            setPdfReady(false);
        }
    };

    const startPolling = async () => {
        const deletePdfs = async () => {
            try {
                const response = await fetch("/api/reset-pdf-directory", {
                    method: "POST",
                });
                if (!response.ok) {
                    throw new Error("Failed to reset PDF directory");
                }
                console.log("PDF directory reset successfully");
            } catch (error) {
                console.error("Error resetting PDF directory:", error);
            }
        };
        await deletePdfs();
        const interval = setInterval(async () => {
            try {
                console.log(
                    "Checking PDF status for company:",
                    selectedCompany_,
                );
                const statusResponse = await fetch("/api/check-pdf-status", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ selectedCompany: selectedCompany_ }),
                });
                console.log("Status response:", statusResponse);
                const { ready } = await statusResponse.json();
                if (ready) {
                    clearInterval(interval);
                    clearTimeout(timeout);
                    setPdfLoading(false);
                    setPdfLoading_(false);
                    setPdfReady(true);
                }
            } catch (error) {
                console.error("Error checking PDF status:", error);
                clearInterval(interval);
            }
        }, 5000);

        const timeout = setTimeout(() => {
            clearInterval(interval);
            console.error("Polling timed out after 1000 seconds.");
        }, 1000000);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
            setPdfLoading(false);
            setPdfLoading_(false);
            setPdfReady(false);
        };
    };

    return (
        <div className="flex flex-col w-full">
            <h1 className="text-2xl font-bold text-[#ff6d63]">
                Select a Company
            </h1>
            <div className="mb-4">
                {companyListLoading ? (
                    <div className="flex items-center justify-center p-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff6d63]"></div>
                    </div>
                ) : (
                    <select
                        id="companySelect"
                        value={selectedCompany_}
                        onChange={(e) => {
                            setSelectedCompany_(e.target.value);
                            setSelectedCompany(e.target.value);
                            setPdfReady(false);
                        }}
                        className="block w-full p-2 border border-[#ff6d63] rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff6d63] text-black"
                    >
                        <option value="">Select a company</option>
                        {companies.map(
                            (
                                company: { id: string; company_name: string },
                                index: number,
                            ) => (
                                <option
                                    key={`${company.id}-${index}`}
                                    value={company.id}
                                    className="text-black"
                                >
                                    {`${company.company_name} | ID: ${company.id}`}
                                </option>
                            ),
                        )}
                    </select>
                )}
            </div>
            <button
                onClick={handleFetchData}
                disabled={!selectedCompany_ || pdfLoading_ || pdfLoading}
                className={`px-4 py-2 bg-[#ff6d63] text-white rounded-md hover:bg-[#e55a4d] focus:outline-none focus:ring-2 focus:ring-[#ff6d63] transition-colors
                    ${!selectedCompany_ || pdfLoading_ || pdfLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#e55a4d]"}`}
            >
                Fetch Data
            </button>
        </div>
    );
};

export default SelectCompany;
