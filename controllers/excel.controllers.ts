// Allows us to extract last row in respective excel sheet
function extractRowCount(range: string): number {
    const match = range.match(/\d+$/); // Match the last sequence of digits in the string
    return match ? parseInt(match[0], 10) : 4;
}
function convertToDateType(s: string): Date | null {
    if (!s) return null
    if (s.length < 2) {
        return null
    }
    const dateObj = new Date(s);

    return isNaN(dateObj.getTime()) ? null : dateObj;
}
function convertDateTimeStringToDateOnly(input: string) {
    if (!input) return null;

    // Split at the first space
    const [datePart] = input.trim().split(" ");
    const parsedDate = new Date(datePart);

    if (isNaN(parsedDate.getTime())) {
        console.warn("Invalid date:", input);
        return null;
    }

    return parsedDate; // Return the Date object itself
}
function formatDateToYYYYMMDD(date: Date | null): string {
    if (date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0"); // getMonth is 0-based
        const day = date.getDate().toString().padStart(2, "0");

        return `${year}-${month}-${day}`;
    } else {
        return ""
    }
}
function getCurrentDate(cell: any) {
    const dateString = cell.split("-")[0];
    const convertedDate = convertToDateType(dateString)
    return convertedDate
}
export function parseExcelForUpdate(cases: any) {
    const columnHeaderIndexes: string[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "AA", "AB", "AC", "AD", "AE", "AF", "AG"];
    const caseCensus = []
    const intermediateDate = getCurrentDate(cases["A1"]["v"])
    // Added to get date in string format for DB pull.
    const currentDate = formatDateToYYYYMMDD(intermediateDate)
    const lastCell = cases["!ref"]
    // Limit for rows in excel sheet
    const rowCount = extractRowCount(lastCell)
    // Only relevant column names for parsing update
    const allColumnNames: any = {
        "Case\nId": "",
        "RN": "",
    }
    // Goes through each column title cell and creates key value pair for COLUMN NAME: COLUMN LOCATION (COL NUMBER)
    for (let columnHeader of columnHeaderIndexes) {
        const columnKey = `${columnHeader}2`
        const currentColumnHeaderName = cases[columnKey]["v"]
        if (currentColumnHeaderName in allColumnNames) {
            if (currentColumnHeaderName == "RN" && columnHeader.includes("A")) {
                allColumnNames["RN2"] = columnHeader
            } else {
                allColumnNames[currentColumnHeaderName] = columnHeader
            }
        }
    }
    // Iterates through each cell, beginning at first row, down to last row (calculated)
    for (let currentRow = 3; currentRow < rowCount; currentRow++) {
        // Creating a temp object due to automatic hashing in caseHashTable object.
        const tempRowObject: any = {}
        // Once inside a row, iterate through each column and add it to our tempRowObject hash. Example: Key: Column Title (MTT/RA). Value: 
        for (const [key, value] of Object.entries(allColumnNames)) {
            let currentKey = `${value}${currentRow}`
            // Make sure there is a value on the cell
            if (cases[currentKey]) {
                // To prevent our algorithm from becoming too complicated, we just want it to choose between OTHER and ASSIGN
                if (key == "RN" && cases[currentKey]["w"] != "OTHER") { // Checks if our current col is RN and if it has an RN's name
                    tempRowObject[key] = "ASSIGN"
                } else {
                    tempRowObject[key] = cases[currentKey]["w"]
                }
                // Determining how we want to handle empty entries in our database. Currently set to N/A
            } else {
                tempRowObject[key] = null
            }
        }
        // We need to redefine the object keys to match what our database column names are for smooth integration
        caseCensus.push(
            {
                caseId: tempRowObject["Case\nId"],
                censusDate: currentDate,
                rn: tempRowObject["RN"],
            }
        )
    }
    return caseCensus
}
export function parseExcelFile(cases: any) {
    const columnHeaderIndexes: string[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "AA", "AB", "AC", "AD", "AE", "AF", "AG", "AH", "AI", "AJ", "AK", "AL", "AM", "AN", "AO", "AP", "AQ", "AR", "AS", "AT", "AU", "AV", "AW", "AX", "AY"];
    const caseCensus = []
    const lastCell = cases["!ref"]
    const rowCount = extractRowCount(lastCell)

    const currentDate = getCurrentDate(cases["A1"]["v"])
    console.log("All CCR Cases here", cases)
    const allColumnNames: any = {
        "Case\nId": "",
        "Case Assignment Category": "",
        "Explicitly Assigned RN": "",
        "Last Assigned RN": "",
        "Primary Medical Home": "",
        "MTT/RA": "",
        "RN": "",
        "Service \nCode": "",
        "Coverage\nType": "",
        "DOB": "",
        "MRN": "",
        "LOS": "",
        "DX": "",
        "In Or Out of Area": "",
        "Vendor Name": "",
        "Admit Date": "",
        "last review date": "",
        "Last Reviewer Name": "",
        "Last CM Decision Creator": "",
        "Last CMDate": "",
        "Not Authorized": "",
        "Last PAD Reason": "",
        "PAD Reason entered date": "",
        "Level of Care": "",
        "Desk": "",
        "Priority Level": "",
        "Imported From EPRP": "",
        "Review Outcome": "",
        "Review Outcome Reason": "",
        " Entered Date": "",
        "Entered By": "",
        "Anticipated Disposition": "",
        "Barriers to Dispo": "",
        "Stability Order Reveived ": "",
        "StabilityOrder-NKF CM Verbal": "",
        "SFT Event": "",
        "SFT Date/Time": "",
        "Last Pertinent Event": "",
        "Last Pertinent Event Date": "",
        "Stable For Transfer Per OURS MD": "",
        "Reason": "",
        "Morning Rounding Report (12PM)": "",
        "Afternoon Rounding Report (4:30PM)": "",
        "Managing Fac": "",
        "Authorization Start Date": "",
        "Authorization End Date": "",
        "Last Review Required By Date": "",
        "RN2": ""
    }
    // Iterates each column to get the respective column index. 
    for (let columnHeader of columnHeaderIndexes) {
        const columnKey = `${columnHeader}2`
        const currentColumnHeaderName = cases[columnKey]["v"]
        if (currentColumnHeaderName in allColumnNames) {
            if (currentColumnHeaderName == "RN" && columnHeader.includes("A")) {
                allColumnNames["RN2"] = columnHeader
            } else {
                allColumnNames[currentColumnHeaderName] = columnHeader
            }
        }
    }
    // Iterating each case row
    for (let currentRow = 3; currentRow < rowCount; currentRow++) {
        // Creating a temp object due to automatic hashing in caseHashTable object.
        const tempRowObject: any = {}
        // Once inside a row, iterate through each column and add it to our tempRowObject hash. Example: Key: Column Title (MTT/RA). Value: 
        for (const [key, value] of Object.entries(allColumnNames)) {
            let currentKey = `${value}${currentRow}`
            // Make sure there is a value on the cell
            if (cases[currentKey]) {
                // To prevent our algorithm from becoming too complicated, we just want it to choose between OTHER and ASSIGN
                if (key == "RN" && cases[currentKey]["w"] != "OTHER") { // Checks if our current col is RN and if it has an RN's name
                    tempRowObject[key] = "ASSIGN"
                } else {
                    tempRowObject[key] = cases[currentKey]["w"]
                }
                // Determining how we want to handle empty entries in our database. Currently set to N/A
            } else {
                tempRowObject[key] = null
            }
        }
        const formattedDob = convertToDateType(tempRowObject["DOB"])

        // We need to redefine the object keys to match what our database column names are for smooth integration
        caseCensus.push(
            {
                caseId: tempRowObject["Case\nId"],
                censusDate: currentDate,
                caseAssignmentCategory: tempRowObject["Case Assignment Category"],
                explicitlyAssignedRn: tempRowObject["Explicitly Assigned RN"],
                lastAssignedRn: tempRowObject["Last Assigned RN"],
                primaryMedicalHome: tempRowObject["Primary Medical Home"],
                mtt: tempRowObject["MTT/RA"],
                rn: tempRowObject["RN"],
                serviceCode: tempRowObject["Service \nCode"],
                coverageType: tempRowObject["Coverage\nType"],
                // Should be converted to date type
                dob: convertToDateType(tempRowObject["DOB"]),
                // Should be converted to integer
                los: parseInt(tempRowObject["LOS"]),
                dx: tempRowObject["DX"],
                inOrOutOfArea: tempRowObject["In Or Out of Area"],
                vendorName: tempRowObject["Vendor Name"],
                // Should be converted to date time
                admitDate: convertDateTimeStringToDateOnly(tempRowObject["Admit Date"]),
                // Should be converted to date
                lastReviewDate: convertToDateType(tempRowObject["last review date"]),
                // Should be converted to date
                lastCmDate: convertToDateType(tempRowObject["Last CMDate"]),
                notAuthorized: tempRowObject["Not Authorized"],
                lastPadReason: tempRowObject["Last PAD Reason"],
                // Should be converted to date time
                padReasonEnteredDate: convertDateTimeStringToDateOnly(tempRowObject["PAD Reason entered date"]),
                levelOfCare: tempRowObject["Level of Care"],
                desk: tempRowObject["Desk"],
                priorityLevel: tempRowObject["Priority Level"],
                reviewOutcome: tempRowObject["Review Outcome"],
                reviewOutcomeReason: tempRowObject["Review Outcome Reason"],
                // Should be converted to date
                enteredDate: convertDateTimeStringToDateOnly(tempRowObject[" Entered Date"]),
                anticipatedDisposition: tempRowObject["Anticipated Disposition"],
                barriersToDisposition: tempRowObject["Barriers to Dispo"],
                rn2: tempRowObject["RN2"],
                stabilityOrderReceived: convertDateTimeStringToDateOnly(tempRowObject["Stability Order Reveived "]),
                // Should be converted to date time
                stabilityNkfCmVerbal: convertDateTimeStringToDateOnly(tempRowObject["StabilityOrder-NKF CM Verbal"]),
                sftEvent: tempRowObject["SFT Event"],
                // Should be converted to date time
                sftDateTime: convertDateTimeStringToDateOnly(tempRowObject["SFT Date/Time"]),
                lastPertinentEventDate: tempRowObject["Last Pertinent Event Date"],
                stablePerOursMd: tempRowObject["Stable For Transfer Per OURS MD"],
                reason: tempRowObject["Reason"],
                managingFac: tempRowObject["Managing Fac"],
                // Should be converted to date
                authStartDate: convertToDateType(tempRowObject["Authorization Start Date"]),
                // Should be converted to date
                authEndDate: convertToDateType(tempRowObject["Authorization End Date"]),
                lastReviewRequired: convertToDateType(tempRowObject["Last Review Required By Date"]),
            }
        )
    }
    return caseCensus
}

