'use client';

import 'react-data-grid/lib/styles.css';
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { DataGrid, type Column, CellMouseArgs } from 'react-data-grid';
import Typesense from 'typesense';
import {  SearchResponseHit } from 'typesense/lib/Typesense/Documents';


interface Staff {
  id: string;
  given_name: string;
  family_name: string;
  email: string;
  phone_number: string;
}

const columns: Column<Staff>[] = [
  { key: 'id', name: 'ID' },
  { key: 'given_name', name: 'Given name' },
  { key: 'family_name', name: 'Family name' },
  { key: 'email', name: 'Email' },
  { key: 'phone_number', name: 'Phone number', sortable: true }
];

export default function StaffTable() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [typesenseHost, setTypesenseHost] = useState<string | undefined>();
  const [typesenseKey, setTypesenseKey] = useState<string | undefined>();
  const [query, setQuery] = useState('');
  const router = useRouter();
  useEffect(() => {
    fetch('/api/request/typesenseKey')
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        console.log("Typesense host:", data.host);
        console.log("Typesense key:", data.key);
        setTypesenseKey(data.key);
        setTypesenseHost(data.host);
      });
  }, []);

  useEffect(() => {
    if (typesenseKey && typesenseHost) {
      const typesense = new Typesense.Client({
        nodes: [
          {
            host: typesenseHost,
            port: 443,
            protocol: 'https',
          },
        ],
        apiKey: typesenseKey,
        connectionTimeoutSeconds: 2,
      });
      typesense
        .collections('staff')
        .documents()
        .search({ 'q': query, query_by: "given_name,family_name,email,phone_number" })
        .then((res) => {
          const typedRes = res as { hits: SearchResponseHit<Staff>[] | undefined };
          if (typedRes.hits) { setStaff(typedRes.hits.map((hit: SearchResponseHit<Staff>) => hit.document)); }
        });
    }
  }, [typesenseKey, typesenseHost, query]);


  function onCellClick(args: CellMouseArgs<Staff>) {
    router.push(`/staff/${args.row.id}`);
  }

  return (
    <>
      <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search customers..." /><br />
      <DataGrid columns={columns} rows={staff} onCellClick={onCellClick} />
    </>
  );
}
