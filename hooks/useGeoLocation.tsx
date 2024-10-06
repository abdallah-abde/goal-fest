"use client";

import { useEffect, useState } from "react";

export default function useGeoLocation() {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    country: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }
    const getLocation = () => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const geoData = await response.json();
          const country = geoData.countryName;
          //   const city = geoData.city;

          setLocation({ latitude, longitude, country });
          setLoading(false);
        },
        (error) => {
          setError(`Error occurred: ${error.message}`);
          setLoading(false);
        }
      );
    };

    getLocation();
  }, []);

  return { location, loading, error };
}
