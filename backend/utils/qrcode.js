import QRCode from 'qrcode';

export const generateQRCode = async (url) => {
  try {
    const qr = await QRCode.toDataURL(url);
    return qr;
  } catch (err) {
    throw new Error('QR generation failed');
  }
};
