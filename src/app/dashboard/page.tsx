"use client";

import { Diamond, CreditCard, Package2, RefreshCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "../../../components/stats-card";

import { CircularProgress } from "../../../components/circular-progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const salesData = [
  { month: "Jan", revenue: 65000, expense: 45000 },
  { month: "Feb", revenue: 75000, expense: 50000 },
  { month: "Mar", revenue: 85000, expense: 55000 },
  { month: "Apr", revenue: 95000, expense: 60000 },
  { month: "May", revenue: 105000, expense: 65000 },
  { month: "Jun", revenue: 115000, expense: 70000 },
  { month: "Jul", revenue: 125000, expense: 75000 },
  { month: "Aug", revenue: 135000, expense: 80000 },
  { month: "Sep", revenue: 145000, expense: 85000 },
  { month: "Oct", revenue: 155000, expense: 90000 },
  { month: "Nov", revenue: 165000, expense: 95000 },
  { month: "Dec", revenue: 175000, expense: 100000 },
];

const orderStats = [
  { title: "Orders Completed", value: "2345", icon: Package2 },
  { title: "Orders Cancelled", value: "17", icon: RefreshCcw },
  { title: "Orders Completed", value: "2345", icon: Package2 },
  { title: "Orders Cancelled", value: "17", icon: RefreshCcw },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Data Refreshed</span>
          <RefreshCcw className="h-4 w-4 text-[#00BFA6]" />
          <span className="text-sm">
            {new Date().toLocaleString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })}
          </span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          icon={<Diamond className="h-6 w-6 text-[#00BFA6]" />}
          title="Total Revenue"
          value="$123k"
          change={{ value: "+45.00%", trend: "up" }}
        />
        <StatsCard
          icon={<CreditCard className="h-6 w-6 text-[#00BFA6]" />}
          title="Average Order Value"
          value="$52.89k"
          change={{ value: "-12.45%", trend: "down" }}
        />
        <div className="lg:col-span-1 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Total Balance</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="w-48 h-48 bg-gray-100 rounded-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold">$476.3k</div>
                  <div className="text-sm text-gray-500">Total Balance</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {orderStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <stat.icon className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Sales Statistic 2022</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#00BFA6" />
                  <Bar dataKey="expense" fill="#FF725E" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Delivery Percentage</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <CircularProgress value={77} label="Delivery Rate" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
