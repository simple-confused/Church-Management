import {
  GetDashboardInfoForOwner,
  GetDashboardInfoForUser,
} from "@/aggregation/Dashboard";
import dbConnect from "@/lib/DbConnect";
import { createToken, verifyToken } from "@/lib/JsonWebToken";
import AdminModel from "@/model/Admin";
import OwnerModel from "@/model/Owner";
import { ApiResponse } from "@/types/ApiResponse";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

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

    if (!verifiedData?.role) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "You are not logged in",
      });
    }

    let data: any = [];

    if (verifiedData.role === "admin" && verifiedData.adminId) {
      const isAdminExist = await AdminModel.find(
        {
          _id: verifiedData.adminId,
        },
        { _id: 1 }
      );

      if (!isAdminExist) {
        return NextResponse.json<ApiResponse>({
          success: false,
          message: "You are not logged in",
        });
      }

      if (verifiedData.ownerId) {
        data = await GetDashboardInfoForOwner(verifiedData.ownerId);
      } else {
        const churchInfo = await OwnerModel.aggregate([
          {
            $project: {
              name: 1,
              image: 1,
            },
          },
        ]);
        return NextResponse.json<ApiResponse>({
          success: true,
          message: "Data found successfully",
          data: {
            ChurchInfo: churchInfo,
            role: verifiedData.role,
          },
        });
      }
    } else if (verifiedData.role === "owner" && verifiedData?.ownerId) {
      data = await GetDashboardInfoForOwner(verifiedData?.ownerId);
    } else if (
      verifiedData.role === "people" &&
      verifiedData.peopleId &&
      verifiedData?.ownerId
    ) {
      data = await GetDashboardInfoForUser(
        verifiedData?.ownerId,
        verifiedData.peopleId
      );
    } else {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Some thing went wrong in role",
      });
    }

    if (!data.length) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "No data found",
      });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Data found successfully",
      data: {
        ...data[0],
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
  const cookieSettings = { httpOnly: true, secure: true };
  dbConnect();
  try {
    const { _id } = await req.json();
    const token = req.cookies.get("access_token")?.value;

    if (!token) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "You are not logged in",
      });
    }

    const verifiedData = verifyToken(token);

    if (verifiedData?.role !== "admin" || !verifiedData.adminId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "You are not logged in",
      });
    }
    if (!_id) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Id is required",
      });
    }
    const { access_token, refresh_token } = createToken({
      adminId: verifiedData.adminId,
      ownerId: _id,
      role: "admin",
    });
    const response = NextResponse.json<ApiResponse>({
      message: "Logged in successfully",
      success: true,
    });
    response.cookies.set("access_token", access_token, cookieSettings);
    response.cookies.set("refresh_token", refresh_token, cookieSettings);
    return response;
  } catch (err: any) {
    return NextResponse.json<ApiResponse>({
      success: false,
      message: err.message,
    });
  }
}

export async function DELETE(req: NextRequest) {
  const cookieSettings = { httpOnly: true, secure: true };
  try {
    const token = req.cookies.get("access_token")?.value;

    if (!token) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "You are not logged in",
      });
    }

    const verifiedData = verifyToken(token);

    if (verifiedData?.role !== "admin" || !verifiedData.adminId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "You are not logged in",
      });
    }

    const { access_token, refresh_token } = createToken({
      adminId: verifiedData.adminId,
      role: "admin",
    });
    const response = NextResponse.json<ApiResponse>({
      message: "Logged in successfully",
      success: true,
    });
    response.cookies.set("access_token", access_token, cookieSettings);
    response.cookies.set("refresh_token", refresh_token, cookieSettings);
    return response;
  } catch (err: any) {
    return NextResponse.json<ApiResponse>({
      success: false,
      message: err.message,
    });
  }
}
