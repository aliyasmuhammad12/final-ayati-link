import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";

interface QrScannerProps {
  onResult: (result: string) => void;
  onClose: () => void;
}

export default function QrScanner({ onResult, onClose }: QrScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let qrCodeScanner: import("html5-qrcode").Html5Qrcode | null = null;

    const startScanner = async () => {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        qrCodeScanner = new Html5Qrcode("qr-reader");
        setIsScanning(true);

        await qrCodeScanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 250 },
          (decodedText) => {
            onResult(decodedText);
            stopScanner();
          },
          (errorMessage) => {
            console.warn("QR scan error:", errorMessage);
          }
        );
      } catch (err) {
        console.error("Error starting scanner:", err);
        setError("Cannot access the camera. Check permissions.");
        setIsScanning(false);
      }
    };

    const stopScanner = async () => {
      if (qrCodeScanner && isScanning) {
        try {
          await qrCodeScanner.stop();
        } catch (err) {
          console.error("Error stopping scanner:", err);
        }
        setIsScanning(false);
      }
    };

    if (!isScanning) startScanner();

    return () => {
      if (qrCodeScanner) stopScanner();
    };
  }, [onResult, isScanning]);

  return (
    <div className="flex flex-col items-center">
      <div id="qr-reader" className="w-full max-w-sm h-64 mb-4"></div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <Button onClick={onClose} variant="outline">
        Fermer
      </Button>
    </div>
  );
}
