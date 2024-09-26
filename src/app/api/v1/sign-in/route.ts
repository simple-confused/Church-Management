import dbConnect from "@/lib/DbConnect";
import { createToken } from "@/lib/JsonWebToken";
import AdminModel from "@/model/Admin";
import OwnerModel from "@/model/Owner";
import PeopleModel from "@/model/People";
import { ApiResponse } from "@/types/ApiResponse";
import { compare } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  dbConnect();
  const cookieSettings = { httpOnly: true, secure: true };
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Please enter email and password",
      });
    }
    let isPeopleExist = await PeopleModel.findOne(
      { email },
      { church: 1, password: 1 }
    );

    if (isPeopleExist?.id) {
      const isPasswordCorrect = await compare(password, isPeopleExist.password);
      if (!isPasswordCorrect) {
        return NextResponse.json<ApiResponse>({
          success: false,
          message: "Credentials are incorrect",
        });
      }
      const { access_token, refresh_token } = createToken({
        ownerId: isPeopleExist.church.toString(),
        peopleId: isPeopleExist._id.toString(),
        role: "people",
      });
      const response = NextResponse.json<ApiResponse>({
        message: "Logged in successfully",
        success: true,
      });
      response.cookies.set("access_token", access_token, cookieSettings);
      response.cookies.set("refresh_token", refresh_token, cookieSettings);
      return response;
    }

    let isOwnerExist = await OwnerModel.findOne({ email }, { password: 1 });
    if (isOwnerExist?._id) {
      const isPasswordCorrect = await compare(password, isOwnerExist.password);
      if (!isPasswordCorrect) {
        return NextResponse.json<ApiResponse>({
          success: false,
          message: "Credentials are incorrect",
        });
      }
      const { access_token, refresh_token } = createToken({
        ownerId: isOwnerExist._id.toString(),
        role: "owner",
      });
      const response = NextResponse.json<ApiResponse>({
        message: "Logged in successfully",
        success: true,
      });
      response.cookies.set("access_token", access_token, cookieSettings);
      response.cookies.set("refresh_token", refresh_token, cookieSettings);
      return response;
    }
    let isAdminExist = await AdminModel.findOne({ email }, { password: 1 });
    // let ownerId = await OwnerModel.findOne();
    if (!isAdminExist?._id) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "User does not exist",
      });
    }

    const isPasswordCorrect = await compare(password, isAdminExist.password);
    if (!isPasswordCorrect) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Credentials are incorrect",
      });
    }

    const { access_token, refresh_token } = createToken({
      adminId: isAdminExist._id.toString(),
      // ownerId: ownerId._id.toString(),
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
  dbConnect();
  try {
    const response = NextResponse.json<ApiResponse>({
      message: "Logged in successfully",
      success: true,
    });
    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");
    return response;
  } catch (err: any) {
    return NextResponse.json<ApiResponse>({
      success: false,
      message: err.message,
    });
  }
}
