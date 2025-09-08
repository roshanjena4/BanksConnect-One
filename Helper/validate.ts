import { z } from 'zod'

export const UpdateFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long.' })
    .trim(),
  email: z
    .string()
    .email({ message: 'Please enter a valid email.' })
    .max(50, { message: 'Email must be at most 50 characters long.' })
    .trim(),
  password: z
    .string()
    .min(5, { message: 'Be at least 5 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Contain at least one special character.',
    })
    .trim(),
})
export const UpdateFormSchemalogin = z.object({

  email: z
    .string()
    .email({ message: 'Please enter a valid email.' })
    .max(50, { message: 'Email must be at most 50 characters long.' })
    .trim(),
  password: z
    .string()
    .min(5, { message: 'Be at least 5 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Contain at least one special character.',
    })
    .trim(),
})
export const FormSchemaTransfer = z.object({
  email: z
    .string()
    .email({ message: 'Please enter a valid email.' })
    .max(50, { message: 'Email must be at most 50 characters long.' })
    .trim()
    .nullable(),
  amount: z.string({ message: 'Please enter a valid amount.' }).trim().min(1).max(10),
  description: z.string({ message: 'Please enter a valid description.' }).trim().min(2).max(100).optional(),
})

export const FormSchemaCreateUser = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long.' })
    .max(100, { message: 'Name must be at most 100 characters long.' })
    .trim(),
  email: z
    .string()
    .email({ message: 'Please enter a valid email.' })
    .max(50, { message: 'Email must be at most 50 characters long.' })
    .trim(),
  password: z
    .string()
    .min(5, { message: 'Be at least 5 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, { message: 'Contain at least one special character.' })
    .trim()
    .nullable(),
  phone: z.string().min(10, { message: 'Phone must be 10 characters long' }).max(10, { message: 'Phone must be 10 characters long' }).trim(),
  role: z.string().min(2, { message: 'must select one role' }),
  status: z.string().min(2, { message: 'must select one status' })
})

export const FormSchemaCreateBank = z.object({
  bankName: z
    .string()
    .min(2, { message: 'Bank name must be at least 2 characters long.' })
    .max(100, { message: 'Bank name must be at most 100 characters long.' })
    .trim(),
  bankCode: z
    .string()
    .min(2, { message: 'Bank code must be at least 2 characters long.' })
    .max(10, { message: 'Bank code must be at most 10 characters long.' })
    .trim(),
  bankAddress: z
    .string()
    .min(5, { message: 'Bank location must be at least 5 characters long.' })
    .max(200, { message: 'Bank location must be at most 200 characters long.' })
    .trim(),
  bankEmail: z
    .string()
    .email({ message: 'Please enter a valid email.' })
    .max(50, { message: 'Email must be at most 50 characters long.' })
    .trim(),
})

export const FormSchemaCreateCard = z.object({
  cardType: z.string().min(2, { message: 'Please select a card type.' }),
  expiry: z.string().min(3, { message: 'Please select an expiry date.' }),
  cardStatus: z.string().min(2, { message: 'Please select a status.' }),
  accountNumber: z.string().min(2, { message: 'Please select an account number.' }),
})

export const FormSchemaCreateAccount = z.object({
  userid: z.string().min(2, { message: 'Please select an account owner.' }),
  bankid: z.string().min(1, { message: 'Please select a bank.' }),
  accounttype: z.string().min(2, { message: 'Please select an account type.' }),
  balance: z.string().min(2, { message: 'Please add an account balance.' }),
})


export const FormSchemaConnectBank = z.object({
  bankName: z.string().min(2, { message: 'Bank name must be at least 2 characters long.' }).max(100, { message: 'Bank name must be at most 100 characters long.' }).trim(),
  bankCode: z.string().min(2, { message: 'Bank code must be at least 2 characters long.' }).max(5, { message: 'Bank code must be at most 5 characters long.' }).trim(),
  bankAddress: z.string().min(5, { message: 'Bank location must be at least 5 characters long.' }).max(100, { message: 'Bank location must be at most 100 characters long.' }).trim(),
  bankEmail: z.string().email({ message: 'Please enter a valid email.' }).max(50, { message: 'Email must be at most 50 characters long.' }).trim(),
  accountHolderName: z.string().min(2, { message: 'Please enter a valid account holder name.' }).max(100, { message: 'Account holder name must be at most 100 characters long.' }).trim(),
  accountNumber: z.string().min(2, { message: 'Please enter a valid account number.' }).max(100, { message: 'Account number must be at most 100 characters long.' }).trim(),
  accountType: z.string().min(2, { message: 'Please select an account type.' }).max(20, { message: 'Account type must be at most 20 characters long.' }).trim(),
  amount: z.string().min(1, { message: 'Please enter an amount.' }).max(10, { message: 'Amount must be at most 10 characters long.' }).trim(),
  cardNumber: z.string().min(16, { message: 'Please enter a valid card number.' }).max(19, { message: 'Card number must be at most 19 characters long.' }).trim(),
  expirationDate: z.string().min(3, { message: 'Please enter a valid expiration date.' }).max(5, { message: 'Expiration date must be at most 5 characters long.' }).trim(),
  cvv: z.string().min(3, { message: 'Please enter a valid cvv.' }).max(4, { message: 'Cvv must be at most 4 characters long.' }).trim(),
  cardType: z.string().min(2, { message: 'Please select a card type.' }).max(20, { message: 'Card type must be at most 20 characters long.' }).trim(),
})