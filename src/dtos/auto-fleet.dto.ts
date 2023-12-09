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
  max_weight_in_tons: number;
  net_weight_in_tons: number;
  stationary_hour: number;
  work_hour: number;
  car_type: string;
}
