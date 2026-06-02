export function parseNumberList(input: string) {
  const tokens = input
    .split(/[\s,]+/)
    .map((token) => token.trim())
    .filter(Boolean);

  if (tokens.length === 0) {
    return {
      ok: false as const,
      error: "Add at least one integer to search through.",
    };
  }

  if (tokens.length > 32) {
    return {
      ok: false as const,
      error: "Keep the list to 32 values or fewer so the search steps stay readable.",
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
      error: "Use integers between 0 and 120 for the clearest visualization.",
    };
  }

  return {
    ok: true as const,
    values,
  };
}

export function parseTarget(input: string) {
  const value = Number(input.trim());

  if (!input.trim()) {
    return {
      ok: false as const,
      error: "Enter a target value to search for.",
    };
  }

  if (!Number.isFinite(value) || !Number.isInteger(value)) {
    return {
      ok: false as const,
      error: "The target must be a whole number.",
    };
  }

  if (value < 0 || value > 120) {
    return {
      ok: false as const,
      error: "Use a target between 0 and 120.",
    };
  }

  return {
    ok: true as const,
    value,
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

export function generateSearchExample(size: number, maxValue: number) {
  const values = generateRandomList(size, maxValue);
  const target = values[Math.floor(Math.random() * values.length)] ?? 1;

  return {
    values,
    target,
  };
}
