import { rc4Encrypt } from "./encrypt.js";
import { v4 as uuidv4 } from "uuid";

export async function createPaymentForm({
  orderId,
  amount,
  currency,
  customerEmail,
  customerName,
  description,
}) {
  const fullOrderId = \`ORDER_\${orderId || uuidv4()}_\${Date.now()}\`;

  const xml = \`
<order>
  <signature>\${process.env.NETOPIA_SIGNATURE}</signature>
  <order_id>\${fullOrderId}</order_id>
  <confirm_url>https://www.musicgift.ro/api/payment/webhook</confirm_url>
  <return_url>https://www.musicgift.ro/api/payment/return</return_url>
  <invoice>
    <amount>\${amount}</amount>
    <currency>\${currency}</currency>
    <details>\${description}</details>
  </invoice>
  <billing>
    <type>person</type>
    <first_name>\${customerName}</first_name>
    <email>\${customerEmail}</email>
  </billing>
</order>\`.trim();

  const encrypted = rc4Encrypt(xml, process.env.NETOPIA_PUBLIC_KEY);

  return {
    netopiaOrderId: fullOrderId,
    paymentUrl: process.env.NETOPIA_TEST_MODE === "true"
      ? "https://sandboxsecure.mobilpay.ro"
      : "https://secure.mobilpay.ro",
    formData: encrypted,
  };
}
