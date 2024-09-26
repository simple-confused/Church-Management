import dbConnect from "@/lib/DbConnect";
import { verifyToken } from "@/lib/JsonWebToken";
import { pusherServer } from "@/lib/Pusher";
import ChatModel from "@/model/Chat";
import OwnerModel from "@/model/Owner";
import { ApiResponse } from "@/types/ApiResponse";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  dbConnect();
  try {
    const access_token = req.cookies.get("access_token")?.value;
    const peopleId = req.nextUrl.searchParams.get("peopleId");
    if (!access_token) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "You are not logged in",
      });
    }

    const verifiedData = verifyToken(access_token);

    if (verifiedData?.role === "admin" || !verifiedData.ownerId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "You are not logged in",
      });
    }

    let chatInfo = null;

    if (verifiedData.role === "owner" && peopleId) {
      chatInfo = await ChatModel.aggregate([
        {
          $match: {
            $or: [
              {
                $and: [
                  { sender: new mongoose.Types.ObjectId(verifiedData.ownerId) },
                  { receiver: new mongoose.Types.ObjectId(peopleId) },
                ],
              },
              {
                $and: [
                  { sender: new mongoose.Types.ObjectId(peopleId) },
                  {
                    receiver: new mongoose.Types.ObjectId(verifiedData.ownerId),
                  },
                ],
              },
            ],
          },
        },
        {
          $project: {
            message: 1,
            createdAt: 1,
            sender: 1,
          },
        },
      ]);

      await ChatModel.updateMany(
        {
          sender: peopleId,
          receiver: verifiedData.ownerId,
          seen: false,
        },
        {
          $set: { seen: true },
        }
      );
    } else if (verifiedData.role === "people" && verifiedData.peopleId) {
      chatInfo = await ChatModel.aggregate([
        {
          $match: {
            $or: [
              {
                $and: [
                  { sender: new mongoose.Types.ObjectId(verifiedData.ownerId) },
                  {
                    receiver: new mongoose.Types.ObjectId(
                      verifiedData.peopleId
                    ),
                  },
                ],
              },
              {
                $and: [
                  {
                    sender: new mongoose.Types.ObjectId(verifiedData.peopleId),
                  },
                  {
                    receiver: new mongoose.Types.ObjectId(verifiedData.ownerId),
                  },
                ],
              },
            ],
          },
        },
        // {
        //   $lookup: {
        //     from: "owners",
        //     localField: "sender",
        //     foreignField: "_id",
        //     as: "Church",
        //   },
        // },
        // {
        //   $addFields: {
        //     Church: {
        //       $first: "$Church",
        //     },
        //   },
        // },
        {
          $project: {
            message: 1,
            createdAt: 1,
            sender: 1,
          },
        },
      ]);
      await ChatModel.updateMany(
        {
          sender: verifiedData.ownerId,
          receiver: verifiedData.peopleId,
          seen: false,
        },
        {
          $set: { seen: true },
        }
      );
    }

    if (!chatInfo?.length) {
      return NextResponse.json<ApiResponse>({
        success: true,
        message: "No data found",
      });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Message found",
      data: chatInfo,
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
    const { peopleId, message } = await req.json();
    if (!access_token) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "You are not logged in",
      });
    }

    const verifiedData = verifyToken(access_token);

    if (verifiedData?.role === "admin" || !verifiedData.ownerId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "You are not logged in",
      });
    }

    if (!message) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Provide the message and people id",
      });
    }

    let isChatCreated = null;

    if (verifiedData.role === "owner" && peopleId) {
      pusherServer.trigger(`from${peopleId}`, "messages", message);

      isChatCreated = await ChatModel.create({
        sender: verifiedData.ownerId,
        receiver: peopleId,
        message,
      });
    } else if (verifiedData?.role === "people" && verifiedData?.peopleId) {
      pusherServer.trigger(`to${verifiedData?.peopleId}`, "messages", message);

      isChatCreated = await ChatModel.create({
        sender: verifiedData?.peopleId,
        receiver: verifiedData.ownerId,
        message,
      });
    } else {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Provide peopleId or churchId",
      });
    }

    if (!isChatCreated) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Chat not created",
      });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Message send successfully",
    });
  } catch (err: any) {
    return NextResponse.json<ApiResponse>({
      success: false,
      message: err.message,
    });
  }
}
