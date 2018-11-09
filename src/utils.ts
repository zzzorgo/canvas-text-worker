// import { csvData } from "./data";

// export function parse(data : string) : object[] {
//     const rows : string[] = data.split('\n');
//     const headers : string[] = rows[0].split(';');
//     const dataRows : string[] = rows.slice(1);

//     const entries = [];

//     for (const rawEntry of dataRows)
//     {
//         const entry = {};
//         const splitedRawEntry = rawEntry.split(';');

//         for (let i = 0; i < headers.length; i++) {
//             const fieldName : string = headers[i];
//             entry[fieldName] = splitedRawEntry[i];
//         }

//         entries.push(entry);
//     }

//     return entries; 
// }

// export const result : object[] = parse(csvData);
