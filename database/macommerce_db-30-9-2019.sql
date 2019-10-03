-- MySQL dump 10.13  Distrib 8.0.17, for Win64 (x86_64)
--
-- Host: localhost    Database: macommerce_db
-- ------------------------------------------------------
-- Server version	8.0.17

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `productId` int(11) NOT NULL,
  `small` int(11) DEFAULT '0',
  `medium` int(11) DEFAULT '0',
  `large` int(11) DEFAULT '0',
  `xlarge` int(11) DEFAULT '0',
  `price` int(11) NOT NULL,
  `total_price` int(11) NOT NULL DEFAULT '0',
  `userId` int(11) NOT NULL,
  `is_deleted` tinyint(1) NOT NULL,
  `move_to_transaction` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (16,3,0,0,1,0,250000,250000,2,1,0),(17,4,0,35,0,0,200000,7000000,2,1,1),(18,4,0,14,0,0,200000,2800000,2,1,0),(27,5,0,0,2,0,300000,600000,2,0,1);
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `parentId` int(11) DEFAULT NULL,
  `categoryImage` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_constraint_parentId_idx` (`parentId`),
  CONSTRAINT `id_constraint_parentId` FOREIGN KEY (`parentId`) REFERENCES `category` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'Men',NULL,'/category/MaCommerce-1568817676501.jpg'),(2,'T-Shirt',1,NULL),(3,'Pants',1,NULL),(4,'Women',NULL,'/category/MaCommerce-1568817994227.jpg'),(5,'Skirt',4,NULL),(6,'Dress',4,NULL),(13,'Sweater',4,NULL);
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS `comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `comment` text NOT NULL,
  `commentId` int(11) DEFAULT NULL,
  `date_created` datetime NOT NULL,
  `is_edited` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment`
--

LOCK TABLES `comment` WRITE;
/*!40000 ALTER TABLE `comment` DISABLE KEYS */;
INSERT INTO `comment` VALUES (1,2,4,'test 123',NULL,'2019-09-27 08:54:12',0),(2,3,4,'12345',NULL,'2019-09-27 08:57:03',0),(3,2,3,'123456',NULL,'2019-09-27 09:02:09',0),(4,2,2,'Test 123',NULL,'2019-09-27 18:27:25',0),(5,3,2,'Test 123',NULL,'2019-09-27 20:05:53',0),(6,3,2,'Halo dunia',NULL,'2019-09-27 20:06:07',0),(7,2,5,'1234444',NULL,'2019-09-27 20:30:11',0),(8,2,5,'Halo test 123',NULL,'2019-09-27 20:30:21',0),(9,2,5,'Halo dunia................',NULL,'2019-09-27 20:30:55',0),(10,2,5,'Kapan stock S untuk product ini tersedia?\n',NULL,'2019-09-27 20:31:57',0),(11,2,6,'Test 123',NULL,'2019-09-29 13:03:48',0),(14,2,4,'67890',2,'2019-09-30 19:04:24',0),(15,2,4,'Halo dunia',2,'2019-09-30 19:48:36',0),(16,1,5,'Untuk stock S akan tersedia 3 hari lagi. Mohon maaf kami akan update stock productnya. :)',10,'2019-09-30 19:51:00',0),(17,1,5,'Silahkan untuk melihat lihat barang yang lain. Semoga ada barang yang kk tertarik',10,'2019-09-30 19:51:53',0);
/*!40000 ALTER TABLE `comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification` (
  `userId` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `commentId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
