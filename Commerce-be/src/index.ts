import "./module-alias-bootstrap";
import express, {Request, Response} from "express";
import cors from "cors";
import { config } from "dotenv";
import * as swaggerUi from 'swagger-ui-express';
import { setupCategoryHexagon } from "@modules/category";
import { sequelize } from "@share/component/sequelize";
import { setupBrandHexagon } from "@modules/brand";
import { setupUserHexagon } from "@modules/user";
import { setupProductHexagon } from "@modules/product";
import { setupCartHexagon } from "@modules/cart";
import { setupOrderHexagon } from "@modules/order";
import { setupProductLikeHexagon } from "@modules/product-like";
import { setupProductRatingHexagon } from "@modules/product-rating";
import { setupImageHexagon } from "@modules/image";
import { setupCouponHexagon } from "@modules/coupon";
import { setupUserAddressHexagon } from "@modules/user-address";
import { setupProductVariantHexagon } from "@modules/product-variant";
import { setupAdminHexagon } from "@modules/admin";
import { MYSQLProductRepository } from "@modules/product/infras/repository/sequelize";
import { modelName as productModelName } from "@modules/product/infras/repository/sequelize/dto";
import { buildSwaggerDocument } from '@share/transport/swagger';

config();

(async () => {
  await sequelize.authenticate();
  console.log(' Connection has been established successfully.');
  const app = express();
  const port = process.env.PORT || 3000;

  const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : [/^http:\/\/localhost:\d+$/, /^http:\/\/127\.0\.0\.1:\d+$/];
  app.use(cors({ origin: allowedOrigins }));
  app.use(express.json());

  app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
  });

  // Product repo is shared with Order module for product lookup
  const productRepository = new MYSQLProductRepository(sequelize, productModelName);

  // Coupon module - returns router, repository and validate handler for Order integration
  const couponSetup = setupCouponHexagon(sequelize);

  // Coupon service adapter for Order module
  const couponServiceForOrder = {
    validate: async (code: string, orderTotal: number) => {
      const result = await couponSetup.validateQueryHandler.query({ code, orderTotal });
      return { couponId: result.coupon.id, discountAmount: result.discountAmount };
    },
    incrementUsage: async (couponId: string) => {
      return couponSetup.repository.incrementUsage(couponId);
    },
  };

  app.use('/v1', setupCategoryHexagon(sequelize));
  app.use('/v1', setupBrandHexagon(sequelize));
  app.use('/v1', setupUserHexagon(sequelize));
  app.use('/v1', setupProductHexagon(sequelize));
  app.use('/v1', setupCartHexagon(sequelize, productRepository));
  app.use('/v1', setupOrderHexagon(sequelize, productRepository, couponServiceForOrder));
  app.use('/v1', setupProductLikeHexagon(sequelize));
  app.use('/v1', setupProductRatingHexagon(sequelize));
  app.use('/v1', setupImageHexagon(sequelize));
  app.use('/v1', couponSetup.router);
  app.use('/v1', setupUserAddressHexagon(sequelize));
  app.use('/v1', setupProductVariantHexagon(sequelize));
  app.use('/v1', setupAdminHexagon(sequelize));

  // Creates any tables that don't exist yet based on the Sequelize model definitions above
  await sequelize.sync();

  // const swaggerDocument = buildSwaggerDocument(port);
  // app.get('/swagger.json', (req, res) => {
  //   res.json(swaggerDocument);
  // });
  // app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
    //console.log(`Swagger UI available at http://localhost:${port}/swagger`);
  });
})();