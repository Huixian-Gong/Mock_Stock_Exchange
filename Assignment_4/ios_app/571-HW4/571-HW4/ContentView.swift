//
//  ContentView.swift
//  571-HW4
//
//  Created by Huixian Gong on 4/8/24.
//

import SwiftUI

struct ContentView: View {
    @EnvironmentObject var portfolioViewModel: PortfolioViewModel
    @EnvironmentObject var watchlistViewModel: WatchlistViewModel
    
    var body: some View {
        HomeScreenView()
    }
}

//#Preview {
//    ContentView()
//}
