"use client"
import { trpc } from '@/trpc/client';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

interface PageProps{
    orderEmail : string;
    orderId : string;
    isPaid : boolean;
}

const PaymentStatus = ({orderEmail, orderId, isPaid}: PageProps) => {

    const router = useRouter()

    const {data} = trpc.payment.pollOrderStatus.useQuery({orderId}, {
        enabled : isPaid === false,
        refetchInterval : (data)=>(data?.isPaid ? false : 1000)
    })

    useEffect(()=>{
        if(data?.isPaid) router.refresh()
    },[data?.isPaid, router])

  return (
    <div className='mt-16 grid grid-cols-2 gap-x-4 text-sm text-gray-600'>
    <div>
      <p className='font-medium text-gray-900'>
        Shipping To
      </p>
      <p>{orderEmail}</p>
    </div>
    <div>
        <p className='font-medium text-gray-900'>
            Order Status
        </p>
        <p>
          {isPaid ? 'Payment Successfull' : 'Pending Payment'}  
        </p>
    </div>
    </div>
)
}

export default PaymentStatus