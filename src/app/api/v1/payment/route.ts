import { instance } from "@/lib/Razorpay";
import { ApiResponse } from "@/types/ApiResponse";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { amount } = await req.json();
    if (!amount) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Amount is required",
      });
    }
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "order_rcptid_11",
    };
    const order = await instance.orders.create(options);
    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Razorpay order created successfully",
        data: {
          orderId: order.id,
        },
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json<ApiResponse>({
      success: false,
      message: err.message,
    });
  }
}
