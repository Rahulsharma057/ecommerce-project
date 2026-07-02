import { API_URL } from "@/lib/api";
import { useEffect, useState } from "react";

export function useAddresses() {
  const [addresses, setAddresses] = useState([]);

  const fetchAddresses = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${API_URL}/users/addresses`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    setAddresses(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  return { addresses, fetchAddresses, setAddresses };
}