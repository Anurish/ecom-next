export default async function handler(req, res) {
  const { address } = req.query;
  if (!address) return res.status(400).json({ success: false });

  try {
    const wpURL = `https://schlaftablette.net/wp-admin/admin-ajax.php?action=fetch_address_details&address=${encodeURIComponent(address)}`;
    const wpRes = await fetch(wpURL);
    const wpData = await wpRes.json();

    return res.status(200).json({
      success: wpData.success,
      street: wpData.data?.street || "",
      city: wpData.data?.city || "",
    });

  } catch (error) {
    console.log("PostGrid Details Error", error);
    return res.status(500).json({ success: false });
  }
}
