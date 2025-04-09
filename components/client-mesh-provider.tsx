"use client";

import { MeshProvider } from "@meshsdk/react";
import React from "react";

export default function MeshProviderClient({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return <MeshProvider>{children}</MeshProvider>;
}