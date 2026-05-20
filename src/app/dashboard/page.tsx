"use client";

import { Diamond, CreditCard, Package2, RefreshCcw, Car } from "lucide-react";
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
    {
      title: "Orders Completed",
      value: ordersCompleted,
      icon: Package2,
      shadow: "shadow-[0_4px_14px_rgba(16,185,129,0.35)]",
      cardBg: "bg-gradient-to-br from-emerald-400 to-emerald-600",
    },
    {
      title: "Orders Cancelled",
      value: orderCancelled,
      icon: RefreshCcw,
      shadow: "shadow-[0_4px_14px_rgba(244,63,94,0.35)]",
      cardBg: "bg-gradient-to-br from-rose-400 to-rose-600",
    },
    {
      title: "Orders Processing",
      value: orderProcessing,
      icon: Package2,
      shadow: "shadow-[0_4px_14px_rgba(59,130,246,0.35)]",
      cardBg: "bg-gradient-to-br from-blue-400 to-blue-600",
    },
    {
      title: "Orders Shipped",
      value: orderShipped,
      icon: RefreshCcw,
      shadow: "shadow-[0_4px_14px_rgba(139,92,246,0.35)]",
      cardBg: "bg-gradient-to-br from-violet-400 to-violet-600",
    },
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-stone-800">Dashboard</h2>
          <p className="text-sm text-stone-400 mt-0.5">
            Welcome back — here's what's happening
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-3 py-2 rounded-xl border border-stone-200 bg-white/80 text-sm text-stone-500 hover:text-teal-600 hover:border-teal-200 hover:bg-teal-50/50 transition-all duration-150 shadow-sm"
        >
          <RefreshCcw className="h-3.5 w-3.5" />
          <span>
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

      <div className="grid gap-4 md:grid-cols-3">
        {/* Total Revenue */}
        <div className="rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-500 to-teal-600 p-5 text-white shadow-[0_4px_14px_rgba(20,184,166,0.25)]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-teal-100">Total Revenue</p>
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <Diamond className="h-4 w-4 text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold">${totalRevenue.toFixed(2)}</p>
        </div>

        {/* Average Order Value */}
        <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-500 to-violet-600 p-5 text-white shadow-[0_4px_14px_rgba(139,92,246,0.25)]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-violet-100">
              Avg Order Value
            </p>
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <CreditCard className="h-4 w-4 text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold">${averageOrderValue.toFixed(2)}</p>
        </div>

        {/* Total Balance */}
        <div className="rounded-2xl border-0 bg-gradient-to-br from-amber-400 to-orange-500 p-5 text-white shadow-[0_4px_14px_rgba(251,146,60,0.35)]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-white/80">Total Balance</p>
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <Car className="h-4 w-4 text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold">${totalBalance.toFixed(2)}</p>
          <p className="text-xs text-white/60 mt-1">Pending payout</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {orderStats.map((stat, index) => (
          <Card
            key={index}
            className={`${stat.cardBg} ${stat.shadow} border-0 text-white`}
          >
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-white/80">
                  {stat.title}
                </p>
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 border-0 bg-gradient-to-br from-slate-700 to-slate-900 shadow-[0_4px_14px_rgba(15,23,42,0.35)]">
          <CardHeader>
            <CardTitle className="text-white">
              Sales Statistic {new Date().getFullYear()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData} barCategoryGap="30%">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.08)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "rgba(255,255,255,0.45)" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "rgba(255,255,255,0.45)" }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      background: "rgba(30,41,59,0.95)",
                      color: "#fff",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                      fontSize: "12px",
                    }}
                    cursor={{ fill: "rgba(255,255,255,0.05)" }}
                  />
                  <Bar dataKey="revenue" fill="#00BFA6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expense" fill="#fb7185" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 bg-gradient-to-br from-blue-700 to-indigo-900 shadow-[0_4px_14px_rgba(30,58,138,0.4)]">
          <CardHeader>
            <CardTitle className="text-white">Delivery Percentage</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <CircularProgress
              value={parseFloat(deliveryPercentage.toFixed(2))}
              label=""
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
