import dbConnect from "@/lib/DbConnect";
import AdminModel from "@/model/Admin";
import OwnerModel from "@/model/Owner";
import PeopleModel from "@/model/People";
import { ApiResponse } from "@/types/ApiResponse";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  dbConnect();
  try {
    const { verificationCode, _id, type } = await req.json();
    if (!verificationCode || !_id || !type) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Verification code, type and id is needed",
      });
    }

    if (type === "admin") {
      const isExist = await AdminModel.findOne(
        { verify_code: verificationCode, _id },
        { _id: 1, verify_expiry: 1 }
      );

      if (!isExist) {
        return NextResponse.json<ApiResponse>({
          success: false,
          message: "Invalid verification code or id",
        });
      }

      if (isExist?.verify_expiry < Math.floor(Date.now() / 1000)) {
        return NextResponse.json<ApiResponse>({
          success: false,
          message: "Verification code expired",
        });
      }
      const updateAdmin = await AdminModel.updateOne(
        { _id },
        {
          $set: {
            is_verified: true,
          },
          $unset: {
            verify_code: "",
            verify_expiry: "",
          },
        }
      );
      if (!updateAdmin.modifiedCount) {
        return NextResponse.json<ApiResponse>({
          success: false,
          message: "Updating the admin failed",
        });
      }
    } else if (type === "owner") {
      const isExist = await OwnerModel.findOne(
        { verify_code: verificationCode, _id },
        { _id: 1, verify_expiry: 1 }
      );

      if (!isExist) {
        return NextResponse.json<ApiResponse>({
          success: false,
          message: "Invalid verification code or id",
        });
      }

      if (isExist?.verify_expiry < Math.floor(Date.now() / 1000)) {
        return NextResponse.json<ApiResponse>({
          success: false,
          message: "Verification code expired",
        });
      }
      const updateOwner = await OwnerModel.updateOne(
        { _id },
        {
          $set: {
            is_verified: true,
          },
          $unset: {
            verify_code: "",
            verify_expiry: "",
          },
        }
      );
      if (!updateOwner.modifiedCount) {
        return NextResponse.json<ApiResponse>({
          success: false,
          message: "Updating the church failed",
        });
      }
    } else {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Invalid type",
      });
    }
    return NextResponse.json<ApiResponse>({
      success: true,
      message: "User verified successfully",
    });
  } catch (err: any) {
    return NextResponse.json<ApiResponse>({
      success: false,
      message: err.message,
    });
  }
}
