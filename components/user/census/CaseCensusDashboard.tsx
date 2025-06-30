"use client"
import { postNewCases, updateAllCases, retrieveCasesForUpdate } from '@/controllers/cases.controllers';
import { parseExcelFile, parseExcelForTraining, parseExcelForUpdate } from '@/controllers/excel.controllers';
import React, { useState } from 'react'
import { toast } from 'sonner';
import * as XLSX from "xlsx";

interface MetricsInterface {
    accuracy: number,
    precision: number,
    recall: number,
    f1: number
}

const CaseCensusDashboard = () => {
    const [excelCases, setExcelCases] = useState<any[]>([])
    const [trainedData, setTrainedData] = useState<any>()
    const [cases, setCases] = useState<any[]>([])
    const [date, setDate] = useState<any>("")
    const [trueCases, setTrueCases] = useState<any[]>()
    const [originalExcelFile, setOriginalExcelFile] = useState<File | null>(null);
    const [metrics, setMetrics] = useState<MetricsInterface | null>(null)
    const [columnNames, setColumnNames] = useState<any[]>()
    const [workbookCopy, setWorkbookCopy] = useState<any>()
    // const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setDate(e.target.value)
    // }
    // async function handleFileUpdate(event: React.ChangeEvent<HTMLInputElement>) {
    //     const file = event.target.files?.[0];
    //     if (!file) return;
    //     const reader = new FileReader();
    //     reader.onload = (e) => {
    //         const binaryData = e.target?.result;
    //         if (binaryData) {
    //             const workbook = XLSX.read(binaryData, { type: "binary" });
    //             const ccrCaseWorksheet = workbook["Sheets"]["Details"]
    //             const res = parseExcelForUpdate(ccrCaseWorksheet)
    //             if (res) {
    //                 setExcelCases(res)
    //                 setDate(res[0].censusDate)
    //                 toast.success("Excel sheet read correctly. Cases parsed.")
    //             }
    //         }
    //     };
    //     reader.readAsBinaryString(file);
    // }
    // // Handles excel file upload. For now we will handle one file upload event.
    // async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    //     const files = event.target.files;
    //     if (!files || files.length === 0) return;
    //     const allCases: any[] = [];
    //     const readFile = (file: File): Promise<any[]> =>
    //         new Promise((resolve, reject) => {
    //             const reader = new FileReader();
    //             reader.onload = (e) => {
    //                 const binaryData = e.target?.result;
    //                 if (binaryData) {
    //                     try {
    //                         const workbook = XLSX.read(binaryData, { type: "binary" });
    //                         const worksheet = workbook.Sheets["Details"];
    //                         const parsed = parseExcelFile(worksheet);
    //                         resolve(parsed || []); // return empty array if nothing parsed
    //                     } catch (err) {
    //                         reject(err);
    //                     }
    //                 } else {
    //                     reject("No binary data found");
    //                 }
    //             };
    //             reader.onerror = reject;
    //             reader.readAsBinaryString(file);
    //         });
    //     for (const file of Array.from(files)) {
    //         try {
    //             const parsedCases = await readFile(file); // This now returns a real array
    //             allCases.push(...parsedCases); // Works correctly if parsedCases is an array
    //             console.log("Parsed cases from file:", file.name, parsedCases);
    //         } catch (err) {
    //             console.error(`Error processing file ${file.name}:`, err);
    //         }
    //     }
    //     setCases(allCases);
    //     console.log("All combined cases", allCases);
    // }
    // Parsing our excel

    // async function uploadCases() {
    //     if (cases.length > 1) {
    //         const newSchedule = await postNewCases(cases)
    //         if (newSchedule) {
    //             console.log("New schedule uploaded.", newSchedule)
    //             toast.success("Entry successfully added!")
    //         }
    //     } else {
    //         console.log("Unable to post new case. Cases not available")
    //     }
    // }
    // Test instance of database updates. Test cases represents our excel parse.
    // const getCases = async () => {
    //     const dbCases = await retrieveCasesForUpdate(date)
    //     if (dbCases) {
    //         console.log("DB Cases retrieved here", dbCases)
    //         toast.success("Cases retrieved for update")
    //         const updatedCases = dbCases.map((caseItem: any) => {
    //             const matchedExcelCase = excelCases.find((xlcase) => xlcase.caseId == caseItem.caseId)
    //             if (matchedExcelCase) {
    //                 // HERE IS WHERE WE ACCOUNT FOR OUR OTHER VALUES.
    //                 if (matchedExcelCase.rn == "OTHER") {
    //                     return { ...caseItem, rn: null }
    //                 } else {
    //                     return { ...caseItem, rn: "ASSIGN" }
    //                 }
    //                 // If for whatever reason, the database case was not in our initial case load, return the regular case.
    //             } else {
    //                 console.log("CASE FOUND IN PRE, BUT NOT OFFICIAL")
    //                 return caseItem
    //             }
    //         })
    //         if (updatedCases) {
    //             toast.success("Excel cases matched with database cases.")
    //             const updatedCasesArray = await updateAllCases(updatedCases)
    //             if (updatedCasesArray) {
    //                 toast.success("Cases successfully updated in database.")
    //             }
    //             console.log("Updated cases array", updatedCasesArray)
    //         }
    //     }
    // }
    function insertPredictionsAndSave() {
        if (!excelCases.length || excelCases.length !== trainedData.length) {
            console.error("Mismatched data lengths.");
            return;
        }
        // Step 1: Add assign_probability to each row object
        const updatedCases = excelCases.map((row, i) => ({
            ...row,
            assign_probability: trainedData[i]
        }));
        // Step 2: Convert back to worksheet
        const newWorksheet = XLSX.utils.json_to_sheet(updatedCases);
        // Step 3: Create new workbook and add sheet
        const newWorkbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, "Details");
        // Step 4: Save as file
        XLSX.writeFile(newWorkbook, "cases_with_predictions.xlsx");
    }
    async function parsePreExcelAssignedCases(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;
        setOriginalExcelFile(file); // Save file for later use
        const reader = new FileReader();
        reader.onload = (e) => {
            const binaryData = e.target?.result;
            if (binaryData) {
                const workbook = XLSX.read(binaryData, { type: "binary" });
                setWorkbookCopy(workbook)
                console.log("My workbook here", workbook)
                const ccrCaseWorksheet = workbook["Sheets"]["Details"]
                const { caseCensus, allColumnNames } = parseExcelForTraining(ccrCaseWorksheet)
                if (caseCensus) {
                    setExcelCases(caseCensus)
                    setDate(caseCensus[0].censusDate)
                    setColumnNames(allColumnNames)
                    toast.success("Excel sheet read correctly. Cases parsed.")
                }
            }
        };
        reader.readAsBinaryString(file);
    }
    // File entry for excel cases that have updated RN values for cross analysis
    async function parsePostExcelAssignedCases(event: React.ChangeEvent<HTMLInputElement>) {
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
            console.log("My data to JSON that i am sending", dataToJson)
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
                setMetrics(data)
            }
        }
    }
    const testExcelCopy = () => {
        const clonedWorkbook = workbookCopy
        clonedWorkbook["Sheets"]["Details"]["AZ2"] = {
            "t": "s",
            "v": "Case Probability",
            "r": "<t>Case Probability</t>",
            "h": "Case Probability",
            "w": "Case Probability"
        }
        XLSX.writeFile(clonedWorkbook, "updated_predictions.xlsx");
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
                        onChange={parsePreExcelAssignedCases}
                    />
                    <button className='bg-red-300 text-white p-2 m-2 rounded-lg' onClick={testExcelCopy}>
                        Test
                    </button>
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
                            onChange={parsePostExcelAssignedCases}
                        />
                        <button onClick={crossReferenceData} className='bg-blue-600 p-2 m-2'>
                            Analyze
                        </button>

                    </div>
                )}
            </div>
            {metrics && (
                <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 text-left border-b border-gray-300 font-semibold">Metrics</th>
                            <th className="px-4 py-2 text-left border-b border-gray-300 font-semibold">Values</th>
                            <th className="px-4 py-2 text-left border-b border-gray-300 font-semibold">Interpretation</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                            <td className="px-4 py-3">Accuracy</td>
                            <td className="px-4 py-3">{metrics.accuracy}%</td>
                            <td className="px-4 py-3">
                                Out of all cases, <b> {metrics.accuracy}%</b>were classified correctly between assigned and not assigned. Accuracy measures overall percentage between assigning and not assigning.
                            </td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3">Precision</td>
                            <td className="px-4 py-3">{metrics.precision}%</td>
                            <td className="px-4 py-3">
                                Out of all the cases the model assigned, <b>{metrics.precision}% </b>  were supposed to be assigned. <b> ~{Math.floor(100 - metrics.precision)}% </b> <u> were assigned </u> by the model that <u> should not have been assigned </u>.
                            </td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3">Recall</td>
                            <td className="px-4 py-3">{metrics.recall}%</td>
                            <td className="px-4 py-3">
                                Of all the cases that were supposed to be assigned, the model caught <b> {metrics.recall}% </b> of them. {Math.floor(100 - metrics.recall)}% that <u> were </u> assigned by management <u> were  <b>not</b></u> assigned by the model.
                            </td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3">F1 Score</td>
                            <td className="px-4 py-3">{metrics.f1}%</td>
                            <td className="px-4 py-3">
                                Harmonic mean between accuracy and precision.
                            </td>
                        </tr>
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default CaseCensusDashboard