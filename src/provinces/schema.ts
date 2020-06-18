"use strict";

import * as mongoose from "mongoose";


export interface IProvince extends mongoose.Document {
  name: string;
  enabled: Boolean;
}

export const ProvinceSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "",
    trim: true,
    required: "Nombre no puede estar vacío."
  },
  enabled: {
    type: Boolean,
    default: true
  }
}, { collection: "provinces" });

export const Province = mongoose.model<IProvince>("Province", ProvinceSchema);
