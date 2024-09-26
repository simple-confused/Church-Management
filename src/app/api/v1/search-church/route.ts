import dbConnect from "@/lib/DbConnect";
import OwnerModel from "@/model/Owner";
import { ApiResponse } from "@/types/ApiResponse";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  dbConnect();
  try {
    const churchName = req.nextUrl.searchParams.get("churchName");

    if (!churchName) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "Church name is required",
      });
    }

    const churchInfo = await OwnerModel.aggregate([
      {
        $search: {
          index: "church",
          autocomplete: {
            query: `${churchName}`,
            path: "name",
          },
        },
      },
      {
        $limit: 5,
      },
      {
        $project: {
          name: 1,
          image: 1,
        },
      },
    ]);

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Church successfully retrieved",
      data: churchInfo,
    });
  } catch (err: any) {
    return NextResponse.json<ApiResponse>({
      success: false,
      message: err.message,
    });
  }
}

export const dynamic = 'force-dynamic';
