import OwnerModel from "@/model/Owner";
import mongoose from "mongoose";

export async function GetOnlineGivingInfoAggregate(
  peopleId: string,
  ownerId: string
) {
  return OwnerModel.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(ownerId),
      },
    },
    {
      $lookup: {
        from: "peoples",
        localField: "_id",
        foreignField: "church",
        as: "People_Info",
        pipeline: [
          {
            $match: {
              _id: new mongoose.Types.ObjectId(peopleId),
            },
          },
        ],
      },
    },
    {
      $addFields: {
        User_Info: {
          $first: "$People_Info",
        },
      },
    },
    {
      $project: {
        name: 1,
        email: 1,
        image: 1,
        razorpay_api_key: 1,
        razorpay_secret_key: 1,
        "User_Info._id": 1,
        "User_Info.name": 1,
        "User_Info.email": 1,
        "User_Info.phone_number": 1,
      },
    },
  ]);
}
