import { z } from "zod"
 
export const signupFormSchema = z.object({
    name: z.string().min(3, 'Please enter your name.'),
    email: z.string().min(3, 'Please enter your email.').email('The email address is badly formatted.'),
    password: z.string().min(3, 'Please enter your password.').min(8, 'Your password must have 8 characters or more.'),
    phone: z.string().length(10, 'Please enter a valid phone number.'),

    roleId: z.string().optional(),
    deptId: z.string().optional(),
    companyId: z.string().optional(),

    companyName: z.string().min(3 , "Please the Company Name"),
    companyAddress: z.string().min(3 , "Please the Company Address"),
    companyPhone: z.string().min(3 , "Please the Company Phone Number"),
    companyEmail: z.string().min(3 , "Please the Company Email Address").email("Please enter a valid email address"),

})