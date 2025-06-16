import React from 'react';
import { tableStyles, cn } from '../../config/design';

export interface Column<T = any> {
  key: string;
  title: string;
  dataIndex?: keyof T;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
}

export interface TableProps<T = any> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  className?: string;
  rowKey?: keyof T | ((record: T) => string);
  onRowClick?: (record: T, index: number) => void;
  emptyText?: string;
}

export const Table = <T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  className,
  rowKey = 'id',
  onRowClick,
  emptyText = 'Aucune donnée'
}: TableProps<T>) => {
  const getRowKey = (record: T, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return record[rowKey] || index.toString();
  };

  const getCellAlignment = (align?: string) => {
    switch (align) {
      case 'center': return 'text-center';
      case 'right': return 'text-right';
      default: return 'text-left';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className={cn(tableStyles.container, className)}>
      <table className={tableStyles.table}>
        <thead className={tableStyles.header.base}>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  tableStyles.header.cell,
                  getCellAlignment(column.align)
                )}
                style={{ width: column.width }}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={tableStyles.body.base}>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-12 text-center text-gray-500"
              >
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((record, index) => (
              <tr
                key={getRowKey(record, index)}
                className={cn(
                  tableStyles.body.row.default,
                  onRowClick && 'cursor-pointer'
                )}
                onClick={() => onRowClick?.(record, index)}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn(
                      tableStyles.body.cell,
                      getCellAlignment(column.align)
                    )}
                  >
                    {column.render
                      ? column.render(
                          column.dataIndex ? record[column.dataIndex] : record,
                          record,
                          index
                        )
                      : column.dataIndex
                      ? record[column.dataIndex]
                      : null}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
