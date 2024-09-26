import OwnerModel from "@/model/Owner";
import mongoose from "mongoose";

export async function getTagsInfoFromEventsAggregate(ownerId: string) {
  return await OwnerModel.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(ownerId),
      },
    },
    {
      $lookup: {
        from: "tagitems",
        localField: "_id",
        foreignField: "church",
        as: "Tags_Item",
      },
    },
    {
      $project: {
        _id: 0,
        "Tags_Item._id": 1,
        "Tags_Item.name": 1,
      },
    },
  ]);
}

export async function GetEventsInfoForOwnerAggregate(
  ownerId: string,
  month: number
) {
  return await OwnerModel.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(ownerId),
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
                    { $eq: ["$date_month", month] },
                    { $eq: ["$date_year", new Date().getFullYear()] },
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
          {
            $addFields: {
              Tag_Id: "$Tag_Info._id",
            },
          },
        ],
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
        "Events.description": 1,
        "Events.time": 1,
        "Events._id": 1,
        "Events.Tag_Name": 1,
        "Events.Tag_Id": 1,
      },
    },
  ]);
}

export async function GetEventsInfoForPeopleAggregate(
  ownerId: string,
  peopleId: string,
  month: number
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
                        $redact: {
                          $cond: {
                            if: {
                              $and: [
                                { $eq: ["$date_month", month] },
                                {
                                  $eq: ["$date_year", new Date().getFullYear()],
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
      $project: {
        name: 1,
        image: 1,
        "Events.name": 1,
        "Events.date_day": 1,
        "Events.date_month": 1,
        "Events.date_year": 1,
        "Events.description": 1,
        "Events.time": 1,
        "Events._id": 1,
        "Events.Tag_Name": 1,
      },
    },
  ]);
}

export async function GetTagsPeoplesInfo(ownerId: string, tagId: string) {
  return await OwnerModel.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(ownerId),
      },
    },
    {
      $lookup: {
        from: "tagitems",
        localField: "_id",
        foreignField: "church",
        as: "Tag_Item",
        pipeline: [
          {
            $match: {
              _id: new mongoose.Types.ObjectId(tagId),
            },
          },
          {
            $lookup: {
              from: "tagjoineds",
              localField: "_id",
              foreignField: "tag_item",
              as: "Tag_Joined",
              pipeline: [
                {
                  $lookup: {
                    from: "peoples",
                    localField: "people",
                    foreignField: "_id",
                    as: "People_Info",
                  },
                },
                {
                  $addFields: {
                    People_Info: {
                      $first: "$People_Info",
                    },
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
        isTagExist: {
          $cond: {
            if: {
              $in: [new mongoose.Types.ObjectId(tagId), "$Tag_Item._id"],
            },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $addFields: {
        Tag_Item: {
          $first: "$Tag_Item",
        },
      },
    },
    {
      $addFields: {
        People_Info: "$Tag_Item.Tag_Joined.People_Info",
      },
    },

    {
      $project: {
        _id: 0,
        name: 1,
        "People_Info.email": 1,
        "People_Info.name": 1,
        isTagExist: 1,
      },
    },
  ]);
}
