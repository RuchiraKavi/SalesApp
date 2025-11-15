import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Generate a PDF for a single order. Expects:
// - order: sales order object (items array with itemId, quantity, taxRate, note)
// - client: client object (optional)
// - itemsMaster: array of available items with id, itemCode, description, price
export function generateOrderPdf(order, client, itemsMaster = []) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const marginLeft = 40;
  let cursorY = 40;

  doc.setFontSize(16);
  doc.text(`Sales Order${order.invoiceNo ? ' - ' + order.invoiceNo : ''}`, marginLeft, cursorY);

  doc.setFontSize(10);
  cursorY += 24;

  // Order & Client details
  const leftCol = marginLeft;
  const rightCol = 320;

  const addLine = (label, value, x, y) => {
    doc.setFont(undefined, 'bold');
    doc.text(`${label}:`, x, y);
    doc.setFont(undefined, 'normal');
    doc.text(String(value ?? ''), x + 60, y);
  };

  addLine('Invoice No', order.invoiceNo || '', leftCol, cursorY);
  addLine('Date', order.invoiceDate ? order.invoiceDate.slice(0, 10) : '', rightCol, cursorY);
  cursorY += 14;
  addLine('Customer', client?.customerName || (order.client?.customerName || ''), leftCol, cursorY);
  addLine('Reference', order.referenceNo || '', rightCol, cursorY);
  cursorY += 14;
  addLine('Note', order.note || '', leftCol, cursorY);

  cursorY += 24;

  // Items table
  const tableBody = (order.items || []).map((line) => {
    const master = itemsMaster.find((m) => Number(m.id) === Number(line.itemId)) || {};
    const price = Number(master.price || 0);
    const quantity = Number(line.quantity || 0);
    const taxRate = Number(line.taxRate || 0);
    const exclAmount = quantity * price;
    const taxAmount = (exclAmount * taxRate) / 100;
    const inclAmount = exclAmount + taxAmount;

    return [
      master.itemCode || line.itemId || '',
      master.description || '',
      line.note || '',
      quantity.toString(),
      price.toFixed(2),
      taxRate.toFixed(2),
      exclAmount.toFixed(2),
      taxAmount.toFixed(2),
      inclAmount.toFixed(2),
    ];
  });

  doc.autoTable({
    head: [[
      'Item Code',
      'Description',
      'Note',
      'Qty',
      'Price',
      'Tax %',
      'Excl Amount',
      'Tax Amount',
      'Incl Amount'
    ]],
    body: tableBody,
    startY: cursorY,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [240, 240, 240] },
    margin: { left: marginLeft, right: marginLeft }
  });

  const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : cursorY + 20;

  // Totals
  const totalExcl = (order.items || []).reduce((s, line) => {
    const master = itemsMaster.find((m) => Number(m.id) === Number(line.itemId)) || {};
    const price = Number(master.price || 0);
    const quantity = Number(line.quantity || 0);
    return s + (price * quantity);
  }, 0);
  const totalTax = (order.items || []).reduce((s, line) => {
    const master = itemsMaster.find((m) => Number(m.id) === Number(line.itemId)) || {};
    const price = Number(master.price || 0);
    const quantity = Number(line.quantity || 0);
    const excl = price * quantity;
    return s + (excl * (Number(line.taxRate || 0) / 100));
  }, 0);
  const totalIncl = totalExcl + totalTax;

  doc.setFontSize(10);
  const totalsX = 400;
  let y = finalY + 20;
  doc.text('Total Excl:', totalsX, y);
  doc.text(totalExcl.toFixed(2), totalsX + 80, y);
  y += 14;
  doc.text('Total Tax:', totalsX, y);
  doc.text(totalTax.toFixed(2), totalsX + 80, y);
  y += 14;
  doc.setFont(undefined, 'bold');
  doc.text('Total Incl:', totalsX, y);
  doc.text(totalIncl.toFixed(2), totalsX + 80, y);

  // Save
  const fileName = `Order-${order.invoiceNo || order.id || Date.now()}.pdf`;
  doc.save(fileName);
}
