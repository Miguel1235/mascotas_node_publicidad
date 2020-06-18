"user strict";

import * as mongoose from "mongoose";

export interface IAd extends mongoose.Document{
  image: string;
  url: string;
  created: Number;
  updated: Number;
  enabled: Boolean;
}
/**
 * Esquema del Perfil
 */
export const AdSchema=new mongoose.Schema({
  image: {
    type: String,
    ref: "Image"
  },
  url: {
    type: String,
    default: ""
  },
  updated: {
    type: Date,
    default: Date.now()
  },
  created: {
    type: Date,
    default: Date.now()
  },
  enabled: {
    type: Boolean,
    default: true
  }
},{collection: "ads"});

AdSchema.pre("save",function (this: IAd, next) {
  this.updated=Date.now();
  next();
});

export const Ad = mongoose.model<IAd>("Ad", AdSchema);