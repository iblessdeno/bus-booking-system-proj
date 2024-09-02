'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, DollarSign, Users, PlusCircle, BookOpen, CreditCard, PieChart as PieChartIcon, Menu, X, Bell, Search } from "lucide-react";
import { Pie, PieChart, Cell, CartesianGrid, LabelList, Line, LineChart, Label } from "recharts";
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
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const revenueData = [
  { month: "Jan", revenue: 10000 },
  { month: "Feb", revenue: 15000 },
  { month: "Mar", revenue: 12000 },
  { month: "Apr", revenue: 18000 },
  { month: "May", revenue: 22000 },
  { month: "Jun", revenue: 20000 },
];

const customerData = [
  { category: "New", count: 120, fill: "hsl(var(--chart-1))" },
  { category: "Returning", count: 80, fill: "hsl(var(--chart-2))" },
  { category: "Inactive", count: 50, fill: "hsl(var(--chart-3))" },
];

const revenueConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-2))",
  },
} as ChartConfig;

const customerConfig = {
  count: {
    label: "Customers",
  },
  New: {
    label: "New",
    color: "hsl(var(--chart-1))",
  },
  Returning: {
    label: "Returning",
    color: "hsl(var(--chart-2))",
  },
  Inactive: {
    label: "Inactive",
    color: "hsl(var(--chart-3))",
  },
} as ChartConfig;

export default function AnalyticsDashboard() {
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

  const totalRevenue = React.useMemo(() => {
    return revenueData.reduce((acc, curr) => acc + curr.revenue, 0);
  }, []);

  const totalCustomers = React.useMemo(() => {
    return customerData.reduce((acc, curr) => acc + curr.count, 0);
  }, []);

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>January - June 2024</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={revenueConfig}>
                  <LineChart
                    data={revenueData}
                    margin={{
                      top: 24,
                      right: 24,
                      left: 24,
                      bottom: 24,
                    }}
                  >
                    <CartesianGrid vertical={false} />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          indicator="line"
                          nameKey="revenue"
                          hideLabel
                        />
                      }
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="hsl(var(--chart-2))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--chart-2))" }}
                    >
                      <LabelList
                        dataKey="revenue"
                        position="top"
                        formatter={(value: number) => `$${value.toLocaleString()}`}
                      />
                    </Line>
                  </LineChart>
                </ChartContainer>
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-medium">Total Revenue:</span>
                  <span>${totalRevenue.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 text-green-500">
                  <TrendingUp className="h-4 w-4" />
                  <span>Up 15% from last month</span>
                </div>
              </CardFooter>
            </Card>

            {/* Customer Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Breakdown</CardTitle>
                <CardDescription>Current Month</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={customerConfig}
                  className="mx-auto aspect-square max-h-[250px]"
                >
                  <PieChart>
                    <ChartTooltip
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={customerData}
                      dataKey="count"
                      nameKey="category"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                    >
                      {customerData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                      <Label
                        content={(props) => {
                          const { viewBox } = props;
                          if (!viewBox) return null;

                          const { cx, cy } = viewBox;

                          return (
                            <text
                              x={cx}
                              y={cy}
                              fill="var(--chart-text)"
                              textAnchor="middle"
                              dominantBaseline="central"
                            >
                              <tspan x={cx} dy="-0.5em" fontSize="2em" fontWeight="bold">
                                {totalCustomers}
                              </tspan>
                              <tspan x={cx} dy="1.5em" fontSize="1em">
                                Total Customers
                              </tspan>
                            </text>
                          );
                        }}
                      />
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="font-medium">Total Customers:</span>
                  <span>{totalCustomers.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 text-green-500">
                  <TrendingUp className="h-4 w-4" />
                  <span>Up 8% from last month</span>
                </div>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}