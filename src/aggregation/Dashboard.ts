import OwnerModel from "@/model/Owner";
import mongoose from "mongoose";

export async function GetDashboardInfoForOwner(ownerId: string) {
  return await OwnerModel.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(ownerId),
      },
    },
    {
      $lookup: {
        from: "payments",
        localField: "_id",
        foreignField: "church",
        as: "Payment",
        pipeline: [
          {
            $redact: {
              $cond: {
                if: {
                  $gte: [
                    "$createdAt",
                    new Date(new Date().setDate(new Date().getDate() - 7)),
                  ],
                },

                then: "$$KEEP",
                else: "$$PRUNE",
              },
            },
          },
          {
            $group: {
              _id: null,
              amount: {
                $sum: "$amount",
              },
            },
          },
        ],
      },
    },
    {
      $addFields: {
        Payment: {
          $first: "$Payment.amount",
        },
      },
    },
    {
      $lookup: {
        from: "events",
        localField: "_id",
        foreignField: "owner",
        as: "Events",
        pipeline: [
          {
            $redact: {
              $cond: {
                if: {
                  $and: [
                    {
                      $gte: ["$date_day", new Date().getDate()],
                    },
                    {
                      $gte: ["$date_month", new Date().getMonth()],
                    },
                    {
                      $gte: ["$date_year", new Date().getFullYear()],
                    },
                  ],
                },
                then: "$$KEEP",
                else: "$$PRUNE",
              },
            },
          },
          {
            $lookup: {
              from: "tagitems",
              localField: "tag",
              foreignField: "_id",
              as: "Tag_Info",
            },
          },
          {
            $addFields: {
              Tag_Info: {
                $first: "$Tag_Info",
              },
            },
          },
          {
            $addFields: {
              Tag_Name: "$Tag_Info.name",
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "peoples",
        localField: "_id",
        foreignField: "church",
        as: "Peoples",
        pipeline: [
          {
            $redact: {
              $cond: {
                if: {
                  $gte: [
                    "$createdAt",
                    new Date(new Date().setDate(new Date().getDate() - 7)),
                  ],
                },
                then: "$$KEEP",
                else: "$$PRUNE",
              },
            },
          },
        ],
      },
    },
    {
      $addFields: {
        PeopleCount: {
          $size: "$Peoples",
        },
      },
    },
    {
      $project: {
        name: 1,
        image: 1,
        PeopleCount: 1,
        "Events.name": 1,
        "Events.date_day": 1,
        "Events.date_month": 1,
        "Events.date_year": 1,
        "Events.time": 1,
        "Events._id": 1,
        "Events.description": 1,
        "Events.Tag_Name": 1,
        Payment: 1,
      },
    },
  ]);
}

export async function GetDashboardInfoForUser(
  ownerId: string,
  peopleId: string
) {
  return await OwnerModel.aggregate([
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
        as: "Peoples",
        pipeline: [
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
              as: "Tags",
              pipeline: [
                {
                  $lookup: {
                    from: "events",
                    localField: "tag_item",
                    foreignField: "tag",
                    as: "Events",
                    pipeline: [
                      {
                        $lookup: {
                          from: "tagitems",
                          localField: "tag",
                          foreignField: "_id",
                          as: "Tag_Info",
                        },
                      },
                      {
                        $addFields: {
                          Tag_Info: {
                            $first: "$Tag_Info",
                          },
                        },
                      },
                    ],
                  },
                },
                {
                  $unwind: "$Events",
                },
                {
                  $addFields: {
                    "Events.Tag_Name": "$Events.Tag_Info.name",
                  },
                },
              ],
            },
          },
          {
            $lookup: {
              from: "chats",
              localField: "_id",
              foreignField: "receiver",
              as: "Chats_Info",
              pipeline: [
                {
                  $group: {
                    _id: "$seen",
                    count: {
                      $sum: 1,
                    },
                  },
                },
                {
                  $match: {
                    _id: false,
                  },
                },
              ],
            },
          },
        ],
      },
    },

    {
      $addFields: {
        People: {
          $first: "$Peoples",
        },
      },
    },
    {
      $addFields: {
        Events: "$People.Tags.Events",
      },
    },
    {
      $addFields: {
        UnseenChatCount: {
          $first: "$People.Chats_Info.count",
        },
      },
    },
    {
      $addFields: {
        name: "$$ROOT.People.name",
        image: "$$ROOT.People.image",
        _id: "$$ROOT.People._id",
      },
    },
    {
      $project: {
        name: 1,
        image: 1,
        "Events.name": 1,
        "Events.date_day": 1,
        "Events.date_month": 1,
        "Events.date_year": 1,
        "Events.time": 1,
        "Events.description": 1,
        "Events._id": 1,
        "Events.Tag_Name": 1,
        UnseenChatCount: 1,
      },
    },
  ]);
}
