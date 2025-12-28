//7
/*
// services/sharedHelpers/GetAllValidator.ts

export interface GetAllQuery {
  pagination?: {
    limit?: number;
    offset?: number;
  };
  sort?: string; // Example: "title,-artistId"
  fields?: string[]; // Example: ["id", "title", "artistId"]
  include?: string[]; // Example: ["artist"]
}

export interface ValidatorConfig {
  allowedFields: string[];
  allowedSortFields: string[];
  allowedIncludes?: string[];
  defaultLimit?: number;
  maxLimit?: number;
}

export interface ValidatedQuery {
  pagination: {
    limit: number;
    offset: number;
  };
  sort: { field: string; direction: "ASC" | "DESC" }[];
  fields: string[];
  include: string[];
}

export function validateGetAllQuery(
  query: GetAllQuery,
  config: ValidatorConfig
): ValidatedQuery {
  // --- Pagination ---
  const limit = Math.min(
    query.pagination?.limit ?? config.defaultLimit ?? 50,
    config.maxLimit ?? 100
  );
  const offset = Math.max(query.pagination?.offset ?? 0, 0);

  // --- Sort ---
  const sort: { field: string; direction: "ASC" | "DESC" }[] = [];
  if (query.sort) {
    query.sort.split(",").forEach((fieldRaw) => {
      const direction: "ASC" | "DESC" = fieldRaw.startsWith("-") ? "DESC" : "ASC";
      const field = fieldRaw.replace(/^-/, "");
      if (!config.allowedSortFields.includes(field)) {
        throw new Error(`Invalid sort field: ${field}`);
      }
      sort.push({ field, direction });
    });
  }

  // --- Fields ---
  const fields = query.fields?.filter((f) => config.allowedFields.includes(f)) ?? config.allowedFields;

  // --- Includes ---
  const include = query.include?.filter((f) =>
    config.allowedIncludes?.includes(f)
  ) ?? [];

  return {
    pagination: { limit, offset },
    sort,
    fields,
    include,
  };
}

*/