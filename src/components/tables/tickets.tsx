'use client';

import 'react-data-grid/lib/styles.css';
import { useState, useEffect } from "react";
import { DataGrid, type Column } from 'react-data-grid';
import Typesense from 'typesense';
import { SearchResponseHit } from 'typesense/lib/Typesense/Documents';
import { Ticket } from '@/types/tickets';

const columns: Column<Ticket>[] = [
  { key: 'id', name: 'ID' },
  { key: 'barcode', name: 'Barcode' },
  { key: 'product', name: 'Product' },
  { key: 'type', name: 'Type' },
  { key: 'given_name', name: 'Given Name', sortable: true },
  { key: 'family_name', name: 'Family Name', sortable: true },
  { key: 'email', name: 'Email' },
  { key: 'phone_number', name: 'Phone Number' },
];

export default function TicketsTable() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [typesenseHost, setTypesenseHost] = useState<string | undefined>();
  const [typesenseKey, setTypesenseKey] = useState<string | undefined>();
  const [query, setQuery] = useState('');

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
        .collections('tickets')
        .documents()
        .search({ 'q': query, query_by: "barcode,product,type,given_name,family_name,email,phone_number" })
        .then((res) => {
          const typedRes = res as { hits: SearchResponseHit<Ticket>[] | undefined };
          if (typedRes.hits) { 
            setTickets(typedRes.hits.map((hit: SearchResponseHit<Ticket>) => hit.document)); 
          }
        })
        .catch((error) => {
          console.error('Error searching tickets:', error);
          setTickets([]);
        });
    }
  }, [typesenseKey, typesenseHost, query]);

  return (
    <>
      <input 
        type="text" 
        value={query} 
        onChange={e => setQuery(e.target.value)} 
        placeholder="Search tickets by ID, barcode, product, type, name, email, or phone..." 
        className="w-full p-2 mb-4 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-white"
      />
      <DataGrid columns={columns} rows={tickets} />
    </>
  );
}
