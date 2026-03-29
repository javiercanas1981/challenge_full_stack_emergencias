import { z } from "zod";

export const createPersonSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format"),
  dateOfBirth: z.string().min(1, "dateOfBirth is required"),
  phones: z
    .array(
      z.object({
        id: z.number().optional(),
        number: z.string().min(1, "Phone number is required"),
        phoneType: z.object({
          id: z.number(),
          typeName: z.string(),
        }),
      }),
    )
    .optional(),
  addresses: z
    .array(
      z.object({
        id: z.number().optional(),
        street: z.string().min(1, "Street is required"),
        locality: z.string().min(1, "Locality is required"),
        number: z.number(),
        notes: z.string().min(1).optional(),
      }),
    )
    .optional(),
});

export const updatePersonSchema = z.object({
  id: z.number(),
  firstName: z.string().min(1, "firstName is required"),
  lastName: z.string().min(1, "lastName is required"),
  email: z.string().email("Invalid email format"),
  dateOfBirth: z.string().min(1, "dateOfBirth is required"),
  phones: z
    .array(
      z.object({
        id: z.number().optional(),
        number: z.string().min(1, "Phone number is required"),
        phoneType: z.union([
          z.string(),
          z.object({
            id: z.number(),
            typeName: z.string(),
          }),
        ]),
      }),
    )
    .optional(),
  addresses: z
    .array(
      z.object({
        id: z.number().optional(),
        street: z.string().min(1),
        locality: z.string().min(1),
        number: z.number(),
        notes: z.string().optional(),
      }),
    )
    .optional(),
});
