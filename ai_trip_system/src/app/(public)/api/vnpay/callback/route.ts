import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// VNPay configuration
const VNP_HASH_SECRET = process.env.VNP_HASHSECRET || "your_hash_secret";

function sortObject(obj: Record<string, string>) {
  const sorted: Record<string, string> = {};
  const keys = Object.keys(obj).sort();
  keys.forEach((key) => {
    sorted[key] = obj[key];
  });
  return sorted;
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const vnpParams: Record<string, string> = {};

    // Extract all VNPay parameters from query string
    for (const [key, value] of url.searchParams.entries()) {
      vnpParams[key] = value;
    }

    // Extract signature
    const secureHash = vnpParams.vnp_SecureHash;
    delete vnpParams.vnp_SecureHash;
    delete vnpParams.vnp_SecureHashType;

    // Sort parameters
    const sortedParams = sortObject(vnpParams);

    // Create query string for signature verification
    const signData = new URLSearchParams(sortedParams).toString();

    // Generate HMAC SHA512 signature
    const hmac = crypto.createHmac("sha512", VNP_HASH_SECRET);
    const signature = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    console.log("VNPay callback received:", vnpParams);
    console.log("Signature verification:", signature === secureHash);

    // Verify signature
    if (signature !== secureHash) {
      console.error("VNPay signature verification failed");
      return NextResponse.redirect(
        new URL("/booking?payment=failed&error=signature", request.url)
      );
    }

    // Check payment status
    const responseCode = vnpParams.vnp_ResponseCode;
    const transactionStatus = vnpParams.vnp_TransactionStatus;

    if (responseCode === "00" && transactionStatus === "00") {
      // Payment successful
      console.log("VNPay payment successful:", vnpParams.vnp_TxnRef);
      return NextResponse.redirect(
        new URL("/booking?payment=success&vnp_ResponseCode=00", request.url)
      );
    } else {
      // Payment failed
      console.log("VNPay payment failed:", responseCode, transactionStatus);
      return NextResponse.redirect(
        new URL(
          `/booking?payment=failed&vnp_ResponseCode=${responseCode}`,
          request.url
        )
      );
    }
  } catch (error) {
    console.error("Error processing VNPay callback:", error);
    return NextResponse.redirect(
      new URL("/booking?payment=failed&error=processing", request.url)
    );
  }
}

export async function POST(request: NextRequest) {
  // Handle POST callback from VNPay (IPN - Instant Payment Notification)
  return GET(request);
}
