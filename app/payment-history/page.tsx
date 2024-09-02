'use client';

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { PlusCircle, BookOpen, CreditCard, PieChart, Download, Search, Menu, X, Bell } from "lucide-react"
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface Payment {
  bookingId: string;
  customerName: string;
  route: string;
  date: string;
  amount: number;
}

export default function PaymentHistoryPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const sidebarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchPayments();
  }, [])

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const paymentsCollection = collection(db, 'payments');
      const q = query(paymentsCollection, orderBy('date', 'desc'), limit(20));
      const paymentSnapshot = await getDocs(q);
      
      const paymentList = paymentSnapshot.docs.map(doc => {
        const data = doc.data() as Payment;
        return {
          ...data,
          amount: parseFloat(data.amount.toString())
        };
      });
      
      setPayments(paymentList);
      setFilteredPayments(paymentList);
    } catch (error) {
      console.error("Error fetching payments:", error);
      setError("Failed to fetch payment data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = payments.filter(payment => 
      payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.bookingId.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPayments(filtered);
  }, [searchTerm, payments]);

  const exportToCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Booking ID,Customer Name,Route,Date,Amount\n"
      + filteredPayments.map(p => `${p.bookingId},${p.customerName},${p.route},${p.date},${p.amount}`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "payment_history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white shadow dark:bg-gray-800 p-4 flex justify-between items-center">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="icon"
            className="mr-4 md:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Payment History</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Input
            type="search"
            placeholder="Search..."
            className="hidden md:block"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="outline" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside 
          ref={sidebarRef}
          className={`bg-blue-600 text-white w-64 p-4 flex-shrink-0 transition-all duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 md:static fixed inset-y-0 left-0 z-50`}
        >
          <div className="flex justify-between items-center mb-6">
            <Link href="/">
              <h2 className="text-2xl font-semibold cursor-pointer hover:text-blue-200">Dashboard</h2>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="md:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <nav>
            <ul className="space-y-2">
              <li>
                <Link href="/add-route">
                  <Button variant="ghost" className="w-full justify-start text-white hover:text-blue-200 hover:bg-blue-700">
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Add Route
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/book">
                  <Button variant="ghost" className="w-full justify-start text-white hover:text-blue-200 hover:bg-blue-700">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Book
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/payment-history">
                  <Button variant="ghost" className="w-full justify-start text-white hover:text-blue-200 hover:bg-blue-700">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Payment History
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/analytics">
                  <Button variant="ghost" className="w-full justify-start text-white hover:text-blue-200 hover:bg-blue-700">
                    <PieChart className="mr-2 h-5 w-5" />
                    Analytics
                  </Button>
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4">
          <div className="mb-4 flex justify-between items-center">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search payments..."
                className="pl-10 pr-4 py-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <Button onClick={exportToCSV}>
              <Download className="mr-2 h-4 w-4" />
              Export to CSV
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Payments</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Loading...</div>
              ) : error ? (
                <div className="text-center py-4 text-red-500">{error}</div>
              ) : filteredPayments.length === 0 ? (
                <div className="text-center py-4">No payments found</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Booking ID</TableHead>
                        <TableHead>Customer Name</TableHead>
                        <TableHead className="hidden md:table-cell">Route</TableHead>
                        <TableHead className="hidden md:table-cell">Date</TableHead>
                        <TableHead>Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPayments.map((payment) => (
                        <TableRow key={payment.bookingId}>
                          <TableCell>{payment.bookingId}</TableCell>
                          <TableCell>{payment.customerName}</TableCell>
                          <TableCell className="hidden md:table-cell">{payment.route}</TableCell>
                          <TableCell className="hidden md:table-cell">{payment.date}</TableCell>
                          <TableCell>${payment.amount.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
