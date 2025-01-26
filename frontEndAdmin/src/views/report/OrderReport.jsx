/* eslint-disable react/prop-types */
// OrderReport.js
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Define styles for the PDF document
const styles = StyleSheet.create({
  page: {
    padding: 20
  },
  header: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  table: {
    display: 'table',
    width: '100%',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#000'
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid'
  },
  tableCell: {
    flex: 1,
    padding: 6,
    textAlign: 'center',
    fontSize: 10,
    borderRightWidth: 1,
    borderRightColor: '#000',
    borderRightStyle: 'solid'
  },
  tableCellLast: {
    borderRightWidth: 0 // Remove right border for the last cell
  },
  tableHeader: {
    fontWeight: 'bold',
    backgroundColor: '#f0f0f0'
  }
});

// Component to render the Order Report
const OrderReport = ({ dataOrder }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <Text style={styles.header}>Order Report</Text>

      {/* Table */}
      <View style={styles.table}>
        {/* Table Header */}
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, styles.tableHeader, { width: '10%' }]}>#</Text>
          <Text style={[styles.tableCell, styles.tableHeader, { width: '30%' }]}>Order Date</Text>
          <Text style={[styles.tableCell, styles.tableHeader, { width: '30%' }]}>Total Order Item</Text>
          <Text style={[styles.tableCell, styles.tableHeader, styles.tableCellLast, { width: '30%' }]}>Total Amount</Text>
        </View>

        {/* Table Rows */}
        {dataOrder.map((order, index) => (
          <View style={styles.tableRow} key={order._id}>
            <Text style={[styles.tableCell, { width: '10%' }]}>{index + 1}</Text>
            <Text style={[styles.tableCell, { width: '30%' }]}>{new Date(order.createdAt).toLocaleDateString()}</Text>
            <Text style={[styles.tableCell, { width: '30%' }]}>{order.items_count}</Text>
            <Text style={[styles.tableCell, styles.tableCellLast, { width: '30%' }]}>Rp. {order.invoice.totals.toLocaleString()}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default OrderReport;
