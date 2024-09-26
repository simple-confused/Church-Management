import dbConnect from "@/lib/DbConnect";
import { verifyToken } from "@/lib/JsonWebToken";
import PeopleModel from "@/model/People";
import { ApiResponse } from "@/types/ApiResponse";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { peopleId: string } }
) {
  dbConnect();
  try {
    const access_token = req.cookies.get("access_token")?.value;
    const { peopleId } = params;
    const eventId = req.nextUrl.searchParams.get("eventId");
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

    if (!peopleId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Provide peopleId",
      });
    }

    const eventInfo = await PeopleModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(peopleId),
        },
      },
      {
        $lookup: {
          from: "tagjoineds",
          localField: "_id",
          foreignField: "people",
          as: "TagInfo",
          pipeline: [
            {
              $lookup: {
                from: "events",
                localField: "tag_item",
                foreignField: "tag",
                as: "Events_Info",
              },
            },
            {
              $unwind: "$Events_Info",
            },
          ],
        },
      },
      {
        $addFields: {
          Events_Info: "$TagInfo.Events_Info",
        },
      },
      {
        $project: {
          _id: 0,
          "Events_Info._id": 1,
          "Events_Info.name": 1,
        },
      },
    ]);

    if (!eventInfo.length) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "No data found",
      });
    }
    return NextResponse.json<ApiResponse>({
      success: true,
      message: "User found",
      data: {
        ...eventInfo[0],
      },
    });
  } catch (err: any) {
    return NextResponse.json<ApiResponse>({
      success: false,
      message: err.message,
    });
  }
}
