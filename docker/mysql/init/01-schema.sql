-- Adminer 4.8.1 MySQL 8.0.31 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

CREATE DATABASE `chat` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `chat`;

DROP TABLE IF EXISTS `bans`;
CREATE TABLE `bans` (
                        `id` int unsigned NOT NULL AUTO_INCREMENT,
                        `start_time` timestamp NULL DEFAULT NULL,
                        `end_time` timestamp NULL DEFAULT NULL,
                        `user_id` int unsigned NOT NULL,
                        `ip_address` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin DEFAULT NULL,
                        `room_id` int unsigned DEFAULT NULL,
                        `moderator_id` int unsigned NOT NULL,
                        `reason` text CHARACTER SET utf8mb3 COLLATE utf8mb3_bin,
                        `deleted_at` timestamp NULL DEFAULT NULL,
                        PRIMARY KEY (`id`),
                        KEY `user_id` (`user_id`),
                        KEY `ip_address` (`ip_address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='moderator_id = banned_by';


DROP TABLE IF EXISTS `chat_messages`;
CREATE TABLE `chat_messages` (
                                 `id` int unsigned NOT NULL AUTO_INCREMENT,
                                 `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                 `room_id` int unsigned NOT NULL,
                                 `user_id` int unsigned NOT NULL,
                                 `message_text` text CHARACTER SET utf8mb3 COLLATE utf8mb3_bin,
                                 `deleted_at` timestamp NULL DEFAULT NULL,
                                 PRIMARY KEY (`id`),
                                 KEY `room_id` (`room_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;


DROP TABLE IF EXISTS `connections`;
CREATE TABLE `connections` (
                               `id` int unsigned NOT NULL AUTO_INCREMENT,
                               `created_at` timestamp NULL DEFAULT NULL,
                               `socket_id` varchar(32) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
                               `ip_address` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
                               `user_agent` text CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci,
                               `user_id` int unsigned DEFAULT NULL,
                               `room_id` int unsigned DEFAULT NULL,
                               `updated_at` timestamp NULL DEFAULT NULL,
                               `deleted_at` timestamp NULL DEFAULT NULL,
                               PRIMARY KEY (`id`),
                               KEY `socket_id` (`socket_id`),
                               KEY `user_id` (`user_id`),
                               KEY `room_id` (`room_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;


DROP TABLE IF EXISTS `moderators`;
CREATE TABLE `moderators` (
                              `id` int unsigned NOT NULL AUTO_INCREMENT,
                              `created_at` timestamp NULL DEFAULT NULL,
                              `updated_at` timestamp NULL DEFAULT NULL,
                              `user_id` int unsigned NOT NULL,
                              `room_id` int DEFAULT NULL,
                              `can_view_ip` tinyint unsigned NOT NULL DEFAULT '0',
                              `can_purge` tinyint unsigned NOT NULL DEFAULT '1',
                              `deleted_at` timestamp NULL DEFAULT NULL,
                              PRIMARY KEY (`id`),
                              KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;


DROP TABLE IF EXISTS `rooms`;
CREATE TABLE `rooms` (
                         `id` int unsigned NOT NULL AUTO_INCREMENT,
                         `created_at` timestamp NULL DEFAULT NULL,
                         `uid` varchar(32) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
                         `user_id` int unsigned NOT NULL,
                         `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
                         `description` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin DEFAULT NULL,
                         `slow_mode` int DEFAULT NULL,
                         `updated_at` timestamp NULL DEFAULT NULL,
                         `deleted_at` timestamp NULL DEFAULT NULL,
                         PRIMARY KEY (`id`),
                         KEY `uid` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;


DROP TABLE IF EXISTS `sessions`;
CREATE TABLE `sessions` (
                            `id` int unsigned NOT NULL AUTO_INCREMENT,
                            `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                            `user_id` int unsigned NOT NULL,
                            `token` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL DEFAULT '',
                            `revoked_at` timestamp NULL DEFAULT NULL,
                            `client_ip` int DEFAULT NULL,
                            `user_agent` varchar(50) DEFAULT NULL,
                            PRIMARY KEY (`id`),
                            KEY `token` (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;


DROP TABLE IF EXISTS `settings`;
CREATE TABLE `settings` (
                            `id` int unsigned NOT NULL AUTO_INCREMENT,
                            `created_at` timestamp NULL DEFAULT NULL,
                            `updated_at` timestamp NULL DEFAULT NULL,
                            `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
                            `value` text CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
                            `meta_json` text CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci,
                            PRIMARY KEY (`id`),
                            KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;


DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
                         `id` int unsigned NOT NULL AUTO_INCREMENT,
                         `created_at` timestamp NULL DEFAULT NULL,
                         `uid` varchar(255) DEFAULT NULL,
                         `username` varchar(255) DEFAULT NULL,
                         `password` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
                         `is_guest` tinyint unsigned NOT NULL,
                         `display_name` varchar(255) DEFAULT NULL,
                         `display_name_updated_at` timestamp NULL DEFAULT NULL,
                         `picture_url` varchar(255) DEFAULT NULL,
                         `ip_address` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
                         `country_code` char(2) DEFAULT NULL,
                         `auth_token` varchar(32) NOT NULL,
                         `deleted_at` timestamp NULL DEFAULT NULL,
                         PRIMARY KEY (`id`) USING BTREE,
                         KEY `auth_token` (`auth_token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;


-- 2022-12-31 03:59:44