import Papa from "papaparse";
import UploadForm from './UploadForm.module.css';
import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import { signal } from "@preact/signals";

const filters = signal([]);

const ResultColumn = ({ name,values }) => {
	
	return <li>
		<p>{name}</p>
		<ul>
			{Object.entries(values).map(([key, value]) => <li>{key}: {value}</li>)}
		</ul>
	</li>
}

const FiltersList = ({ headers }) => {
	const [filters, setFilters] = useState([]);
	const updateFilters = useCallback((newFilter) => {
		if (filters.indexOf(newFilter) === -1) {
			setFilters([...filters, newFilter]);
		} else {
			setFilters([...filters.filter(h => h !== newFilter)]);
		}
	}, [filters])
	return <ul class={UploadForm.choices} role="list">
		{headers.map((h, i) => {
			const id = h.replace(/\W/g, '');
			return <li key={i}>
				<input id={id} type="checkbox" name="filters" onChange={updateFilters}/>
				<label htmlFor={id}>{h}</label>
			</li>
		})}
	</ul>
}

const useFilters = (newFilter) => {
	const [filters, setFilters] = useState([]);

	const update = useCallback(() => {
		if (filters.indexOf(newFilter) !== -1) {
			setFilters(filters.filter(f => f !== newFilter));
		} else {
			setFilters([...filters, newFilter]);
		}
	}, [filters])

	return { filters, update };
}
 
export default function() {
	const inputRef = useRef(null)
	const [columns, setColumns] = useState([]);
	const [headers, setHeaders] = useState([])
	const [filters, setFilters ] = useState([])
	
	const [totals, setTotals] = useState({ rows: 0, cols: 0 });
	const change = useCallback(async () => {
		const input = inputRef.current;

		const [file] = input.files;
		const { data } = await new Promise(res => Papa.parse(file, { 
			complete: res,
			header: true,
			worker: true
		})) as { data: {[index: string]:unknown}[] };

		
		setTotals({
			rows: Object.keys(data[0]).length,
			cols: data.length
		});
		if (headers.length === 0) setHeaders(Object.keys(data[0]));
		setColumns([...data]);
	}, [inputRef])

	return <form>
		<input type="file" ref={inputRef} onChange={change} />
		<div>
			<FiltersList headers={headers} />
			<ul class="columns" role="list">
				{columns.map((c, i) => {
					// if (i === 0) console.log(c, filters);
					const values = {};
					filters.forEach(f => values[f] = c[f]);
					const name = c['Patient Name'];
					return <ResultColumn key={i} name={name} values={values} />
				})}
			</ul>
		</div>
	</form>
}