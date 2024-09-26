import dbConnect from "@/lib/DbConnect";
import { verifyToken } from "@/lib/JsonWebToken";
import PaymentModel from "@/model/Payment";
import { ApiResponse } from "@/types/ApiResponse";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  dbConnect();
  try {
    const { amount, userId } = await req.json();
    const access_token = req.cookies.get("access_token")?.value;

    if (!access_token) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "You are not logged in",
      });
    }

    const verifiedData = verifyToken(access_token);

    if (verifiedData.role === "people" || !verifiedData.ownerId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "You are not logged in",
      });
    }

    if (!amount || !userId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Amount and userid is required",
      });
    }

    const isCreated = await PaymentModel.create({
      church: verifiedData.ownerId,
      people: userId,
      amount,
    });

    if (!isCreated) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Payment not created",
      });
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Razorpay order created successfully",
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
