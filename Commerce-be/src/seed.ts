import 'module-alias/register';
import { config } from 'dotenv';
import { v7 as uuid } from 'uuid';
import { sequelize } from '@share/component/sequelize';
import { generateSalt, hashPassword } from '@share/helper/hash';

import { init as initCategory, CategoryPersistence } from '@modules/category/infras/repository/sequelize/dto';
import { init as initBrand, BrandPersistence } from '@modules/brand/infras/repository/sequelize/dto';
import { init as initUser, UserPersistence } from '@modules/user/infras/repository/sequelize/dto';
import { init as initProduct, ProductPersistence } from '@modules/product/infras/repository/sequelize/dto';
import { init as initProductVariant, ProductVariantPersistence } from '@modules/product-variant/infras/repository/sequelize/dto';
import { init as initImage, ImagePersistence } from '@modules/image/infras/repository/sequelize/dto';
import { init as initCart, CartPersistence } from '@modules/cart/infras/repository/sequelize/dto';
import { init as initCoupon, CouponPersistence } from '@modules/coupon/infras/repository/sequelize/dto';
import { init as initOrder, OrderPersistence, OrderItemPersistence } from '@modules/order/infras/repository/sequelize/dto';
import { init as initProductLike, ProductLikePersistence } from '@modules/product-like/infras/repository/sequelize/dto';
import { init as initProductRating, ProductRatingPersistence } from '@modules/product-rating/infras/repository/sequelize/dto';
import { init as initUserAddress, UserAddressPersistence } from '@modules/user-address/infras/repository/sequelize/dto';

config();

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem<T>(items: T[]): T {
  return items[randomInt(0, items.length - 1)];
}

function pickSome<T>(items: T[], count: number): T[] {
  const shuffled = [...items].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, items.length));
}

// Curated, verified-loading Unsplash photos (real fashion/retail imagery, stable CDN URLs)
const img = (id: string, w = 600) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

const PHOTOS = {
  manTshirt: '1521572163474-6864f9cf17ab',
  shirtsHangersGreen: '1523381210434-271e8be1f52b',
  jacketJeansRack: '1495121605193-b116b5b9c5fe',
  redSneaker: '1542291026-7eec264c27ff',
  clothingRackStore: '1445205170230-053b83016050',
  navyBackpack: '1553062407-98eeb64c6a62',
  redHandbag: '1584917865442-de89df76afd3',
  smartWatch: '1523275335684-37898b6baf30',
  classicWatch: '1524805444758-089113d48a6d',
  boutiqueDisplay: '1441986300917-64674bd600d8',
  clothingStoreInterior: '1441984904996-e0b6ba687e04',
  colorfulTshirtsRack: '1489987707025-afc232f7ea0f',
  womanWhiteTshirt: '1554568218-0f1715e72254',
  womanShoppingBags: '1483985988355-763728e1935b',
  shirtsOnHangers: '1490481651871-ab68de25d43d',
};

const CATEGORY_IMAGES: Record<string, string[]> = {
  'Thời trang nam': [PHOTOS.manTshirt, PHOTOS.clothingStoreInterior],
  'Thời trang nữ': [PHOTOS.womanWhiteTshirt, PHOTOS.shirtsOnHangers],
  'Áo nam': [PHOTOS.shirtsHangersGreen, PHOTOS.colorfulTshirtsRack],
  'Quần nam': [PHOTOS.jacketJeansRack, PHOTOS.clothingRackStore],
  'Áo nữ': [PHOTOS.shirtsOnHangers, PHOTOS.womanWhiteTshirt],
  'Quần nữ': [PHOTOS.clothingRackStore, PHOTOS.jacketJeansRack],
  'Giày dép': [PHOTOS.redSneaker],
  'Túi xách': [PHOTOS.redHandbag, PHOTOS.navyBackpack],
  'Phụ kiện': [PHOTOS.boutiqueDisplay, PHOTOS.womanShoppingBags],
  'Đồng hồ': [PHOTOS.classicWatch, PHOTOS.smartWatch],
};

