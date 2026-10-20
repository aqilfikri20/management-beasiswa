const requiredEnv = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} belum dikonfigurasi`);
  }

  return value;
};

export const services = {
  rbac: requiredEnv("RBAC_SERVICE_URL"),
  master: requiredEnv("MASTER_SERVICE_URL"),
  transaction: requiredEnv("TRANSACTION_SERVICE_URL"),
  document: requiredEnv("DOCUMENT_SERVICE_URL"),
};