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
