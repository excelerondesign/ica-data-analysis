import { useSanityClient, groq } from "astro-sanity";
import { parse } from "csv-parse";
let output = null;
let _headers = [];
export async function getRecords(group:number = 1) {
    const query = groq`*[_type == "record"]{
        "record": recordUpload.asset->url
    }`;
    let records;
    if (output === null) {
        const [{ record }] = await useSanityClient().fetch(query);
        
        const csv = await fetch(record);
        records = await _parseRecords(csv, group);
    } else {
        records = await _parseRecords(null, group)
    }

    return records;
}

export function getHeaders() {
    return _headers;
}

async function _parseRecords(file:Response|null, group: number) {
    if (!output) {
        const input = await file?.text();
        output = input;
    }

    const groupEnd = group + 10;
    const { err, records } = await new Promise<{ err: unknown, records: string[][] }>((res, rej) => parse(output, {
        from: group,
        to: groupEnd,
        columns: true
    }, function(err, records) {
        if (err) rej({ err, records: [] });
        res({ err: null, records });
    }))

    if (err) throw err;

    if (_headers.length === 0) _headers.concat(Object.keys(records));
    
    return records;
}