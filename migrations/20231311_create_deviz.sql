CREATE TABLE IF NOT EXISTS public."Deviz"
(
    deviz_id SERIAL PRIMARY KEY,
    auto_fleet_id BIGINT,
    partner_id BIGINT,
    date DATE NOT NULL DEFAULT (now() AT TIME ZONE 'utc'),
    denumire VARCHAR NOT NULL,
    pret BIGINT NOT NULL,
    infos VARCHAR,
    currency VARCHAR,
    FOREIGN KEY (auto_fleet_id) REFERENCES Public."AutoFleet"(auto_fleet_id),
    FOREIGN KEY (partner_id) REFERENCES Public."Partner"(partner_id),
    CHECK (
        (auto_fleet_id IS NOT NULL AND partner_id IS NULL) OR 
        (auto_fleet_id IS NULL AND partner_id IS NOT NULL)
    )
);