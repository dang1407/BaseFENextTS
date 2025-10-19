"use client"
import { LeftMenu } from '@/components/custom/LeftMenu'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react'

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryClientProvider client={new QueryClient()}>

      <div className='flex min-h-screen w-100'>
        <LeftMenu />
        <div className='flex-1 p-4'>
          {children}
        </div>
      </div>
    </QueryClientProvider>
  )
}

