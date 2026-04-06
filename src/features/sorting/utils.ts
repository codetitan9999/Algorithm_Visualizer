export function parseNumberList(input: string) {
  const tokens = input
    .split(/[\s,]+/)
    .map((token) => token.trim())
    .filter(Boolean);

  if (tokens.length === 0) {
    return {
      ok: false as const,
      error: "Add at least two comma-separated integers to visualize.",
    };
  }

  if (tokens.length > 32) {
    return {
      ok: false as const,
      error: "Keep the list to 32 values or fewer so the animation stays readable.",
    };
  }

  const values = tokens.map((token) => Number(token));
  if (values.some((value) => !Number.isFinite(value) || !Number.isInteger(value))) {
    return {
      ok: false as const,
      error: "Only whole numbers are supported right now.",
    };
  }

  if (values.some((value) => value < 0 || value > 120)) {
    return {
      ok: false as const,
      error: "Use integers between 0 and 120 for the clearest bar chart.",
    };
  }

  return {
    ok: true as const,
    values,
  };
}

export function formatNumberList(values: number[]) {
  return values.join(", ");
}

export function generateRandomList(size: number, maxValue: number) {
  return Array.from({ length: size }, () =>
    Math.floor(Math.random() * maxValue) + 1,
  );
}
