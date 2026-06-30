"use client";

import { Diamond, CreditCard, Package2, RefreshCcw, Car } from "lucide-react";
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
import axios from "axios";
import { User } from "@/lib/auth-types";
import { useEffect, useState } from "react";
import { SalesDataItem, SalesRecord } from "../types";
import { calculateRevenueIncrements, generateSalesData } from "../common";

type Order = {
  totalAmount: number;
  createdAt: string;
};

export default function DashboardPage() {
  const [statsLoading, setStatsLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [averageOrderValue, setAverageOrderValue] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [ordersCompleted, setOrdersCompleted] = useState(0);
  const [orderCancelled, setOrderCancelled] = useState(0);
  const [orderProcessing, setOrderProcessing] = useState(0);
  const [orderShipped, setOrderShipped] = useState(0);
  const [deliveryPercentage, setDeliveryPercentage] = useState(0);
  const [salesData, setSalesData] = useState<SalesDataItem[]>([]);
  const [totalRevenueIncresement, setTotalRevenueIncresement] = useState(0);
  const [averageOrderValueIncresement, setAverageOrderValueIncresement] =
    useState(0);

  const orderStats = [
    { title: "Orders Completed", value: ordersCompleted, icon: Package2 },
    { title: "Orders Cancelled", value: orderCancelled, icon: RefreshCcw },
    { title: "Orders Processing", value: orderProcessing, icon: Package2 },
    { title: "Orders Shipped", value: orderShipped, icon: RefreshCcw },
  ];

  useEffect(() => {
    getAllStats();
  }, []);

  const getAllStats = async () => {
    try {
      var user = localStorage.getItem("user") as string | null;
      var userObj = null;
      if (user) {
        userObj = JSON.parse(user) as User;
      }

      await axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/vendor/${userObj?._id}?perPage=999999`,
        )
        .then((response) => {
          const allOrder = response.data;

          const totalRevenue = allOrder.reduce((acc: number, order: any) => {
            return (
              acc +
              order.subtotal * 0.92 +
              order.shippingAmount +
              order.taxAmount
            );
          }, 0);

          const averageOrderValue = allOrder.length
            ? totalRevenue / allOrder.length
            : 0;

          const totalBalance = allOrder.reduce((acc: number, order: any) => {
            if (!order.amountDispatched) {
              return (
                acc +
                order.subtotal * 0.92 +
                order.shippingAmount +
                order.taxAmount
              );
            } else {
              return acc;
            }
          }, 0);

          const ordersCompleted = allOrder.filter((order: any) => {
            return order.status === "delivered";
          }).length;

          const orderCancelled = allOrder.filter((order: any) => {
            return order.status === "cancelled";
          }).length;

          const orderProcessing = allOrder.filter((order: any) => {
            return order.status === "processing";
          }).length;

          const orderShipped = allOrder.filter((order: any) => {
            return order.status === "shipped";
          }).length;

          const deliveryPercentage = allOrder.length
            ? (ordersCompleted / allOrder.length) * 100
            : 0;

          const salesData = generateSalesData(allOrder);

          const revenueIncrements = calculateRevenueIncrements(salesData);

          setTotalRevenue(totalRevenue);
          setAverageOrderValue(averageOrderValue);
          setTotalBalance(totalBalance);
          setStatsLoading(false);
          setOrdersCompleted(ordersCompleted);
          setOrderCancelled(orderCancelled);
          setOrderProcessing(orderProcessing);
          setOrderShipped(orderShipped);
          setDeliveryPercentage(deliveryPercentage);
          setSalesData(salesData);
          setTotalRevenueIncresement(
            revenueIncrements[revenueIncrements.length - 1].incrementPercent,
          );
          setAverageOrderValueIncresement(
            revenueIncrements[revenueIncrements.length - 1].incrementPercent,
          );
        });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-800">Dashboard</h2>
          <p className="text-sm text-stone-400 mt-0.5">
            Welcome back — here's what's happening
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-3 py-2 rounded-xl border border-stone-200 bg-white/80 text-xs sm:text-sm text-stone-500 hover:text-teal-600 hover:border-teal-200 hover:bg-teal-50/50 transition-all duration-150 shadow-sm self-start sm:self-auto shrink-0"
        >
          <RefreshCcw className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">
            {new Date().toLocaleString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })}
          </span>
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {/* Total Revenue */}
        <div className="rounded-2xl bg-white/90 backdrop-blur-sm border border-stone-200/60 shadow-[0_1px_6px_rgba(0,0,0,0.06)] p-5 hover:shadow-[0_4px_14px_rgba(0,0,0,0.08)] transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">Total Revenue</p>
            <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center">
              <Diamond className="h-4 w-4 text-teal-600" />
            </div>
          </div>
          {statsLoading
            ? <div className="h-9 w-32 rounded-lg bg-stone-100 animate-pulse" />
            : <p className="text-3xl font-bold text-stone-800">${totalRevenue.toFixed(2)}</p>}
        </div>

        {/* Average Order Value */}
        <div className="rounded-2xl bg-white/90 backdrop-blur-sm border border-stone-200/60 shadow-[0_1px_6px_rgba(0,0,0,0.06)] p-5 hover:shadow-[0_4px_14px_rgba(0,0,0,0.08)] transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">Avg Order Value</p>
            <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center">
              <CreditCard className="h-4 w-4 text-teal-600" />
            </div>
          </div>
          {statsLoading
            ? <div className="h-9 w-28 rounded-lg bg-stone-100 animate-pulse" />
            : <p className="text-3xl font-bold text-stone-800">${averageOrderValue.toFixed(2)}</p>}
        </div>

        {/* Total Balance */}
        <div className="rounded-2xl bg-white/90 backdrop-blur-sm border border-stone-200/60 shadow-[0_1px_6px_rgba(0,0,0,0.06)] p-5 hover:shadow-[0_4px_14px_rgba(0,0,0,0.08)] transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">Total Balance</p>
            <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center">
              <Car className="h-4 w-4 text-teal-600" />
            </div>
          </div>
          {statsLoading
            ? <div className="h-9 w-28 rounded-lg bg-stone-100 animate-pulse" />
            : <p className="text-3xl font-bold text-stone-800">${totalBalance.toFixed(2)}</p>}
          <p className="text-xs text-stone-400 mt-1">Pending payout</p>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {orderStats.map((stat, index) => (
          <div
            key={index}
            className="rounded-2xl bg-white/90 backdrop-blur-sm border border-stone-200/60 shadow-[0_1px_6px_rgba(0,0,0,0.06)] p-5 hover:shadow-[0_4px_14px_rgba(0,0,0,0.08)] transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                {stat.title}
              </p>
              <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center">
                <stat.icon className="h-4 w-4 text-teal-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-stone-800">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 rounded-2xl bg-white/90 backdrop-blur-sm border border-stone-200/60 shadow-[0_1px_6px_rgba(0,0,0,0.06)] p-4 sm:p-6">
          <p className="text-sm font-semibold text-stone-700 mb-5">
            Sales Statistic {new Date().getFullYear()}
          </p>
          <div className="h-[220px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData} barCategoryGap="30%">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(0,0,0,0.05)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#a8a29e" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#a8a29e" }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid rgba(0,0,0,0.06)",
                    background: "#fff",
                    color: "#292524",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                    fontSize: "12px",
                  }}
                  cursor={{ fill: "rgba(20,184,166,0.04)" }}
                />
                <Bar dataKey="revenue" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#d6d3d1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-2xl bg-white/90 backdrop-blur-sm border border-stone-200/60 shadow-[0_1px_6px_rgba(0,0,0,0.06)] p-4 sm:p-6 flex flex-col">
          <p className="text-sm font-semibold text-stone-700 mb-5">Delivery Percentage</p>
          <div className="flex-1 flex items-center justify-center">
            <CircularProgress
              value={parseFloat(deliveryPercentage.toFixed(2))}
              label=""
            />
          </div>
        </div>
      </div>
    </div>
  );
}
