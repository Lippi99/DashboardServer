import { Request, Response } from "express";
import moment from "moment";
import { UserModel } from "../model/User";


interface DateFilter {
  createdAt?: any;
  total: number;
}

export class Dashboard {
  async filter(req: Request, res: Response) {
    const endingDate = new Date(req.query.endingDate as string);

    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate());
    const user = await UserModel.aggregate<DateFilter>([
      {
        $match: {
          createdAt: {
            $gt: endingDate,
            $lt: currentDate,
          },
        },
      },
    ]);

    if (user.length == 0) {
      res.status(404).json({ user: "not found" });
     
    } else {
      user.sort((a, b) => b.createdAt - a.createdAt);
      const countedData = user.reduce(
        (acc: any, { createdAt }, index, array) => {
          const date = moment(createdAt).format("L");
          acc[`${date}`] = {
            date,
            total: (acc[`${date}`] ? acc[`${date}`].total : 0) + 1,
        
          };
          return index === array.length - 1 ? Object.values(acc) : acc;
        },
        {}
      );
      res.status(200).json(countedData);
    }
  }

  async gender(req: Request, res: Response) {
    const user = await UserModel.find({});
    const countedData = user.reduce(
      (acc: any, { gender }, index, array) => {
       
        acc[`${gender}`] = {
          gender,
          total: (acc[`${gender}`] ? acc[`${gender}`].total : 0) + 1,
      
        };
        return index === array.length - 1 ? Object.values(acc) : acc;
      },
      {}
    );
  
    res.status(200).send(countedData);
  }
}
