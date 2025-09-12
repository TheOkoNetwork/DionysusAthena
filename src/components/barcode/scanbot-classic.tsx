'use client'

import { useEffect, useState, useRef, useCallback } from "react";
import ScanbotSDK from 'scanbot-web-sdk';
import type { IBarcodeScannerHandle } from 'scanbot-web-sdk/@types/interfaces/i-barcode-scanner-handle';
import useSound from 'use-sound';
import { GridLoader } from "react-spinners";
import { useLocalStorage } from "@uidotdev/usehooks";
import Select from 'react-select'

type AccessPoint = {
  id: string;
  name: string;
}

type ScanResults = {
  hasResult: boolean,
  acknowledgeRequired?: boolean,
  message?: string,
  status?: 'ACCEPTED' | 'REJECTED' | 'ATTENTION' | 'OFFLINE',
  ticketHolder?: string,
  product?: string,
  type?: string
}


function useTimeout(callback: () => void, delay: number) {
  const callbackRef = useRef(callback)
  const timeoutRef = useRef(setTimeout(() => function () { }, 0));
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])
  const set = useCallback(() => {
    timeoutRef.current = setTimeout(() => callbackRef.current(), delay)
  }, [delay])
  const clear = useCallback(() => {
    timeoutRef.current && clearTimeout(timeoutRef.current)
  }, [])
  useEffect(() => {
    set()
    return clear
  }, [delay, set, clear])
  const reset = useCallback(() => {
    clear()
    set()
  }, [clear, set])
  return { reset, clear }
}

