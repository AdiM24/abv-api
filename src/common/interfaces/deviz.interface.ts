import { Model } from "sequelize";

export interface IDeviz extends Model {
    deviz_id: number;
    auto_fleet_id?: number;
    partner_id?: number;
    date: Date;
    denumire: 'Leasing' | 'Casco' | 'RCA' | 'Diurna Sofer' | 'RO vigneta' | 'Hu vigneta' | 'Cauciucuri' | 'Autostrăzi' | 'Asigurare CMR' | 'Revizii' | 'Chirie' | 'Întreținere' | 'Digi' | 'Asibox' | 'Curieri' | 'CargoTrack' | 'Depozite' | 'Bugetul de Stat' | 'Contribuții Asigurare Munca' | 'TVA' | 'Burse' | 'Salarii Angajați' | 'Bonuri' | 'Consumabile' | 'Alte Cheltuieli';
    pret: number;
    infos?: string;
    AutoFleet?: {
        reg_no: string;
    };
    Partner?: {
        name: string;
    };
}
