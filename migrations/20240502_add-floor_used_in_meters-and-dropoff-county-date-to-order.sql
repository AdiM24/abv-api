ALTER TABLE public."Order" ADD COLUMN floor_used_in_meters real DEFAULT 0;
ALTER TABLE public."Order" ADD COLUMN dropoff_county varchar;
ALTER TABLE public."Order" ADD COLUMN dropoff_date DATE;