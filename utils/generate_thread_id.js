import crypto from "crypto";

// Function to generate a secure random 16-digit number
export const generateThreadId = () => {
  // Convert 8 bytes (64 bits) of random data to a base-10 number and then trim it to 16 digits
  const randomBuffer = crypto.randomBytes(8);
  const threadId = BigInt(`0x${randomBuffer.toString("hex")}`)
    .toString()
    .slice(0, 16);
  return threadId;
};
