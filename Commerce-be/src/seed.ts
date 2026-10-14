import "./module-alias-bootstrap";
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

// Seeded PRNG (mulberry32): every run produces the same catalog, orders and reviews.
let prngState = 20260101;
function random(): number {
  prngState = (prngState + 0x6d2b79f5) | 0;
  let t = Math.imul(prngState ^ (prngState >>> 15), 1 | prngState);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

function randomInt(min: number, max: number): number {
  return Math.floor(random() * (max - min + 1)) + min;
}

function randomItem<T>(items: T[]): T {
  return items[randomInt(0, items.length - 1)];
}

function pickSome<T>(items: T[], count: number): T[] {
  const shuffled = [...items].sort(() => random() - 0.5);
  return shuffled.slice(0, Math.min(count, items.length));
}

const DAY_MS = 24 * 60 * 60 * 1000;
const hoursAgo = (hours: number) => new Date(Date.now() - hours * 60 * 60 * 1000);

// Curated Unsplash photos (stable CDN URLs); every product below uses a photo of that kind of item.
const img = (id: string, w = 600) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

const PHOTOS = {
  whiteTee: '1521572163474-6864f9cf17ab',
  greenShirts: '1523381210434-271e8be1f52b',
  denimJacketRack: '1495121605193-b116b5b9c5fe',
  redRunningShoe: '1542291026-7eec264c27ff',
  navyBackpack: '1553062407-98eeb64c6a62',
  redHandbag: '1584917865442-de89df76afd3',
  whiteSmartWatch: '1523275335684-37898b6baf30',
  automaticWatch: '1524805444758-089113d48a6d',
  boutiqueDisplay: '1441986300917-64674bd600d8',
  colorfulTeesRack: '1489987707025-afc232f7ea0f',
  womanGraphicTee: '1554568218-0f1715e72254',
  womenTopsRack: '1490481651871-ab68de25d43d',
  greyHoodie: '1556821840-3a63f95609a7',
  graphicTee: '1576566588028-4147f3842f27',
  blackTee: '1583743814966-8936f5b7be1a',
  knitTop: '1434389677669-e08b4cac3105',
  yellowTracksuit: '1515886657613-9f3515b0c78f',
  sunglassesBlack: '1572635196237-14b3f281503f',
  sunglassesRound: '1511499767150-a48a237f0083',
  whiteNikeShoes: '1460353581641-37baddab0fa2',
  pastelSneakers: '1595950653106-6c9ebd614d3a',
  brownSneakers: '1549298916-b41d501d3772',
  blackNikeShoe: '1491553895911-0055eca6402d',
  darkJeans: '1542272604-787c3835535d',
  rippedJeans: '1541099649105-f69ad21f3246',
  khakiPants: '1473966968600-fa801b869a1a',
  gucciBag: '1548036328-c9fa89d128fa',
  wickerBag: '1590874103328-eac38a683ce7',
  leatherWallet: '1627123424574-724758594e93',
  steelWatch: '1523170335258-f5ed11844a49',
  roseGoldWatch: '1522312346375-d1a52e2b99b3',
  minimalWatch: '1434056886845-dac89ffe9b56',
  appleWatch: '1508685096489-7aacd43bd3b1',
  bomberJacket: '1591047139829-d91aecb6caea',
  leatherJacket: '1551028719-00167b16eac5',
  womanCoat: '1539109136881-3be0616acf4b',
  floralDress: '1496747611176-843222e1e57c',
  redDress: '1595777457583-95e059d581b8',
  burgundyDress: '1585487000160-6ebcfceb0d03',
  leatherBelt: '1624222247344-550fb60583dc',
  whiteCap: '1588850561407-ed78c282e89b',
} as const;
type PhotoKey = keyof typeof PHOTOS;

const CATEGORY_IMAGES: Record<string, PhotoKey> = {
  'Thời trang nam': 'whiteTee',
  'Thời trang nữ': 'womanGraphicTee',
  'Áo nam': 'colorfulTeesRack',
  'Quần nam': 'darkJeans',
  'Áo nữ': 'womenTopsRack',
  'Quần nữ': 'rippedJeans',
  'Giày dép': 'redRunningShoe',
  'Túi xách': 'redHandbag',
  'Phụ kiện': 'sunglassesBlack',
  'Đồng hồ': 'automaticWatch',
};

const BRAND_IMAGES: Record<string, PhotoKey> = {
  Nike: 'whiteNikeShoes',
  Adidas: 'pastelSneakers',
  Puma: 'brownSneakers',
  Zara: 'womanCoat',
  Uniqlo: 'colorfulTeesRack',
  Gucci: 'gucciBag',
  "Levi's": 'darkJeans',
  'Local Brand': 'boutiqueDisplay',
};

type ProductGroup = 'clothing' | 'shoes' | 'bag' | 'accessory' | 'watch';

const GROUPS: Record<ProductGroup, { colors: string[]; sizes: string[] }> = {
  clothing: { colors: ['Đen', 'Trắng', 'Xám', 'Xanh navy', 'Be', 'Đỏ'], sizes: ['S', 'M', 'L', 'XL'] },
  shoes: { colors: ['Đen', 'Trắng', 'Xám', 'Nâu'], sizes: ['38', '39', '40', '41', '42', '43'] },
  bag: { colors: ['Đen', 'Nâu', 'Be', 'Xanh navy', 'Đỏ'], sizes: ['Free size'] },
  accessory: { colors: ['Đen', 'Nâu', 'Trắng', 'Bạc'], sizes: ['Free size'] },
  watch: { colors: ['Đen', 'Bạc', 'Vàng hồng', 'Xanh navy'], sizes: ['Free size'] },
};

interface CatalogItem {
  name: string;
  brand: string;
  photo: PhotoKey;
  price: [number, number];
}

interface CategoryCatalog {
  group: ProductGroup;
  gender: 'male' | 'female' | 'unisex';
  items: CatalogItem[];
}

// Every product name, brand, photo and price range is chosen to match its category.
const CATALOG: Record<string, CategoryCatalog> = {
  'Thời trang nam': {
    group: 'clothing',
    gender: 'male',
    items: [
      { name: 'Áo hoodie xám', brand: 'Nike', photo: 'greyHoodie', price: [450_000, 900_000] },
      { name: 'Áo khoác bomber cam', brand: 'Zara', photo: 'bomberJacket', price: [700_000, 1_500_000] },
      { name: 'Áo khoác da biker', brand: 'Local Brand', photo: 'leatherJacket', price: [1_200_000, 2_500_000] },
    ],
  },
  'Thời trang nữ': {
    group: 'clothing',
    gender: 'female',
    items: [
      { name: 'Bộ đồ thể thao vàng', brand: 'Puma', photo: 'yellowTracksuit', price: [600_000, 1_200_000] },
      { name: 'Đầm hoa maxi', brand: 'Zara', photo: 'floralDress', price: [500_000, 1_100_000] },
      { name: 'Đầm đỏ dạ hội', brand: 'Local Brand', photo: 'redDress', price: [700_000, 1_600_000] },
      { name: 'Đầm công sở', brand: 'Uniqlo', photo: 'burgundyDress', price: [450_000, 900_000] },
      { name: 'Áo khoác dạ', brand: 'Zara', photo: 'womanCoat', price: [1_400_000, 2_800_000] },
      { name: 'Áo khoác jean', brand: "Levi's", photo: 'denimJacketRack', price: [800_000, 1_600_000] },
    ],
  },
  'Áo nam': {
    group: 'clothing',
    gender: 'male',
    items: [
      { name: 'Áo thun trắng basic', brand: 'Uniqlo', photo: 'whiteTee', price: [150_000, 350_000] },
      { name: 'Áo thun in hình', brand: 'Local Brand', photo: 'graphicTee', price: [180_000, 400_000] },
      { name: 'Áo thun đen tối giản', brand: 'Zara', photo: 'blackTee', price: [200_000, 450_000] },
      { name: 'Áo sơ mi xanh rêu', brand: 'Uniqlo', photo: 'greenShirts', price: [350_000, 700_000] },
    ],
  },
  'Quần nam': {
    group: 'clothing',
    gender: 'male',
    items: [
      { name: 'Quần jean xanh đậm', brand: "Levi's", photo: 'darkJeans', price: [700_000, 1_400_000] },
      { name: 'Quần kaki', brand: 'Zara', photo: 'khakiPants', price: [400_000, 800_000] },
    ],
  },
  'Áo nữ': {
    group: 'clothing',
    gender: 'female',
    items: [
      { name: 'Áo thun in hình', brand: 'Uniqlo', photo: 'womanGraphicTee', price: [150_000, 350_000] },
      { name: 'Áo len poncho', brand: 'Zara', photo: 'knitTop', price: [400_000, 800_000] },
      { name: 'Áo sơ mi nữ', brand: 'Local Brand', photo: 'womenTopsRack', price: [300_000, 650_000] },
    ],
  },
  'Quần nữ': {
    group: 'clothing',
    gender: 'female',
    items: [
      { name: 'Quần jean rách gối', brand: "Levi's", photo: 'rippedJeans', price: [700_000, 1_400_000] },
      { name: 'Quần jean ống đứng', brand: 'Uniqlo', photo: 'darkJeans', price: [500_000, 1_000_000] },
    ],
  },
  'Giày dép': {
    group: 'shoes',
    gender: 'unisex',
    items: [
      { name: 'Giày chạy bộ đỏ', brand: 'Nike', photo: 'redRunningShoe', price: [1_800_000, 2_800_000] },
      { name: 'Giày sneaker trắng', brand: 'Nike', photo: 'whiteNikeShoes', price: [1_500_000, 2_500_000] },
      { name: 'Giày sneaker pastel', brand: 'Adidas', photo: 'pastelSneakers', price: [1_300_000, 2_200_000] },
      { name: 'Giày da lộn nâu', brand: 'Puma', photo: 'brownSneakers', price: [1_000_000, 1_900_000] },
      { name: 'Giày thể thao đen', brand: 'Nike', photo: 'blackNikeShoe', price: [1_600_000, 2_600_000] },
    ],
  },
  'Túi xách': {
    group: 'bag',
    gender: 'unisex',
    items: [
      { name: 'Túi xách đỏ', brand: 'Gucci', photo: 'redHandbag', price: [4_200_000, 4_900_000] },
      { name: 'Túi đeo chéo da chần', brand: 'Gucci', photo: 'gucciBag', price: [4_000_000, 4_900_000] },
      { name: 'Túi cói màu cam', brand: 'Local Brand', photo: 'wickerBag', price: [600_000, 1_200_000] },
      { name: 'Balo xanh navy', brand: 'Nike', photo: 'navyBackpack', price: [700_000, 1_400_000] },
    ],
  },
  'Phụ kiện': {
    group: 'accessory',
    gender: 'unisex',
    items: [
      { name: 'Kính mát Wayfarer', brand: 'Local Brand', photo: 'sunglassesBlack', price: [250_000, 600_000] },
      { name: 'Kính mát gọng tròn', brand: 'Zara', photo: 'sunglassesRound', price: [250_000, 600_000] },
      { name: 'Ví da nâu', brand: 'Local Brand', photo: 'leatherWallet', price: [300_000, 700_000] },
      { name: 'Thắt lưng da nâu', brand: 'Gucci', photo: 'leatherBelt', price: [3_200_000, 4_500_000] },
      { name: 'Mũ lưỡi trai trắng', brand: 'Nike', photo: 'whiteCap', price: [200_000, 450_000] },
    ],
  },
  'Đồng hồ': {
    group: 'watch',
    gender: 'unisex',
    items: [
      { name: 'Đồng hồ chronograph thép', brand: 'Gucci', photo: 'steelWatch', price: [3_500_000, 4_900_000] },
      { name: 'Đồng hồ automatic', brand: 'Local Brand', photo: 'automaticWatch', price: [1_500_000, 3_000_000] },
      { name: 'Đồng hồ dây da vàng hồng', brand: 'Gucci', photo: 'roseGoldWatch', price: [3_000_000, 4_500_000] },
      { name: 'Đồng hồ tối giản mặt đen', brand: 'Local Brand', photo: 'minimalWatch', price: [900_000, 1_800_000] },
      { name: 'Đồng hồ thông minh trắng', brand: 'Puma', photo: 'whiteSmartWatch', price: [1_200_000, 2_400_000] },
      { name: 'Đồng hồ thông minh', brand: 'Nike', photo: 'appleWatch', price: [2_000_000, 3_500_000] },
    ],
  },
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

  // Creates any tables that don't exist yet based on the Sequelize model definitions above
  await sequelize.sync();

  // Reset tables so the script is safely re-runnable without duplicate/unique-key errors
  const tablesToReset = [
    'order_items', 'orders', 'product_likes', 'product_ratings', 'carts',
    'user_addresses', 'coupons', 'product_variants', 'images', 'products',
    'users', 'brands', 'categories',
  ];
  for (const table of tablesToReset) {
    await sequelize.query(`TRUNCATE TABLE ${table} CASCADE`);
  }
  console.log('Cleared existing data from all seeded tables');

  // 1. Categories (a few parents + children)
  const categoryImage = (name: string) => img(PHOTOS[CATEGORY_IMAGES[name]], 500);

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
    image: img(PHOTOS[BRAND_IMAGES[name]], 500),
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
    const email = `${firstName}.${lastName}@example.com`.toLowerCase();
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

  // 4. Products: a fixed catalog per category (name, brand, photo, price and gender all match the category)
  const brandByName = new Map(brands.map((b) => [b.name, b]));
  const products: any[] = [];
  const productMeta = new Map<string, { colors: string[]; sizes: string[] }>();

  for (const category of categories) {
    const catalog = CATALOG[category.name];
    const pool = GROUPS[catalog.group];
    for (const item of catalog.items) {
      const brand = brandByName.get(item.brand)!;
      const price = randomInt(item.price[0] / 1000, item.price[1] / 1000) * 1000;
      const hasSale = random() < 0.4;
      const name = `${item.name} ${brand.name}`;
      const colors = pickSome(pool.colors, randomInt(2, 4));
      const id = uuid();
      productMeta.set(id, { colors, sizes: pool.sizes });
      products.push({
        id,
        name,
        gender: catalog.gender,
        images: [img(PHOTOS[item.photo], 700)],
        price,
        salePrice: hasSale ? Math.round((price * 0.8) / 1000) * 1000 : null,
        colors: colors.join(','),
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

  // 5. Product variants (2-3 per product, using the colors and sizes that fit the product type)
  const attributeFor = (productId: string) => {
    const meta = productMeta.get(productId)!;
    return `color:${randomItem(meta.colors)},size:${randomItem(meta.sizes)}`;
  };
  const variants: any[] = [];
  let skuCounter = 0;
  for (const product of products) {
    const meta = productMeta.get(product.id)!;
    const variantCount = Math.min(randomInt(2, 3), meta.colors.length * meta.sizes.length);
    const usedCombos = new Set<string>();
    while (usedCombos.size < variantCount) {
      const color = randomItem(meta.colors);
      const size = randomItem(meta.sizes);
      const comboKey = `${color}-${size}`;
      if (usedCombos.has(comboKey)) continue;
      usedCombos.add(comboKey);
      skuCounter++;
      variants.push({
        id: uuid(),
        productId: product.id,
        sku: `SKU-${String(skuCounter).padStart(6, '0')}-${color.slice(0, 2).toUpperCase()}-${size.replace(/\s/g, '')}`,
        color,
        size,
        price: product.price,
        salePrice: product.salePrice,
        quantity: randomInt(5, 100),
        image: (product.images as string[])[0],
        status: 'active',
      });
    }
  }
  await ProductVariantPersistence.bulkCreate(variants);
  console.log(`Seeded ${variants.length} product variants`);

  // 6. Images (standalone media pool, pointing at real photos)
  const imageKeys = Object.keys(PHOTOS) as PhotoKey[];
  const images = imageKeys.slice(0, 20).map((key) => ({
    id: uuid(),
    path: img(PHOTOS[key], 800),
    cloudName: `seed-${key}`,
    width: 800,
    height: 800,
    size: randomInt(50_000, 500_000),
    status: 'uploaded',
  }));
  await ImagePersistence.bulkCreate(images);
  console.log(`Seeded ${images.length} images`);

  // 7. Coupons (valid for two years so a demo stays usable)
  const now = new Date();
  const inTwoYears = new Date(now.getTime() + 730 * DAY_MS);
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
    endDate: inTwoYears,
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
        attribute: attributeFor(product.id),
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
      createdAt: hoursAgo(randomInt(1, 45 * 24)),
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
    const createdAt = hoursAgo(randomInt(1, 45 * 24));
    ratings.push({
      userId: customer.id,
      productId: product.id,
      rating: star,
      content: randomItem(reviewsByStar[star]),
      createdAt,
      updated: createdAt,
    });
  }
  await ProductRatingPersistence.bulkCreate(ratings);
  console.log(`Seeded ${ratings.length} product ratings`);

  await sequelize.query(
    `UPDATE products
     SET rating = COALESCE((SELECT ROUND(AVG(pr.rating), 1) FROM product_ratings pr WHERE pr.product_id = products.id), 0)`
  );

  // 12. Orders + order items, spread over the last 30 days; older orders are further along in the workflow
  const shippingMethods = ['free', 'standard'];
  const paymentMethods = ['cod', 'zalo'];
  const orderCount = 30;
  const orders: any[] = [];
  const orderItems: any[] = [];

  const statusForAge = (ageDays: number): string => {
    if (ageDays >= 10) return random() < 0.8 ? 'delivered' : 'cancelled';
    if (ageDays >= 5) return randomItem(['shipping', 'delivered', 'delivered']);
    if (ageDays >= 2) return randomItem(['processing', 'shipping']);
    return randomItem(['pending', 'confirmed']);
  };

  for (let i = 0; i < orderCount; i++) {
    const customer = randomItem(customers);
    const orderId = uuid();
    const itemCount = randomInt(1, 3);
    const ageDays = ((orderCount - 1 - i) * 30) / orderCount;
    const createdAt = new Date(Date.now() - ageDays * DAY_MS - randomInt(0, 20) * 60 * 60 * 1000);

    let subtotal = 0;
    for (const product of pickSome(products, itemCount)) {
      const quantity = randomInt(1, 2);
      const price = Number(product.salePrice ?? product.price);
      subtotal += price * quantity;
      orderItems.push({
        id: uuid(),
        orderId,
        productId: product.id,
        attribute: attributeFor(product.id),
        image: (product.images as string[])[0],
        name: product.name,
        quantity,
        price,
      });
    }

    const eligibleCoupons = coupons.filter((c) => subtotal >= c.minOrderValue);
    const coupon = random() < 0.3 && eligibleCoupons.length > 0 ? randomItem(eligibleCoupons) : null;
    let discountAmount = 0;
    if (coupon) {
      discountAmount = coupon.type === 'percent'
        ? Math.min(Math.round((subtotal * Number(coupon.value)) / 100), Number(coupon.maxDiscount ?? subtotal))
        : Math.min(Number(coupon.value), subtotal);
    }

    const status = statusForAge(ageDays);
    const paymentMethod = randomItem(paymentMethods);
    const paymentStatus =
      status === 'delivered' ? 'paid'
        : status === 'cancelled' ? (paymentMethod === 'zalo' ? 'failed' : 'pending')
          : paymentMethod === 'zalo' ? 'paid' : 'pending';

    orders.push({
      id: orderId,
      userId: customer.id,
      shippingAddress: `${randomInt(1, 200)} Tran Hung Dao Street`,
      shippingCity: randomItem(citiesPool),
      shippingMethod: randomItem(shippingMethods),
      paymentMethod,
      paymentStatus,
      recipientFirstName: customer.firstName,
      recipientLastName: customer.lastName,
      recipientPhone: customer.phone,
      recipientEmail: customer.email,
      trackingNumber: `TRK-${String(i).padStart(6, '0')}`,
      couponId: coupon ? coupon.id : null,
      discountAmount,
      totalAmount: Math.max(subtotal - discountAmount, 0),
      status,
      created_at: createdAt,
      updated_at: createdAt,
    });
  }
  await OrderPersistence.bulkCreate(orders);
  await OrderItemPersistence.bulkCreate(orderItems);
  console.log(`Seeded ${orders.length} orders with ${orderItems.length} order items`);

  // Coupon usage counts follow the seeded orders (cancelled orders do not count)
  await sequelize.query(
    `UPDATE coupons
     SET usage_count = (SELECT COUNT(*) FROM orders WHERE orders.coupon_id = coupons.id AND orders.status != 'cancelled')`
  );

  console.log('\nSeed completed successfully.');
  console.log(`Admin login -> email: admin@commerce.local / password: Admin123!`);
  console.log(`Customer login -> email: ${customers[0].email} (all customers use password: ${defaultPassword})`);
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
