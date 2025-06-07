"use client"
import { postNewCases, updateAllCases, retrieveCasesForUpdate } from '@/controllers/cases.controllers';
import { parseExcelFile, parseExcelForUpdate } from '@/controllers/excel.controllers';
import React, { useState } from 'react'
import { toast } from 'sonner';
import * as XLSX from "xlsx";

const CaseCensusDashboard = () => {
    const [excelCases, setExcelCases] = useState<any[]>([
        {
            id: 2932,
            created_at: '2025-05-26T05:23:54.675897+00:00',
            caseId: '673412',
            caseAssignmentCategory: 'NONE',
            explicitlyAssignedRn: 'NONE',
            lastAssignedRn: 'NONE',
            primaryMedicalHome: 'ANV',
            mtt: 'ANV',
            rn: "E651821",
            serviceCode: 'MED',
            coverageType: 'Medicare',
            dob: '1946-05-02',
            los: 4,
            dx: 'PAIN IN UNSPECIFIED ANKLE',
            inOrOutOfArea: 'OOA',
            vendorName: 'Sunrise Hospital and Medical Center S',
            admitDate: '2025-03-29',
            lastReviewDate: '2025-03-31',
            lastCmDate: '2025-03-30',
            notAuthorized: null,
            lastPadReason: null,
            padReasonEnteredDate: null,
            levelOfCare: 'TELE',
            desk: 'CCR',
            priorityLevel: 'Low',
            reviewOutcome: 'Authorized Stable',
            reviewOutcomeReason: 'Post-Stabilization Care',
            enteredDate: null,
            anticipatedDisposition: null,
            barriersToDisposition: null,
            rn2: 'OOA',
            stabilityOrderReceived: null,
            stabilityNkfCmVerbal: null,
            sftEvent: 'NKP Stated Unstable For Transfer',
            sftDateTime: '2025-03-30',
            lastPertinentEventDate: null,
            stablePerOursMd: 'Yes',
            reason: 'Member Barriers (See Review Outcome)',
            managingFac: 'CCC',
            authStartDate: '2025-03-29',
            authEndDate: '2025-03-30',
            lastReviewRequired: '2025-03-31T07:00:00.000Z',
            censusDate: '2025-04-01'
        },
        {
            id: 2933,
            created_at: '2025-05-26T05:23:54.675897+00:00',
            caseId: '672276',
            caseAssignmentCategory: 'NONE',
            explicitlyAssignedRn: 'NONE',
            lastAssignedRn: 'NONE',
            primaryMedicalHome: 'RIV',
            mtt: 'RIV',
            rn: "OTHER",
            serviceCode: 'MED',
            coverageType: 'Medicare',
            dob: '1945-12-13',
            los: 12,
            dx: 'UNSPECIFIED FALL INITIAL ENCOUNTER',
            inOrOutOfArea: 'OOA',
            vendorName: 'Sentara Virginia Beach Hosp',
            admitDate: '2025-03-21',
            lastReviewDate: '2025-03-31',
            lastCmDate: '2025-03-26',
            notAuthorized: null,
            lastPadReason: null,
            padReasonEnteredDate: null,
            levelOfCare: 'ICU',
            desk: 'CCR',
            priorityLevel: 'Low',
            reviewOutcome: 'Authorized Stable',
            reviewOutcomeReason: 'Post-Stabilization Care',
            enteredDate: null,
            anticipatedDisposition: null,
            barriersToDisposition: null,
            rn2: 'OOA',
            stabilityOrderReceived: null,
            stabilityNkfCmVerbal: null,
            sftEvent: 'NKP Stated Unstable For Transfer',
            sftDateTime: '2025-03-24',
            lastPertinentEventDate: null,
            stablePerOursMd: 'Yes',
            reason: 'KP Barriers',
            managingFac: 'CCC',
            authStartDate: '2025-03-26',
            authEndDate: '2025-03-27',
            lastReviewRequired: '2025-03-25T07:00:00.000Z',
            censusDate: '2025-04-01'
        },
        {
            id: 2934,
            created_at: '2025-05-26T05:23:54.675897+00:00',
            caseId: '672459',
            caseAssignmentCategory: 'NONE',
            explicitlyAssignedRn: 'NONE',
            lastAssignedRn: 'NONE',
            primaryMedicalHome: 'ORC',
            mtt: 'ORC',
            rn: null,
            serviceCode: 'MED',
            coverageType: 'Medicare',
            dob: '1945-07-16',
            los: 9,
            dx: 'CHEST PAIN UNSPECIFIED',
            inOrOutOfArea: 'OOA',
            vendorName: 'Parkwest Medical Center',
            admitDate: '2025-03-24',
            lastReviewDate: '2025-03-30',
            lastCmDate: '2025-03-26',
            notAuthorized: null,
            lastPadReason: null,
            padReasonEnteredDate: null,
            levelOfCare: 'TELE',
            desk: 'CCR',
            priorityLevel: 'Low',
            reviewOutcome: 'Authorized Stable',
            reviewOutcomeReason: 'Post-Stabilization Care',
            enteredDate: null,
            anticipatedDisposition: null,
            barriersToDisposition: null,
            rn2: 'OOA',
            stabilityOrderReceived: null,
            stabilityNkfCmVerbal: null,
            sftEvent: 'NKP Stated Unstable For Transfer',
            sftDateTime: '2025-03-25',
            lastPertinentEventDate: null,
            stablePerOursMd: 'Yes',
            reason: 'Non-KP Barriers (See Review Outcome)',
            managingFac: 'CCC',
            authStartDate: '2025-03-25',
            authEndDate: '2025-03-27',
            lastReviewRequired: '2025-03-26T07:00:00.000Z',
            censusDate: '2025-04-01'
        },
        {
            id: 2935,
            created_at: '2025-05-26T05:23:54.675897+00:00',
            caseId: '672735',
            caseAssignmentCategory: 'DCP',
            explicitlyAssignedRn: 'NONE',
            lastAssignedRn: 'D447227',
            primaryMedicalHome: 'SDO',
            mtt: 'SDO',
            rn: 'ASSIGN',
            serviceCode: 'MED',
            coverageType: 'Medicare',
            dob: '1944-09-18',
            los: 7,
            dx: 'DSPL INTERTROCHANTERIC FX LT FEMUR INIT ENC CLO',
            inOrOutOfArea: 'OOA',
            vendorName: "LOVELACE WOMEN'S HOSPITAL",
            admitDate: '2025-03-26',
            lastReviewDate: '2025-03-31',
            lastCmDate: '2025-03-26',
            notAuthorized: null,
            lastPadReason: null,
            padReasonEnteredDate: null,
            levelOfCare: 'Acute Rehab',
            desk: 'CCR',
            priorityLevel: 'High(Xfer Likely)',
            reviewOutcome: 'Authorized Stable',
            reviewOutcomeReason: 'Post-Stabilization Care',
            enteredDate: '2025-03-31',
            anticipatedDisposition: 'ARU',
            barriersToDisposition: 'PENDING FOR ARU NOTES, F/U IN AM ',
            rn2: 'DCP',
            stabilityOrderReceived: null,
            stabilityNkfCmVerbal: null,
            sftEvent: 'NKP Stated Unstable For Transfer',
            sftDateTime: '2025-03-26',
            lastPertinentEventDate: null,
            stablePerOursMd: 'No',
            reason: 'See Live Census Links',
            managingFac: 'CCC',
            authStartDate: '2025-03-26',
            authEndDate: '2025-03-27',
            lastReviewRequired: '2025-03-27T07:00:00.000Z',
            censusDate: '2025-04-01'
        },
        {
            id: 2936,
            created_at: '2025-05-26T05:23:54.675897+00:00',
            caseId: '672903',
            caseAssignmentCategory: 'DCP',
            explicitlyAssignedRn: 'NONE',
            lastAssignedRn: 'E779662',
            primaryMedicalHome: 'WOD',
            mtt: 'WOD',
            rn: 'ASSIGN',
            serviceCode: 'MED',
            coverageType: 'Medicare',
            dob: '1944-05-15',
            los: 10,
            dx: 'PATHOLOGICAL FX HIP UNS INITIAL ENC FRACTURE',
            inOrOutOfArea: 'OOA',
            vendorName: 'Sunrise Hospital and Medical Center S',
            admitDate: '2025-03-23',
            lastReviewDate: '2025-03-31',
            lastCmDate: '2025-03-31',
            notAuthorized: null,
            lastPadReason: 'Other, specify',
            padReasonEnteredDate: '2025-03-31',
            levelOfCare: 'TELE',
            desk: 'CCR',
            priorityLevel: 'High(Xfer Likely)',
            reviewOutcome: 'Authorized Stable',
            reviewOutcomeReason: 'Post-Stabilization Care',
            enteredDate: '2025-03-31',
            anticipatedDisposition: 'Skilled Nursing Facility',
            barriersToDisposition: 'SNF 3/28. CURRENTLY OOA, NEED SNF BACK IN-AREA. CASE WITH CPH.THOUSAND OAKS PA ACCEPTED. ENGAGED TRANSPORT. PENDING AMBULANCE ACCEPTANCE TO TRANSPORT PATIENT 5-6HRS. ',
            rn2: 'DCP',
            stabilityOrderReceived: null,
            stabilityNkfCmVerbal: null,
            sftEvent: 'NKP Stated Unstable For Transfer',
            sftDateTime: '2025-03-27',
            lastPertinentEventDate: null,
            stablePerOursMd: 'Yes',
            reason: 'KP Barriers',
            managingFac: 'CCC',
            authStartDate: '2025-03-29',
            authEndDate: '2025-04-01',
            lastReviewRequired: '2025-03-28T07:00:00.000Z',
            censusDate: '2025-04-01'
        },
        {
            id: 2937,
            created_at: '2025-05-26T05:23:54.675897+00:00',
            caseId: '671523',
            caseAssignmentCategory: 'DCP',
            explicitlyAssignedRn: 'NONE',
            lastAssignedRn: 'D447227',
            primaryMedicalHome: 'ORC',
            mtt: 'ORC',
            rn: 'E651821',
            serviceCode: 'MED',
            coverageType: 'Medicare',
            dob: '1942-10-10',
            los: 14,
            dx: 'GOUT UNSPECIFIED',
            inOrOutOfArea: 'OOA',
            vendorName: 'HAVASU REGIONAL MEDICAL CENTER',
            admitDate: '2025-03-19',
            lastReviewDate: '2025-03-31',
            lastCmDate: '2025-03-31',
            notAuthorized: null,
            lastPadReason: 'Pending LOA',
            padReasonEnteredDate: '2025-03-31',
            levelOfCare: 'TELE',
            desk: 'CCR',
            priorityLevel: 'Low',
            reviewOutcome: 'Authorized Stable',
            reviewOutcomeReason: 'Post-Stabilization Care',
            enteredDate: '2025-03-31',
            anticipatedDisposition: 'Skilled Nursing Facility',
            barriersToDisposition: 'LOA INITITIATED 3/31/2025, PENDING FOR APPROVAL',
            rn2: 'DCP',
            stabilityOrderReceived: null,
            stabilityNkfCmVerbal: null,
            sftEvent: 'NKP Stated Unstable For Transfer',
            sftDateTime: '2025-03-20',
            lastPertinentEventDate: null,
            stablePerOursMd: 'Yes',
            reason: 'KP Barriers',
            managingFac: 'CCC',
            authStartDate: '2025-03-27',
            authEndDate: '2025-04-01',
            lastReviewRequired: '2025-03-21T07:00:00.000Z',
            censusDate: '2025-04-01'
        },
        {
            id: 2938,
            created_at: '2025-05-26T05:23:54.675897+00:00',
            caseId: '673568',
            caseAssignmentCategory: 'NONE',
            explicitlyAssignedRn: 'NONE',
            lastAssignedRn: 'NONE',
            primaryMedicalHome: 'HAR',
            mtt: 'HAR',
            rn: null,
            serviceCode: 'MED',
            coverageType: 'Medicare',
            dob: '1942-11-26',
            los: 3,
            dx: 'APHASIA',
            inOrOutOfArea: 'OOA',
            vendorName: 'BAPTIST HOSPITAL OF SOUTHEAST TEXAS',
            admitDate: '2025-03-30',
            lastReviewDate: '2025-03-31',
            lastCmDate: '2025-03-31',
            notAuthorized: null,
            lastPadReason: null,
            padReasonEnteredDate: null,
            levelOfCare: 'TELE',
            desk: 'CCR',
            priorityLevel: 'Low',
            reviewOutcome: 'Authorized Stable',
            reviewOutcomeReason: 'Post-Stabilization Care',
            enteredDate: null,
            anticipatedDisposition: null,
            barriersToDisposition: null,
            rn2: 'OOA',
            stabilityOrderReceived: null,
            stabilityNkfCmVerbal: null,
            sftEvent: 'NKP Stated Unstable For Transfer',
            sftDateTime: '2025-03-31',
            lastPertinentEventDate: null,
            stablePerOursMd: 'No',
            reason: 'See Live Census Links',
            managingFac: 'CCC',
            authStartDate: '2025-03-30',
            authEndDate: '2025-03-31',
            lastReviewRequired: '2025-04-01T07:00:00.000Z',
            censusDate: '2025-04-01'
        },
        {
            id: 2939,
            created_at: '2025-05-26T05:23:54.675897+00:00',
            caseId: '673550',
            caseAssignmentCategory: 'NONE',
            explicitlyAssignedRn: 'NONE',
            lastAssignedRn: 'NONE',
            primaryMedicalHome: 'WLA',
            mtt: 'WLA',
            rn: null,
            serviceCode: 'MED',
            coverageType: 'Medicare',
            dob: '1940-04-20',
            los: 5,
            dx: 'DEHYDRATION',
            inOrOutOfArea: 'OOA',
            vendorName: 'BAYLOR SCOTT AND WHITE MEDICAL CENTER',
            admitDate: '2025-03-28',
            lastReviewDate: '2025-03-31',
            lastCmDate: '2025-03-31',
            notAuthorized: null,
            lastPadReason: null,
            padReasonEnteredDate: null,
            levelOfCare: 'MED-SURG',
            desk: 'CCR',
            priorityLevel: 'High(Xfer Likely)',
            reviewOutcome: 'Authorized Stable',
            reviewOutcomeReason: 'Post-Stabilization Care',
            enteredDate: null,
            anticipatedDisposition: null,
            barriersToDisposition: null,
            rn2: 'OOA',
            stabilityOrderReceived: null,
            stabilityNkfCmVerbal: null,
            sftEvent: 'NKP Stated Unstable For Transfer',
            sftDateTime: '2025-03-31',
            lastPertinentEventDate: null,
            stablePerOursMd: 'No',
            reason: 'See Live Census Links',
            managingFac: 'CCC',
            authStartDate: '2025-03-28',
            authEndDate: '2025-04-01',
            lastReviewRequired: '2025-04-01T07:00:00.000Z',
            censusDate: '2025-04-01'
        },
        {
            id: 2940,
            created_at: '2025-05-26T05:23:54.675897+00:00',
            caseId: '673086',
            caseAssignmentCategory: 'NONE',
            explicitlyAssignedRn: 'NONE',
            lastAssignedRn: 'NONE',
            primaryMedicalHome: 'RIV',
            mtt: 'RIV',
            rn: "OTHER",
            serviceCode: 'MED',
            coverageType: 'Medicare',
            dob: '1940-01-26',
            los: 6,
            dx: 'ENCEPHALOPATHY UNSPECIFIED',
            inOrOutOfArea: 'OOA',
            vendorName: 'Swedish Medical Center',
            admitDate: '2025-03-27',
            lastReviewDate: '2025-03-28',
            lastCmDate: '2025-03-28',
            notAuthorized: null,
            lastPadReason: null,
            padReasonEnteredDate: null,
            levelOfCare: 'MED-SURG',
            desk: 'CCR',
            priorityLevel: 'Low',
            reviewOutcome: 'Authorized Stable',
            reviewOutcomeReason: 'Post-Stabilization Care',
            enteredDate: null,
            anticipatedDisposition: null,
            barriersToDisposition: null,
            rn2: 'OOA',
            stabilityOrderReceived: null,
            stabilityNkfCmVerbal: null,
            sftEvent: 'NKP Stated Unstable For Transfer',
            sftDateTime: '2025-03-28',
            lastPertinentEventDate: null,
            stablePerOursMd: 'Yes',
            reason: 'Member Barriers (See Review Outcome)',
            managingFac: 'CCC',
            authStartDate: '2025-03-27',
            authEndDate: '2025-03-28',
            lastReviewRequired: '2025-03-29T07:00:00.000Z',
            censusDate: '2025-04-01'
        },
        {
            id: 2941,
            created_at: '2025-05-26T05:23:54.675897+00:00',
            caseId: '668723',
            caseAssignmentCategory: 'NONE',
            explicitlyAssignedRn: 'NONE',
            lastAssignedRn: 'NONE',
            primaryMedicalHome: 'HAR',
            mtt: 'BEL',
            rn: null,
            serviceCode: 'MED',
            coverageType: 'Medicare',
            dob: '1936-01-17',
            los: 35,
            dx: 'PRESSURE ULCER OF UNSPECIFIED SITE STAGE 4',
            inOrOutOfArea: 'OOA',
            vendorName: 'CAPE CORAL HOSPITAL',
            admitDate: '2025-02-26',
            lastReviewDate: '2025-03-30',
            lastCmDate: '2025-03-26',
            notAuthorized: null,
            lastPadReason: null,
            padReasonEnteredDate: null,
            levelOfCare: 'TELE',
            desk: 'CCR',
            priorityLevel: 'High(Xfer Likely)',
            reviewOutcome: 'Authorized Stable',
            reviewOutcomeReason: 'Post-Stabilization Care',
            enteredDate: '2025-03-24',
            anticipatedDisposition: 'Non-KP Acute Care Hospital',
            barriersToDisposition: 'NO DCP order received at this time. ',
            rn2: 'OOA',
            stabilityOrderReceived: null,
            stabilityNkfCmVerbal: null,
            sftEvent: 'NKP Stated Unstable For Transfer',
            sftDateTime: '2025-03-04',
            lastPertinentEventDate: null,
            stablePerOursMd: 'Yes',
            reason: 'Non-KP Barriers (See Review Outcome)',
            managingFac: 'CCC',
            authStartDate: '2025-03-26',
            authEndDate: '2025-03-27',
            lastReviewRequired: '2025-03-05T08:00:00.000Z',
            censusDate: '2025-04-01'
        },
    ])
    const [cases, setCases] = useState<any[]>([])
    const [date, setDate] = useState<any>("")
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
    console.log("Date here", date)
    return (
        <div>
            <div className="flex items-center w-full justify-center">
                {/* For UPLOADING cases */}
                <div className=''>
                    <label className='font-bold mx-2' htmlFor="fileUpload">Upload cases</label>
                    <input
                        name='fileUpload'
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
                <div>
                    {/* For UPDATING cases */}
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
                </div>

            </div>
        </div>
    )
}

export default CaseCensusDashboard