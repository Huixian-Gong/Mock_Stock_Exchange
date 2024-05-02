//
//  PortfolioModel.swift
//  571-HW4
//
//  Created by Huixian Gong on 4/8/24.
//

import Foundation

struct PortfolioStock: Decodable {
    var ticker: String
//    let watchlist: Bool
    var count: Int
    var price: Double
    var totalPrice: Double?
    var difference: Double?
    var differencePercentage: Double?
    
}

class PortfolioModel {
    

}
