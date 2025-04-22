"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

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

      const { session, error } = response.data;

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
    return <div>Loading...</div>;
  }

  if (status === "failed") {
    return <div>Failed to process subscription. Please try again.</div>;
  }

  return (
    <div>
      <h1>Subscription Successful!</h1>
      <p>
        Thank you for your subscription. A confirmation email has been sent to{" "}
        {customerEmail}.
      </p>
    </div>
  );
}
