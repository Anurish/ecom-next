export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { country, type = "crypto" } = req.query;

  if (!country) {
    return res.status(400).json({ message: "Country is required" });
  }

  try {
    const ezdashUrl =
      `https://prod2api.ezdash.online/api/v1/payment/stripe-publish-key` +
      `?country=${encodeURIComponent(country)}&type=${encodeURIComponent(type)}`;

    const ezdashRes = await fetch(ezdashUrl, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    });

    if (!ezdashRes.ok) {
      const text = await ezdashRes.text();
      console.error("Ezdash API error:", text);
      return res.status(500).json({ message: "Ezdash API failed" });
    }

    const data = await ezdashRes.json();

    /**
     * IMPORTANT:
     * We pass-through the response exactly as received
     * so frontend logic does not need changes.
     */
    res.status(200).json(data);

  } catch (error) {
    console.error("Shipping proxy error:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}
