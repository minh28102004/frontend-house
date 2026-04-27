import React from 'react';
import { Select, SelectProps } from 'antd';
import { AdminFilterItem } from './AdminUi'; // Reuse the filter item wrapper

/**
 * AdminSelectFilter – a thin wrapper that places an Ant Design Select inside
 * an {@link AdminFilterItem}. It accepts the same props as AntD `Select`.
 */
export const AdminSelectFilter = (props: SelectProps<any>) => {
  const { placeholder, ...rest } = props;
  return (
    <AdminFilterItem label={placeholder ?? ''}>
      <Select placeholder={placeholder} {...rest} />
    </AdminFilterItem>
  );
};
