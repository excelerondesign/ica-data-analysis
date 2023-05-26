import { useSanityClient, groq } from "astro-sanity";
import { parse } from "csv-parse";
import type { Options } from "csv-parse";
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

export async function p(text:string, _options = { }) {
    const options = {
        columns: true,
        ..._options
    }

    return await new Promise<{ err: unknown, records: any }>((res, rej) => {
        parse(text, options,(err, records) => {
            if (err) rej({ err, records: [] });
            res({ err: null, records });
        });
    });

}

export async function _parseRecords(file:File|Response|null, group: number):Promise<{ [index:string]: string }[]> {
    if (file === null) throw new Error('Missing file param');
    let options:Options = {
        columns: true
    };

    if (group !== 0) {
        options = {
            ...options,
            from: group,
            to: group + 10
        }
    }
    
    const text = await file.text();
    const { err, records } = await p(text, options);
    /*
    const { err, records } = await new Promise<{ err: unknown, records: any }>((res, rej) => {
        
        parse(text, options, function(err, records) {
            if (err) rej({ err, records: [] });
            res({ err: null, records });
        });
    });*/
    
    if (err) throw err;

    if (_headers.length === 0) _headers.concat(Object.keys(records));
    /*
    const output = _headers.map((h, i) => {
        records.map(r => ({ [h]:r[i] }))
    })*/

    return records;
}