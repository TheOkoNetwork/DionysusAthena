'use client'


import ScanbotSDK from 'scanbot-web-sdk/ui';
import { useEffect, useState, CSSProperties, useCallback, useRef } from "react";

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


import useSound from 'use-sound';
import Button from "@/components/ui/button/Button";
import Select from 'react-select'
import { GridLoader } from "react-spinners";
import { useLocalStorage } from "@uidotdev/usehooks";


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

export default function ScanbotBarcodeScannerComponent() {
  const [playScannedSfx] = useSound("/sounds/scan/scanned.wav");
  const [playAcceptedSfx] = useSound("/sounds/scan/accepted.wav");
  const [playRejectedSfx] = useSound("/sounds/scan/rejected.wav");
  const [playAttentionSfx] = useSound("/sounds/scan/attention.wav");
  const [playOfflineSfx] = useSound("/sounds/scan/offline.wav");

  const [accessPoints, setAccessPoints] = useState<AccessPoint[]>();
  const [selectedAccessPoint, setSelectedAccessPoint] = useLocalStorage<string>('selectedAccessPoint');
  const [topBarColour, setTopBarColour] = useState<string>('#000000');
  const [topBarMessage, setTopBarMessage] = useState<string>('Present ticket');
  const [scanResults, setScanResults] = useState<ScanResults>({ hasResult: false });
  const [resultsLoading, setResultsLoading] = useState<boolean>(false);
  const [scanAcknowledged, setScanAcknowledged] = useState<boolean>(false);
  const [scanDivClass, setScanDivClass] = useState<string>("");
  const [previousScanBarcode, setPreviousScanBarcode] = useState<string>("");
  const { clear: clearTimeout, reset: resetTimeout } = useTimeout(function () {
    setPreviousScanBarcode('');
  }, 1250);

  useEffect(() => {
    setResultsLoading(true);
    fetch('/api/request/GetAccessPoints').then(r => r.json()).then(function (accessPointsRes) {
      setResultsLoading(false);
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
      await ScanbotSDK.initialize({
        licenseKey: LICENSE_KEY,
        enginePath: "/wasm/"
      });
    };

    init();
  }, [window]);




  const acknowledgeScan = () => {
    setScanAcknowledged(true);
    startScanner({
      topBarText: topBarMessage,
      topBarColour: topBarColour,
      userGuidanceText: `
      ${scanResults.message}
      ${scanResults.product ? '-' : ''}${scanResults.product || ''}
      ${scanResults.type ? '-' : ''}${scanResults.type || ''}
      ${scanResults.ticketHolder ? '-' : ''}${scanResults.ticketHolder || ''}`
    })
  };


  const startScanner = async (options = {
    topBarColour: '#000000',
    topBarText: "Ticket Validation",
    userGuidanceText: "Position the ticket barcode within the finder"
  }) => {
    const config = new ScanbotSDK.UI.Config.BarcodeScannerScreenConfiguration();
    config.scannerConfiguration.barcodeFormats = ['QR_CODE'];
    config.sound.successBeepEnabled = false;
    config.vibration.enabled = true;

    config.topBar.backgroundColor = options?.topBarColour || "#000000";
    config.topBar.title.text = options?.topBarText || "Ticket validation";
    config.userGuidance.title.text = options?.userGuidanceText || "Position the ticket barcode within the finder";


    const result = await ScanbotSDK.UI.createBarcodeScanner(config);

    if (result && result.items.length > 0) {
      if (result.items[0].barcode.text == previousScanBarcode) {
        return startScanner({
          topBarColour: config.topBar.backgroundColor,
          topBarText: config.topBar.title.text,
          userGuidanceText: config.userGuidance.title.text
        })
      };
      clearTimeout();
      setPreviousScanBarcode(result.items[0].barcode.text);
      resetTimeout();

      playScannedSfx();
      setResultsLoading(true);
      setScanResults({
        hasResult: false
      });
      setScanAcknowledged(false);


      fetch('/api/request/ValidateTicket', {
        method: "POST",
        headers: {
          'Content-Type': 'Application/json',
        },
        body: JSON.stringify({
          barcode: result.items[0].barcode.text,
          access_point_id: selectedAccessPoint,
          scanning_engine: "SCANBOT"
        })
      }).then(r => r.json()).then(function (validateResponse: ScanResults) {
        setResultsLoading(false);
        setScanResults(validateResponse);
        validateResponse.hasResult = true;
        switch (validateResponse.status) {
          case "ACCEPTED":
            setTopBarColour("#00FF00");
            setTopBarMessage("Accepted!");
            setScanDivClass("bg-green-500");
            playAcceptedSfx();
            return startScanner({
              topBarText: "Accepted!",
              topBarColour: "#00FF00",
              userGuidanceText: `${validateResponse.message} ${validateResponse.product} ${validateResponse.type} ${validateResponse.ticketHolder}`
            });
            break;
          case "REJECTED":
            setTopBarColour("#FF0000");
            setTopBarMessage("**NOT VALID FOR ENTRY**");
            setScanDivClass("bg-red-500");
            playRejectedSfx();
            break
          case "OFFLINE":
            setTopBarColour("#0000FF");
            setTopBarMessage("**OFFLINE**");
            setScanDivClass("bg-blue-600");
            playOfflineSfx();
            break
          case "ATTENTION":
          default:
            setTopBarColour("#FFFF00");
            setTopBarMessage("**ATTENTION**");
            setScanDivClass("bg-yellow-300");
            playAttentionSfx();
            break
        };
      });
      return;
    }

    return result;
  }

  useEffect(() => {
    if (!selectedAccessPoint) {
      return;
    };
    if (!accessPoints || !accessPoints.length) {
      return;
    };

    const currentAccessPoint = accessPoints.find(f => f.id === selectedAccessPoint);
    if (!currentAccessPoint) {
      return setSelectedAccessPoint('');
    }
    startScanner({
      topBarText: currentAccessPoint.name,
      topBarColour: "#000000",
      userGuidanceText: "Present ticket"
    });
  }, [selectedAccessPoint, accessPoints]);

  if (resultsLoading) {
    return <GridLoader />
  }


  if (scanResults.hasResult && scanResults.acknowledgeRequired && !scanAcknowledged) {
    return (
      <>
        <div className={`${scanDivClass} text-center`}>
          {scanResults.status === 'ATTENTION' && (<p>*** ATTENTION ***</p>)}
          {scanResults.status === 'OFFLINE' && (<p>*** OFFLINE ***</p>)}
          {scanResults.status === 'REJECTED' && (<p>*** NOT VALID ***</p>)}
          {scanResults.message && (<p>{scanResults.message}</p>)}
          {scanResults.product && (<p>{scanResults.product}</p>)}
          {scanResults.type && (<p>{scanResults.type}</p>)}
          {scanResults.ticketHolder && (<p>{scanResults.ticketHolder}</p>)}
          <Button onClick={acknowledgeScan}>
            Acknowledge scan
          </Button>
        </div>
      </>
    )
  }


  return (
    <div>
      {accessPoints && (
        <div>
          <Select options={accessPoints} noOptionsMessage={() => "No access points ready for use"} placeholder="Select access point" value={accessPoints.find(ap => ap.id === selectedAccessPoint)} getOptionValue={(option) => option.id} getOptionLabel={(option) => option.name} onChange={(e) => setSelectedAccessPoint(e?.id || '')} />
        </div>
      )}

      {selectedAccessPoint && (
        <Button onClick={startScanner}>Start Scanner</Button>
      )}
    </div>
  );

}
