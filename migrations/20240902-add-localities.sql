CREATE TABLE IF NOT EXISTS public."Localities"
(
    locality_id SERIAL PRIMARY KEY,
    city varchar NOT NULL,
    county varchar NOT NULL,
    county_auto varchar NOT NULL

);
