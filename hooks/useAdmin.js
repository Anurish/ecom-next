import { useEffect, useState } from "react";

export default function useAdmin() {
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) setAdmin(data.user);
        else window.location.href = "/admin/login";
      })
      .finally(() => setLoading(false));
  }, []);

  return { admin, loading };
}
