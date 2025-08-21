'use client';

import 'react-data-grid/lib/styles.css';
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { DataGrid, type Column, CellMouseArgs } from 'react-data-grid';
import { TicketProductType } from '@/types/tickets';

const columns: Column<TicketProductType>[] = [
  { key: 'id', name: 'ID' },
  { key: 'name', name: 'Name' }
];

export default function TicketProductTypesTable() {
  const [ticketProductTypes, setTicketProductTypes] = useState<TicketProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/request/GetTicketProductTypes')
      .then((res) => res.json())
      .then((data) => {
        console.log('Ticket Product Types:', data);
        if (Array.isArray(data)) {
          setTicketProductTypes(data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching ticket product types:', error);
        setLoading(false);
      });
  }, []);

  function onCellClick(args: CellMouseArgs<TicketProductType>) {
    // Navigate to ticket product types list page since we don't have individual detail pages
    router.push(`/ticket-product-types`);
  }

  if (loading) {
    return <div>Loading ticket product types...</div>;
  }

  return (
    <>
      <DataGrid columns={columns} rows={ticketProductTypes} onCellClick={onCellClick} />
    </>
  );
}