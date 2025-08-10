"use client";

import dynamic from "next/dynamic"
import { useState } from "react";
const BarcodeScanner = dynamic(
  () => import("react-qr-barcode-scanner"),
  { ssr: false }
)

export default function BarcodeScannerComponent() {
    const [data, setData] = useState("Not Found");

    return (
      <>
        <BarcodeScanner
          width={500}
          height={500}
          onUpdate={(err, result) => {
            if (result) setData(result.getText());
            else setData("Not Found");
          }}
        />
        <p>{data}</p>
      </>
    );
}
