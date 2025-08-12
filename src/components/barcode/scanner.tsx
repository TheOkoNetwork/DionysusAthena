"use client";

import dynamic from "next/dynamic"
import Button from "@/components/ui/button/Button"
import { useState } from "react";
import { BarcodeStringFormat } from "react-qr-barcode-scanner"

const BarcodeScanner = dynamic(
  () => import("react-qr-barcode-scanner"),
  { ssr: false }
)

import useSound from 'use-sound';


export default function BarcodeScannerComponent() {
  const [data, setData] = useState("Not Found");

  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  // const [torchActive, setTorchActive] = useState<boolean>(false);
  const [scannerActive, setScannerActive] = useState<boolean>(true);


  const [playScannedSfx] = useSound("/sounds/scan/scanned.wav");
  const [playAcceptedSfx] = useSound("/sounds/scan/accepted.wav");
  const [playRejectedSfx] = useSound("/sounds/scan/rejected.wav");
  const [playAttentionSfx] = useSound("/sounds/scan/attention.wav");
  const [playOfflineSfx] = useSound("/sounds/scan/offline.wav");


  const toggleFacingMode = () => {
    setFacingMode(facingMode === "environment" ? "user" : "environment");
  };
  // const toggleTorchActive = () => {
  //   setTorchActive(!torchActive);
  // };

  if (!scannerActive) {
    return "Scanner not active."
  }
  return (
    <>
      <Button onClick={toggleFacingMode}>
        {facingMode === "user" ? "Switch to back camera" : "Switch to front camera"}
      </Button>
      {/* <Button onClick={toggleTorchActive}>
        {torchActive ? "Turn torch off" : "Turn torch on"}
      </Button> */}


      <BarcodeScanner
        width={Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)}
        height={500}
        facingMode={facingMode}
        // torch={Boolean(torchActive)}
        formats={[BarcodeStringFormat.QR_CODE]}
        onUpdate={(err, result) => {
          if (result) {
            setScannerActive(false);
            setData(result.getText())
            playScannedSfx();
            setTimeout(function () {
              playRejectedSfx();
            }, 1000);

            setTimeout(function () {
              playAcceptedSfx();
            }, 3000)

            setTimeout(function () {
              playAttentionSfx();
            }, 6000)

            setTimeout(function () {
              playOfflineSfx();
            }, 9000)
          } else {
            setData("Not Found");
          };
        }}
      />
      <p>{data}</p>
    </>
  );
}
