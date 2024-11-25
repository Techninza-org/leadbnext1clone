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

    vehicleDate: z.date(),
    vehicleName: z.string(),
    vehicleModel: z.string(),
    department: z.string().optional(),

});

export const leadSchema = createLeadSchema.extend({
    companyId: z.string(),
    deptId: z.string(),
    description: z.string(),
    callStatus: z.string(),
    nextFollowUpDate: z.date(),
    paymentStatus: z.string(),
    createdAt: z.any(),
    isLeadApproved: z.boolean(),
    isLeadConverted: z.boolean(), // prospect only
    LeadMember: z.array(z.object({
        Member: loggedUserSchema,
    })),
    LeadFeedback: z.array(z.object({
        id: z.string(),
        memberId: z.string(),
        member: loggedUserSchema,
        imageUrls: z.array(z.string().optional()),
        feedback: z.array(z.object({
            id: z.string(),
            name: z.string(),
            fieldType: z.string(),
            value: z.string(),
        })),
    })),
    bids: z.array(z.object({
        id: z.string(),
        bidAmount: z.number(),
        description: z.string().optional(),
        bidStatus: z.string().optional(),
        Member: loggedUserSchema,
    })),
});

export const groupedLeadSchema = z.object({
    formName: z.string(),
    feedback: z.array(z.object({
        name: z.string(),
        value: z.string(),
    })),
});

export const companyLeadSchema = z.object({
    lead: z.array(leadSchema),
    groupedLeads: z.array(groupedLeadSchema),
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
    nextFollowUpDate: z.date().optional(),
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
    lead: leadSchema, 
    Member: loggedUserSchema,
});

export const financerBidApprovalSchema = z.object({
    leadId: z.string(),
    leadFinanceStatus: z.string().optional(),
});