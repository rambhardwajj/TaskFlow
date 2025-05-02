import mongoose from "mongoose";
import { CustomError } from "./CustomError";
import { ResponseStatus } from "./constants";

export const extractUserField = (field: string) => {
  return {
    $arrayElemAt: [
      {
        $map: {
          input: {
            $filter: {
              input:  "$memberUsers",
              as: "memberUser",
              cond: { $eq: ["$$memberUser._id", "$$member.user"] },
            },
        },
          as: "user",
          in: `$$user.${field}`,
        },
      },
      0,
    ],
  };
};

export const validateObjectId= (id: string, idname: string): void =>{
  if( !mongoose.Types.ObjectId.isValid(id)){
    throw new CustomError(ResponseStatus.BadRequest, `Invalid ${idname} `)
  }
}