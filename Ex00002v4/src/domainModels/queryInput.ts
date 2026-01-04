//3.4
//Goal: query input
//      reused by all entities
//      reused for get page and get by id

export interface QueryInput {
    /**
     * get items\ get by id Field selection: array of field names to return
     * - Controls which fields (title/url/artistId) to return
     * - id is always returned, if exists in the entity(industry best practice)
     * - When omitted or empty, all fields are returned
     * - Example: ['title', 'url'] returns only title and url fields
     */
    fields?: string[];
  
    /**
     * Get items \ get by id Include related entities: array of relationship names to include
     * - When omitted or empty, no related entities are included
     * - Example: ['artist'] includes artist information
     * - Industry best practice: string array enables generic repository pattern
     */
    include?: string[];
    
    //paging (ignored by get all):
    //flat to simplify code
    limit?: number;             // max number of items to return
    offset?: number;            // number of items to skip
    
  
    /**
     * Get items Sorting (ignored by get all): 
     * array of field names with optional "-" prefix for descending order
     * - When omitted or empty, no sorting is applied (default order)
     * - Example: ['title', '-artistId'] sorts by title ascending, then artistId descending
     * - Query string format: ?sort=title,-artistId (comma-separated, parsed to array)
     * - Industry best practice: string array enables generic repository pattern
     */
    sort?: string[];
  }
  
  