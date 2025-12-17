import { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import './EventQRCode.css';

interface EventQRCodeProps {
  eventId: string;
  eventName: string;
  eventDate: string;
}

const EventQRCode = ({ eventId, eventName, eventDate }: EventQRCodeProps) => {
  const qrRef = useRef<HTMLDivElement>(null);

  // Generate QR code data - this could be a URL to check-in page or event details
  const qrData = JSON.stringify({
    eventId,
    eventName,
    eventDate,
    checkInUrl: `${window.location.origin}/events/${eventId}/check-in`
  });

  const handleDownload = () => {
    if (!qrRef.current) return;

    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    // Convert SVG to canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      
      // Download as PNG
      canvas.toBlob((blob) => {
        if (!blob) return;
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${eventName.replace(/\s+/g, '-')}-QRCode.png`;
        link.click();
        URL.revokeObjectURL(link.href);
      });
      
      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const qrElement = qrRef.current?.querySelector('svg');
    if (!qrElement) return;

    const svgData = new XMLSerializer().serializeToString(qrElement);
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Event QR Code - ${eventName}</title>
          <style>
            body {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              padding: 2rem;
            }
            .qr-container {
              text-align: center;
              page-break-inside: avoid;
            }
            h1 {
              margin: 0 0 1rem 0;
              font-size: 2rem;
            }
            .event-info {
              margin: 1rem 0 2rem 0;
              color: #666;
            }
            svg {
              max-width: 400px;
              max-height: 400px;
            }
            .instructions {
              margin-top: 2rem;
              padding: 1rem;
              background: #f0f0f0;
              border-radius: 8px;
              max-width: 500px;
            }
            @media print {
              body { padding: 1rem; }
              .instructions { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <h1>${eventName}</h1>
            <div class="event-info">
              <p>Event Check-in QR Code</p>
              <p>${new Date(eventDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}</p>
            </div>
            ${svgData}
            <div class="instructions">
              <p><strong>Instructions:</strong></p>
              <p>Scan this QR code at the event entrance to check in attendees.</p>
            </div>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <div className="event-qr-code">
      <div className="qr-code-container" ref={qrRef}>
        <QRCodeSVG
          value={qrData}
          size={256}
          level="H"
          includeMargin={true}
          bgColor="#ffffff"
          fgColor="#000000"
        />
      </div>
      <div className="qr-code-info">
        <h3>Entrance QR Code</h3>
        <p>Use this QR code for attendee check-in at the event entrance</p>
      </div>
      <div className="qr-code-actions">
        <button className="btn btn-secondary" onClick={handleDownload}>
          📥 Download QR Code
        </button>
        <button className="btn btn-secondary" onClick={handlePrint}>
          🖨️ Print QR Code
        </button>
      </div>
    </div>
  );
};

export default EventQRCode;
