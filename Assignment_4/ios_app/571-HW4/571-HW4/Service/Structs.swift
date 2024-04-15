//
//  Structs.swift
//  571-HW4
//
//  Created by Huixian Gong on 4/11/24.
//

import Foundation

struct StockProfile: Decodable {
    var exchange: String
    var finnhubIndustry: String
    var name: String
    var ipo: String
    var weburl: String
    
}


struct StockQuote: Decodable {
    var c: Double
    var d: Double?
    var dp: Double
    var h: Double
    var l: Double
    var o: Double
    var pc: Double
    var t: Int
}

struct StockNews: Decodable {
    var datetime: Int
    var headline: String
    var image: String
    var source: String
    var summary: String
    var url: String
}

struct StockRecommendation: Decodable {
    var buy: Int
    var hold: Int
    var period: String
    var sell: Int
    var strongBuy: Int
    var strongSell: Int
}

struct StockEarnings: Decodable {
    var actual: Double
    var estimate: Double
    var quarter: Int
    var surprise: Double
    var surprisePercent: Double
    
}

struct StockInsider: Decodable {
    var year: Int
    var month: Int
    var change: Double
    var mspr: Double
}

struct InsiderAggregates {
    var totalMspr: Double
    var positiveMspr: Double
    var negativeMspr: Double
    var totalChange: Double
    var positiveChange: Double
    var negativeChange: Double
}

struct StockHourly: Codable {
    var t: Double    // Timestamp
    var c: Double // Closing price
}

struct HourlyResponse: Codable {
    var results: [StockHourly]
}
