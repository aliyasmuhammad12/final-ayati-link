import { useEffect, useRef } from "react";
import QRCode from "qrcode";

interface QrGeneratorProps {
  url: string;
  onClose: () => void;
}


const QrGenerator = ({ url, onClose }: QrGeneratorProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        url,
        {
          width: 250,
          margin: 1,
          color: {
            dark: "#000",
            light: "#fff",
          },
        },
        (error?: Error | null) => {
          if (error) console.error("Error generating QR code:", error);
        }
      );
    }
  }, [url]);

  return (
    <div className="flex flex-col items-center">
      <div className="bg-white p-4 rounded-lg mb-4">
        <canvas ref={canvasRef} className="mx-auto"></canvas>
      </div>
      <p className="text-center mb-4 text-sm break-all">{url}</p>
      <button onClick={onClose} className="border border-gray-300 py-2 px-4 rounded">
        Fermer
      </button>
    </div>
  );
};

export default QrGenerator;