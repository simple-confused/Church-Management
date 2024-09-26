import dbConnect from "@/lib/DbConnect";
import { verifyToken } from "@/lib/JsonWebToken";
import OwnerModel from "@/model/Owner";
import { ApiResponse } from "@/types/ApiResponse";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  dbConnect();
  try {
    const access_token = req.cookies.get("access_token")?.value;

    if (!access_token) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "You are not logged in",
      });
    }

    const verifiedData = verifyToken(access_token);

    if (verifiedData?.role!=="owner" || !verifiedData.ownerId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "You are not logged in",
      });
    }

    const isExist = await OwnerModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(verifiedData.ownerId),
        },
      },
      {
        $project: {
          _id: 0,
          name: 1,
          image: 1,
        },
      },
    ]);

    if (!isExist?.length) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "No data found",
      });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "User found",
      data: {
        ...isExist[0],
        role: verifiedData.role,
      },
    });
  } catch (err: any) {
    return NextResponse.json<ApiResponse>({
      success: false,
      message: err.message,
    });
  }
}

export async function POST(req: NextRequest) {
  dbConnect();
  try {
    const access_token = req.cookies.get("access_token")?.value;

    if (!access_token) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "You are not logged in",
      });
    }

    const verifiedData = verifyToken(access_token);

    if (verifiedData?.role!=="owner" || !verifiedData.ownerId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "You are not logged in",
      });
    }

    const isExist = await OwnerModel.findOne(
      { _id: verifiedData.ownerId },
      { image: 1, name: 1 }
    );

    if (!isExist) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "No data found",
      });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "User found",
      data: {
        ...isExist,
        role: verifiedData.role,
      },
    });
  } catch (err: any) {
    return NextResponse.json<ApiResponse>({
      success: false,
      message: err.message,
    });
  }
}
