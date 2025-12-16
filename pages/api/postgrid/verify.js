export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    // req.body is already an object — convert it properly
    const body = new URLSearchParams(req.body).toString();

    const response = await fetch(
      "https://api.postgrid.com/v1/intl_addver/verifications?geoData=true&includeDetails=true",
      {
        method: "POST",
        headers: {
          "x-api-key": process.env.POSTGRID_KEY,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      }
    );

    const data = await response.json();

    // PostGrid error handling
    if (!data?.data?.summary?.verificationStatus) {
      return res.status(400).json({
        success: false,
        message: "PostGrid verification failed",
        raw: data,
      });
    }

    return res.status(200).json({
      success: true,
      data: data.data, // pass full verified address
    });
  } catch (err) {
    console.error("PostGrid verify error:", err);
    return res.status(500).json({
      success: false,
      message: "PostGrid verification error",
    });
  }
}
