'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const password = formData.get('password') as string
  console.log('[lab/login] LAB_PASSWORD set:', !!process.env.LAB_PASSWORD, '| length:', process.env.LAB_PASSWORD?.length)
  console.log('[lab/login] LAB_TOKEN set:', !!process.env.LAB_TOKEN)
  if (password && password === process.env.LAB_PASSWORD) {
    const jar = await cookies()
    jar.set('lab_session', process.env.LAB_TOKEN ?? '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    })
    redirect('/lab')
  }
  redirect('/lab/login?error=1')
}
