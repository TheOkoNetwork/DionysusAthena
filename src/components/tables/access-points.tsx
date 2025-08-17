'use client';

import 'react-data-grid/lib/styles.css';
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { DataGrid, type Column, CellMouseArgs } from 'react-data-grid';
import Typesense from 'typesense';
import {  SearchResponseHit } from 'typesense/lib/Typesense/Documents';


interface AccessPoint {
  id: string;
  name: string;
}

const columns: Column<AccessPoint>[] = [
  { key: 'id', name: 'ID' },
  { key: 'name', name: 'name' },
];

export default function AccessPointsTable() {
  const [AccessPoints, setAccessPoints] = useState<AccessPoint[]>([]);
  const [typesenseKey, setTypesenseKey] = useState<string | undefined>(undefined);
  const [typesenseHost, setTypesenseHost] = useState<string | undefined>(undefined);
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
        .collections('accessPoints')
        .documents()
        .search({ 'q': query, query_by: "name" })
        .then((res) => {
          const typedRes = res as { hits: SearchResponseHit<AccessPoint>[] | undefined };
          if (typedRes.hits) { setAccessPoints(typedRes.hits.map((hit: SearchResponseHit<AccessPoint>) => hit.document)); }
        });
    }
  }, [typesenseKey,typesenseHost, query]);


  function onCellClick(args: CellMouseArgs<AccessPoint>) {
    router.push(`/access-points/${args.row.id}`);
  }

  return (
    <>
      <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search Access points..." /><br />
      <DataGrid columns={columns} rows={AccessPoints} onCellClick={onCellClick} />
    </>
  );
}
