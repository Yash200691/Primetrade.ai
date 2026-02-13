/**
 * Validation middleware using Zod schemas
 * Validates request body, params, and query against provided schema
 * @param {Object} schema - Zod schema object
 * @returns {Function} Express middleware
 */
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query
  });

  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.flatten().fieldErrors
    });
  }

  next();
};
