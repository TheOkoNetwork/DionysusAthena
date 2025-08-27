'use client';

import 'react-data-grid/lib/styles.css';
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { DataGrid, type Column, CellMouseArgs } from 'react-data-grid';

type PDFTemplate = {
  id: string;
  name: string;
  custom: boolean;
}
const columns: Column<PDFTemplate>[] = [
  { key: 'id', name: 'ID' },
  { key: 'name', name: 'Name' },
  { key: 'custom', name: 'Custom template?',
    renderCell: (row) => {
      return row.row.custom ? 'Yes' : 'No';
    }
   },
];

export default function PDFTemplatesTable() {
  const [pdfTemplates, setPDFTemplate] = useState<PDFTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/request/GetPDFTemplates')
      .then((res) => res.json())
      .then((data) => {
        console.log('PDF Templates:', data);
        if (Array.isArray(data)) {
          setPDFTemplate(data.map(row => {
            return {
              id: row.id,
              name: row.name,
              custom: Boolean(row.organiser_id)
            }
          }));
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching PDF templates:', error);
        setLoading(false);
      });
  }, []);

  function onCellClick(args: CellMouseArgs<PDFTemplate>) {
    // Navigate to PDF templates detail page since we don't have individual detail pages
    router.push(`/pdf-templates/${args.row.id}`);
  }

  if (loading) {
    return <div>Loading PDF Templates...</div>;
  }

  return (
    <>
      <DataGrid columns={columns} rows={pdfTemplates} onCellClick={onCellClick} />
    </>
  );
}