// Export utilities for PDF and Excel
export const exportToCSV = (data, filename = 'export.csv') => {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value}"`;
          }
          return value;
        })
        .join(',')
    ),
  ].join('\n');

  downloadFile(csv, filename, 'text/csv');
};

export const exportToJSON = (data, filename = 'export.json') => {
  const json = JSON.stringify(data, null, 2);
  downloadFile(json, filename, 'application/json');
};

export const exportToExcel = (data, filename = 'export.xlsx') => {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const rows = data.map((row) => headers.map((h) => row[h]));

  // Create simple Excel-compatible CSV
  const csv = [
    headers.join('\t'),
    ...rows.map((row) => row.join('\t')),
  ].join('\n');

  downloadFile(csv, filename, 'application/vnd.ms-excel');
};

export const exportToPDF = (data, filename = 'export.pdf', title = 'Report') => {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  let html = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; }
          table { border-collapse: collapse; width: 100%; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #4CAF50; color: white; }
          tr:nth-child(even) { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <p>Generated on: ${new Date().toLocaleString()}</p>
        <table>
          <thead>
            <tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${data
              .map(
                (row) =>
                  `<tr>${headers.map((h) => `<td>${row[h]}</td>`).join('')}</tr>`
              )
              .join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;

  const printWindow = window.open('', '', 'height=600,width=800');
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.print();
};

const downloadFile = (content, filename, type) => {
  const blob = new Blob([content], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// Format data for export
export const formatOrdersForExport = (orders) => {
  return orders.map((order) => ({
    'Order ID': order.orderNumber,
    'Client': order.clientId?.name || 'N/A',
    'Attire Type': order.attireType,
    'Price': `₦${order.price.toLocaleString()}`,
    'Status': order.status,
    'Payment Status': order.paymentStatus,
    'Amount Paid': `₦${order.amountPaid.toLocaleString()}`,
    'Outstanding': `₦${(order.price - order.amountPaid).toLocaleString()}`,
    'Created': new Date(order.createdAt).toLocaleDateString(),
  }));
};

export const formatClientsForExport = (clients) => {
  return clients.map((client) => ({
    'Name': client.name,
    'Phone': client.phone,
    'WhatsApp': client.whatsappNumber,
    'Email': client.email || 'N/A',
    'Gender': client.gender,
    'City': client.address?.city || 'N/A',
    'Measurements': client.measurementCount || 0,
    'Orders': client.orderCount || 0,
    'Created': new Date(client.createdAt).toLocaleDateString(),
  }));
};

export const formatInventoryForExport = (items) => {
  return items.map((item) => ({
    'Item Name': item.name,
    'Category': item.categoryName || 'N/A',
    'SKU': item.sku,
    'Quantity': item.quantity,
    'Unit': item.unit,
    'Cost Price': `₦${item.costPrice.toLocaleString()}`,
    'Selling Price': `₦${item.sellingPrice.toLocaleString()}`,
    'Profit Margin': `${(((item.sellingPrice - item.costPrice) / item.costPrice) * 100).toFixed(2)}%`,
    'Low Stock Threshold': item.lowStockThreshold,
    'Status': item.quantity <= item.lowStockThreshold ? 'Low Stock' : 'In Stock',
  }));
};
