import NodeClam from "clamscan";

let clamScanPromise:
  Promise<NodeClam> | null = null;

const getClamScan = async () => {
  if (!clamScanPromise) {
    const host = process.env.CLAMAV_HOST;
    const port = Number(
      process.env.CLAMAV_PORT || 3310,
    );

    if (!host) {
      throw new Error(
        "CLAMAV_HOST belum dikonfigurasi",
      );
    }

    if (!Number.isInteger(port) || port <= 0) {
      throw new Error(
        "CLAMAV_PORT tidak valid",
      );
    }

    clamScanPromise = new NodeClam().init({
      clamdscan: {
        host,
        port,
        timeout: 60000,
        localFallback: false,
      },
    });
  }

  return clamScanPromise;
};

export const scanFileForMalware =
  async (filePath: string) => {
    const clamScan = await getClamScan();

    const { isInfected, viruses } =
      await clamScan.isInfected(filePath);

    if (isInfected) {
      throw new Error(
        `File terdeteksi mengandung malware: ${viruses.join(", ")}`,
      );
    }
  };