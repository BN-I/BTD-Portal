"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Image from "next/image";

export default function SuccessPage() {
  const [status, setStatus] = useState("loading");
  const [customerEmail, setCustomerEmail] = useState("");
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (sessionId) {
      fetchSessionStatus();
    }
  }, [sessionId]);

  async function fetchSessionStatus() {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/check-session`,
        { sessionId },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { session, subscription, error } = response.data;

      // document.cookie = `subscription=${encodeURIComponent(
      //   JSON.stringify(subscription)
      // )}; path=/; max-age=${60 * 60 * 24 * 365}`; // Expires in 365 days
      document.cookie = `subscription=${true}; path=/; max-age=${
        60 * 60 * 24 * 365
      }`;
      localStorage.setItem("subscription", JSON.stringify(subscription));

      if (error) {
        setStatus("failed");
        console.error(error);
        return;
      }

      setStatus(session.status);
      setCustomerEmail(
        session.customer_email || session.customer_details.email
      );
    } catch (error) {
      setStatus("failed");
      console.error("Request failed:", error);
    }
  }

  if (status === "loading") {
    return (
      <div className="flex justify-center">
        <Loader2 className="animate-spin text-4xl" />
      </div>
    );
  }

  if (status === "failed") {
    return <div>Failed to process subscription. Please try again.</div>;
  }

  return (
    <div>
      {/* <h1>Subscription Successful!</h1>
      <p>
        Thank you for your subscription. A confirmation email has been sent to{" "}
        {customerEmail}.
      </p> */}
      <Card>
        <CardHeader className="flex flex-col items-center">
          <CardTitle className="text-green-500 font-bold text-center">
            Success!
          </CardTitle>
          <Image
            src={"/logo.png"}
            alt="logo"
            className="w-48 h-48 rounded-full"
            width={48}
            height={48}
          />
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="text-base font-semibold">
                Welcome to Before The Dates!
              </div>
              <div className="text-base font-normal">
                Thank you for your subscription. A confirmation email has been
                sent to <span className="font-semibold">{customerEmail}</span>
              </div>
              <div>
                Proceed to your dashboard to get started.{" "}
                <button
                  className="text-[#00BFA6] underline"
                  onClick={() => {
                    window.location.href = "/dashboard";
                  }}
                >
                  Dashboard
                </button>
              </div>
              {/* <div className="text-sm text-gray-500">Total Balance</div> */}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
