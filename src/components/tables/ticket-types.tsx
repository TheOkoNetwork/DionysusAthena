'use client';

import 'react-data-grid/lib/styles.css';
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { DataGrid, type Column, CellMouseArgs } from 'react-data-grid';
import { TicketType } from '@/types/tickets';

const columns: Column<TicketType>[] = [
  { key: 'id', name: 'ID' },
  { key: 'name', name: 'Name' },
  { key: 'description', name: 'Description' },
  { key: 'active', name: 'Active', sortable: true }
];

export default function TicketTypesTable() {
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/request/GetTicketTypes')
      .then((res) => res.json())
      .then((data) => {
        console.log('Ticket Types:', data);
        if (Array.isArray(data)) {
          setTicketTypes(data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching ticket types:', error);
        setLoading(false);
      });
  }, []);

  function onCellClick(args: CellMouseArgs<TicketType>) {
    router.push(`/ticket-types/${args.row.id}`);
  }

  if (loading) {
    return <div>Loading ticket types...</div>;
  }

  return (
    <>
      <DataGrid columns={columns} rows={ticketTypes} onCellClick={onCellClick} />
    </>
  );
}