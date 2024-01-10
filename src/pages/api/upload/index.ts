import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "4mb" // Set desired value here
    }
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const apiUrl =
    "https://api.cloudflare.com/client/v4/accounts/39aa4ea3c7a7d766adc4428933324787/images/v1";
  const token = "LpMNSFUw7gmxpn4ZZ7P2ZAcReF6Q-HlbIWqthbO0";

  if (req.method === "GET") {
    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        res.status(200).json(data);
      } else {
        const errorData = await response.json();
        res.status(response.status).json(errorData);
      }
    } catch (error) {
      res.status(500).json({ error: "An error occurred" });
    }
  } else if (req.method === "POST") {
    try {
      const file = req.body.file;
      res.status(200).send(file);
    } catch (error) {
      res.status(500).json({ error: "An error occurred" });
    }
  } else if (req.method === "DELETE") {
    // Handle DELETE logic here if needed
    res.status(405).json({ error: "Method not allowed" });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}