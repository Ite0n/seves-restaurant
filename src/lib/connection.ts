type NetworkInformation = {
  saveData?: boolean;
  effectiveType?: "slow-2g" | "2g" | "3g" | "4g";
};

/** Skip heavy media on data-saver or very slow connections. */
export function shouldLoadHeroVideo(): boolean {
  if (typeof window === "undefined") return false;

  const conn = (navigator as Navigator & { connection?: NetworkInformation })
    .connection;
  if (!conn) return true;
  if (conn.saveData) return false;

  return conn.effectiveType !== "slow-2g" && conn.effectiveType !== "2g";
}
