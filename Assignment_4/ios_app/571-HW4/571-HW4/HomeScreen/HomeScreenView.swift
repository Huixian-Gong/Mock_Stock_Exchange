//
//  HomeScreenView.swift
//  571-HW4
//
//  Created by Huixian Gong on 4/8/24.
//
import SwiftUI

struct HomeScreenView: View {
    @EnvironmentObject var portfolioViewModel: PortfolioViewModel
    @EnvironmentObject var watchlistViewModel: WatchlistViewModel
    
    
//    @StateObject var portfolioViewModel = PortfolioViewModel()
//    @StateObject var watchlistViewModel = WatchlistViewModel()
    
    @State private var searchTicker: String = ""
    
    var body: some View {
        NavigationView {
            Group {
                if searchTicker.isEmpty {
                    regularContent
                } else {
                    SearchResultsView(searchTicker: $searchTicker)
                }
            }
            .navigationTitle("Stocks")
            .toolbar {
                EditButton()
            }
            .searchable(text: $searchTicker)
            .overlay(loadingOverlay)
        }
    }

    // Extracted the regular content into a computed property
    private var regularContent: some View {
        List {
            Text(Date(), style: .date)
                .bold()
                .foregroundStyle(.gray)
                .font(.system(size:30))
                .padding(EdgeInsets(top: 4, leading: 0, bottom: 4, trailing: 0))
            
            portfolioSection
            watchlistSection
            Section { FooterView() }
        }
    }
    
    // Portfolio Section
    private var portfolioSection: some View {
        Section(header: Text("PORTFOLIO")) {
            HStack {
                VStack(alignment: .leading) {
                    Text("Net Worth")
                    Text("$\(portfolioViewModel.netWorth, specifier: "%.2f")").bold()
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                
                VStack(alignment: .leading) {
                    Text("Cash Balance")
                    Text("$\(portfolioViewModel.walletBalance, specifier: "%.2f")").bold()
                }
                .frame(maxWidth: .infinity, alignment: .trailing)
            }
            .font(.system(size: 20))
            
            ForEach(portfolioViewModel.stocks, id: \.ticker) { stock in
                PortfolioStockRowView(
                    ticker: stock.ticker,
                    count: stock.count,
                    price: stock.price,
                    difference: stock.difference,
                    differencePercentage: stock.differencePercentage
                )
            }
            .onMove(perform: portfolioViewModel.moveStocks)
        }
        .onAppear {
            portfolioViewModel.fetchStocks()
            portfolioViewModel.fetchWalletBalance()
        }
    }
    
    // Watchlist Section
    private var watchlistSection: some View {
        Section(header: Text("WATCHLIST")) {
            ForEach(watchlistViewModel.watchlistStocks, id: \.ticker) { stock in
                WatchlistStockRowView(
                    ticker: stock.ticker,
                    companyName: stock.companyName,
                    price: stock.price,
                    difference: stock.difference,
                    differencePercentage: stock.differencePercentage
                )
            }
            .onDelete(perform: watchlistViewModel.removeStock)
            .onMove(perform: watchlistViewModel.moveStocks)
        }
        .onAppear {
            watchlistViewModel.fetchStocks()
        }
    }
    
    // Loading Overlay
    private var loadingOverlay: some View {
        Group {
            if portfolioViewModel.isLoading || watchlistViewModel.isLoading {
                Color.white.edgesIgnoringSafeArea(.all)
                VStack(spacing: 8) {
                    ProgressView().scaleEffect(1.5).progressViewStyle(CircularProgressViewStyle(tint: .gray))
                    Text("Fetching Data...").foregroundStyle(.gray)
                }
            }
        }
    }
}

#Preview {
    HomeScreenView()
}