export default function ScanbotClassicBarcodeScannerComponent() {
  const [scanbotSdk, setScanbotSdk] = useState<ScanbotSDK>();
  const scanbotScanner = useRef<IBarcodeScannerHandle>(null);
  const [barcodeValue, setBarcodeValue] = useState('');
  const [scanResults, setScanResults] = useState<ScanResults>({ hasResult: false });

  const [playScannedSfx] = useSound("/sounds/scan/scanned.wav");
  const [playAcceptedSfx] = useSound("/sounds/scan/accepted.wav");
  const [playRejectedSfx] = useSound("/sounds/scan/rejected.wav");
  const [playAttentionSfx] = useSound("/sounds/scan/attention.wav");
  const [playOfflineSfx] = useSound("/sounds/scan/offline.wav");

  const [accessPoints, setAccessPoints] = useState<AccessPoint[]>();
  const [selectedAccessPoint, setSelectedAccessPoint] = useLocalStorage<string>('selectedAccessPoint');
  const [isScannerVisible, setScannerVisible] = useState(false);
  const [scanAcknowledged, setScanAcknowledged] = useState(false);
  const [scannerLoading, setScannerLoading] = useState(false);
  const [topBarColour, setTopBarColour] = useState<string>('#000000');
  const [topBarMessage, setTopBarMessage] = useState<string>('Present ticket');

  const [previousScanBarcode, setPreviousScanBarcode] = useState<string>("");
  const { clear: clearTimeout, reset: resetTimeout } = useTimeout(function () {
    setPreviousScanBarcode('');
  }, 1500);

  const acknowledgeScan = () => {
    setScanAcknowledged(true);
    startScanner();
  };

  useEffect(() => {
    setScannerLoading(true);
    fetch('/api/request/GetAccessPoints').then(r => r.json()).then(function (accessPointsRes) {
      setScannerLoading(false);
      setAccessPoints(accessPointsRes);
    })
  }, []);

  useEffect(() => {
    if (!window) {
      return;
    }
    const init = async () => {
      const LICENSE_KEY =
      "lbeKBwflnPu1yqygUOwQlzrYLRPB+D" +
      "CX3I90LMfzxsHOfHeH9wG0pVEq2mZI" +
      "It4tHBg2z+Uq6ckEJkll81bLCaM1NN" +
      "w0/sfKmEOaS7CCPnJ+OEKLo1cjz0AD" +
      "2jkPwRpKZcTTepwTEXAMDbch2qDK8+" +
      "QPldoGoGeFQo5ekola5p9o2iwSgahi" +
      "sS1Kp3rAYMwT0wNvWqURTYCHseNBtH" +
      "HwLcnYGEj+pt5nCVbX2/5gnC8poseL" +
      "hUbBk7//PiXEPBmPslnsQbM8uJ6pc1" +
      "0r7XAu6/fx/q81Vga4hOI7Q5ENg28l" +
      "AGbeRhjIIwVgPMjtErqO2f2id71Smh" +
      "dVcBhpgFqEiQ==\nU2NhbmJvdFNESw" +
      "psb2NhbGhvc3R8bWFwZ3JvdXAuYXRo" +
      "ZW5hLmdiLmRpb255c3VzdGlja2V0aW" +
      "5nLmFwcAoxNzU4MDY3MTk5CjgzODg2" +
      "MDcKOA==\n";
      const sdk = await ScanbotSDK.initialize({
        licenseKey: LICENSE_KEY,
        enginePath: "/wasm/"
      });
      setScanbotSdk(sdk);
    };

    init();

    return () => {
      scanbotScanner.current?.dispose();
    };
  }, []);

  const startScanner = () => {
    setScannerVisible(true);
  };

  const closeScanner = () => {
    if (scanbotScanner.current) {
      scanbotScanner.current.dispose();
    }
    setScannerVisible(false);
  };

  useEffect(() => {
    if (isScannerVisible && scanbotSdk) {
      const initScanner = async () => {
        const configuration = {
          containerId: 'scanner-container',
          detectionParameters: {
            barcodeFormatConfigurations: [
              new ScanbotSDK.Config.BarcodeFormatCommonConfiguration({ formats: ["QR_CODE"] }),
            ]
          },
          onBarcodesDetected: (result: { barcodes: { format: string, text: string; }[]; }) => {
            if (!scanbotScanner.current) {
              return;
            }
            const text = result.barcodes[0].text;
            if (text == previousScanBarcode) {
              setBarcodeValue('ANTI DUPE');
              return true;
            };
            setBarcodeValue(text);
            clearTimeout();
            setPreviousScanBarcode(text);
            resetTimeout();
            setScanResults({
              hasResult: false
            });
            setScanAcknowledged(false);
            playScannedSfx();
            setScannerLoading(true);
            closeScanner();


            //Start validation API logic
            fetch('/api/request/ValidateTicket', {
              method: "POST",
              headers: {
                'Content-Type': 'Application/json',
              },
              body: JSON.stringify({
                barcode: text,
                access_point_id: selectedAccessPoint,
                scanning_engine: "SCANBOT_CLASSIC"
              })
            }).then(r => r.json()).then(function (validateResponse: ScanResults) {
              setScannerLoading(false);
              setScanResults(validateResponse);
              validateResponse.hasResult = true;
              switch (validateResponse.status) {
                case "ACCEPTED":
                  playAcceptedSfx();
                  setScannerLoading(false);
                  startScanner();
                  setTopBarColour("#00FF00");
                  setTopBarMessage("Valid for entry");
                  break;
                case "REJECTED":
                  playRejectedSfx();
                  setScannerLoading(false);
                  setTopBarColour("#FF0000");
                  setTopBarMessage("** DO NOT ACCEPT **");
                  break
                case "OFFLINE":
                  playOfflineSfx();
                  setScannerLoading(false);
                  setTopBarColour("#0000FF");
                  setTopBarMessage("** OFFLINE **");
                  break
                case "ATTENTION":
                default:
                  playAttentionSfx();
                  setScannerLoading(false);
                  setTopBarColour("#FFFF00");
                  setTopBarMessage("** ATTENTION **");
                  break
              };
            }).catch(function (error) {
              console.error(error);
              playRejectedSfx();
              setScannerLoading(false);
              setTopBarColour("#FF0000");
              setTopBarMessage("** API ERROR **");
              setScanResults({
                hasResult: true,
                acknowledgeRequired: true,
                message: `Network error processing scan`
              })
            })

            //End validation AI logic
          }
        };
        scanbotScanner.current = await scanbotSdk.createBarcodeScanner(configuration);
      };
      initScanner();
    }
  }, [isScannerVisible, scanbotSdk, previousScanBarcode, playScannedSfx, playOfflineSfx, playAcceptedSfx, playRejectedSfx, playAttentionSfx]);

  if (scannerLoading) {
    return (
      <div id="loading-screen" className="w-full h-full fixed block top-0 left-0 bg-black z-99999999">
        <div className="fixed inset-0 bg-black text-white flex flex-col">
          <div className="relative flex justify-center items-center text-white px-4 py-2">
            {/* <button onClick={closeScanner} className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold">✕</button> */}
            <span className="font-semibold">Loading</span>
          </div>
          <div className="flex-1 relative flex items-center justify-center">
            <GridLoader />
            {/* <div id="scanner-container" className="absolute inset-0" /> */}
          </div>
        </div>
      </div>
    )
  }


  if (scanResults.hasResult && scanResults.acknowledgeRequired && !scanAcknowledged) {
    return (
      <div id="loading-screen" className="w-full h-full fixed block top-0 left-0 bg-black z-99999999">
        <div className="fixed inset-0 bg-black text-white flex flex-col">
          <div className="relative flex justify-center items-center text-white px-4 py-2" style={{ backgroundColor: topBarColour }}>
            <button onClick={closeScanner} className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold">✕</button>
            <span className="font-semibold">{topBarMessage}</span>
          </div>

          <div className="text-center text-sm py-6">
            {scanResults.message && (<p>{scanResults.message}</p>)}
            {scanResults.product && (<p>{scanResults.product}</p>)}
            {scanResults.type && (<p>{scanResults.type}</p>)}
            {scanResults.ticketHolder && (<p>{scanResults.ticketHolder}</p>)}
            <button
              onClick={acknowledgeScan}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Acknoledge
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div id="loading-screen" className="w-full h-full fixed block top-0 left-0 bg-black z-99999999">

      {!isScannerVisible && accessPoints && (
        <div>
          <Select options={accessPoints} noOptionsMessage={() => "No access points ready for use"} placeholder="Select access point" value={accessPoints.find(ap => ap.id === selectedAccessPoint)} getOptionValue={(option) => option.id} getOptionLabel={(option) => option.name} onChange={(e) => setSelectedAccessPoint(e?.id || '')} />
        </div>
      )}


      {!isScannerVisible && selectedAccessPoint && (
        <div className="flex items-center justify-center h-full">
          <button
            onClick={startScanner}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Start Scanner
          </button>
        </div>
      )}

      {isScannerVisible && (
        <div className="fixed inset-0 bg-black text-white flex flex-col">
          <div className="relative flex justify-center items-center text-white px-4 py-2" style={{ backgroundColor: topBarColour }}>
            <button onClick={closeScanner} className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold">✕</button>
            <span className="font-semibold">{topBarMessage}</span>
          </div>
          <div className="flex-1 relative flex items-center justify-center">
            <div id="scanner-container" className="absolute inset-0" />
          </div>
          {scanResults.hasResult && (<div className="text-center text-sm py-6">
            {scanResults.message && (<p>{scanResults.message}</p>)}
            {scanResults.product && (<p>{scanResults.product}</p>)}
            {scanResults.type && (<p>{scanResults.type}</p>)}
            {scanResults.ticketHolder && (<p>{scanResults.ticketHolder}</p>)}
          </div>
          )
          }
        </div>
      )}
    </div>
  );
}
