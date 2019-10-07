-- MySQL dump 10.13  Distrib 8.0.17, for Win64 (x86_64)
--
-- Host: localhost    Database: testingapi
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
-- Table structure for table `campaign_data`
--

DROP TABLE IF EXISTS `campaign_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `campaign_data` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `categoryId` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `description` mediumtext NOT NULL,
  `coverImage` varchar(255) NOT NULL,
  `shareCount` int(11) DEFAULT NULL,
  `date_created` datetime NOT NULL,
  `is_deleted` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `campaign_data`
--

LOCK TABLES `campaign_data` WRITE;
/*!40000 ALTER TABLE `campaign_data` DISABLE KEYS */;
/*!40000 ALTER TABLE `campaign_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `campaign_post`
--

DROP TABLE IF EXISTS `campaign_post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `campaign_post` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `campaign_image` varchar(45) NOT NULL,
  `kategory` int(11) DEFAULT NULL,
  `deskripsi` text,
  `target_pemasukan` int(11) DEFAULT NULL,
  `expired` datetime DEFAULT NULL,
  `campaigner_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `sharecount` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `campaign_post`
--

LOCK TABLES `campaign_post` WRITE;
/*!40000 ALTER TABLE `campaign_post` DISABLE KEYS */;
/*!40000 ALTER TABLE `campaign_post` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `campaigner_data`
--

DROP TABLE IF EXISTS `campaigner_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `campaigner_data` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `no_ktp` varchar(45) NOT NULL,
  `foto_ktp` varchar(500) NOT NULL,
  `verification` int(11) NOT NULL DEFAULT '0',
  `userid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `campaigner_data`
--

LOCK TABLES `campaigner_data` WRITE;
/*!40000 ALTER TABLE `campaigner_data` DISABLE KEYS */;
/*!40000 ALTER TABLE `campaigner_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `donasi_data`
--

DROP TABLE IF EXISTS `donasi_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `donasi_data` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `donasi` int(11) NOT NULL,
  `waktu` datetime DEFAULT NULL,
  `campaign_postid` int(11) DEFAULT NULL,
  `anonym` int(11) DEFAULT '0',
  `userid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `donasi_data`
--

LOCK TABLES `donasi_data` WRITE;
/*!40000 ALTER TABLE `donasi_data` DISABLE KEYS */;
/*!40000 ALTER TABLE `donasi_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `receiver_data`
--

DROP TABLE IF EXISTS `receiver_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `receiver_data` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nama` varchar(45) DEFAULT NULL,
  `campaignerid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `receiver_data`
--

LOCK TABLES `receiver_data` WRITE;
/*!40000 ALTER TABLE `receiver_data` DISABLE KEYS */;
/*!40000 ALTER TABLE `receiver_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `password` varchar(65) DEFAULT NULL,
  `email` varchar(45) NOT NULL,
  `name` varchar(255) NOT NULL,
  `address` longtext,
  `status` varchar(12) NOT NULL,
  `LastLogin` datetime NOT NULL,
  `UserImage` varchar(255) DEFAULT NULL,
  `role` varchar(10) NOT NULL,
  `googleId` varchar(65) DEFAULT NULL,
  `facebookId` varchar(65) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,NULL,'rezamusashi@gmail.com','Reza Ardi',NULL,'Verified','2019-10-04 10:48:09','/defaultPhoto/defaultUser.png','User',NULL,'78ba5120997f404efafc5e644d6489a7a6005631ebb4430a1e3353f86b4af7f0');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-10-07 17:28:49
