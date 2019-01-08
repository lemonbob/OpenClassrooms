-- phpMyAdmin SQL Dump
-- version 4.8.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 21, 2018 at 12:05 PM
-- Server version: 10.1.34-MariaDB
-- PHP Version: 7.2.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `expressfood`
--

--
-- Dumping data for table `address`
--

INSERT INTO `address` (`address_id`, `customer_id`, `street_address`, `postcode`) VALUES
(1, 1, '12 Park Avenue\r\nNew York\r\n', '10012'),
(2, 1, '315 Lower East Side\r\nNew York', '10002'),
(3, 2, '145 Greenwich Village\r\nNew York', '10013'),
(4, 3, 'Apartment 223a\r\nManhattan Plaza\r\nNew York', '10003'),
(5, 4, 'Apartment 54\r\nDockland View\r\nNew York', '10003'),
(6, 4, '34 Park Drive\r\nNew York', '10014');

--
-- Dumping data for table `batch_stock`
--

INSERT INTO `batch_stock` (`batch_id`, `menu_id`, `stock_level`, `use_by_date`) VALUES
(5, 1, 23, '2018-12-30'),
(6, 2, 27, '2018-12-31'),
(7, 3, 33, '2019-01-17'),
(8, 4, 36, '2019-01-23'),
(9, 5, 5, '2019-01-02'),
(10, 6, 7, '2018-12-31'),
(11, 7, 12, '2019-01-23'),
(12, 8, 3, '2019-01-30');

--
-- Dumping data for table `customer_info`
--

INSERT INTO `customer_info` (`customer_id`, `first_name`, `last_name`) VALUES
(1, 'Will', 'Smith'),
(2, 'Matt', 'Damon'),
(3, 'Cameron', 'Diaz'),
(4, 'Denzel', 'Washington');

--
-- Dumping data for table `delivery_biker`
--

INSERT INTO `delivery_biker` (`biker_id`, `first_name`, `last_name`, `shift_status`, `hours_on_shift`) VALUES
(1, 'Bob', 'Speedwell', 1, 15.2),
(2, 'David', 'Wheelie', 1, 7.5),
(3, 'Max', 'Shimano', 0, 16.7),
(4, 'Theresa', 'Brakes', 0, 13.4);

--
-- Dumping data for table `menu`
--

INSERT INTO `menu` (`menu_id`, `dish_name`, `price`, `main_or_dessert`, `daily_item`, `last_date_on`) VALUES
(1, 'Chicken Cacciatore', '15.95', 0, 1, '2018-12-19'),
(2, 'Boeuf Bourguignon', '19.95', 0, 1, '2018-12-19'),
(3, 'Caramel Slice', '7.95', 1, 1, '2018-12-19'),
(4, 'New York Cheese Cake', '7.95', 1, 1, '2018-12-19'),
(5, 'Chicken Danzak', '13.95', 0, 0, '2018-12-20'),
(6, 'Lamb Tagine', '12.45', 0, 0, '2018-12-20'),
(7, 'Crème Brûlée ', '5.95', 1, 0, '2018-12-20'),
(8, 'Strawberry Parfait', '7.95', 1, 0, '2018-12-20');

--
-- Dumping data for table `order_basket`
--

INSERT INTO `order_basket` (`order_id`, `menu_id`, `quantity`, `purchase_price`) VALUES
(1, 2, 12, '19.95'),
(1, 3, 7, '7.95'),
(2, 3, 34, '7.95'),
(2, 4, 22, '7.95'),
(2, 1, 15, '15.95'),
(2, 2, 17, '19.95'),
(3, 1, 2, '15.95'),
(3, 4, 2, '7.95'),
(4, 1, 5, '15.95'),
(4, 2, 4, '19.95'),
(4, 3, 3, '7.95'),
(4, 4, 7, '7.95'),
(5, 7, 22, '5.95'),
(5, 8, 26, '7.95'),
(5, 6, 2, '12.45'),
(5, 5, 2, '13.95'),
(6, 5, 3, '13.95'),
(6, 6, 7, '12.45');

--
-- Dumping data for table `order_number`
--

INSERT INTO `order_number` (`order_id`, `customer_id`, `address_id`, `biker_id`, `order_date`, `order_time`, `delivery_time`) VALUES
(1, 1, 1, 1, '2018-12-19', '18:08:00', '18:18:00'),
(2, 2, 3, 2, '2018-12-19', '19:23:00', '19:38:00'),
(3, 3, 4, 1, '2018-12-19', '19:25:15', '19:41:16'),
(4, 4, 5, 2, '2018-12-19', '20:11:30', '20:16:43'),
(5, 2, 3, 3, '2018-12-20', '17:26:13', '17:40:15'),
(6, 1, 2, 4, '2018-12-20', '17:28:44', '17:38:00');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
