import { API_URL } from "@/lib/api";


export const getPaymentSettings = async()=>{

 const res = await fetch(
 `${API_URL}/payment/settings`
 );

 const data = await res.json();

 return data;

};



export const updatePaymentSettings = async(payload)=>{

 const token = localStorage.getItem("token");


 const res = await fetch(
 `${API_URL}/payment/settings`,
 {
 method:"PUT",
 headers:{
 "Content-Type":"application/json",
 Authorization:`Bearer ${token}`
 },
 body:JSON.stringify(payload)
 }
 );


 const data = await res.json();

 return data;

};