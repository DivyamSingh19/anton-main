import z from "zod";

const userProfileSchema = z.object({
  bio: z
    .string()
    .min(20, "Bio can not be less than 20 characters")
    .max(500, "Bio can not be more than 500 characters"),
});

const engineerProfileSchema = z.object({
  bio: z
    .string()
    .min(20, "Bio can not be less than 20 characters")
    .max(500, "Bio can not be more than 500 characters"),
});

const adminProfileSchema = z.object({
  bio: z
    .string()
    .min(20, "Bio can not be less than 20 characters")
    .max(500, "Bio can not be more than 500 characters"),
});

const organizationProfileSchema = z.object({
  bio: z
    .string()
    .min(20, "Bio can not be less than 20 characters")
    .max(500, "Bio can not be more than 500 characters"),
});

export {
  userProfileSchema,
  engineerProfileSchema,
  adminProfileSchema,
  organizationProfileSchema,
};
