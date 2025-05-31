export default async function handler(req, res) {
  const rawBody = await new Promise(resolve => {
    let data = "";
    req.on("data", chunk => (data += chunk));
    req.on("end", () => resolve(data));
  });

  // Decrypt and verify webhook (future enhancement)
  console.log("Received NETOPIA IPN:", rawBody);

  res.status(200).send("OK");
}