export function parseExcelForTraining(cases: any) {
    const columnHeaderIndexes: string[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "AA", "AB", "AC", "AD", "AE", "AF", "AG", "AH", "AI", "AJ", "AK", "AL", "AM", "AN", "AO", "AP", "AQ", "AR", "AS", "AT", "AU", "AV", "AW", "AX", "AY"];
    const caseCensus = []
    const lastCell = cases["!ref"]
    const rowCount = extractRowCount(lastCell)

    const currentDate = getCurrentDate(cases["A1"]["v"])
    console.log("All CCR Cases here", cases)
    const allColumnNames: any = {
        "Case\nId": "",
        "Case Assignment Category": "",
        "Explicitly Assigned RN": "",
        "Last Assigned RN": "",
        "Primary Medical Home": "",
        "MTT/RA": "",
        "RN": "",
        "Service \nCode": "",
        "Coverage\nType": "",
        "DOB": "",
        "MRN": "",
        "LOS": "",
        "DX": "",
        "In Or Out of Area": "",
        "Vendor Name": "",
        "Admit Date": "",
        "last review date": "",
        "Last Reviewer Name": "",
        "Last CM Decision Creator": "",
        "Last CMDate": "",
        "Not Authorized": "",
        "Last PAD Reason": "",
        "PAD Reason entered date": "",
        "Level of Care": "",
        "Desk": "",
        "Priority Level": "",
        "Imported From EPRP": "",
        "Review Outcome": "",
        "Review Outcome Reason": "",
        " Entered Date": "",
        "Entered By": "",
        "Anticipated Disposition": "",
        "Barriers to Dispo": "",
        "Stability Order Reveived ": "",
        "StabilityOrder-NKF CM Verbal": "",
        "SFT Event": "",
        "SFT Date/Time": "",
        "Last Pertinent Event": "",
        "Last Pertinent Event Date": "",
        "Stable For Transfer Per OURS MD": "",
        "Reason": "",
        "Morning Rounding Report (12PM)": "",
        "Afternoon Rounding Report (4:30PM)": "",
        "Managing Fac": "",
        "Authorization Start Date": "",
        "Authorization End Date": "",
        "Last Review Required By Date": "",
        "RN2": ""
    }
    // Iterates each column to get the respective column index. 
    for (let columnHeader of columnHeaderIndexes) {
        const columnKey = `${columnHeader}2`
        const currentColumnHeaderName = cases[columnKey]["v"]
        if (currentColumnHeaderName in allColumnNames) {
            if (currentColumnHeaderName == "RN" && columnHeader.includes("A")) {
                allColumnNames["RN2"] = columnHeader
            } else {
                allColumnNames[currentColumnHeaderName] = columnHeader
            }
        }
    }
    // Iterating each case row
    for (let currentRow = 3; currentRow < rowCount; currentRow++) {
        // Creating a temp object due to automatic hashing in caseHashTable object.
        const tempRowObject: any = {}
        // Once inside a row, iterate through each column and add it to our tempRowObject hash. Example: Key: Column Title (MTT/RA). Value: 
        for (const [key, value] of Object.entries(allColumnNames)) {
            let currentKey = `${value}${currentRow}`
            // Make sure there is a value on the cell
            if (cases[currentKey]) {
                // To prevent our algorithm from becoming too complicated, we just want it to choose between OTHER and ASSIGN
                if (key == "RN" && cases[currentKey]["w"] != "OTHER") { // Checks if our current col is RN and if it has an RN's name
                    tempRowObject[key] = "ASSIGN"
                } else {
                    tempRowObject[key] = cases[currentKey]["w"]
                }
                // Determining how we want to handle empty entries in our database. Currently set to N/A
            } else {
                tempRowObject[key] = null
            }
        }
        const formattedDob = convertToDateType(tempRowObject["DOB"])
        const features = [
            "vendorName",
            "anticipatedDisposition",
            "rn2",
            "reviewOutcomeReason",
            "explicitlyAssignedRn",
            "lastAssignedRn",
            "censusDate",
        ]
        // We need to redefine the object keys to match what our database column names are for smooth integration
        caseCensus.push(
            {
                caseId: tempRowObject["Case\nId"],
                censusDate: currentDate,
                caseAssignmentCategory: tempRowObject["Case Assignment Category"],
                explicitlyAssignedRn: tempRowObject["Explicitly Assigned RN"],
                lastAssignedRn: tempRowObject["Last Assigned RN"],
                primaryMedicalHome: tempRowObject["Primary Medical Home"],
                mtt: tempRowObject["MTT/RA"],
                rn: tempRowObject["RN"],
                serviceCode: tempRowObject["Service \nCode"],
                coverageType: tempRowObject["Coverage\nType"],
                // Should be converted to date type
                dob: convertToDateType(tempRowObject["DOB"]),
                // Should be converted to integer
                los: parseInt(tempRowObject["LOS"]),
                dx: tempRowObject["DX"],
                inOrOutOfArea: tempRowObject["In Or Out of Area"],
                vendorName: tempRowObject["Vendor Name"],
                // Should be converted to date time
                admitDate: convertDateTimeStringToDateOnly(tempRowObject["Admit Date"]),
                // Should be converted to date
                lastReviewDate: convertToDateType(tempRowObject["last review date"]),
                // Should be converted to date
                lastCmDate: convertToDateType(tempRowObject["Last CMDate"]),
                notAuthorized: tempRowObject["Not Authorized"],
                lastPadReason: tempRowObject["Last PAD Reason"],
                // Should be converted to date time
                padReasonEnteredDate: convertDateTimeStringToDateOnly(tempRowObject["PAD Reason entered date"]),
                levelOfCare: tempRowObject["Level of Care"],
                desk: tempRowObject["Desk"],
                priorityLevel: tempRowObject["Priority Level"],
                reviewOutcome: tempRowObject["Review Outcome"],
                reviewOutcomeReason: tempRowObject["Review Outcome Reason"],
                // Should be converted to date
                enteredDate: convertDateTimeStringToDateOnly(tempRowObject[" Entered Date"]),
                anticipatedDisposition: tempRowObject["Anticipated Disposition"],
                barriersToDisposition: tempRowObject["Barriers to Dispo"],
                rn2: tempRowObject["RN2"],
                stabilityOrderReceived: convertDateTimeStringToDateOnly(tempRowObject["Stability Order Reveived "]),
                // Should be converted to date time
                stabilityNkfCmVerbal: convertDateTimeStringToDateOnly(tempRowObject["StabilityOrder-NKF CM Verbal"]),
                sftEvent: tempRowObject["SFT Event"],
                // Should be converted to date time
                sftDateTime: convertDateTimeStringToDateOnly(tempRowObject["SFT Date/Time"]),
                lastPertinentEventDate: tempRowObject["Last Pertinent Event Date"],
                stablePerOursMd: tempRowObject["Stable For Transfer Per OURS MD"],
                reason: tempRowObject["Reason"],
                managingFac: tempRowObject["Managing Fac"],
                // Should be converted to date
                authStartDate: convertToDateType(tempRowObject["Authorization Start Date"]),
                // Should be converted to date
                authEndDate: convertToDateType(tempRowObject["Authorization End Date"]),
                lastReviewRequired: convertToDateType(tempRowObject["Last Review Required By Date"]),
            }
        )
    }
    return caseCensus
}

// We need to pull all the relevant cases from the same data. As soon as the excel file is loaded up:
// 1. Retrieve the date for the excel file that was uploaded. 
// 2. Make SQL inquiry to pull all cases from same date. 
// 3. Once cases retrieved, loop through retrieved cases and do following:
// 3a: Find the matching reno number
// 3b: Change database RN value to corresponding spreadsheet RN value. 
// 4. After all cases matched, we need to update those cases and push back to database. 
// 

// Test: make an array of test data with updated values