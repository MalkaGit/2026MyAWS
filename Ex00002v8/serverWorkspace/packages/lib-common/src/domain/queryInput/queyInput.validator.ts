//Goal:  query input validator  (reused by all entity services)
//Clean:
//  It stays independent of HTTP or DB.


import { BadRequestError } from "../errors/error.types";
import { DomainErrorCode } from "../errors/error.codes";
import { QueryInput } from "./queryInput.model";

export type FieldDependencyMap = Record<string, string[]>; 
// key = field name (domain) from fields or sort
// value = array of required includes for that field



/**
 * Generic validator for query inputs (fields, sort, include)
 * 
 * Responsibilities:
 * - Validate selected fields against allowed fields
 * - Validate sort fields against allowed sort fields
 * - Validate include values against allowed includes
 * - Enforce dependencies between fields/sort and includes
 */
export class QueryInputValidator {

    /**
     * Validate a QueryInput object
     * 
     * @param query - QueryInput from controller/service
     * @param allowedFields - Allowed fields for selection
     * @param allowedSortFields - Allowed fields for sorting
     * @param allowedIncludes - Optional: allowed related entities for include
     * @param dependencies - Optional: map of field/sort to required includes
     * @throws BadRequestError if validation fails
     */
    static validate(
      query: QueryInput | undefined,
      allowedFields: string[],
      allowedSortFields: string[],
      allowedIncludes?: string[],
      dependencies?: FieldDependencyMap
    ): void {
      const fields = query?.fields ?? [];
      const sort = query?.sort ?? [];
      const include = query?.include ?? [];
  
      // --- Validate fields ---
      for (const field of fields) {
        if (!allowedFields.includes(field)) {
          throw new BadRequestError(
            DomainErrorCode.QUERY_WITH_INVALID_FIELDS_VALUE,
            `Invalid field value: ${field}. Allowed fields: ${allowedFields.join(", ")}`
          );
        }
  
        if (dependencies?.[field]) {
          const missing = dependencies[field].filter(req => !include.includes(req));
          if (missing.length > 0) {
            throw new BadRequestError(
              DomainErrorCode.QUERY_WITH_MISSING_INCLUDE_VALUE,
              `Field "${field}" requires include: ${missing.join(", ")}`
            );
          }
        }
      }
  
      // --- Validate sort fields ---
      for (const s of sort) {
        const sortField = s.startsWith("-") ? s.slice(1) : s;
  
        if (!allowedSortFields.includes(sortField)) {
          throw new BadRequestError(
            DomainErrorCode.QUERY_WITH_INVALID_SORT_VALUE,
            `Invalid sort value: ${sortField}. Allowed sort fields: ${allowedSortFields.join(", ")}`
          );
        }
  
        if (dependencies?.[sortField]) {
          const missing = dependencies[sortField].filter(req => !include.includes(req));
          if (missing.length > 0) {
            throw new BadRequestError(
              DomainErrorCode.QUERY_WITH_MISSING_INCLUDE_VALUE,
              `Sorting by "${sortField}" requires include: ${missing.join(", ")}`
            );
          }
        }
      }
  
      // --- Validate includes ---
      if (allowedIncludes) {
        const invalidIncludes = include.filter(i => !allowedIncludes.includes(i));
        if (invalidIncludes.length > 0) {
          throw new BadRequestError(
            DomainErrorCode.QUERY_WITH_INVALID_INCLUDE_VALUE,
            `Invalid include values: ${invalidIncludes.join(", ")}. Allowed includes: ${allowedIncludes.join(", ")}`
          );
        }
      }
    }
  }