import { Request, Response } from "express";
import moment from "moment";
import { UserModel } from "../model/User";

interface DateFilter {
  createdAt?: any;
  total: number;
}

export class Dashboard {
  async filter(req: Request, res: Response) {
    try {
      const endingDateStr = req.query.endingDate as string;
      const endingDate = new Date(endingDateStr);

      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      const userCounts = await UserModel.aggregate([
        { $match: { createdAt: { $gte: endingDate, $lte: currentDate } } },
        {
          $group: {
            _id: { $dateToString: { format: "%d/%m/%Y", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: -1 } },
      ]);

      const formattedCounts = userCounts
        .map(({ _id, count }) => ({
          date: _id,
          total: count,
        }))
        .sort((a, b) => {
          const dateA: Date = new Date(a.date.split("/").reverse().join("/"));
          const dateB = new Date(b.date.split("/").reverse().join("/"));
          return Number(dateA) - Number(dateB);
        });

      res.json(formattedCounts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async gender(req: Request, res: Response) {
    try {
      const allGenders = await UserModel.aggregate([
        {
          $group: {
            _id: "$gender",
            total: {
              $sum: 1,
            },
          },
        },
        { $project: { _id: 0, gender: "$_id", total: 1 } },
        {
          $sort: {
            total: -1,
          },
        },
      ]);
      res.send(allGenders);
    } catch (error) {}
  }
}
