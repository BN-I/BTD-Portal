import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const user = request.cookies.get("user");
  const path = request.nextUrl.pathname;
  console.log("Middleware is running...");

  //check if loggedin

  if (!user) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  // Check if path starts with /admin
  if (path.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }

    try {
      const userData = JSON.parse(user.value);
      if (userData.role !== "Admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
  }

  // Check vendor access for dashboard routes
  if (
    path.startsWith("/dashboard") &&
    !path.startsWith("/dashboard/account") &&
    !path.startsWith("/dashboard/payment-success")
  ) {
    console.log("in dashboard middleware");
    if (!user) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }

    try {
      const userData = JSON.parse(user.value);
      const storeData = request.cookies.get("storeData");
      const businessInformation = request.cookies.get("businessInformation");
      const paymentInformation = request.cookies.get("paymentInformation");
      const subscription = request.cookies.get("subscription");

      if (
        userData.role === "Vendor" &&
        (!storeData ||
          !businessInformation ||
          !paymentInformation ||
          !subscription)
      ) {
        return NextResponse.redirect(
          new URL("/dashboard/account", request.url)
        );
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
