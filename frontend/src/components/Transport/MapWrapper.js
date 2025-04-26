import React, { useEffect, useState } from 'react';
import { MapContainer } from 'react-leaflet';

const MapWrapper = ({ children, ...props }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <MapContainer {...props}>{children}</MapContainer>;
};

export default MapWrapper;