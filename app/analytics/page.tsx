'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, DollarSign, Users, PlusCircle, BookOpen, CreditCard, PieChart as PieChartIcon, Menu, X, Bell, Search } from "lucide-react";
import { Pie, PieChart, Cell, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const chartConfig = {
  visitors: {
    label: "Bookings",
  },
  hundred: {
    label: "$100 Bookings",
    color: "hsl(var(--chart-1))",
  },
  ten: {
    label: "$10 Bookings",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function AnalyticsDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [customerData, setCustomerData] = useState<{ category: string; count: number; fill: string }[]>([]);
  const [bookingData, setBookingData] = useState<{ date: string; hundred: number; ten: number }[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState("90d");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([fetchCustomerData(), fetchBookingData()]);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("An error occurred while fetching data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerData = async () => {
    const bookingsCollection = collection(db, 'bookings');
    const bookingsSnapshot = await getDocs(bookingsCollection);
    const customers = bookingsSnapshot.docs.map(doc => doc.data().customerName);
    const uniqueCustomers = [...new Set(customers)];
    
    const newCustomers = uniqueCustomers.length;
    const returningCustomers = customers.length - newCustomers;
    
    const data = [
      { category: "New", count: newCustomers, fill: "#8884d8" },
      { category: "Returning", count: returningCustomers, fill: "#82ca9d" },
    ];
    
    setCustomerData(data);
    setTotalCustomers(uniqueCustomers.length);
  };

  const fetchBookingData = async () => {
    const bookingsCollection = collection(db, 'bookings');
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const q = query(
      bookingsCollection,
      where('date', '>=', sixMonthsAgo.toISOString()),
      orderBy('date', 'asc')
    );
    
    const bookingsSnapshot = await getDocs(q);
    const bookings = bookingsSnapshot.docs.map(doc => ({
      date: new Date(doc.data().date),
      price: parseFloat(doc.data().price)
    }));
    
    const dailyBookings: { [key: string]: { hundred: number; ten: number } } = {};
    let total = 0;
    
    bookings.forEach(booking => {
      const dateStr = booking.date.toISOString().split('T')[0];
      if (!dailyBookings[dateStr]) {
        dailyBookings[dateStr] = { hundred: 0, ten: 0 };
      }
      if (booking.price === 100) {
        dailyBookings[dateStr].hundred++;
      } else if (booking.price === 10) {
        dailyBookings[dateStr].ten++;
      }
      total += booking.price;
    });
    
    const data = Object.entries(dailyBookings).map(([date, counts]) => ({
      date,
      hundred: counts.hundred,
      ten: counts.ten
    }));
    
    setBookingData(data);
    setTotalRevenue(total);
  };

  const filteredData = bookingData.filter((item) => {
    const date = new Date(item.date);
    const now = new Date();
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    now.setDate(now.getDate() - daysToSubtract);
    return date >= now;
  });

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
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Analytics Dashboard</h1>
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
                    <PieChartIcon className="mr-2 h-5 w-5" />
                    Analytics
                  </Button>
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4">
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Booking Chart */}
              <Card>
                <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                  <div className="grid flex-1 gap-1 text-center sm:text-left">
                    <CardTitle>Booking Comparison</CardTitle>
                    <CardDescription>
                      Comparing $100 and $10 bookings
                    </CardDescription>
                  </div>
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger
                      className="w-[160px] rounded-lg sm:ml-auto"
                      aria-label="Select a value"
                    >
                      <SelectValue placeholder="Last 3 months" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="90d" className="rounded-lg">
                        Last 3 months
                      </SelectItem>
                      <SelectItem value="30d" className="rounded-lg">
                        Last 30 days
                      </SelectItem>
                      <SelectItem value="7d" className="rounded-lg">
                        Last 7 days
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </CardHeader>
                <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                  <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                  >
                    <AreaChart data={filteredData}>
                      <defs>
                        <linearGradient id="fillHundred" x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="5%"
                            stopColor="var(--color-hundred)"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="var(--color-hundred)"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                        <linearGradient id="fillTen" x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="5%"
                            stopColor="var(--color-ten)"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="var(--color-ten)"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        minTickGap={32}
                        tickFormatter={(value) => {
                          const date = new Date(value);
                          return date.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          });
                        }}
                      />
                      <YAxis />
                      <ChartTooltip
                        cursor={false}
                        content={
                          <ChartTooltipContent
                            labelFormatter={(value) => {
                              return new Date(value).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              });
                            }}
                            indicator="dot"
                          />
                        }
                      />
                      <Area
                        dataKey="ten"
                        type="monotone"
                        fill="url(#fillTen)"
                        stroke="var(--color-ten)"
                        stackId="1"
                      />
                      <Area
                        dataKey="hundred"
                        type="monotone"
                        fill="url(#fillHundred)"
                        stroke="var(--color-hundred)"
                        stackId="1"
                      />
                      <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Customer Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Customer Breakdown</CardTitle>
                  <CardDescription>New vs Returning Customers</CardDescription>
                </CardHeader>
                <CardContent>
                  {customerData.length > 0 ? (
                    <div style={{ width: '100%', height: 300 }}>
                      <ResponsiveContainer>
                        <PieChart>
                          <Pie
                            data={customerData}
                            dataKey="count"
                            nameKey="category"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            label
                          >
                            {customerData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="text-center py-4">No customer data available</div>
                  )}
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span className="font-medium">Total Customers:</span>
                    <span>{totalCustomers.toLocaleString()}</span>
                  </div>
                </CardFooter>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
