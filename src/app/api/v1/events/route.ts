import {
  GetEventsInfoForOwnerAggregate,
  GetEventsInfoForPeopleAggregate,
  GetTagsPeoplesInfo,
} from "@/aggregation/Events";
import { SendEventInvitationEmail } from "@/helpers/SendEventInvitationEmail";
import dbConnect from "@/lib/DbConnect";
import { verifyToken } from "@/lib/JsonWebToken";
import AdminModel from "@/model/Admin";
import EventModel from "@/model/Event";
import { ApiResponse } from "@/types/ApiResponse";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  dbConnect();
  try {
    const access_token = req.cookies.get("access_token")?.value;
    const month = Number(req.nextUrl.searchParams.get("month"));
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

    let data: any = [];

    if (verifiedData.role === "admin" && verifiedData.adminId) {
      const isAdminExist = await AdminModel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(verifiedData.adminId),
          },
        },
        {
          $project: {
            name: 1,
            image: 1,
          },
        },
      ]);

      if (!isAdminExist.length) {
        return NextResponse.json<ApiResponse>({
          success: false,
          message: "Admin not found",
        });
      }

      // data = await GetEventsInfoForOwnerAggregate(verifiedData.ownerId, month);
    } else if (verifiedData.role === "owner") {
      data = await GetEventsInfoForOwnerAggregate(verifiedData.ownerId, month);
    } else if (verifiedData.role === "people" && verifiedData.peopleId) {
      data = await GetEventsInfoForPeopleAggregate(
        verifiedData.ownerId,
        verifiedData.peopleId,
        month
      );
    } else {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Some thing went wrong in role",
      });
    }

    if (!data?.length) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "No events found",
      });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Events found",
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
  dbConnect();
  try {
    const { name, date_day, date_month, date_year, time, tag, description } =
      await req.json();
    const access_token = req.cookies.get("access_token")?.value;

    if (
      !name ||
      !date_day ||
      !date_month ||
      !date_year ||
      !time ||
      !tag ||
      !description
    ) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Please fill all the fields",
      });
    }

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
        message: "Missing owner id or unauthorized access",
      });
    }

    let isValid = (await GetTagsPeoplesInfo(verifiedData.ownerId, tag)) as {
      name: string;
      isTagExist: boolean;
      People_Info: {
        name: string;
        email: string;
      }[];
    }[];

    if (!isValid?.length) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Tag not found",
      });
    }

    if (!isValid[0].isTagExist) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Tag not found in your people's list",
      });
    }

    const isEventCreated = await EventModel.create({
      name,
      date_day,
      date_month,
      date_year,
      time,
      tag,
      description,
      owner: verifiedData.ownerId,
    });

    if (!isEventCreated) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Event not created",
      });
    }

    await SendEventInvitationEmail({
      churchName: isValid[0].name,
      eventDate: new Date(`${date_month}-${date_day}-${date_year}`),
      eventDescription: description,
      eventName: name,
      eventTime: time,
      peopleInfo: isValid[0].People_Info,
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Event created successfully",
    });
  } catch (err: any) {
    return NextResponse.json<ApiResponse>({
      success: false,
      message: err.message,
    });
  }
}

export async function PATCH(req: NextRequest) {
  dbConnect();
  try {
    const eventId = req.nextUrl.searchParams.get("eventId");
    const access_token = req.cookies.get("access_token")?.value;
    const values = await req.json();

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

    if (!eventId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Event id not found",
      });
    }

    const isEventExist = await EventModel.findOne(
      {
        _id: eventId,
        owner: verifiedData.ownerId,
      },
      { _id: 1 }
    );

    if (!isEventExist) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Event does not exist",
      });
    }

    const isEventUpdated = await EventModel.updateOne(
      {
        _id: eventId,
        owner: verifiedData.ownerId,
      },
      {
        $set: {
          ...values,
        },
      }
    );

    if (!isEventUpdated.modifiedCount) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Event is not updated",
      });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Event deleted successfully",
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
    const eventId = req.nextUrl.searchParams.get("eventId");
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

    if (!eventId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Event id not found",
      });
    }

    const isEventDeleted = await EventModel.deleteOne({
      _id: eventId,
      owner: verifiedData.ownerId,
    });

    if (!isEventDeleted.deletedCount) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Event not deleted",
      });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (err: any) {
    return NextResponse.json<ApiResponse>({
      success: false,
      message: err.message,
    });
  }
}
