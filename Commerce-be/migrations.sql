-- =============================================
-- 1. Coupons (Mã giảm giá)
-- =============================================
CREATE TABLE IF NOT EXISTS `coupons` (
  `id` varchar(36) NOT NULL,
  `code` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `type` enum('percent','fixed') NOT NULL DEFAULT 'percent',
  `value` decimal(10,2) NOT NULL COMMENT 'Giá trị giảm (% hoặc số tiền cố định)',
  `min_order_value` decimal(10,2) DEFAULT '0.00' COMMENT 'Giá trị đơn hàng tối thiểu để áp dụng',
  `max_discount` decimal(10,2) DEFAULT NULL COMMENT 'Giảm tối đa (cho loại percent)',
  `usage_limit` int DEFAULT NULL COMMENT 'Tổng lượt sử dụng tối đa (NULL = không giới hạn)',
  `usage_count` int DEFAULT '0' COMMENT 'Số lượt đã dùng',
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `status` enum('active','inactive','deleted') NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `idx_status` (`status`),
  KEY `idx_code_status` (`code`, `status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =============================================
-- 2. User Addresses (Sổ địa chỉ)
-- =============================================
CREATE TABLE IF NOT EXISTS `user_addresses` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `title` varchar(50) DEFAULT NULL COMMENT 'Tên gợi nhớ: Nhà, Công ty...',
  `recipient_name` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `address` varchar(255) NOT NULL,
  `city` varchar(80) NOT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT '0',
  `status` enum('active','deleted') NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =============================================
-- 3. Product Variants (Biến thể sản phẩm)
-- =============================================
CREATE TABLE IF NOT EXISTS `product_variants` (
  `id` varchar(36) NOT NULL,
  `product_id` varchar(36) NOT NULL,
  `sku` varchar(50) DEFAULT NULL,
  `color` varchar(50) DEFAULT NULL,
  `size` varchar(20) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL COMMENT 'Giá riêng cho variant',
  `sale_price` decimal(10,2) DEFAULT NULL,
  `quantity` int NOT NULL DEFAULT '0' COMMENT 'Tồn kho riêng cho variant',
  `image` varchar(200) DEFAULT NULL,
  `status` enum('active','inactive','deleted') NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sku` (`sku`),
  KEY `idx_product_id` (`product_id`),
  KEY `idx_product_status` (`product_id`, `status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =============================================
-- Thêm cột coupon vào bảng orders
-- =============================================
ALTER TABLE `orders`
  ADD COLUMN `coupon_id` varchar(36) DEFAULT NULL AFTER `user_id`,
  ADD COLUMN `discount_amount` decimal(10,2) DEFAULT '0.00' AFTER `coupon_id`,
  ADD COLUMN `total_amount` decimal(10,2) DEFAULT '0.00' AFTER `discount_amount`;
