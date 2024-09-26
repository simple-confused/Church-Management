import { isEventAndTagValidForThePeople } from "@/aggregation/CheckIn";
import dbConnect from "@/lib/DbConnect";
import { verifyToken } from "@/lib/JsonWebToken";
import CheckInModel from "@/model/CheckIn";
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

    if (verifiedData?.role !== "owner" || !verifiedData.ownerId) {
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
          image: 1,
          name: 1,
        },
      },
    ]);

    if (!isExist.length) {
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
    const { peopleId, eventId } = await req.json();
    if (!access_token) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "You are not logged in",
      });
    }

    const verifiedData = verifyToken(access_token);

    if (verifiedData?.role !== "owner" || !verifiedData.ownerId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "You are not logged in",
      });
    }

    if (!peopleId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Provide peopleId",
      });
    }

    let isCheckedIn = null;

    if (eventId) {
      const isEventValid = await isEventAndTagValidForThePeople(
        peopleId,
        eventId
      );

      if (!isEventValid?.length) {
        return NextResponse.json<ApiResponse>({
          success: false,
          message: "Event is not valid",
        });
      }

      isCheckedIn = await CheckInModel.create({
        people: peopleId,
        event: eventId,
      });
    } else {
      isCheckedIn = await CheckInModel.create({
        people: peopleId,
      });
    }

    if (!isCheckedIn) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Check in is not created",
      });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "User found",
    });
  } catch (err: any) {
    return NextResponse.json<ApiResponse>({
      success: false,
      message: err.message,
    });
  }
}
