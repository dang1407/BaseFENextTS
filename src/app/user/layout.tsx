import { LeftMenu } from '@/components/custom/LeftMenu';
import React from 'react'

export default function UserRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='flex'>
      <LeftMenu />
      <div className='flex-1 p-4'>
        {children}
      </div>
    </div>
  )
}
