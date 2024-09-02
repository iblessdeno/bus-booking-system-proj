'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, BookOpen, CreditCard, PieChart, Menu, X, Bell, Search } from "lucide-react";
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Route {
  id: string;
  name: string;
  distance: string;
  duration: string;
  price: string;
}

export default function AddRoutePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newRoute, setNewRoute] = useState({
    name: '',
    distance: '',
    duration: '',
    price: ''
  });
  const [routes, setRoutes] = useState<Route[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    const routesCollection = collection(db, 'routes');
    const routeSnapshot = await getDocs(routesCollection);
    const routeList = routeSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Route));
    setRoutes(routeList);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewRoute({ ...newRoute, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'routes'), newRoute);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000); // Hide success message after 3 seconds
      setNewRoute({ name: '', distance: '', duration: '', price: '' });
      fetchRoutes(); // Refresh the routes list
    } catch (error) {
      console.error('Error adding route: ', error);
      alert('Failed to add route');
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
              <h1 className="text-3xl font-semibold text-gray-800">Routes</h1>
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
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Route Name
                        </Label>
                        <Input id="name" name="name" className="col-span-3" value={newRoute.name} onChange={handleInputChange} />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="distance" className="text-right">
                          Distance
                        </Label>
                        <Input id="distance" name="distance" className="col-span-3" value={newRoute.distance} onChange={handleInputChange} />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="duration" className="text-right">
                          Duration
                        </Label>
                        <Input id="duration" name="duration" className="col-span-3" value={newRoute.duration} onChange={handleInputChange} />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right">
                          Price ($)
                        </Label>
                        <Input id="price" name="price" type="number" className="col-span-3" value={newRoute.price} onChange={handleInputChange} />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit">Save Route</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {showSuccess && (
              <Alert className="mb-4 bg-green-100 border-green-400 text-green-700">
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>
                  Route added successfully!
                </AlertDescription>
              </Alert>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Current Routes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Route Name</TableHead>
                        <TableHead>Distance</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {routes.map((route) => (
                        <TableRow key={route.id}>
                          <TableCell>{route.name}</TableCell>
                          <TableCell>{route.distance}</TableCell>
                          <TableCell>{route.duration}</TableCell>
                          <TableCell>${parseFloat(route.price).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}