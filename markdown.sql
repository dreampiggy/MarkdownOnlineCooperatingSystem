/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 50534
 Source Host           : localhost
 Source Database       : markdown

 Target Server Type    : MySQL
 Target Server Version : 50534
 File Encoding         : utf-8

 Date: 03/04/2015 01:29:56 AM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `docs`
-- ----------------------------
DROP TABLE IF EXISTS `docs`;
CREATE TABLE `docs` (
  `docID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `content` longtext,
  `author` varchar(11) DEFAULT NULL,
  `datetime` datetime DEFAULT NULL,
  `userList` varchar(11) DEFAULT NULL,
  PRIMARY KEY (`docID`)
) ENGINE=InnoDB AUTO_INCREMENT=11112 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `docs`
-- ----------------------------
BEGIN;
INSERT INTO `docs` VALUES ('11111', 'This is the *first* editor.\n--------------dkflsakdjflds\n2. ???\n3. Profit!\n\"\"\"\n', '11111', '2015-03-04 01:26:39', '{11111}');
COMMIT;

-- ----------------------------
--  Table structure for `project`
-- ----------------------------
DROP TABLE IF EXISTS `project`;
CREATE TABLE `project` (
  `projectID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `docsList` int(11) DEFAULT NULL,
  `member` int(11) DEFAULT NULL,
  `admin` int(11) DEFAULT NULL,
  PRIMARY KEY (`projectID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `user`
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `userID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `docNum` int(11) DEFAULT NULL,
  `projectNum` int(11) DEFAULT NULL,
  `password` varchar(11) DEFAULT NULL,
  `userName` varchar(11) DEFAULT NULL,
  PRIMARY KEY (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

SET FOREIGN_KEY_CHECKS = 1;
