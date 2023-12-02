ALTER TABLE public."Deviz" ADD COLUMN cota_tva BIGINT DEFAULT 19;
ALTER TABLE public."Deviz" RENAME COLUMN pret TO pret_fara_tva;
ALTER TABLE public."Deviz" ADD COLUMN tva DECIMAL;