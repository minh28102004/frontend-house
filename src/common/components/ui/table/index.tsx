import React, { ReactNode } from "react";

// Props for Table
interface TableProps {
  children: ReactNode; // Table content (thead, tbody, etc.)
  className?: string; // Optional className for styling
}

// Props for TableHeader
interface TableHeaderProps {
  children: ReactNode; // Header row(s)
  className?: string; // Optional className for styling
}

// Props for TableBody
interface TableBodyProps {
  children: ReactNode; // Body row(s)
  className?: string; // Optional className for styling
}

// Props for TableRow
interface TableRowProps {
  children: ReactNode; // Cells (th or td)
  className?: string; // Optional className for styling
}

// Props for TableCell
interface TableCellProps {
  children: ReactNode; // Cell content
  isHeader?: boolean; // If true, renders as <th>, otherwise <td>
  className?: string; // Optional className for styling
}

// Table Component
const Table: React.FC<TableProps> = ({ children, className }) => {
  return <table className={`min-w-full text-[var(--ah-text)] ${className ?? ""}`}>{children}</table>;
};

// TableHeader Component
const TableHeader: React.FC<TableHeaderProps> = ({ children, className }) => {
  return <thead className={`bg-[rgba(237,229,216,0.58)] ${className ?? ""}`}>{children}</thead>;
};

// TableBody Component
const TableBody: React.FC<TableBodyProps> = ({ children, className }) => {
  return <tbody className={`divide-y divide-[var(--ah-border)] ${className ?? ""}`}>{children}</tbody>;
};

// TableRow Component
const TableRow: React.FC<TableRowProps> = ({ children, className }) => {
  return <tr className={`transition-colors hover:bg-[rgba(196,148,74,0.06)] ${className ?? ""}`}>{children}</tr>;
};

// TableCell Component
const TableCell: React.FC<TableCellProps> = ({
  children,
  isHeader = false,
  className,
}) => {
  const CellTag = isHeader ? "th" : "td";
  return (
    <CellTag
      className={`px-4 py-3 ${
        isHeader
          ? "text-left text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--ah-muted)]"
          : "text-sm text-[var(--ah-text)]"
      } ${className ?? ""}`}
    >
      {children}
    </CellTag>
  );
};

export { Table, TableHeader, TableBody, TableRow, TableCell };
