/**
 * queryValidator middleware
 * Only allow SELECT statements – blocks DDL / DML for sandbox safety.
 */
const FORBIDDEN = /\b(INSERT|INTO|UPDATE|DELETE|DROP|ALTER|CREATE|TRUNCATE|GRANT|REVOKE|EXEC|EXECUTE|COPY|LOAD|SET|PERFORM|CALL|DO)\b/i;

// Block dangerous PG server-side functions
const PG_DANGEROUS_FN = /\b(pg_read_file|pg_read_binary_file|pg_ls_dir|pg_stat_file|lo_import|lo_export|pg_sleep|dblink|current_setting)\s*\(/i;

const validateQuery = (req, res, next) => {
  const { sql } = req.body;

  if (!sql || typeof sql !== 'string') {
    return res.status(400).json({ error: 'SQL query is required.' });
  }

  const trimmed = sql.trim();
  if (trimmed.length === 0) {
    return res.status(400).json({ error: 'SQL query cannot be empty.' });
  }

  // Block multiple statements (semicolons followed by non-whitespace)
  if (/;\s*\S/.test(trimmed)) {
    return res.status(403).json({ error: 'Multiple statements are not allowed.' });
  }

  // Must start with SELECT (after optional whitespace / comments)
  const cleaned = trimmed.replace(/\/\*[\s\S]*?\*\//g, '').replace(/--.*$/gm, '').trim();
  if (!/^SELECT\b/i.test(cleaned)) {
    return res.status(403).json({ error: 'Only SELECT queries are allowed in the sandbox.' });
  }

  // Extra guard: block dangerous keywords inside sub-queries etc.
  if (FORBIDDEN.test(cleaned)) {
    return res.status(403).json({ error: 'Query contains forbidden operations.' });
  }

  // Block dangerous PG functions
  if (PG_DANGEROUS_FN.test(cleaned)) {
    return res.status(403).json({ error: 'Query contains disallowed functions.' });
  }

  // Attach sanitised SQL to request
  req.sanitizedSQL = trimmed;
  next();
};

module.exports = validateQuery;
