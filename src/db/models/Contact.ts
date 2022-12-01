import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Partner, PartnerId } from './Partner';

export interface ContactAttributes {
  contact_id: number;
  contact_email: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  personal_identification_number?: string;
  car_registration_number?: string;
  department?: string;
  created_at_utc: Date;
  modified_at_utc: Date;
  partner_id?: number;
}

export type ContactPk = "contact_id";
export type ContactId = Contact[ContactPk];
export type ContactOptionalAttributes = "contact_id" | "phone" | "first_name" | "last_name" | "personal_identification_number" | "car_registration_number" | "department" | "created_at_utc" | "modified_at_utc" | "partner_id";
export type ContactCreationAttributes = Optional<ContactAttributes, ContactOptionalAttributes>;

export class Contact extends Model<ContactAttributes, ContactCreationAttributes> implements ContactAttributes {
  contact_id!: number;
  contact_email!: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  personal_identification_number?: string;
  car_registration_number?: string;
  department?: string;
  created_at_utc!: Date;
  modified_at_utc!: Date;
  partner_id?: number;

  // Contact belongsTo Partner via partner_id
  partner!: Partner;
  getPartner!: Sequelize.BelongsToGetAssociationMixin<Partner>;
  setPartner!: Sequelize.BelongsToSetAssociationMixin<Partner, PartnerId>;
  createPartner!: Sequelize.BelongsToCreateAssociationMixin<Partner>;

  static initModel(sequelize: Sequelize.Sequelize): typeof Contact {
    return Contact.init({
    contact_id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    contact_email: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    personal_identification_number: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    car_registration_number: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    department: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    created_at_utc: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('(now() AT TIME ZONE utc')
    },
    modified_at_utc: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('(now() AT TIME ZONE utc')
    },
    partner_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'Partner',
        key: 'partner_id'
      }
    }
  }, {
    sequelize,
    tableName: 'Contact',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "Contact_pkey",
        unique: true,
        fields: [
          { name: "contact_id" },
        ]
      },
    ]
  });
  }
}
