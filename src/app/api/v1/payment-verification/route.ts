import { ApiResponse } from "@/types/ApiResponse";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/DbConnect";
import { verifyToken } from "@/lib/JsonWebToken";
import PaymentModel from "@/model/Payment";
import OwnerModel from "@/model/Owner";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  dbConnect();
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
    } = await req.json();

    const access_token = req.cookies.get("access_token")?.value;

    if (!access_token) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "You are not logged in",
      });
    }

    const verifiedData = verifyToken(access_token);

    if (
      !verifiedData?.role ||
      !verifiedData.peopleId ||
      !verifiedData.ownerId
    ) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "You are not logged in",
      });
    }

    const isChurchAndPeopleValid: any = await OwnerModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(verifiedData.ownerId),
        },
      },
      {
        $lookup: {
          from: "peoples",
          localField: "_id",
          foreignField: "church",
          as: "People_Info",
          pipeline: [
            {
              $match: {
                _id: new mongoose.Types.ObjectId(verifiedData.peopleId),
              },
            },
          ],
        },
      },
      {
        $addFields: {
          PeopleInfo: {
            $first: "$People_Info",
          },
        },
      },
      {
        $project: {
          _id: 0,
          razorpay_secret_key: 1,
          "PeopleInfo._id": 1,
        },
      },
    ]);

    if (!isChurchAndPeopleValid?.length) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Not Found",
      });
    }

    if (!isChurchAndPeopleValid[0]?.PeopleInfo?._id) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Church or the people is not valid",
      });
    }

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !amount
    ) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message:
          "razorpay_order_id, razorpay_payment_id and razorpay_signature are required",
      });
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET!)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Signature is not valid",
      });
    }

    const isPaymentCreated = await PaymentModel.create({
      church: verifiedData.ownerId,
      people: verifiedData.peopleId,
      amount,
    });

    if (!isPaymentCreated) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Payment not created",
      });
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Payment verified",
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
