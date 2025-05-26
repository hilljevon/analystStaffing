"use client"
import { postNewCases } from '@/controllers/cases.controllers';
import { parseExcelFile } from '@/controllers/excel.controllers';
import React, { useState } from 'react'
import { toast } from 'sonner';
import * as XLSX from "xlsx";

const CaseCensusDashboard = () => {
    const [cases, setCases] = useState<any[]>([])
    async function handleSingleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const binaryData = e.target?.result;
            if (binaryData) {
                const workbook = XLSX.read(binaryData, { type: "binary" });
                const ccrCaseWorksheet = workbook["Sheets"]["Details"]
                console.log("CCR Cases here", ccrCaseWorksheet)
                const res = parseExcelFile(ccrCaseWorksheet)
                if (res) {
                    setCases(res)
                }
            }
        };
        reader.readAsBinaryString(file);
    }
    // Handles excel file upload. For now we will handle one file upload event.
    async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
        const files = event.target.files;
        if (!files || files.length === 0) return;
        const allCases: any[] = [];
        const readFile = (file: File): Promise<any[]> =>
            new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const binaryData = e.target?.result;
                    if (binaryData) {
                        try {
                            const workbook = XLSX.read(binaryData, { type: "binary" });
                            const worksheet = workbook.Sheets["Details"];
                            const parsed = parseExcelFile(worksheet);
                            resolve(parsed || []); // return empty array if nothing parsed
                        } catch (err) {
                            reject(err);
                        }
                    } else {
                        reject("No binary data found");
                    }
                };
                reader.onerror = reject;
                reader.readAsBinaryString(file);
            });
        for (const file of Array.from(files)) {
            try {
                const parsedCases = await readFile(file); // This now returns a real array
                allCases.push(...parsedCases); // Works correctly if parsedCases is an array
                console.log("Parsed cases from file:", file.name, parsedCases);
            } catch (err) {
                console.error(`Error processing file ${file.name}:`, err);
            }
        }
        setCases(allCases);
        console.log("All combined cases", allCases);
    }

    async function uploadCases() {
        if (cases.length > 1) {
            const newSchedule = await postNewCases(cases)
            if (newSchedule) {
                console.log("New schedule uploaded.", newSchedule)
                toast.success("Entry successfully added!")
            }
        } else {
            console.log("Unable to post new case. Cases not available")
        }
    }
    return (
        <div>
            <div className="flex items-center w-full justify-center">
                <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileUpload}
                    multiple
                />
                {cases.length > 1 && (
                    <button className='bg-green-400 text-white p-2 rounded-lg' onClick={uploadCases}>
                        Upload
                    </button>
                )}
            </div>
        </div>
    )
}

export default CaseCensusDashboard