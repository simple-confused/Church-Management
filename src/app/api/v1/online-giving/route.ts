import { GetOnlineGivingInfoAggregate } from "@/aggregation/OnlineGiving";
import dbConnect from "@/lib/DbConnect";
import { verifyToken } from "@/lib/JsonWebToken";
import { ApiResponse } from "@/types/ApiResponse";
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
    const isExist = await GetOnlineGivingInfoAggregate(
      verifiedData.peopleId,
      verifiedData.ownerId
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

export const dynamic = 'force-dynamic';

