//
//  WatchlistView.swift
//  571-HW4
//
//  Created by Huixian Gong on 4/8/24.
//

import SwiftUI

struct WatchlistView: View {
    @ObservedObject var watchlistViewModel: WatchlistViewModel = WatchlistViewModel()
    var body: some View {
        Text(/*@START_MENU_TOKEN@*/"Hello, World!"/*@END_MENU_TOKEN@*/)
    }
}

#Preview {
    WatchlistView()
}
