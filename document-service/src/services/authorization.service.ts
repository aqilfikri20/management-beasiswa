const transactionServiceUrl =
  process.env.TRANSACTION_SERVICE_URL;

const internalServiceKey =
  process.env.INTERNAL_SERVICE_KEY;

export const checkRegistrationAccess =
  async (
    registrationId: number,
    userId: number,
  ): Promise<boolean> => {
    if (!transactionServiceUrl) {
      throw new Error(
        "TRANSACTION_SERVICE_URL belum dikonfigurasi",
      );
    }

    if (!internalServiceKey) {
      throw new Error(
        "INTERNAL_SERVICE_KEY belum dikonfigurasi",
      );
    }

    const response = await fetch(
      `${transactionServiceUrl}/internal/registrations/${registrationId}/access?userId=${userId}`,
      {
        method: "GET",
        headers: {
          "X-Internal-Service-Key":
            internalServiceKey,
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Transaction Service mengembalikan status ${response.status}`,
      );
    }

    const data = (await response.json()) as {
      allowed?: boolean;
    };

    return data.allowed === true;
  };