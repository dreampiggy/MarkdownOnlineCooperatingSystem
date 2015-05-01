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

 Date: 03/04/2015 19:14:57 PM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `docs`
-- ----------------------------
DROP TABLE IF EXISTS `docs`;
CREATE TABLE `docs` (
  `docID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `content` longtext NOT NULL,
  `author` varchar(11) NOT NULL DEFAULT '',
  `datetime` datetime NOT NULL,
  `userList` varchar(11) NOT NULL DEFAULT '',
  PRIMARY KEY (`docID`)
) ENGINE=InnoDB AUTO_INCREMENT=11122 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `docs`
-- ----------------------------
BEGIN;
INSERT INTO `docs` VALUES ('11111', 'This is the *first* editor.\n------------------------------\n\nJust plain **Markdown**, except that the input is sanitized:\n\n<marquee>I\'m the ghost from the past!</marquee>\n\nand that it implements \"fenced blockquotes\" via a plugin:\n\n\"\"\"\nDo it like this:\n\n1. Have idea.\n2. ???\n3. Profit!\n\"\"\"\n', '11111', '2015-03-04 19:14:36', '{11111}'), ('11114', '', '11111', '2015-03-04 17:51:16', '{11111}'), ('11115', '', '11111', '2015-03-04 17:51:55', '{11111}'), ('11116', '', '11111', '2015-03-04 17:56:20', '{11111}'), ('11117', '', '11111', '2015-03-04 18:03:22', '{11111}'), ('11119', '', '11111', '2015-03-04 18:49:17', '{11111}'), ('11120', '', '11111', '2015-03-04 19:11:06', '{11111}');
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
) ENGINE=InnoDB AUTO_INCREMENT=11112 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `user`
-- ----------------------------
BEGIN;
INSERT INTO `user` VALUES ('11111', null, null, null, 'lizhuoli');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
