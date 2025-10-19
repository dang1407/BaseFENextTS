"use client";
import { NumberInput } from '@/components/custom/NumericInput';
import React, { Component, useState } from 'react'

export default function Page () {

    const [number, setNumber] = useState<number | undefined>(0);
    return (
      <div>
        Trang chủ
        <NumberInput className='text-right' value={number} onValueChange={(value) => setNumber(value)} />
      </div>
    )
}
