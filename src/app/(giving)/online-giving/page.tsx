"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOnlineGivingContext } from "@/my_components/providers/OnlineGivingProvider";
import axios from "axios";
import { useCallback, useState } from "react";

interface ResponseValue {
  razorpay_order_id: String;
  razorpay_payment_id: String;
  razorpay_signature: String;
}

const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;

function Page() {
  const [amount, setAmount] = useState<Number>(0);
  const { ChurchInfo, UserInfo } = useOnlineGivingContext();
  const paymentHandler = useCallback(
    async (e: any) => {
      const { data } = await axios.post("/api/v1/payment", {
        amount,
      });
      console.log(ChurchInfo?.razorpay_api_key);
      if (data.success && ChurchInfo?.razorpay_api_key) {
        const options = {
          key: ChurchInfo?.razorpay_api_key,
          amount: amount,
          currency: "INR",
          name: ChurchInfo?.name,
          description: "Test Transaction",
          image: `${imageUrl}/${ChurchInfo?.imageUrl}`,
          order_id: data.data.orderId,
          handler: async function (response: ResponseValue) {
            const { data } = await axios.post("/api/v1/payment-verification", {
              ...response,
              amount,
            });
            if (data.success) {
              setAmount(0);
            }
          },
          prefill: {
            name: UserInfo?.name,
            email: UserInfo?.email,
            contact: UserInfo?.phone_number,
          },
          notes: {
            address: "Razorpay Corporate Office",
          },
          theme: {
            color: "#3399cc",
          },
        };
        const razor = new (window as any).Razorpay(options);
        razor.open();
        e.preventDefault();
      }
    },
    [amount]
  );
  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-4">
        Thank You!
      </h1>
      <p className="text-lg text-gray-700 text-center mb-4">
        Your generosity is deeply appreciated. Your support empowers us to keep
        moving forward and reach new heights.
      </p>
      <p className="text-lg text-gray-700 text-center mb-6">
        We are incredibly grateful for your valuable input. Every contribution
        counts and makes a significant impact.
      </p>
      <div className="flex flex-col items-center">
        <input
          placeholder="Amount"
          type="number"
          value={amount.toString()}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          className="w-full bg-blue-600 text-white font-semibold text-xl py-3 rounded-lg mt-4 hover:bg-blue-700 transition duration-200 ease-in-out"
          onClick={paymentHandler}
        >
          Contribute
        </button>
      </div>
    </div>
  );
}

export default Page;
