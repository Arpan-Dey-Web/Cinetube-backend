import { ContentStatus, Role } from "../../generated/enums";



declare global {
  namespace Express {
    interface Request {
      user: IRequestUser;
    }
  }
}
