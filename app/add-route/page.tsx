'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
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
import { PlusCircle, BookOpen, CreditCard, PieChart, Menu, X, Bell, Search } from "lucide-react"

// Mock data for current routes
const currentRoutes = [
  { id: "R001", name: "New York - Boston", distance: "215 miles", duration: "4h 15m", price: 120.00 },
  { id: "R002", name: "Los Angeles - San Francisco", distance: "383 miles", duration: "6h 30m", price: 85.00 },
  { id: "R003", name: "Chicago - Detroit", distance: "283 miles", duration: "4h 45m", price: 95.00 },
  { id: "R004", name: "Miami - Orlando", distance: "236 miles", duration: "3h 45m", price: 75.00 },
  { id: "R005", name: "Seattle - Portland", distance: "173 miles", duration: "3h 15m", price: 110.00 },
]

export default function AddRoutePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setSidebarOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [newRoute, setNewRoute] = useState({ name: '', distance: '', duration: '', price: 0 });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewRoute({ ...newRoute, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'routes'), newRoute);
      // Handle successful addition (e.g., clear form, show success message)
    } catch (error) {
      console.error('Failed to add route:', error);
    }
  };

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
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Add Route</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Input
            type="search"
            placeholder="Search..."
            className="hidden md:block"
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
          <div className="mb-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New Route
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Route</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new route. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="routeName" className="text-right">
                      Route Name
                    </Label>
                    <Input id="routeName" className="col-span-3" placeholder="e.g. New York - Boston" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="distance" className="text-right">
                      Distance
                    </Label>
                    <Input id="distance" className="col-span-3" placeholder="e.g. 215 miles" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="duration" className="text-right">
                      Duration
                    </Label>
                    <Input id="duration" className="col-span-3" placeholder="e.g. 4h 15m" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="price" className="text-right">
                      Price ($)
                    </Label>
                    <Input id="price" type="number" className="col-span-3" placeholder="0.00" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="submit">Save Route</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Current Routes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Route ID</TableHead>
                      <TableHead>Route Name</TableHead>
                      <TableHead className="hidden md:table-cell">Distance</TableHead>
                      <TableHead className="hidden md:table-cell">Duration</TableHead>
                      <TableHead>Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentRoutes.map((route) => (
                      <TableRow key={route.id}>
                        <TableCell className="font-medium">{route.id}</TableCell>
                        <TableCell>{route.name}</TableCell>
                        <TableCell className="hidden md:table-cell">{route.distance}</TableCell>
                        <TableCell className="hidden md:table-cell">{route.duration}</TableCell>
                        <TableCell>${route.price.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </main>

        <form onSubmit={handleSubmit}>
          <input name="name" value={newRoute.name} onChange={handleInputChange} />
          <input name="distance" value={newRoute.distance} onChange={handleInputChange} />
          <input name="duration" value={newRoute.duration} onChange={handleInputChange} />
          <input name="price" value={newRoute.price} onChange={handleInputChange} type="number" />
          <button type="submit">Add Route</button>
        </form>
      </div>
    </div>
  )
}
