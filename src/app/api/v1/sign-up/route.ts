import dbConnect from "@/lib/DbConnect";
import AdminModel from "@/model/Admin";
import OwnerModel from "@/model/Owner";
import { ApiResponse } from "@/types/ApiResponse";
import { NextRequest, NextResponse } from "next/server";
import { genSalt, hash } from "bcryptjs";
import PeopleModel from "@/model/People";

export async function POST(req: NextRequest) {
  dbConnect();
  try {
    const { name, password, email, emailOtp } = await req.json();
    const type = req.nextUrl.searchParams.get("type");
    const image =
      "https://res.cloudinary.com/dxkufsejm/image/upload/v1635736824/Church%20App/Church%20App%20Images/ChurchAppLogo";
    console.log(type, email, emailOtp, password);

    if (type !== "people") {
      if (!name || !password || !email || !type) {
        return NextResponse.json(
          {
            message: "All fields are required",
          },
          { status: 400 }
        );
      }
    } else {
      if (!email || !password || !emailOtp) {
        return NextResponse.json(
          {
            message: "All fields are required",
          },
          { status: 400 }
        );
      }
    }

    let isUserCreated;

    if (type === "admin") {
      const isAdminAlreadyExist = await AdminModel.findOne({ email });

      if (isAdminAlreadyExist) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            message: "Admin already exist",
          },
          { status: 400 }
        );
      }

      const salt = await genSalt(10);
      const hashedPassword = await hash(password, salt);

      isUserCreated = await AdminModel.create({
        email,
        password: hashedPassword,
        name,
        image,
      });
      isUserCreated = {
        _id: isUserCreated._id,
        type: type,
      };
    } else if (type === "owner") {
      const isOwnerAlreadyExist = await OwnerModel.findOne({ email });

      if (isOwnerAlreadyExist) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            message: "Owner already exist",
          },
          { status: 400 }
        );
      }

      const salt = await genSalt(10);
      const hashedPassword = await hash(password, salt);

      isUserCreated = await OwnerModel.create({
        email,
        password: hashedPassword,
        name,
        image,
      });
      isUserCreated = {
        _id: isUserCreated._id,
        type: type,
      };
    } else if (type === "people") {
      const salt = await genSalt(10);
      const hashedPassword = await hash(password, salt);

      const isExist = await PeopleModel.findOne(
        { verify_code: emailOtp, email },
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
      const updateUser = await PeopleModel.updateOne(
        { email },
        {
          $set: {
            is_verified: true,
            password: hashedPassword,
          },
          $unset: {
            verify_code: "",
            verify_expiry: "",
          },
        }
      );
      if (!updateUser.modifiedCount) {
        return NextResponse.json<ApiResponse>({
          success: false,
          message: "Updating people failed",
        });
      }

      isUserCreated = {
        _id: 1,
        type: type,
      };
    } else {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Type is required",
        },
        { status: 400 }
      );
    }

    if (!isUserCreated._id) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Failed to create user",
        },
        { status: 400 }
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        message: "User is created successfully",
        success: true,
        data: isUserCreated,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.log(err.message);
    return NextResponse.json({
      error: err.message,
    });
  }
}
