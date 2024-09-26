import {
  isPeopleExistAggregate,
  peopleDetailsAggregate,
} from "@/aggregation/People";
import dbConnect from "@/lib/DbConnect";
import { verifyToken } from "@/lib/JsonWebToken";
import PeopleModel from "@/model/People";
import { ApiResponse } from "@/types/ApiResponse";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import AdminModel from "@/model/Admin";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(req: NextRequest) {
  dbConnect();
  try {
    const access_token = req.cookies.get("access_token")?.value;
    const page = parseInt(req.nextUrl.searchParams.get("page") || "") - 1 || 0;
    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "") || 5;
    const sort = req.nextUrl.searchParams.get("sort") || "recent";
    const gender = req.nextUrl.searchParams.get("gender") || "";
    if (!access_token) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "You are not logged in",
      });
    }

    const verifiedData = verifyToken(access_token);

    if (!verifiedData?.role || !verifiedData.ownerId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "You are not logged in",
      });
    }

    let data = [];

    if (verifiedData.role === "admin" && verifiedData.ownerId) {
      // Checking is the admin exist
      const isAdmin = await AdminModel.findOne(
        { _id: verifiedData.adminId },
        { _id: 1 }
      );

      if (!isAdmin) {
        return NextResponse.json<ApiResponse>({
          success: false,
          message: "You are not logged in",
        });
      }

      data = await peopleDetailsAggregate(
        verifiedData.ownerId,
        gender,
        page,
        limit,
        sort
      );
    } else if (verifiedData.role === "owner") {
      data = await peopleDetailsAggregate(
        verifiedData.ownerId,
        gender,
        page,
        limit,
        sort
      );
    } else {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "You are not logged in",
      });
    }

    // Getting the people info of that owner

    if (!data?.length) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "User does not exist",
      });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "People found successfully",
      data: {
        ...data[0],
        role: verifiedData.role,
      },
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      message: err.message,
    });
  }
}

export async function POST(req: NextRequest) {
  dbConnect();
  try {
    const { name, date_of_birth, gender, address, phone_number, email } =
      await req.json();
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
    if (
      !name ||
      !date_of_birth ||
      !gender ||
      !address ||
      !phone_number ||
      !email
    ) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "All fields are required",
      });
    }

    // Checking the people already exists or not
    const isUserAlreadyExists = await PeopleModel.findOne(
      {
        $or: [{ phone_number }, { email }],
      },
      { _id: 1 }
    );

    if (isUserAlreadyExists) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "User already exist",
      });
    }

    const isUserCreated = await PeopleModel.create({
      name,
      date_of_birth,
      gender,
      address,
      phone_number,
      church: verifiedData.ownerId,
      email,
      image:
        "https://res.cloudinary.com/dxkufsejm/image/upload/v1635736824/Church%20App/Church%20App%20Images/ChurchAppLogo",
    });

    if (!isUserCreated?._id) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Failed to create user",
      });
    }
    return NextResponse.json<ApiResponse>({
      success: true,
      message: "User created successfully",
    });
  } catch (err: any) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: err.message,
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  dbConnect();
  try {
    const peopleId = req.nextUrl.searchParams.get("peopleId");
    const access_token = req.cookies.get("access_token")?.value;
    const value = await req.json();

    if (!access_token || !peopleId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "You are not logged in or does not provide people id",
      });
    }

    const verifiedData = verifyToken(access_token);

    if (verifiedData?.role !== "owner" || !verifiedData.ownerId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "You are not logged in",
      });
    }

    // Checking is the people under the owner or not
    const isPeopleExist = await isPeopleExistAggregate(
      verifiedData.ownerId,
      peopleId
    );

    if (!isPeopleExist?.length) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "User not found",
      });
    }

    if (!isPeopleExist[0]?.Peoples) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "User not found",
      });
    }

    // If everything is verified then deleting the person
    const isPeopleUpdated = await PeopleModel.updateOne(
      {
        _id: peopleId,
      },
      { $set: value }
    );

    if (!isPeopleUpdated?.modifiedCount) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Failed to update user",
      });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "User update successfully",
      data: isPeopleExist,
    });
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
    // peopleId is the id of the people that will be deleted
    const peopleId = req.nextUrl.searchParams.get("peopleId");
    const access_token = req.cookies.get("access_token")?.value;

    if (!access_token || !peopleId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "You are not logged in or does not provide people id",
      });
    }

    const verifiedData = verifyToken(access_token);

    if (verifiedData?.role !== "owner" || !verifiedData.ownerId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "You are not logged in",
      });
    }

    // Checking is the people under the owner or not
    const isPeopleExist = await isPeopleExistAggregate(
      verifiedData.ownerId,
      peopleId
    );

    if (!isPeopleExist?.length) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "User not found",
      });
    }

    if (!isPeopleExist[0]?.Peoples?.image) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Validation failed",
      });
    }

    const cloudinaryResponse = await cloudinary.uploader.destroy(
      isPeopleExist[0]?.Peoples?.image
    );

    if (cloudinaryResponse.result !== "ok") {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Failed to delete image from cloudinary",
      });
    }

    // If everything is verified then deleting the person
    const isPeopleDeleted = await PeopleModel.deleteOne({
      _id: peopleId,
    });

    if (!isPeopleDeleted?.deletedCount) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Failed to delete user",
      });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err: any) {
    return NextResponse.json<ApiResponse>({
      success: false,
      message: err.message,
    });
  }
}
