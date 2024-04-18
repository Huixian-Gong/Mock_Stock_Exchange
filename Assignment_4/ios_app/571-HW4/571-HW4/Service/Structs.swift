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
    var period: String
    
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

struct StockChart: Codable {
    let ticker: String
    let queryCount: Int
    let resultsCount: Int
    let adjusted: Bool
    let results: [ChartData]
    let status: String
    let requestId: String
    let count: Int

    enum CodingKeys: String, CodingKey {
        case ticker
        case queryCount
        case resultsCount
        case adjusted
        case results
        case status
        case requestId = "request_id"
        case count
    }
    
    struct ChartData: Codable {
        let v: Double
        let vw: Double
        let o: Double
        let c: Double
        let h: Double
        let l: Double
        let t: Double
        let n: Double
    }
}

struct StockInfo: Decodable {
    var ticker: String
    var watchlist: Bool
    var count: Int
    var price: Double

    // Use static function to generate a default instance
    static func defaultInstance(ticker: String) -> StockInfo {
        return StockInfo(ticker: ticker, watchlist: false, count: 0, price: 0.0)
    }
}

