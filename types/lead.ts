import { z } from 'zod';
import { loggedUserSchema } from './auth';

export const createLeadSchema = z.object({
    id: z.string().optional(),

    name: z.string().min(3, "Name must be at least 3 characters long."),
    email: z.string().email("Invalid email address."),
    phone: z.string().min(10, "Please enter 10-digit valid Phone Numeber.").max(10, "Please enter 10-digit valid Phone Numeber.").refine((value) => {
        return /^\d+$/.test(value);
    }, {
        message: "Phone number must be a number."
    }),
    alternatePhone: z.string().optional(),
    address: z.string().min(10, "Address must be at least 10 characters long."),
    city: z.string().min(3, "City must be at least 3 characters long."),
    state: z.string().min(3, "State must be at least 3 characters long."),
    zip: z.string().min(6, "Zip code must be at least 6 characters long."),
    rating: z.number().int().optional(),

    vehicleDate: z.string(),
    vehicleName: z.string(),
    vehicleModel: z.string(),

});

export const leadSchema = createLeadSchema.extend({
    companyId: z.string(),
    deptId: z.string(),
    description: z.string(),
    LeadStatus: z.array(z.object({
        callStatus: z.string(),
        paymentStatus: z.string(),
        description: z.string(),
    })),
    LeadMember: z.array(z.object({
        Member: loggedUserSchema,
    })),
});

export const leadAssignToSchema = z.object({
    companyId: z.string().optional(),
    userIds: z.array(z.string().min(3, "User ID must be at least 3 characters long.")),
    deptId: z.string().optional(),

    leadIds: z.array(z.string()),
    description: z.string().optional(),
});

const FeedbackInputSchema = z.object({
    name: z.string(),
    fieldType: z.enum(['INPUT', 'TEXTAREA', 'RADIO', 'CHECKBOX']),
    value: z.string(),
});

export const SubmitFeedbackVariablesSchema = z.object({
    deptId: z.string(),
    leadId: z.string(),
    callStatus: z.enum(['BUSY', 'PENDING', 'SUCCESS']),
    paymentStatus: z.enum(['PENDING', 'PAID', 'FAILED']),
    feedback: z.array(FeedbackInputSchema),
});

export const leadBidSchema = z.object({
    bidAmount: z.string().min(1, "Bid amount must be greater than 0.").refine((value: any) => {
        return /^\d+$/.test(value);
    }, {
        message: "Bid amount must be a number."
    }),
    description: z.string().optional(),
});

export const leadBidsSchema = z.object({
    id: z.string(),
    description: z.string().optional(),
    bidAmount: z.number(),
    Member: loggedUserSchema,
});