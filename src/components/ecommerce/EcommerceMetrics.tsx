"use client";
import React, { useState, useEffect } from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, BoxIconLine, GroupIcon } from "@/icons";


export const EcommerceMetrics = () => {
  const [totalCustomerCount, setTotalCustomerCount] = useState(0);
  // const [totalCustomerCountIncrease, setTotalCustomerCountIncrease] = useState(0);

  useEffect(() => {
    fetch('/api/request/GetCustomersCount').then(r => r.json()).then(function (countResult) {
      setTotalCustomerCount(countResult.count);
    })

    const intervalId = setInterval(() => {
      // setTotalCustomerCountIncrease(parseFloat(percentageIncrease.toFixed(2)));
      fetch('/api/request/GetCustomersCount').then(r => r.json()).then(function (countResult) {
        setTotalCustomerCount(countResult.count);
      })
    }, 5000); // Call every 5000 milliseconds

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, []);



  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Customers
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {totalCustomerCount.toLocaleString()}
            </h4>
          </div>
          {/* {totalCustomerCountIncrease > 0 && (
            <Badge color="success">
              <ArrowUpIcon />
              {totalCustomerCountIncrease}%
            </Badge>
          )} */}
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Orders
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              5,359
            </h4>
          </div>

          <Badge color="error">
            <ArrowDownIcon className="text-error-500" />
            9.05%
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
};
