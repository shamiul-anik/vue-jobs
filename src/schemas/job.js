import { z } from "zod";

export const jobSchema = z.object({
  type: z.enum(["Full-Time", "Part-Time", "Remote", "Internship"], {
    errorMap: () => ({ message: "Please select a valid job type" }),
  }),
  title: z
    .string()
    .min(3, "Job title must be at least 3 characters")
    .max(50, "Job title cannot exceed 50 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  salary: z.string().min(1, "Please select a salary range"),
  location: z
    .string()
    .min(2, "Location must be at least 2 characters")
    .max(60, "Location cannot exceed 60 characters"),
  company_name: z
    .string()
    .min(3, "Company name must be at least 3 characters")
    .max(50, "Company name cannot exceed 50 characters"),
  company_description: z
    .string()
    .min(10, "Company description must be at least 10 characters"),
  contact_email: z.string().email("Please enter a valid email address"),
  contact_phone: z.string().optional(),
});
