export interface CreateAutoFleetDto {
  partner_id: number;
  model: string;
  vin: string;
  reg_no: string;
  vignette_ro?: string;
  itp?: string;
  cmr_insurance?: string;
  rca?: string;
  carbon_copy?: string;
  casco?: string;
  vignette_hu?: string;
  vignette_slo?: string;
}