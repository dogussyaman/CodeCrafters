import { z } from "zod"

/**
 * Şifre validasyonu için regex pattern
 * En az 8 karakter, büyük harf, küçük harf ve sayı içermeli
 */
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&._-]{8,}$/

/**
 * Email validasyonu için regex pattern
 */
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Telefon numarası validasyonu için regex pattern (Türkiye formatı)
 * +90 ile başlayan veya 0 ile başlayan formatlar kabul edilir
 */
const phoneRegex = /^(\+90|0)?[5][0-9]{9}$/

/**
 * Kayıt formu validasyon şeması
 */
export const signUpSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Ad soyad en az 2 karakter olmalıdır")
      .max(100, "Ad soyad en fazla 100 karakter olabilir")
      .regex(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, "Ad soyad sadece harf içerebilir"),
    email: z
      .string()
      .min(1, "E-posta adresi gereklidir")
      .email("Geçerli bir e-posta adresi giriniz")
      .regex(emailRegex, "Geçerli bir e-posta formatı giriniz"),
    password: z
      .string()
      .min(8, "Şifre en az 8 karakter olmalıdır")
      .regex(passwordRegex, "Şifre en az bir büyük harf, bir küçük harf ve bir sayı içermelidir"),
    repeatPassword: z.string().min(1, "Şifre tekrarı gereklidir"),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["repeatPassword"],
  })

/**
 * Giriş formu validasyon şeması
 */
export const signInSchema = z.object({
  email: z
    .string()
    .min(1, "E-posta adresi gereklidir")
    .email("Geçerli bir e-posta adresi giriniz"),
  password: z.string().min(1, "Şifre gereklidir"),
})

/**
 * İletişim formu validasyon şeması
 */
export const contactFormSchema = z.object({
  ad: z
    .string()
    .min(2, "Ad en az 2 karakter olmalıdır")
    .max(100, "Ad en fazla 100 karakter olabilir"),
  email: z
    .string()
    .min(1, "E-posta adresi gereklidir")
    .email("Geçerli bir e-posta adresi giriniz"),
  konu: z.string().min(1, "Lütfen bir konu seçiniz"),
  mesaj: z
    .string()
    .min(10, "Mesaj en az 10 karakter olmalıdır")
    .max(5000, "Mesaj en fazla 5000 karakter olabilir"),
})

/**
 * Telefon numarası validasyon şeması
 */
export const phoneSchema = z
  .string()
  .optional()
  .refine(
    (val) => {
      if (!val || val.length === 0) return true
      return phoneRegex.test(val.replace(/\s/g, ""))
    },
    {
      message: "Geçerli bir telefon numarası giriniz (örn: +905551234567 veya 05551234567)",
    }
  )

/**
 * Şifre unutma formu validasyon şeması
 */
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "E-posta adresi gereklidir")
    .email("Geçerli bir e-posta adresi giriniz")
    .regex(emailRegex, "Geçerli bir e-posta formatı giriniz"),
})

/**
 * Şifre sıfırlama formu validasyon şeması
 */
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Şifre en az 8 karakter olmalıdır")
      .regex(passwordRegex, "Şifre en az bir büyük harf, bir küçük harf ve bir sayı içermelidir"),
    repeatPassword: z.string().min(1, "Şifre tekrarı gereklidir"),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["repeatPassword"],
  })

/**
 * Şifre değiştirme formu validasyon şeması (giriş yapmış kullanıcılar için)
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Mevcut şifre gereklidir"),
    newPassword: z
      .string()
      .min(8, "Yeni şifre en az 8 karakter olmalıdır")
      .regex(passwordRegex, "Yeni şifre en az bir büyük harf, bir küçük harf ve bir sayı içermelidir"),
    repeatPassword: z.string().min(1, "Şifre tekrarı gereklidir"),
  })
  .refine((data) => data.newPassword === data.repeatPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["repeatPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "Yeni şifre mevcut şifre ile aynı olamaz",
    path: ["newPassword"],
  })

export type SignUpFormValues = z.infer<typeof signUpSchema>
export type SignInFormValues = z.infer<typeof signInSchema>
export type ContactFormValues = z.infer<typeof contactFormSchema>
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>