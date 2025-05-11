import { Order, SalesDataItem, SalesRecord } from "./types";

export function formatDate(createdAt: string): string {
  const date = new Date(createdAt);

  // Get individual components of the date
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so add 1
  const day = String(date.getDate()).padStart(2, "0"); // Ensure two digits for day

  // Combine them into the 'YYYY-MM-DD' format
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}

export function formatTime(createdAt: string): string {
  const date = new Date(createdAt);

  // Get individual components of the time
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  // Combine them into the 'HH:MM:SS' format
  const formattedTime = `${hours}:${minutes}:${seconds}`;
  return formattedTime;
}

export function formatPhoneNumber(phone: string | number): string {
  const cleaned = phone.toString().replace(/\D/g, ""); // Remove non-digit characters

  if (cleaned.length !== 10) {
    return phone.toString(); // Return original if not 10 digits
  }

  const areaCode = cleaned.slice(0, 3);
  const centralOfficeCode = cleaned.slice(3, 6);
  const lineNumber = cleaned.slice(6);

  return `(${areaCode}) ${centralOfficeCode}-${lineNumber}`;
}

export function isValidHttpUrl(url: string) {
  let validURL;

  try {
    validURL = new URL(url);
  } catch (_) {
    return false;
  }

  return validURL.protocol === "http:" || validURL.protocol === "https:";
}

export function trimWithEllipsis(str: string, maxLength: number) {
  return str.length > maxLength ? str.slice(0, maxLength - 3) + "..." : str;
}

export function isValidEmail(email: string): RegExpMatchArray | null {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}

export function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

export function deleteAllCookies() {
  const cookies = document.cookie.split(";");

  for (let cookie of cookies) {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  }
}

const monthLabels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function generateSalesData(orders: Order[]): SalesDataItem[] {
  const monthlyTotals = Array(12).fill(0);

  for (const order of orders) {
    const date = new Date(order.createdAt);
    const monthIndex = date.getMonth(); // 0 (Jan) to 11 (Dec)
    monthlyTotals[monthIndex] += order.totalAmount;
  }

  return monthlyTotals.map((total, index) => ({
    month: monthLabels[index],
    revenue: Math.round(total),
    expense: Math.round(0), // Adjust as needed...
  }));
}

export function calculateRevenueIncrements(data: SalesRecord[]) {
  return data.map((entry, index) => {
    if (index === 0) {
      return { month: entry.month, incrementPercent: 0 };
    }

    const prevRevenue = data[index - 1].revenue;
    const increment = ((entry.revenue - prevRevenue) / prevRevenue) * 100;

    return {
      month: entry.month,
      incrementPercent: parseFloat(increment.toFixed(2)),
    };
  });
}
