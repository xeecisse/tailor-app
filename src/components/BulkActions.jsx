import React from 'react';
import { Trash2, Download, CheckSquare, Square } from 'lucide-react';

export default function BulkActions({ selected = [], items = [], onSelectAll, onClearAll, onDelete, onExport }) {
  if (selected.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-blue-50 border-t border-blue-300 p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={selected.length === items.length ? onClearAll : onSelectAll}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 rounded"
          >
            {selected.length === items.length ? (
              <>
                <CheckSquare className="w-4 h-4" />
                Deselect All
              </>
            ) : (
              <>
                <Square className="w-4 h-4" />
                Select All
              </>
            )}
          </button>

          <span className="text-sm font-medium text-gray-700">
            {selected.length} selected
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onExport && (
            <button
              onClick={() => onExport(selected)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => {
                if (confirm(`Delete ${selected.length} items?`)) {
                  onDelete(selected);
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
