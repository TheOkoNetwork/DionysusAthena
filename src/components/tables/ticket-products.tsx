'use client';

import 'react-data-grid/lib/styles.css';
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { DataGrid, type Column, CellMouseArgs } from 'react-data-grid';
import { TicketProduct } from '@/types/tickets';

const columns: Column<TicketProduct>[] = [
  { key: 'id', name: 'ID' },
  { key: 'name', name: 'Name' },
  { key: 'description', name: 'Description' },
  { key: 'price', name: 'Price' },
  { key: 'ticket_type_id', name: 'Ticket Type ID' },
  { key: 'active', name: 'Active', sortable: true }
];

export default function TicketProductsTable() {
  const [ticketProducts, setTicketProducts] = useState<TicketProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/request/GetTicketProducts')
      .then((res) => res.json())
      .then((data) => {
        console.log('Ticket Products:', data);
        if (Array.isArray(data)) {
          setTicketProducts(data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching ticket products:', error);
        setLoading(false);
      });
  }, []);

  function onCellClick(args: CellMouseArgs<TicketProduct>) {
    router.push(`/ticket-products/${args.row.id}`);
  }

  if (loading) {
    return <div>Loading ticket products...</div>;
  }

  return (
    <>
      <DataGrid columns={columns} rows={ticketProducts} onCellClick={onCellClick} />
    </>
  );
}