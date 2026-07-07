"use client";

import { useEffect, useState } from "react";
import { getApplications } from "@/services/careerService";
import CareerTable from "@/components/careers/CareerTable";

export default function CareersPage() {

  const [applications, setApplications] = useState([]);


  const loadData = async () => {
    try {

      const res = await getApplications();

    //  console.log("API RESPONSE:", res.data);

      setApplications(res.data.data || []);

    } catch (error) {

      console.log(error);

    }
  };


  useEffect(() => {
    loadData();
  }, []);


  return (
    <CareerTable
      data={applications}
      reload={loadData}
    />
  );
}