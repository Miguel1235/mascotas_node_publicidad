"user strict";

import { IAd, Ad } from "./schema";

import * as error from "../server/error";

export const createAd = async (imageId: string, imageUrl: string): Promise<IAd> => {
  try {
    const ad = <IAd>new Ad();
    ad.image = imageId;
    ad.url = imageUrl;
    await ad.save();
    return Promise.resolve(ad);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const listAds = async (): Promise<Array<IAd>> => {
  try {
    const result = await Ad.find({ enabled: true }).exec();
    return Promise.resolve(result);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const getAd = async (id: string): Promise<IAd> => {
  try {
    const result = await Ad.findOne({
      _id: escape(id),
      enabled: true
    });
    if (!result) {
      throw error.ERROR_NOT_FOUND;
    }
    return Promise.resolve(result);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const invalidate = async (id: string): Promise<void> => {
  try {
    const result = await Ad.findOne({
      _id: escape(id),
      enabled: true
    });
    if (!result) {
      throw error.ERROR_NOT_FOUND;
    }
    result.enabled = false;
    await result.save();
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
};