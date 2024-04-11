//
//  WatchlistModel.swift
//  571-HW4
//
//  Created by Huixian Gong on 4/9/24.
//

import Foundation

struct WatchlistStock: Identifiable, Decodable {
    var ticker: String
    var watchlist: Bool
    var price: Double?
    var difference: Double?
    var differencePercentage: Double?
    var timestamp: Int?
    var companyName: String = ""

    var id: String { ticker }  // Use `ticker` as the unique identifier

    enum CodingKeys: String, CodingKey {
        case ticker, watchlist
    }
    
    // Decoding from JSON includes a default for `watchlist` if it's missing
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        ticker = try container.decode(String.self, forKey: .ticker)
        watchlist = try container.decodeIfPresent(Bool.self, forKey: .watchlist) ?? false
    }
    
    // Standard initializer
    init(ticker: String, watchlist: Bool = false, price: Double? = nil) {
        self.ticker = ticker
        self.watchlist = watchlist
        self.price = price
    }
}



class WatchlistModel {

    

}