INSERT INTO `notification` VALUES (2,4,1),(3,4,2),(2,3,3),(2,2,4),(3,2,5),(3,2,6),(2,5,7),(2,5,8),(2,5,9),(2,5,10),(2,6,11),(2,4,2),(2,4,2),(2,4,2),(1,5,10),(1,5,10);
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `categoryId` int(11) NOT NULL,
  `subcategoryId` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `description` mediumtext NOT NULL,
  `coverImage` varchar(255) NOT NULL,
  `popularCount` int(11) DEFAULT NULL,
  `date_created` datetime NOT NULL,
  `is_deleted` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (1,'Western',4,5,150000,'Western Skirt','/product/MaCommerceProduct-1567892301227.jpg',0,'2019-09-08 04:38:21',1),(2,'Yellow Skirts',4,5,200000,'Yellow Skirt','/product/MaCommerceProduct-1567908591709.jpg',1,'2019-09-18 21:47:53',0),(3,'Black Pants',1,3,250000,'Black Pants Product For Men','/product/MaCommerceProduct-1567908644748.jpg',2,'2019-09-18 21:48:18',0),(4,'Kombat Green T-Shirt',1,3,200000,'Kombat Green T-Shirt, Product for Men','/product/MaCommerceProduct-1567908700173.jpg',2,'2019-09-18 21:48:45',0),(5,'Black Pants with Red Stripes',1,3,300000,'Black Pants with Red Stripe, Product for Men','/product/MaCommerceProduct-1567908769463.jpg',2,'2019-09-16 19:48:26',0),(6,'White T-Shirt',1,2,250000,'White T-Shirt, Product for Men ','/product/MaCommerceProduct-1567908818130.jpg',2,'2019-09-18 21:49:06',0),(7,'Glossys Skirt',4,5,200000,'Glossy Skirt, Product for Women','/product/MaCommerceProduct-1567908876106.jpg',0,'2019-09-18 21:49:29',0),(8,'Darian Dress',4,6,350000,'Darian Dress Product For Women','/product/MaCommerceProduct-1568851412822.jpg',0,'2019-09-19 07:03:33',0),(9,'Esme Sweatshirt',4,13,400000,'Esme Sweatshirt Product For Women. New Product by MaCommerce','/product/MaCommerceProduct-1568851840569.jpg',0,'2019-09-19 07:10:41',0),(11,'Durian',4,15,1,'1','/product/MaCommerceProduct-1568853037375.jpg',1,'2019-09-19 07:30:38',1),(12,'test 123',4,15,2,'2','/product/MaCommerceProduct-1568853059937.jpg',1,'2019-09-19 07:31:00',1),(13,'asdasd',16,17,2,'2','/product/MaCommerceProduct-1568854315368.jpg',1,'2019-09-19 07:51:55',1);
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_image`
--

DROP TABLE IF EXISTS `product_image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_image` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `imagePath` varchar(255) NOT NULL,
  `productId` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_image`
--

