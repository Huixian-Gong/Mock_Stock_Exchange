//
//  _71_HW4App.swift
//  571-HW4
//
//  Created by Huixian Gong on 4/8/24.
//

import SwiftUI

@main
struct _71_HW4App: App {
    
    var portfolioViewModel = PortfolioViewModel()
    var watchlistViewModel = WatchlistViewModel()
    var stockDetailViewModel = StockDetailViewModel()
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(portfolioViewModel)
                .environmentObject(watchlistViewModel)
                
                
        }
    }
}
