export default async function handler(req, res) {
  const { country, postcode, house } = req.query;

  if (!country || !postcode || !house) {
    return res.status(400).json({ success: false, suggestions: [] });
  }

  try {
    const wpURL = `https://schlaftablette.net/wp-admin/admin-ajax.php?action=fetch_address_suggestions&house_number=${house}&postcode=${encodeURIComponent(
      postcode
    )}&country=${country}`;

    const response = await fetch(wpURL);
    const data = await response.json();

    return res.status(200).json({
      success: data.success,
      suggestions: data?.data?.suggestions || [],
    });
  } catch (e) {
    return res.status(500).json({ success: false, suggestions: [] });
  }
}
