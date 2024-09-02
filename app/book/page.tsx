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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, PlusCircle, BookOpen, CreditCard, PieChart, Menu, Bell, Search, X } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { collection, addDoc, getDocs, query, where, updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface Route {
  id: string;
  name: string;
  price: number;
}

interface Booking {
  id: string;
  customerName: string;
  route: string;
  date: string;
  status: string;
  price: number;
}

export default function BookPage() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [newBooking, setNewBooking] = useState({
    customerName: '',
    route: '',
    date: '',
    price: 0
  });
  const [confirmBookingId, setConfirmBookingId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchRoutes();
    fetchBookings();
  }, []);

  const fetchRoutes = async () => {
    const routesCollection = collection(db, 'routes');
    const routeSnapshot = await getDocs(routesCollection);
    const routeList = routeSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Route));
    setRoutes(routeList);
  };

  const fetchBookings = async () => {
    const bookingsCollection = collection(db, 'bookings');
    const bookingSnapshot = await getDocs(bookingsCollection);
    const bookingList = bookingSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
    setBookings(bookingList);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewBooking({ ...newBooking, [e.target.name]: e.target.value });
  };

  const handleRouteChange = (value: string) => {
    const selectedRoute = routes.find(route => route.id === value);
    setNewBooking({ 
      ...newBooking, 
      route: selectedRoute ? selectedRoute.name : '', // Store the route name
      price: selectedRoute ? selectedRoute.price : 0
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const bookingId = Math.floor(10000 + Math.random() * 90000).toString();
      const bookingData = {
        ...newBooking,
        id: bookingId,
        status: 'Pending',
        date: date ? format(date, 'yyyy-MM-dd') : ''
      };
      await addDoc(collection(db, 'bookings'), bookingData);
      setNewBooking({ customerName: '', route: '', date: '', price: 0 });
      setDate(undefined);
      fetchBookings();
    } catch (error) {
      console.error('Error adding booking: ', error);
      alert('Failed to add booking');
    }
  };

  const handleConfirmBooking = async () => {
    try {
      const bookingsCollection = collection(db, 'bookings');
      const q = query(bookingsCollection, where("id", "==", confirmBookingId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const bookingDoc = querySnapshot.docs[0];
        const bookingData = bookingDoc.data();
        await updateDoc(doc(db, 'bookings', bookingDoc.id), {
          status: 'Confirmed'
        });

        // Add to payment history
        await addDoc(collection(db, 'payments'), {
          bookingId: bookingData.id,
          customerName: bookingData.customerName,
          route: bookingData.route, // This should already be the route name
          date: new Date().toISOString().split('T')[0], // Current date
          amount: bookingData.price
        });

        fetchBookings();
        setConfirmBookingId('');
      } else {
        alert('Booking not found');
      }
    } catch (error) {
      console.error('Error confirming booking: ', error);
      alert('Failed to confirm booking');
    }
  };

  useEffect(() => {
    const filtered = bookings.filter(booking => 
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBookings(filtered);
  }, [searchTerm, bookings]);

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
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Book</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Input
            type="search"
            placeholder="Search bookings..."
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
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-semibold text-gray-800">Bookings</h1>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Booking
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>New Booking</DialogTitle>
                    <DialogDescription>
                      Enter the details for the new booking. Click save when you're done.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="customerName" className="text-right">
                          Name
                        </Label>
                        <Input id="customerName" name="customerName" className="col-span-3" value={newBooking.customerName} onChange={handleInputChange} />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="route" className="text-right">
                          Route
                        </Label>
                        <Select onValueChange={handleRouteChange}>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select a route" />
                          </SelectTrigger>
                          <SelectContent>
                            {routes.map((route) => (
                              <SelectItem key={route.id} value={route.id}>{route.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="date" className="text-right">
                          Date
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "col-span-3 justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={setDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right">
                          Price ($)
                        </Label>
                        <Input id="price" name="price" type="number" className="col-span-3" value={newBooking.price} readOnly />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit">Save Booking</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Booking ID</TableHead>
                        <TableHead>Customer Name</TableHead>
                        <TableHead>Route</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">{booking.id}</TableCell>
                          <TableCell>{booking.customerName}</TableCell>
                          <TableCell>{booking.route}</TableCell>
                          <TableCell>{booking.date}</TableCell>
                          <TableCell>${parseFloat(booking.price.toString()).toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge variant={
                              booking.status === 'Confirmed' ? 'default' :
                              booking.status === 'Pending' ? 'secondary' : 'destructive'
                            }>
                              {booking.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6">
              <h2 className="text-2xl font-semibold mb-4">Confirm Booking</h2>
              <div className="flex items-center space-x-4">
                <Input
                  type="text"
                  placeholder="Enter Booking ID"
                  value={confirmBookingId}
                  onChange={(e) => setConfirmBookingId(e.target.value)}
                  className="max-w-xs"
                />
                <Button onClick={handleConfirmBooking}>Confirm Booking</Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
