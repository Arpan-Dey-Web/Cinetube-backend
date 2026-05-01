import { z } from "zod";

const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    phone: z.string().min(5).optional(),
    address: z.string().min(3).optional(),
    image: z.string().url().or(z.literal("")).optional(),
  }),
});

export const UserValidation = {
  updateProfileSchema,
};
