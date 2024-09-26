import {
  getPeopleInfoAggregateForOwner,
  getPeoplePaymentsAggregateForOwner,
} from "@/aggregation/PeopleInfo";
import dbConnect from "@/lib/DbConnect";
import { verifyToken } from "@/lib/JsonWebToken";
import AdminModel from "@/model/Admin";
import { ApiResponse } from "@/types/ApiResponse";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  dbConnect();
  try {
    const peopleId = req.nextUrl.searchParams.get("peopleId");
    const access_token = req.cookies.get("access_token")?.value;
    if (!access_token || !peopleId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "You are not logged in or does not provide people id",
      });
    }
    const verifiedData = verifyToken(access_token);
    if (verifiedData?.role === "people" || !verifiedData.ownerId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "You are not logged in",
      });
    }

    if (!peopleId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Provide people id",
      });
    }

    // Getting data of the specific people
    let peopleInfo: any = [];

    if (verifiedData.role === "admin" && verifiedData.adminId) {
      const isAdminExist = await AdminModel.findOne(
        { _id: verifiedData.adminId },
        { _id: 1 }
      );

      if (!isAdminExist) {
        return NextResponse.json<ApiResponse>({
          success: false,
          message: "Admin does not exist",
        });
      }

      peopleInfo = await getPeoplePaymentsAggregateForOwner(
        verifiedData.ownerId,
        peopleId
      );
    } else if (verifiedData.role === "owner") {
      peopleInfo = await getPeoplePaymentsAggregateForOwner(
        verifiedData.ownerId,
        peopleId
      );
    }

    if (!peopleInfo?.length) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "No data found",
      });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Successfully fetched users information",
      data: peopleInfo[0],
    });
  } catch (err: any) {
    return NextResponse.json<ApiResponse>({
      success: false,
      message: err.message,
    });
  }
}

export const dynamic = 'force-dynamic';
