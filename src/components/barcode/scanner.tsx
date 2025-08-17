'use client'


import { useState, useEffect } from "react";
import { useZxing } from "react-zxing";
import useSound from 'use-sound';
import { useMediaDevices } from "react-media-devices";
import Button from "@/components/ui/button/Button";
import Select from 'react-select'


type ScanResults = {
  hasResult: boolean,
  acknowledgeRequired?: boolean,
  message?: string,
  status?: 'ACCEPTED' | 'REJECTED' | 'ATTENTION' | 'OFFLINE',
  ticketHolder?: string,
  product?: string,
  type?: string
}

type AccessPoint = {
  id: string;
  name: string;
}
export default function BarcodeScannerComponent() {
  const [scanResults, setScanResults] = useState<ScanResults>({ hasResult: false });
  const [scanAcknowledged, setScanAcknowledged] = useState<boolean>(false);
  const [accessPoints, setAccessPoints] = useState<[AccessPoint]>();
  const [selectedAccessPoint, setSelectedAccessPoint] = useState<string>();

  const [scannerStatus, setScannerStatus] = useState<string>("Loading");
  const [scanDivClass, setScanDivClass] = useState<string>("");
  const [data, setData] = useState<string>("");
  const [scannerActive, setScannerActive] = useState<boolean>(true);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(undefined);
  const [playScannedSfx] = useSound("/sounds/scan/scanned.wav");
  const [playAcceptedSfx] = useSound("/sounds/scan/accepted.wav");
  const [playRejectedSfx] = useSound("/sounds/scan/rejected.wav");
  const [playAttentionSfx] = useSound("/sounds/scan/attention.wav");
  const [playOfflineSfx] = useSound("/sounds/scan/offline.wav");
  const constraints: MediaStreamConstraints = {
    video: true,
    audio: false,
  };
  const { devices } = useMediaDevices({ constraints });

  const acknowledgeScan = () => {
    setScanAcknowledged(true);
    const currentSelectedDeviceId = JSON.parse(JSON.stringify(selectedDeviceId));
    setSelectedDeviceId('');
    setTimeout(function () {
      setSelectedDeviceId(currentSelectedDeviceId);
    }, 250);
  };

  const accessPointSelectionMade = (accessPointId: string) => {
    setSelectedAccessPoint(accessPointId);
    setScannerStatus(selectedDeviceId ? 'Ready for scan' : 'Pending device selection');
  }
  const { ref } = useZxing({
    paused: !selectedDeviceId && !scannerActive,
    deviceId: selectedDeviceId,
    onDecodeResult(result) {
      if (!selectedAccessPoint) {
        return;
      }
      if (!scannerActive) {
        return;
      }
      setScannerActive(false);
      setScannerStatus("Processing scan");
      setScanResults({
        hasResult: false
      });
      setScanAcknowledged(false);
      setData(result.getText());
      setScanDivClass("");
      playScannedSfx();
      //post request to validate ticket /api/request/ValidateTicket
      fetch('/api/request/ValidateTicket', {
        method: "POST",
        headers: {
          'Content-Type': 'Application/json',
        },
        body: JSON.stringify({
          barcode: result.getText(),
          access_point_id: selectedAccessPoint
        })
      }).then(r => r.json()).then(function (validateResponse: ScanResults) {
        validateResponse.hasResult  = true;
        setScanResults(validateResponse);
          switch (validateResponse.status) {
            case "ACCEPTED":
              setScanDivClass("bg-green-500");
              playAcceptedSfx();
              break;
              case "REJECTED":
              setScanDivClass("bg-red-500");
              playRejectedSfx();
              break
              case "ATTENTION":
              setScanDivClass("bg-yellow-300");
              playAttentionSfx();
              break
              case "OFFLINE":
              setScanDivClass("bg-blue-600");
              playOfflineSfx();
              break
            default:
              case "ATTENTION":
              setScanDivClass("bg-yellow-300");
              playAttentionSfx();
              break;
          };

          setScannerStatus("Ready for next scan");
          setScannerActive(true);
          const currentSelectedDeviceId = JSON.parse(JSON.stringify(selectedDeviceId));
          setSelectedDeviceId('');
          setTimeout(function () {
            setSelectedDeviceId(currentSelectedDeviceId);
          }, 250);
      }).catch(function (error) {
        console.log(error);
        setScannerStatus("*ERROR*");
        setScanDivClass("bg-red-500");
        setScanResults({
          hasResult: true,
          message: "Error submitting scan for validation",
          acknowledgeRequired: true,
          status: 'REJECTED'
        })
        playRejectedSfx();
      })
    },
  });



  useEffect(() => {
    fetch('/api/request/GetAccessPoints').then(r => r.json()).then(function (accessPointsRes) {
      setAccessPoints(accessPointsRes);
    })

  }, []);



  // Set the default selected device when the devices are loaded
  useEffect(() => {
    if (selectedDeviceId || scannerStatus === 'Camera initialization in progress') {
      return;
    }
    if (devices && devices.length > 0 && !selectedDeviceId) {
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      if (videoDevices.length > 0) {
        if (!selectedDeviceId) {
          setScannerStatus(selectedAccessPoint ? 'Camera initialization in progress' : 'Pending access point selection');
          setSelectedDeviceId(videoDevices[0].deviceId);
          setTimeout(function () {
            setScannerStatus(selectedAccessPoint ? 'Camera initialization in progress' : 'Pending access point selection');
            setSelectedDeviceId('');
          }, 250);
          setTimeout(function () {
            setSelectedDeviceId(videoDevices[0].deviceId);
            setScannerStatus(selectedAccessPoint ? 'Ready for scan' : 'Pending access point selection');
          }, 500)
        };
      } else {
        setScannerStatus("No video devices found");
      }
    } else {
      setScannerStatus("No devices found");
    }
  }, [devices, selectedDeviceId, selectedAccessPoint, scannerStatus]);



  if (!accessPoints) {
    return <div>Loading access points...</div>;
  }
  if (!scannerActive) {
    return <div className={scanDivClass}>{scannerStatus}</div>;
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
    <>
      {scanResults.hasResult && (
        <div className={`${scanDivClass} text-center`}>
          {scanResults.status === 'ATTENTION' && (<p>*** ATTENTION ***</p>)}
          {scanResults.status === 'OFFLINE' && (<p>*** OFFLINE ***</p>)}
          {scanResults.status === 'REJECTED' && (<p>*** NOT VALID ***</p>)}
          {scanResults.message && (<p>{scanResults.message}</p>)}
          {scanResults.product && (<p>{scanResults.product}</p>)}
          {scanResults.type && (<p>{scanResults.type}</p>)}
          {scanResults.ticketHolder && (<p>{scanResults.ticketHolder}</p>)}
        </div>
      )}

      <div className={scanDivClass}>
        {/* <Button onClick={toggleTorchActive}>
        {torchActive ? "Turn torch off" : "Turn torch on"}
      </Button> */}
        {accessPoints && (
          <div>
            <Select options={accessPoints} noOptionsMessage={() => "No access points ready for use"} placeholder="Select access point" value={accessPoints.find(ap => ap.id === selectedAccessPoint)} getOptionValue={(option) => option.id} getOptionLabel={(option) => option.name} onChange={(e) => accessPointSelectionMade(e?.id || '')} />
          </div>
        )}

        {selectedAccessPoint && (<div>

          <Select options={devices
            ?.filter(device => device.kind === 'videoinput')} noOptionsMessage={() => "No cameras found"} placeholder="Select camera" value={devices?.find(device => device.deviceId === selectedDeviceId)} getOptionValue={(option) => option.deviceId} getOptionLabel={(option) => option.label || `Camera ${option.deviceId}`} onChange={(e) => setSelectedDeviceId(e?.deviceId || '')} />
        </div>
        )}

        <p>{scannerStatus}</p>
        {selectedAccessPoint && (<video ref={ref}
          width={Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)}
        />)}


        {/* <BarcodeScanner
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
      /> */}
        <p>{data}</p>
      </div>
    </>
  );
}
