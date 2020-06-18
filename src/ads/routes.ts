"use strict";

import * as express from "express";
import * as error from "../server/error";
import { onlyLoggedIn } from "../token/passport";
import * as user from "../user/service";
import * as imageService from "../image/service";
import * as adService from "./service";

/**
 * Modulo de publicidad
 */
export function initModule(app: express.Express) {
  app
    .route("/v1/ads")
    .get(getAds)
    .post(onlyLoggedIn,createAd);

  app
    .route("/v1/ads/:adId")
    .get(getAd)
    .delete(onlyLoggedIn,removeAd);
}

/**
 * @api {get} /v1/ads Listar publicidades
 * @apiName Buscar publicidades
 * @apiGroup Publicidad
 *
 * @apiDescription Listar todas las publicidades habilitadas
 *
 * @apiSuccessExample {json} Body
 *    [
 *    {
 *      "image": "886a8280-b0cc-11ea-8ae7-b169694c2352",
 *      "url": facebook.com
 *    },
 *    {
 *      "image": "886a8280-b0cc-11ea-8ae7-b169694c2353",
 *      "url": instagram.com
 *    },
 *    ]
 * @apiUse AuthHeader
 * @apiUse ParamValidationErrors
 * @apiUse OtherErrors
 */
const getAds = async (req: express.Request,res: express.Response) =>{
  const result=await adService.listAds();
  res.json(result.map(u => {
    return {
      id:u._id,
      image: u.image,
      url: u.url
    };
  }));
};

/**
 * @apiDefine TokenResponse
 *
 * @apiSuccessExample {json} Respuesta
 *     HTTP/1.1 200 OK
 *     {
 *       "image": "{Link de imagen de redis}"
 *       "url": "{Link de la pagina de la publicidad}"
 *       "created": "{Fecha de creacion}"
 *       "updated": "{Fecha de actualizacion}"
 *       "enabled": "{Estado de la publicidad}"
 *     }
 */
/**
 * @api {post} /v1/ads Crear una publicidad
 * @apiName Crear publicidad
 * @apiGroup Publicidad
 *
 * @apiDescription Registra una publicidad en el sistema, necesita permisos de admin
 *
 * @apiExample {json} Body
 *    {
 *      "image": "{string de la imagen}",
 *      "url": "{url de la publicidad}",
 *    }
 *
 * @apiUse TokenResponse
 *
 * @apiUse ParamValidationErrors
 * @apiUse OtherErrors
 */
const createAd=async (req: user.ISessionRequest,res: express.Response)=>{
  await user.hasPermission(req.user.user_id,"admin");
  const imageResult=await imageService.create(req.body);
  const adResult=await adService.createAd(imageResult.id,req.body.url);
  res.json({
    adResult
  });
};
/**
 * @api {get} /v1/ads/:adId Buscar una publicidad
 * @apiName Buscar una publicidad
 * @apiGroup Publicidad
 *
 * @apiDescription Busca una publicidad
 *
 * @apiSuccessExample {json} Provincia
 *    {
 *      "id": "id de la publicidad",
 *      "url": "url link a publicidad",
 *      "image": "token de la imagen guardada en redis",
 *    }
 *
 * @apiUse AuthHeader
 * @apiUse ParamValidationErrors
 * @apiUse OtherErrors
 */
const getAd=async (req: express.Request,res: express.Response)=>{
  const result= await adService.getAd(req.params.adId);
  return res.json({
    url:result.url,
    image:result.image,
    id:result.id
  });
};
/**
 * @api {delete} /v1/ads/:adId Eliminar publicidad
 * @apiName Eliminar publicidad
 * @apiGroup Publicidad
 *
 * @apiDescription Elimina una publicidad para que no se muestre mas en el frontEnd, necesita permisos de administrador
 *
 * @apiUse 200OK
 * @apiUse AuthHeader
 * @apiUse ParamValidationErrors
 * @apiUse OtherErrors
 */
const removeAd=async (req: user.ISessionRequest,res: express.Response)=>{
  await user.hasPermission(req.user.user_id,"admin");
  await adService.invalidate(req.params.adId);
  res.send();
};