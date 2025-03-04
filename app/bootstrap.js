// app/bootstrap.js
"use client"; // This makes it a Client Component

import { useEffect } from 'react';

export default function BootstrapClient() {
  useEffect(() => {
    // Import Bootstrap JavaScript only on client-side
    require('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  return null;
}