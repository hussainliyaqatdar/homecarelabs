"use client";
import { useEffect } from "react";
import { injectContentsquareScript } from "@contentsquare/tag-sdk";

export function Contentsquare() {
  useEffect(() => {
    injectContentsquareScript({ clientId: "1bdb5c95ad7d3" });
  }, []);
  return null;
}
