-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 20, 2022 at 04:01 PM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mf_analysis`
--

-- --------------------------------------------------------

--
-- Table structure for table `portfolio_holdings`
--

CREATE TABLE `portfolio_holdings` (
  `stock_name` varchar(255) NOT NULL,
  `fund_key` varchar(255) NOT NULL,
  `sector` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  `percentage_of_total_holding` varchar(100) NOT NULL,
  `one_month_change` varchar(100) NOT NULL,
  `one_year_highest_holding` varchar(100) NOT NULL,
  `one_year_lowest_holding` varchar(100) NOT NULL,
  `quantity` varchar(100) NOT NULL,
  `one_month_change_quantity` varchar(100) NOT NULL,
  `date_entered` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_modified` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Triggers `portfolio_holdings`
--
DELIMITER $$
CREATE TRIGGER `portfolioHoldingChangeTrigger` AFTER UPDATE ON `portfolio_holdings` FOR EACH ROW IF old.quantity <> new.quantity THEN
        INSERT INTO portfolio_holdings_logs(fund_key,stock_name,field_name,old_value, new_value)
        VALUES( old.fund_key,old.stock_name,'quantity', old.quantity, new.quantity);
		
		ELSEIF old.percentage_of_total_holding <> new.percentage_of_total_holding THEN
        INSERT INTO portfolio_holdings_logs(fund_key,stock_name,field_name,old_value, new_value)
        VALUES( old.fund_key,old.stock_name,'percentage_of_total_holding', old.percentage_of_total_holding, new.percentage_of_total_holding);
		
		ELSEIF old.value <> new.value THEN
        INSERT INTO portfolio_holdings_logs(fund_key,stock_name,field_name,old_value, new_value)
        VALUES( old.fund_key,old.stock_name,'value', old.value, new.value);
    END IF
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `portfolio_holdings_logs`
--

CREATE TABLE `portfolio_holdings_logs` (
  `id` int(11) NOT NULL,
  `fund_key` varchar(255) NOT NULL,
  `stock_name` varchar(255) NOT NULL,
  `field_name` varchar(255) NOT NULL,
  `old_value` varchar(255) NOT NULL,
  `new_value` varchar(255) NOT NULL,
  `date_entered` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `top_mutual_funds`
--

CREATE TABLE `top_mutual_funds` (
  `fund_key` varchar(100) NOT NULL,
  `sl_num` int(11) NOT NULL,
  `fund_name` varchar(255) NOT NULL,
  `fund_category` varchar(255) NOT NULL,
  `crisil_rank` varchar(255) NOT NULL,
  `aum_in_cr` varchar(255) NOT NULL,
  `1_week_return` varchar(255) NOT NULL,
  `1_month_return` varchar(255) NOT NULL,
  `3_month_return` varchar(255) NOT NULL,
  `6_month_return` varchar(255) NOT NULL,
  `ytd` varchar(255) NOT NULL,
  `1_year_return` varchar(255) NOT NULL,
  `2_year_return` varchar(255) NOT NULL,
  `3_year_return` varchar(255) NOT NULL,
  `5_year_return` varchar(255) NOT NULL,
  `10_year_return` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `portfolio_holdings`
--
ALTER TABLE `portfolio_holdings`
  ADD PRIMARY KEY (`stock_name`,`fund_key`);

--
-- Indexes for table `portfolio_holdings_logs`
--
ALTER TABLE `portfolio_holdings_logs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `top_mutual_funds`
--
ALTER TABLE `top_mutual_funds`
  ADD PRIMARY KEY (`fund_key`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `portfolio_holdings_logs`
--
ALTER TABLE `portfolio_holdings_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
