'use client';

import 'react-data-grid/lib/styles.css';
import {useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { DataGrid, type Column,SortColumn,CellMouseArgs, CellMouseEvent } from 'react-data-grid';

interface Row {
  id: string;
  name: string;
}

interface AccessPoint {
  id: string;
  name: string;
}

const columns: Column<Row>[] = [
  { key: 'id', name: 'ID',sortable:true },
  { key: 'name', name: 'Name', sortable: true }
];

export default function AccessPointsTable() {
  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([]);
  const [accessPoints, setAccessPoints] = useState<AccessPoint[]>([]);
  const router = useRouter();
  useEffect(() => {
    fetch('/api/request/GetAccessPoints')
      .then((res) => res.json())
      .then((data) => {
        setAccessPoints(data);
      });
  }, []);

  const onSortColumnsChange = function(requestedSortColumns: readonly SortColumn[]) {
    // window.alert(JSON.stringify(requestedSortColumns));
    setSortColumns(requestedSortColumns);
    const newAccessPoints = [...accessPoints];
    newAccessPoints.sort((a, b) => {
      for (const sortColumn of requestedSortColumns) {
        const comparator = (a: AccessPoint, b: AccessPoint) => {
          const aValue = a[sortColumn.columnKey as keyof AccessPoint];
          const bValue = b[sortColumn.columnKey as keyof AccessPoint];
          if (aValue === null || aValue === undefined) return -1;
          if (bValue === null || bValue === undefined) return 1;
          if (aValue < bValue) return sortColumn.direction === 'ASC' ? -1 : 1;
          if (aValue > bValue) return sortColumn.direction === 'ASC' ? 1 : -1;
          return 0;
        };
        const comparisonResult = comparator(a, b);
        if (comparisonResult !== 0) return comparisonResult;
      }
      return 0;
    });
    setAccessPoints(newAccessPoints);
  }
  function onCellClick(args: CellMouseArgs<Row>, event: CellMouseEvent) {
    router.push(`/access-points/${args.row.id}`);
  }
  return <DataGrid columns={columns} rows={accessPoints}  sortColumns={sortColumns}
  onSortColumnsChange={onSortColumnsChange}
  onCellClick={onCellClick}
  />;
}