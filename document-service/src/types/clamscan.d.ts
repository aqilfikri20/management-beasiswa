declare module "clamscan" {
  interface ClamdscanOptions {
    host?: string;
    port?: number;
    timeout?: number;
    localFallback?: boolean;
  }

  interface ClamScanOptions {
    clamdscan?: ClamdscanOptions;
  }

  interface ScanResult {
    isInfected: boolean;
    viruses: string[];
  }

  export default class NodeClam {
    init(options?: ClamScanOptions): Promise<NodeClam>;

    isInfected(
      filePath: string,
    ): Promise<ScanResult>;
  }
}