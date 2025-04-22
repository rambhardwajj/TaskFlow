
import { Request, Response, NextFunction, RequestHandler } from "express";

const asyncHandler =( handler:(req: Request, res: Response, next: NextFunction)=>Promise<any>): 
  RequestHandler =>
  (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
};
export { asyncHandler };

// //-----------------------------------------------------------------------------

// import { NextFunction } from "express";

// function asyncHandler(requestHandler: Function) {
//     return function(req: Request, res: Response, next: NextFunction) {
//         Promise.resolve(requestHandler(req, res, next))
//         .catch( next)
//     };
// }
// export { asyncHandler };