LOCK TABLES `product_image` WRITE;
/*!40000 ALTER TABLE `product_image` DISABLE KEYS */;
INSERT INTO `product_image` VALUES (3,'/product/MaCommerceProduct-1567892301330.jpg',1),(4,'/product/MaCommerceProduct-1567892301339.jpg',1),(5,'/product/MaCommerceProduct-1567908591759.jpg',2),(6,'/product/MaCommerceProduct-1567908591759.jpg',2),(7,'/product/MaCommerceProduct-1567908644769.jpg',3),(8,'/product/MaCommerceProduct-1567908644769.jpg',3),(9,'/product/MaCommerceProduct-1567908700288.jpg',4),(10,'/product/MaCommerceProduct-1567908700288.jpg',4),(11,'/product/MaCommerceProduct-1567908769496.jpg',5),(12,'/product/MaCommerceProduct-1567908769496.jpg',5),(13,'/product/MaCommerceProduct-1567908818138.jpg',6),(14,'/product/MaCommerceProduct-1567908818138.jpg',6),(15,'/product/MaCommerceProduct-1567908876122.jpg',7),(16,'/product/MaCommerceProduct-1567908876122.jpg',7),(17,'/product/MaCommerceProduct-1568851412861.jpg',8),(18,'/product/MaCommerceProduct-1568851412875.jpg',8),(19,'/product/MaCommerceProduct-1568851840579.jpg',9),(20,'/product/MaCommerceProduct-1568851840606.jpg',9),(21,'/product/MaCommerceProduct-1568852411342.jpg',10),(22,'/product/MaCommerceProduct-1568852411342.jpg',10),(23,'/product/MaCommerceProduct-1568853037405.jpg',11),(24,'/product/MaCommerceProduct-1568853037427.jpg',11),(25,'/product/MaCommerceProduct-1568853059987.jpg',12),(26,'/product/MaCommerceProduct-1568853060038.jpg',12),(27,'/product/MaCommerceProduct-1568854315392.jpg',13),(28,'/product/MaCommerceProduct-1568854315419.jpg',13);
/*!40000 ALTER TABLE `product_image` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stockproduct`
--

DROP TABLE IF EXISTS `stockproduct`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stockproduct` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `small` int(11) NOT NULL,
  `medium` int(11) NOT NULL,
  `large` int(11) NOT NULL,
  `xlarge` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='	';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stockproduct`
--

LOCK TABLES `stockproduct` WRITE;
/*!40000 ALTER TABLE `stockproduct` DISABLE KEYS */;
INSERT INTO `stockproduct` VALUES (1,0,12,12,0,1),(2,1,1,1,1,1),(3,0,7,5,0,2),(4,3,10,10,5,3),(5,0,5,5,5,4),(6,0,10,5,0,5),(7,0,5,5,0,6),(8,5,10,10,5,7),(9,20,15,15,5,8),(10,5,10,10,5,9),(11,5,5,3,11,10),(12,1,1,1,0,11),(13,1,8,2,2,12),(14,1,0,1,1,13);
/*!40000 ALTER TABLE `stockproduct` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transaction`
--

DROP TABLE IF EXISTS `transaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaction` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `kodeTransaksi` varchar(100) NOT NULL,
  `transactionImage` varchar(100) DEFAULT NULL,
  `total_price` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `date_created` datetime NOT NULL,
  `is_deleted` int(11) NOT NULL,
  `firstName` varchar(45) NOT NULL,
  `lastName` varchar(45) NOT NULL,
  `addressUser` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaction`
--

LOCK TABLES `transaction` WRITE;
/*!40000 ALTER TABLE `transaction` DISABLE KEYS */;
INSERT INTO `transaction` VALUES (1,'MaCommerce1569737974700',NULL,600000,2,10,'2019-09-29 13:19:35',0,'qwe','123','Jalan Pakubuwono 1 No.10 Perumnas 3 Kelurahan Cibodas Baru Kecamatan Cibodas');
/*!40000 ALTER TABLE `transaction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transaction_detail`
--

DROP TABLE IF EXISTS `transaction_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaction_detail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `productId` int(11) NOT NULL,
  `small` int(11) DEFAULT '0',
  `medium` int(11) DEFAULT '0',
  `large` int(11) DEFAULT '0',
  `xlarge` int(11) DEFAULT '0',
  `price` int(11) NOT NULL,
  `total_price` int(11) NOT NULL DEFAULT '0',
  `transactionId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `is_deleted` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaction_detail`
--

LOCK TABLES `transaction_detail` WRITE;
/*!40000 ALTER TABLE `transaction_detail` DISABLE KEYS */;
INSERT INTO `transaction_detail` VALUES (1,5,0,0,2,0,300000,600000,1,2,0);
/*!40000 ALTER TABLE `transaction_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(16) NOT NULL,
  `password` varchar(65) NOT NULL,
  `email` varchar(45) NOT NULL,
  `FirstName` varchar(255) NOT NULL,
  `LastName` varchar(255) NOT NULL,
  `address` longtext NOT NULL,
  `status` varchar(12) NOT NULL,
  `LastLogin` datetime NOT NULL,
  `UserImage` varchar(255) DEFAULT NULL,
  `role` varchar(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'adminMa1997','7b24718bd586fb2cb9757822d359a8fbdfb0a804e2af474b68a0ae29ec3d384b','rezardiansyah1997@gmail.com','Reza','Ardiansyah','Kota Tangerang','Verified','2019-08-30 20:24:12','/admin/images/adminProfilePictures.png','Admin'),(2,'user123','70c7f533f04ec32bb092efc88854934cbcbc1f35fa1476f507324721b65b003c','rezamusashi@gmail.com','RezaM','Ardiansyah','Jalan Karawaci 1 RT.002 / RW.006 Kota Tangerang....','Verified','2019-08-30 20:25:44','/users/images/MaCommerce-1567171543697.jpg','User'),(3,'ardi1997','70c7f533f04ec32bb092efc88854934cbcbc1f35fa1476f507324721b65b003c','yubikitta@gmail.com','Reza','Ardiansyah','Kota Tangerang','Verified','2019-09-15 21:18:08','/users/images/MaCommerce-1568557087701.png','User');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wishlist`
--

DROP TABLE IF EXISTS `wishlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wishlist` (
  `productId` int(11) NOT NULL,
  `userId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishlist`
--

LOCK TABLES `wishlist` WRITE;
/*!40000 ALTER TABLE `wishlist` DISABLE KEYS */;
INSERT INTO `wishlist` VALUES (5,3),(4,3),(4,2),(6,2),(6,3),(2,3),(3,3),(3,2),(10,2),(12,2),(11,2),(13,2),(5,2);
/*!40000 ALTER TABLE `wishlist` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-09-30 19:56:30
