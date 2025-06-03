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
          `${process.env.NEXT_PUBLIC_API_URL}/orders/vendor/${userObj?._id}?perPage=999999`
        )
        .then((response) => {
          const allOrder = response.data;

          const totalRevenue = allOrder.reduce((acc: number, order: any) => {
            return acc + order.totalAmount;
          }, 0);

          const averageOrderValue = allOrder.length
            ? totalRevenue / allOrder.length
            : 0;

          const totalBalance = allOrder.reduce((acc: number, order: any) => {
            if (!order.amountDispatched) {
              return acc + order.totalAmount;
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
            revenueIncrements[revenueIncrements.length - 1].incrementPercent
          );
          setAverageOrderValueIncresement(
            revenueIncrements[revenueIncrements.length - 1].incrementPercent
          );
        });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Data Refreshed</span>
          <RefreshCcw
            onClick={() => window.location.reload()}
            className="h-4 w-4 text-[#00BFA6] cursor-pointer"
            aria-hidden="true"
          />
          <span className="text-sm">
            {new Date().toLocaleString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
              hour12: true,
            })}
          </span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {/* A card (not a stats card) for total revenue but without change. */}

        <div className="flex items- p-4 bg-white rounded-lg shadow-sm">
          <div className="mr-4">
            <Diamond className="h-6 w-6 text-[#00BFA6]" />{" "}
          </div>
          <div>
            <h3 className="text-sm text-gray-500">Total Revenue</h3>
            <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
          </div>
        </div>
        <div className="flex items- p-4 bg-white rounded-lg shadow-sm">
          <div className="mr-4">
            <CreditCard className="h-6 w-6 text-[#00BFA6]" />{" "}
          </div>
          <div>
            <h3 className="text-sm text-gray-500">Average Order Value</h3>
            <p className="text-2xl font-bold">
              ${averageOrderValue.toFixed(2)}
            </p>
          </div>
        </div>

        {/* <StatsCard
          icon={<Diamond className="h-6 w-6 text-[#00BFA6]" />}
          title="Total Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          change={{ value: `+45.00%`, trend: "up" }}
        />
        <StatsCard
          icon={<CreditCard className="h-6 w-6 text-[#00BFA6]" />}
          title="Average Order Value"
          value={`$${averageOrderValue.toFixed(2)}`}
          change={{ value: "-12.45%", trend: "down" }}
        /> */}
        <div className="lg:col-span-2 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Total Balance</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="w-48 h-48 bg-gray-100 rounded-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold">
                    {"$"}
                    {totalBalance.toFixed(2)}
                  </div>
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
            <CardTitle>Sales Statistic {new Date().getFullYear()}</CardTitle>
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
            <CircularProgress
              value={deliveryPercentage.toFixed(2)}
              label="Delivery Rate"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
