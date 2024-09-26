import { SendVerificationEmail } from "@/helpers/SendVerificationEmail";
import dbConnect from "@/lib/DbConnect";
import AdminModel from "@/model/Admin";
import OwnerModel from "@/model/Owner";
import PeopleModel from "@/model/People";
import { ApiResponse } from "@/types/ApiResponse";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  dbConnect();
  try {
    const type = req.nextUrl.searchParams.get("type");
    const { _id, email } = await req.json();

    if (!type) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Type is required",
      });
    }

    if (!_id && type !== "people") {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Id is required",
      });
    }

    if (!email && type === "people") {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Email is required",
      });
    }

    let isUserVerifyCodeUpdated;

    // Function for generating verification code and expriy time
    const verificationCodeAndExpriy = () => {
      const verify_expiry = Math.floor(Date.now() / 1000) + 3600;
      const verify_code = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
      return { verify_code, verify_expiry };
    };

    // Function for sending email
    const verficationEmail = async (
      email: string,
      name: string,
      code: string
    ) => {
      const { success } = await SendVerificationEmail(email, name, code);

      if (!success) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            message: "Failed to send verification email",
          },
          { status: 400 }
        );
      }
    };

    const checkVerificationTime = (expiry: number) => {
      if (expiry) {
        const currentTime = Math.floor(Date.now() / 1000);
        if (expiry > currentTime) {
          if (expiry - 60 * 59 > currentTime) {
            return true;
          }
        }
      }
    };

    const { verify_code, verify_expiry } = verificationCodeAndExpriy();

    // Updating verification code and expiry to the database based on the type of user
    if (type === "admin") {
      const isUserExist = await AdminModel.findOne(
        { _id },
        { name: 1, email: 1, verify_expiry: 1 }
      );
      if (!isUserExist) {
        return NextResponse.json<ApiResponse>({
          success: false,
          message: "User not found",
        });
      }

      const timeResponse = checkVerificationTime(isUserExist.verify_expiry);

      if (timeResponse) {
        return NextResponse.json<ApiResponse>({
          success: false,
          message: "Verification code is recent",
        });
      }

      await verficationEmail(isUserExist.email, isUserExist.name, verify_code);

      isUserVerifyCodeUpdated = await AdminModel.updateOne(
        { _id },
        {
          $set: {
            verify_code,
            verify_expiry,
          },
        }
      );
    } else if (type === "owner") {
      const isUserExist = await OwnerModel.findOne(
        { _id },
        { name: 1, email: 1, verify_expiry: 1 }
      );
      if (!isUserExist) {
        return NextResponse.json<ApiResponse>({
          success: false,
          message: "User not found",
        });
      }

      const timeResponse = checkVerificationTime(isUserExist.verify_expiry);

      if (timeResponse) {
        return NextResponse.json<ApiResponse>({
          success: false,
          message: "Verification code is recent",
        });
      }

      await verficationEmail(isUserExist.email, isUserExist.name, verify_code);

      isUserVerifyCodeUpdated = await OwnerModel.updateOne(
        { _id },
        {
          $set: {
            verify_code,
            verify_expiry,
          },
        }
      );
    } else if (type === "people") {
      const isUserExist = await PeopleModel.findOne(
        { email },
        { name: 1, email: 1, verify_expiry: 1 }
      );
      if (!isUserExist) {
        return NextResponse.json<ApiResponse>({
          success: false,
          message: "User not found",
        });
      }
      const timeResponse = checkVerificationTime(isUserExist.verify_expiry);

      if (timeResponse) {
        return NextResponse.json<ApiResponse>({
          success: false,
          message: "Verification code is recent",
        });
      }
      await verficationEmail(isUserExist.email, isUserExist.name, verify_code);
      isUserVerifyCodeUpdated = await PeopleModel.updateOne(
        { email },
        {
          $set: {
            verify_code,
            verify_expiry,
          },
        }
      );
    } else {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Invalid type",
      });
    }

    if (!isUserVerifyCodeUpdated) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Failed to send verification email",
      });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Verification code send successfully",
    });
  } catch (err: any) {
    return NextResponse.json<ApiResponse>({
      success: false,
      message: err.message,
    });
  }
}
