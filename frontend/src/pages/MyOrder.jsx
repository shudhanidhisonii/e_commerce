import OrderCard from '@/components/OrderCard'
import React, { useState, useEffect } from "react"
import axios from 'axios'



const MyOrder = () => {


    const [userOrder,setUserOrder]= useState(null)
    const getUserOrders = async()=>{
        const accessToken= localStorage.getItem("accessToken")
        console.log("TOKEN:", accessToken)
        const res= await axios.get(`${import.meta.env.VITE_URL}/api/v1/orders/myorder`,{
            headers:{
                Authorization:`Bearer ${accessToken}`
            }
        })
        if(res.data.success){
setUserOrder(res.data.orders)
        }
    }

useEffect(()=>{
    getUserOrders()
},[])

  return (
    <>
    <OrderCard userOrder={userOrder} />
    </>
  )
}

export default MyOrder
