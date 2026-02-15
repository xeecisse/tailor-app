import { useState } from 'react';

export const useBulkSelection = (items = []) => {
  const [selected, setSelected] = useState([]);

  const toggleItem = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelected(items.map((item) => item._id || item.id));
  };

  const clearAll = () => {
    setSelected([]);
  };

  const isSelected = (id) => selected.includes(id);

  const isAllSelected = selected.length === items.length && items.length > 0;

  const isPartialSelected = selected.length > 0 && selected.length < items.length;

  return {
    selected,
    toggleItem,
    selectAll,
    clearAll,
    isSelected,
    isAllSelected,
    isPartialSelected,
  };
};
