"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Diamond, CreditCard, Users, Store } from "lucide-react";
import axios from "axios";
import { UserStatus } from "@/lib/auth-types";
import { useEffect, useMemo, useState } from "react";
import { set } from "date-fns";
import { calculateRevenueIncrements, generateSalesData } from "../common";
import { SalesDataItem } from "../types";

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

export default function AdminDashboard() {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalVendors, setTotalVendors] = useState(0);
  const [pendingVendors, setPendingVendors] = useState(0);
  const [blockedVendors, setBlockedVendors] = useState(0);
  const [newOrders, setNewOrders] = useState(0);
  const [salesData, setSalesData] = useState<SalesDataItem[]>([]);
  const [revenueIncrements, setRevenueIncrements] = useState(0);

  const getAllStats = async () => {
    try {
      await axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/admin/dashboardDetails`)
        .then((response) => {
          const allOrder = response.data.allOrder;
          const allUsers = response.data.allUsers;
          const allVendors = response.data.allVendors;

          //
          const totalRevenue = allOrder.reduce((acc: number, order: any) => {
            return acc + order.totalAmount;
          }, 0);
          //
          const totalBalance = allOrder.reduce((acc: number, order: any) => {
            if (!order.amountDispatched) {
              return acc + order.totalAmount;
            } else {
              return acc;
            }
          }, 0);
          //

          const totalUsers = allUsers.length;
          //
          const totalVendors = allVendors.length;
          //
          const pendingVendors = allVendors.filter(
            (vendor: any) => vendor.status === UserStatus.pending
          );
          //
          const blockedVendors = allVendors.filter(
            (vendor: any) => vendor.status === UserStatus.blocked
          );
          //

          const salesData = generateSalesData(allOrder);
          const revenueIncrements = calculateRevenueIncrements(salesData);

          const currentWeekOrders = allOrder.filter((order: any) => {
            const orderDate = new Date(order.createdAt);
            const today = new Date();
            return (
              orderDate.getFullYear() === today.getFullYear() &&
              orderDate.getMonth() === today.getMonth() &&
              orderDate.getDate() >= today.getDate() - 7
            );
          }).length;

          setTotalRevenue(totalRevenue);
          setTotalBalance(totalBalance);
          setTotalUsers(totalUsers);
          setTotalVendors(totalVendors);
          setPendingVendors(pendingVendors.length);
          setBlockedVendors(blockedVendors.length);
          setNewOrders(currentWeekOrders);
          setSalesData(salesData);
          setRevenueIncrements(
            revenueIncrements[revenueIncrements.length - 1].incrementPercent
          );
        });
    } catch (e) {
      console.log(e);
    }
  };

  const vendorStats = useMemo(() => {
    return [
      {
        title: "Total Vendors",
        value: totalVendors,
        icon: Store,
        status: "Active",
      },
      {
        title: "Pending",
        value: pendingVendors,
        icon: Store,
        status: "Pending",
      },
      {
        title: "Blocked",
        value: blockedVendors,
        icon: Store,
        status: "Blocked",
      },
      {
        title: "New Orders",
        value: newOrders.toLocaleString(),
        icon: Store,
        status: "This Week",
      },
    ];
  }, [totalVendors, pendingVendors, blockedVendors, newOrders]);

  useEffect(() => {
    getAllStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Data Refreshed</span>
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <Diamond className="h-4 w-4 text-[#00BFA6]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalRevenue.toLocaleString()}
            </div>
            {/* <div className="text-xs text-green-500">+45.00%</div> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-[#00BFA6]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalUsers.toLocaleString()}
            </div>
            {/* <div className="text-xs text-green-500">+15.45%</div> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <CreditCard className="h-4 w-4 text-[#00BFA6]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalBalance.toLocaleString()}
            </div>
            {/* <div className="text-xs text-red-500">-12.45%</div> */}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {vendorStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <stat.icon className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.status}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Sales Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {salesData && salesData.length > 0 ? (
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
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">No sales data available.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Support Tickets</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <CircularProgress value={100} label="Resolution Rate" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