const BRAND_IMAGES: Record<string, string> = {
  Nike: PHOTOS.redSneaker,
  Adidas: PHOTOS.redSneaker,
  Puma: PHOTOS.redSneaker,
  Zara: PHOTOS.shirtsHangersGreen,
  Uniqlo: PHOTOS.colorfulTshirtsRack,
  Gucci: PHOTOS.redHandbag,
  "Levi's": PHOTOS.jacketJeansRack,
  'Local Brand': PHOTOS.boutiqueDisplay,
};

async function seed() {
  await sequelize.authenticate();
  console.log('Connected to DB for seeding.');

  initCategory(sequelize);
  initBrand(sequelize);
  initUser(sequelize);
  initProduct(sequelize);
  initProductVariant(sequelize);
  initImage(sequelize);
  initCart(sequelize);
  initCoupon(sequelize);
  initOrder(sequelize);
  initProductLike(sequelize);
  initProductRating(sequelize);
  initUserAddress(sequelize);

  // Reset tables so the script is safely re-runnable without duplicate/unique-key errors
  await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
  const tablesToReset = [
    'order_items', 'orders', 'product_likes', 'product_ratings', 'carts',
    'user_addresses', 'coupons', 'product_variants', 'images', 'products',
    'users', 'brands', 'categories',
  ];
  for (const table of tablesToReset) {
    await sequelize.query(`TRUNCATE TABLE ${table}`);
  }
  await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  console.log('Cleared existing data from all seeded tables');

  // 1. Categories (a few parents + children)
  const categoryImage = (name: string) => img(CATEGORY_IMAGES[name][0], 500);

  const parentCategoryDefs = ['Thời trang nam', 'Thời trang nữ'];
  const parentCategories = parentCategoryDefs.map((name) => ({
    id: uuid(),
    name,
    image: categoryImage(name),
    description: `Danh mục ${name}`,
    parentId: null as string | null,
    status: 'active',
  }));

  const childCategoryDefs = [
    { name: 'Áo nam', parent: 0 },
    { name: 'Quần nam', parent: 0 },
    { name: 'Áo nữ', parent: 1 },
    { name: 'Quần nữ', parent: 1 },
  ];
  const childCategories = childCategoryDefs.map((c) => ({
    id: uuid(),
    name: c.name,
    image: categoryImage(c.name),
    description: `Danh mục ${c.name}`,
    parentId: parentCategories[c.parent].id,
    status: 'active',
  }));

  const standaloneCategoryDefs = ['Giày dép', 'Túi xách', 'Phụ kiện', 'Đồng hồ'];
  const standaloneCategories = standaloneCategoryDefs.map((name) => ({
    id: uuid(),
    name,
    image: categoryImage(name),
    description: `Danh mục ${name}`,
    parentId: null as string | null,
    status: 'active',
  }));

  const categories = [...parentCategories, ...childCategories, ...standaloneCategories];
  await CategoryPersistence.bulkCreate(categories);
  console.log(`Seeded ${categories.length} categories`);

  // 2. Brands
  const brandDefs = ['Nike', 'Adidas', 'Puma', 'Zara', 'Uniqlo', 'Gucci', "Levi's", 'Local Brand'];
  const brands = brandDefs.map((name) => ({
    id: uuid(),
    name,
    image: img(BRAND_IMAGES[name], 500),
    description: `Thương hiệu ${name}`,
    status: 'active',
  }));
  await BrandPersistence.bulkCreate(brands);
  console.log(`Seeded ${brands.length} brands`);

  // 3. Users (1 admin + several customers)
  const defaultPassword = 'Password123!';
  const customerDefs = [
    ['Nguyen', 'An'], ['Tran', 'Binh'], ['Le', 'Chi'], ['Pham', 'Dung'],
    ['Hoang', 'Em'], ['Vu', 'Phuc'], ['Dang', 'Giang'], ['Bui', 'Hoa'],
    ['Do', 'Khanh'], ['Ngo', 'Linh'], ['Duong', 'Minh'],
  ];
  const users: any[] = [];

  const avatarUrl = (firstName: string, lastName: string) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName + ' ' + lastName)}&background=2563eb&color=fff&size=200`;

  const adminSalt = generateSalt();
  users.push({
    id: uuid(),
    avatar: avatarUrl('Admin', 'System'),
    firstName: 'Admin',
    lastName: 'System',
    email: 'admin@commerce.local',
    password: hashPassword('Admin123!', adminSalt),
    salt: adminSalt,
    phone: '0900000000',
    address: '1 Admin Street, Ha Noi',
    gender: 'male',
    role: 'admin',
    status: 'active',
  });

  for (const [firstName, lastName] of customerDefs) {
    const salt = generateSalt();
    const email = `${firstName}.${lastName}${randomInt(1, 999)}@example.com`.toLowerCase();
    users.push({
      id: uuid(),
      avatar: avatarUrl(firstName, lastName),
      firstName,
      lastName,
      email,
      password: hashPassword(defaultPassword, salt),
      salt,
      phone: `09${randomInt(10000000, 99999999)}`,
      address: `${randomInt(1, 200)} Le Loi Street`,
      gender: randomItem(['male', 'female', 'unknown']),
      role: 'user',
      status: 'active',
    });
  }
  await UserPersistence.bulkCreate(users);
  const customers = users.filter((u) => u.role === 'user');
  console.log(`Seeded ${users.length} users (1 admin + ${customers.length} customers)`);

  // 4. Products (spread across categories & brands)
  const productNameTemplates = ['Áo thun', 'Áo sơ mi', 'Áo khoác', 'Quần jean', 'Quần short', 'Giày sneaker', 'Túi đeo chéo', 'Đồng hồ', 'Mũ lưỡi trai', 'Thắt lưng'];
  const colorsPool = ['Đen', 'Trắng', 'Xám', 'Xanh navy', 'Be', 'Đỏ'];
  const products: any[] = [];
  const productsPerCategory = 3;

  for (const category of categories) {
    for (let i = 0; i < productsPerCategory; i++) {
      const brand = randomItem(brands);
      const price = randomInt(150, 2000) * 1000;
      const hasSale = Math.random() < 0.4;
      const name = `${randomItem(productNameTemplates)} ${category.name} ${brand.name} #${i + 1}`;
      const categoryPhotoIds = CATEGORY_IMAGES[category.name] || [PHOTOS.clothingStoreInterior];
      products.push({
        id: uuid(),
        name,
        gender: randomItem(['male', 'female', 'unisex']),
        images: [img(randomItem(categoryPhotoIds), 700), img(randomItem(categoryPhotoIds), 700)],
        price,
        salePrice: hasSale ? Math.round((price * 0.8) / 1000) * 1000 : null,
        colors: pickSome(colorsPool, randomInt(2, 4)).join(','),
        quantity: randomInt(20, 300),
        brandId: brand.id,
        categoryId: category.id,
        content: `Thông tin chi tiết sản phẩm ${name}.`,
        description: `${name} chất lượng cao, phù hợp cho mọi dịp.`,
        rating: 0,
        saleCount: 0,
        status: 'active',
      });
    }
  }
  await ProductPersistence.bulkCreate(products);
  console.log(`Seeded ${products.length} products`);

  // 5. Product variants (2-3 per product)
  const sizesPool = ['S', 'M', 'L', 'XL', 'XXL'];
  const variants: any[] = [];
  let skuCounter = 0;
  for (const product of products) {
    const variantCount = randomInt(2, 3);
    const usedCombos = new Set<string>();
    for (let i = 0; i < variantCount; i++) {
      let color = randomItem(colorsPool);
      let size = randomItem(sizesPool);
      let comboKey = `${color}-${size}`;
      let attempts = 0;
      while (usedCombos.has(comboKey) && attempts < 10) {
        color = randomItem(colorsPool);
        size = randomItem(sizesPool);
        comboKey = `${color}-${size}`;
        attempts++;
      }
      usedCombos.add(comboKey);
      skuCounter++;
      variants.push({
        id: uuid(),
        productId: product.id,
        sku: `SKU-${String(skuCounter).padStart(6, '0')}-${color.slice(0, 2).toUpperCase()}-${size}`,
        color,
        size,
        price: product.price,
        salePrice: product.salePrice,
        quantity: randomInt(5, 100),
        image: randomItem(product.images as string[]),
        status: 'active',
      });
    }
  }
  await ProductVariantPersistence.bulkCreate(variants);
  console.log(`Seeded ${variants.length} product variants`);

  // 6. Images (standalone media pool)
  const images = Array.from({ length: 20 }).map((_, i) => ({
    id: uuid(),
    path: `/uploads/seed-image-${i}.jpg`,
    cloudName: `seed-image-${i}`,
    width: 800,
    height: 800,
    size: randomInt(50_000, 500_000),
    status: 'uploaded',
  }));
  await ImagePersistence.bulkCreate(images);
  console.log(`Seeded ${images.length} images`);

  // 7. Coupons
  const now = new Date();
  const inOneMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const coupons = [
    { code: 'WELCOME10', type: 'percent', value: 10, minOrderValue: 200000, maxDiscount: 100000, usageLimit: 500 },
    { code: 'SALE50K', type: 'fixed', value: 50000, minOrderValue: 300000, maxDiscount: null, usageLimit: 200 },
    { code: 'SUMMER20', type: 'percent', value: 20, minOrderValue: 500000, maxDiscount: 200000, usageLimit: 100 },
    { code: 'FREESHIP', type: 'fixed', value: 30000, minOrderValue: 0, maxDiscount: null, usageLimit: 1000 },
    { code: 'VIP15', type: 'percent', value: 15, minOrderValue: 1000000, maxDiscount: 300000, usageLimit: 50 },
    { code: 'NEWUSER', type: 'fixed', value: 100000, minOrderValue: 400000, maxDiscount: null, usageLimit: 300 },
  ].map((c) => ({
    id: uuid(),
    code: c.code,
    description: `Mã giảm giá ${c.code}`,
    type: c.type,
    value: c.value,
    minOrderValue: c.minOrderValue,
    maxDiscount: c.maxDiscount,
    usageLimit: c.usageLimit,
    usageCount: 0,
    startDate: now,
    endDate: inOneMonth,
    status: 'active',
  }));
  await CouponPersistence.bulkCreate(coupons);
  console.log(`Seeded ${coupons.length} coupons`);

  // 8. User addresses (1-2 per customer)
  const citiesPool = ['Ha Noi', 'Ho Chi Minh', 'Da Nang', 'Hai Phong', 'Can Tho'];
  const addresses: any[] = [];
  for (const customer of customers) {
    const addressCount = randomInt(1, 2);
    for (let i = 0; i < addressCount; i++) {
      addresses.push({
        id: uuid(),
        userId: customer.id,
        title: i === 0 ? 'Nhà riêng' : 'Công ty',
        recipientName: `${customer.firstName} ${customer.lastName}`,
        phone: customer.phone,
        address: `${randomInt(1, 200)} Nguyen Trai Street`,
        city: randomItem(citiesPool),
        isDefault: i === 0,
        status: 'active',
      });
    }
  }
  await UserAddressPersistence.bulkCreate(addresses);
  console.log(`Seeded ${addresses.length} user addresses`);

  // 9. Carts (a few items per some customers)
  const carts: any[] = [];
  for (const customer of pickSome(customers, Math.ceil(customers.length * 0.6))) {
    const itemCount = randomInt(1, 3);
    for (let i = 0; i < itemCount; i++) {
      const product = randomItem(products);
      carts.push({
        id: uuid(),
        userId: customer.id,
        productId: product.id,
        attribute: `color:${randomItem(colorsPool)},size:${randomItem(sizesPool)}`,
        quantity: randomInt(1, 3),
      });
    }
  }
  await CartPersistence.bulkCreate(carts);
  console.log(`Seeded ${carts.length} cart items`);

  // 10. Product likes (unique user-product pairs)
  const likeCombos = new Set<string>();
  const likes: any[] = [];
  while (likes.length < 40) {
    const customer = randomItem(customers);
    const product = randomItem(products);
    const key = `${customer.id}-${product.id}`;
    if (likeCombos.has(key)) continue;
    likeCombos.add(key);
    likes.push({
      userId: customer.id,
      productId: product.id,
      createdAt: new Date(),
    });
  }
  await ProductLikePersistence.bulkCreate(likes);
  console.log(`Seeded ${likes.length} product likes`);

  // 11. Product ratings (unique user-product pairs, with review content + star rating)
  const reviewsByStar: Record<number, string[]> = {
    5: ['Sản phẩm rất tốt, đúng như mô tả.', 'Đóng gói cẩn thận, sản phẩm đẹp, sẽ ủng hộ shop lần sau.'],
    4: ['Chất lượng ổn, giao hàng nhanh.', 'Giá hợp lý so với chất lượng.'],
    3: ['Tạm ổn, không có gì nổi bật.'],
    2: ['Hơi thất vọng về chất liệu.'],
  };
  const ratingCombos = new Set<string>();
  const ratings: any[] = [];
  while (ratings.length < 35) {
    const customer = randomItem(customers);
    const product = randomItem(products);
    const key = `${customer.id}-${product.id}`;
    if (ratingCombos.has(key)) continue;
    ratingCombos.add(key);
    const star = randomItem([5, 5, 4, 4, 3, 2]);
    ratings.push({
      userId: customer.id,
      productId: product.id,
      rating: star,
      content: randomItem(reviewsByStar[star]),
      createdAt: new Date(),
      updated: new Date(),
    });
  }
  await ProductRatingPersistence.bulkCreate(ratings);
  console.log(`Seeded ${ratings.length} product ratings`);

  await sequelize.query(
    `UPDATE products p
     SET p.rating = COALESCE((SELECT ROUND(AVG(pr.rating), 1) FROM product_ratings pr WHERE pr.product_id = p.id), 0)`
  );

  // 12. Orders + order items
  const shippingMethods = ['free', 'standard'];
  const paymentMethods = ['cod', 'zalo'];
  const orderStatuses = ['pending', 'confirmed', 'processing', 'shipping', 'delivered', 'cancelled'];
  const orders: any[] = [];
  const orderItems: any[] = [];

  for (let i = 0; i < 25; i++) {
    const customer = randomItem(customers);
    const orderId = uuid();
    const itemCount = randomInt(1, 3);
    const useCoupon = Math.random() < 0.3;
    const coupon = useCoupon ? randomItem(coupons) : null;

    let totalAmount = 0;
    const chosenProducts = pickSome(products, itemCount);
    for (const product of chosenProducts) {
      const quantity = randomInt(1, 2);
      const price = Number(product.salePrice ?? product.price);
      totalAmount += price * quantity;
      orderItems.push({
        id: uuid(),
        orderId: orderId,
        productId: product.id,
        attribute: `color:${randomItem(colorsPool)},size:${randomItem(sizesPool)}`,
        image: randomItem(product.images as string[]),
        name: product.name,
        quantity,
        price,
      });
    }

    const discountAmount = coupon
      ? coupon.type === 'percent'
        ? Math.min(Math.round((totalAmount * Number(coupon.value)) / 100), Number(coupon.maxDiscount ?? totalAmount))
        : Number(coupon.value)
      : 0;

    const paymentStatus = randomItem(['pending', 'paid', 'failed']);
    const status = randomItem(orderStatuses);

    orders.push({
      id: orderId,
      userId: customer.id,
      shippingAddress: `${randomInt(1, 200)} Tran Hung Dao Street`,
      shippingCity: randomItem(citiesPool),
      shippingMethod: randomItem(shippingMethods),
      paymentMethod: randomItem(paymentMethods),
      paymentStatus,
      recipientFirstName: customer.firstName,
      recipientLastName: customer.lastName,
      recipientPhone: customer.phone,
      recipientEmail: customer.email,
      trackingNumber: `TRK-${String(i).padStart(6, '0')}`,
      couponId: coupon ? coupon.id : null,
      discountAmount,
      totalAmount: Math.max(totalAmount - discountAmount, 0),
      status,
    });
  }
  await OrderPersistence.bulkCreate(orders);
  await OrderItemPersistence.bulkCreate(orderItems);
  console.log(`Seeded ${orders.length} orders with ${orderItems.length} order items`);

  console.log('\nSeed completed successfully.');
  console.log(`Admin login -> email: admin@commerce.local / password: Admin123!`);
  console.log(`Customer login -> any seeded email / password: ${defaultPassword}`);
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
