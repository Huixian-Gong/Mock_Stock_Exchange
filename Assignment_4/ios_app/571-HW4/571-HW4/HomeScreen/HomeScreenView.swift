//
//  HomeScreenView.swift
//  571-HW4
//
//  Created by Huixian Gong on 4/8/24.
//

import SwiftUI

struct HomeScreenView: View {
    
    @Environment(\.editMode) var editMode
    
    @StateObject var homeScreenViewModel = HomeScreenViewModel()
    @StateObject var portfolioViewModel = PortfolioViewModel()
    @StateObject var watchlistViewModel = WatchlistViewModel()
    
    var body: some View {
        NavigationView {
            List {
                Text(Date(), style: .date)
                    .bold()
                    .foregroundStyle(.gray)
                    .font(.system(size:30))
                    .padding(EdgeInsets(top: 4, leading: 0, bottom: 4, trailing: 0))
                
                Section(header: Text("PORTFOLIO")) {
                    HStack {
                        VStack(alignment: .leading) {
                            Text("Net Worth")
                            Text("$\(portfolioViewModel.netWorth, specifier: "%.2f")")
                                .bold()
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        
                        VStack(alignment: .leading) {
                            Text("Cash Balance")
                            Text("$\(portfolioViewModel.walletBalance, specifier: "%.2f")")
                                .bold()
                        }
                        .frame(maxWidth: .infinity, alignment: .trailing)
                    }
                    .font(.system(size: 20))
                    
                    ForEach(portfolioViewModel.stocks, id: \.ticker) { stock in
                        NavigationLink(destination: Text("Destination")) {
                            
                            HStack {
                                VStack(alignment: .leading) {
                                    Text(stock.ticker)
                                        .font(.system(size: 20))
                                        .bold()
                                    Text("\(stock.count) shares")
                                        .font(.system(size: 15))
                                        .foregroundStyle(.gray)
                                }
                                
                                VStack {
                                    Text("$\(stock.price, specifier: "%.2f")")
                                        .bold()
                                        .frame(maxWidth:.infinity, alignment: .trailing)
                                    HStack {
                                        let differenceColor = stock.difference.map { $0 < 0 ? Color.red : Color.green } ?? Color.gray
                                        
                                        Image(systemName: stock.difference.flatMap { $0 < 0 ? "arrow.down.right" : "arrow.up.right" } ?? "arrow.up.right")
                                            .foregroundColor(differenceColor)
                                            .font(.system(size: 20))
                                        
                                        Text("$\(stock.difference ?? 0, specifier: "%.2f")")
                                            .foregroundColor(differenceColor)
                                        
                                        Text("(\(stock.differencePercentage ?? 0, specifier: "%.2f")%)")
                                            .foregroundColor(differenceColor)
                                    }
                                    .font(.system(size: 14))
                                    .frame(maxWidth:.infinity, alignment: .trailing)
                                }
                            }
                        }
                    }
                    .onMove(perform: portfolioViewModel.moveStocks)
                    
                }.onAppear {
                    portfolioViewModel.fetchStocks()
                    portfolioViewModel.fetchWalletBalance()
                    
                }
                
                Section(header: Text("WATCHLIST")) {
                    ForEach(watchlistViewModel.watchlistStocks, id: \.ticker) { stock in
                        NavigationLink(destination: Text("Destination")) {
                            HStack {
                                VStack(alignment: .leading) {
                                    Text(stock.ticker)
                                        .font(.system(size: 20))
                                        .bold()
                                    Text("\(stock.companyName)")
                                        .font(.system(size: 15))
                                        .foregroundStyle(.gray)
                                }
                                
                                VStack {
                                    Text("$\(stock.price ?? 0, specifier: "%.2f")")
                                        .bold()
                                        .frame(maxWidth:.infinity, alignment: .trailing)
                                    HStack {
                                        let differenceColor = stock.difference.map { $0 < 0 ? Color.red : Color.green } ?? Color.gray
                                        
                                        Image(systemName: stock.difference.flatMap { $0 < 0 ? "arrow.down.right" : "arrow.up.right" } ?? "arrow.up.right")
                                            .foregroundColor(differenceColor)
                                            .font(.system(size: 20))
                                        
                                        Text("$\(stock.difference ?? 0, specifier: "%.2f")")
                                            .foregroundColor(differenceColor)
                                        
                                        Text("(\(stock.differencePercentage ?? 0, specifier: "%.2f")%)")
                                            .foregroundColor(differenceColor)
                                    }
                                    .font(.system(size: 14))
                                    .frame(maxWidth:.infinity, alignment: .trailing)
                                }
                            }
                        }
                    }
                    .onDelete(perform: watchlistViewModel.removeStock)
                    .onMove(perform: watchlistViewModel.moveStocks)
                    
                }.onAppear {
                    watchlistViewModel.fetchStocks()
                }
                
                
                Section{
                    FooterView()
                }
            }
            .navigationTitle("Stocks")
            .toolbar {
                EditButton()
            }
            .blur(radius: (portfolioViewModel.isLoading || watchlistViewModel.isLoading) ? 10 : 0)
            
            
        }
    }
    
    
}


#Preview {
    HomeScreenView()
}
