type NetworkInformation = {
  saveData?: boolean;
  effectiveType?: "slow-2g" | "2g" | "3g" | "4g";
};

/** Skip heavy media only when the user has data-saver enabled. */
export function shouldLoadHeroVideo(): boolean {
  if (typeof window === "undefined") return false;

  const conn = (navigator as Navigator & { connection?: NetworkInformation })
    .connection;
  if (conn?.saveData) return false;

  return true;
}
