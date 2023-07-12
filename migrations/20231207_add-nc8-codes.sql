CREATE TABLE IF NOT EXISTS public."Nc8Code"
(
    nc8_code_id SERIAL PRIMARY KEY,
    code varchar NOT NULL,
    description varchar NOT NULL

);

ALTER TABLE public."Product" ADD COLUMN nc8_code_id integer;
ALTER TABLE public."Product"
    ADD CONSTRAINT Product_Nc8_Code_fk FOREIGN KEY (nc8_code_id) REFERENCES public."Nc8Code" (nc8_code_id);
