-- Request codes read PG-1001, PG-1002, … rather than PG-1.
-- setval keeps any existing numbers unique: next value is max(1001, current max + 1).
SELECT setval(
  pg_get_serial_sequence('trip_requests', 'number'),
  GREATEST(1000, COALESCE((SELECT MAX("number") FROM "trip_requests"), 0)),
  true
);
