"use client"
import { postNewCases, updateAllCases, retrieveCasesForUpdate } from '@/controllers/cases.controllers';
import { parseExcelFile, parseExcelForTraining, parseExcelForUpdate } from '@/controllers/excel.controllers';
import React, { useState } from 'react'
import { toast } from 'sonner';
import * as XLSX from "xlsx";

const CaseCensusDashboard = () => {
    const [excelCases, setExcelCases] = useState<any[]>([

    ])
    const [trainedData, setTrainedData] = useState<any>()
    const [cases, setCases] = useState<any[]>([])
    const [date, setDate] = useState<any>("")
    const [trueCases, setTrueCases] = useState<any[]>()
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDate(e.target.value)
    }
    async function handleFileUpdate(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const binaryData = e.target?.result;
            if (binaryData) {
                const workbook = XLSX.read(binaryData, { type: "binary" });
                const ccrCaseWorksheet = workbook["Sheets"]["Details"]
                const res = parseExcelForUpdate(ccrCaseWorksheet)
                if (res) {
                    setExcelCases(res)
                    setDate(res[0].censusDate)
                    toast.success("Excel sheet read correctly. Cases parsed.")
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
    async function handleCaseTraining(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const binaryData = e.target?.result;
            if (binaryData) {
                const workbook = XLSX.read(binaryData, { type: "binary" });
                const ccrCaseWorksheet = workbook["Sheets"]["Details"]
                const res = parseExcelForTraining(ccrCaseWorksheet)
                if (res) {
                    setExcelCases(res)
                    setDate(res[0].censusDate)
                    toast.success("Excel sheet read correctly. Cases parsed.")
                }
            }
        };
        reader.readAsBinaryString(file);
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
    // Test instance of database updates. Test cases represents our excel parse.
    const getCases = async () => {
        const dbCases = await retrieveCasesForUpdate(date)
        if (dbCases) {
            console.log("DB Cases retrieved here", dbCases)
            toast.success("Cases retrieved for update")
            const updatedCases = dbCases.map((caseItem: any) => {
                const matchedExcelCase = excelCases.find((xlcase) => xlcase.caseId == caseItem.caseId)
                if (matchedExcelCase) {
                    // HERE IS WHERE WE ACCOUNT FOR OUR OTHER VALUES.
                    if (matchedExcelCase.rn == "OTHER") {
                        return { ...caseItem, rn: null }
                    } else {
                        return { ...caseItem, rn: "ASSIGN" }
                    }
                    // If for whatever reason, the database case was not in our initial case load, return the regular case.
                } else {
                    console.log("CASE FOUND IN PRE, BUT NOT OFFICIAL")
                    return caseItem
                }
            })
            if (updatedCases) {
                toast.success("Excel cases matched with database cases.")
                const updatedCasesArray = await updateAllCases(updatedCases)
                if (updatedCasesArray) {
                    toast.success("Cases successfully updated in database.")
                }
                console.log("Updated cases array", updatedCasesArray)
            }
        }
    }
    async function retrieveTrueCases(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const binaryData = e.target?.result;
            if (binaryData) {
                const workbook = XLSX.read(binaryData, { type: "binary" });
                const ccrCaseWorksheet = workbook["Sheets"]["Details"]
                const res = parseExcelForUpdate(ccrCaseWorksheet)
                if (res) {
                    setTrueCases(res)
                    toast.success("Excel sheet read correctly. Cases parsed.")
                    console.log("My true cases here", res)
                }
            }
        };
        reader.readAsBinaryString(file);
    }
    async function trainCases() {
        if (excelCases.length > 1) {
            const dataToJson = JSON.stringify({ cases: excelCases })
            console.log("My to JSON data here", dataToJson)
            toast.success("Trying to train cases ...")
            const response = await fetch('https://caselearn-production.up.railway.app/predict/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: dataToJson,
            });
            if (!response.ok) {
                throw new Error('Prediction request failed');
            }
            const data = await response.json();
            if (data) {
                toast.success("Model successfully trained!!!")
                setTrainedData(data)
                console.log("My trained data here", trainedData)
            }
        } else {
            toast.error("Error training cases. Check console.")
        }
    }
    const downloadTrainedData = () => {
        const worksheet = XLSX.utils.json_to_sheet(trainedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "trained_data.xlsx");
    }
    const crossReferenceData = async () => {
        if (trainedData && trueCases) {
            const dataToJson = JSON.stringify({ trainedCases: trainedData, trueCases: trueCases })
            toast.success("Trying to train cases ...")
            const response = await fetch('https://caselearn-production.up.railway.app/compare/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: dataToJson,
            });
            if (!response.ok) {
                throw new Error('Prediction request failed');
            }
            const data = await response.json();
            if (data) {
                toast.success("Model successfully trained!!!")
                console.log("Data here!", data)
            }
        }
    }
    return (
        <div>
            <div className="flex items-center w-full justify-center">
                {/* For UPLOADING cases */}
                {/* <div className=''>
                    <label className='font-bold mx-2' htmlFor="fileUpload">Upload cases</label>
                    <input
                        name='fileUpload'
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleFileUpload}
                        multiple
                    /> */}
                {/* {cases.length > 1 && (
                        <button className='bg-green-400 text-white p-2 rounded-lg' onClick={uploadCases}>
                            Upload
                        </button>
                    )} */}
                {/* </div> */}
                {/* <div>
                    <label className='font-bold mx-2 underline' htmlFor="updateCases">Update Cases</label>
                    <input
                        name='updateCases'
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleFileUpdate}
                    />
                    <button onClick={getCases} className='border bg-green-500 p-2 rounded-lg'>
                        Update cases
                    </button>
                </div> */}
                <div className=''>
                    <h1>For training cases</h1>
                    <input
                        name='fileUpload'
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleCaseTraining}
                    />
                    {excelCases.length > 1 && (
                        <button className='bg-green-400 text-white p-2 rounded-lg' onClick={trainCases}>
                            Train cases
                        </button>
                    )}
                    {trainedData && (
                        <button onClick={downloadTrainedData} className='bg-purple-400 text-white m-2 p-2 rounded-lg'>
                            Download
                        </button>
                    )}
                </div>
                {trainedData && (
                    <div>
                        <h1>Cross reference</h1>
                        <input
                            name='fileUpload'
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={retrieveTrueCases}
                        />
                        <button onClick={crossReferenceData} className='bg-blue-600 p-2 m-2'>
                            Analyze
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CaseCensusDashboard