import { ContentStatus, Role } from "../generated/enums";

export interface IRequestUser {
    id: string;
    email: string;
    name: string;
    role: Role;
    contentStatus: ContentStatus;
    isBlocked: boolean;
    image?: string | null;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
  }