//
//  StockOwnedView.swift
//  571-HW4
//
//  Created by Huixian Gong on 4/18/24.
//

import SwiftUI

struct StockOwnedView: View {
    @State private var showingTradeSheet = false

    var stockDetail: StockInfo?
    var currPrice: Double?
    var balance: Double?
    var name: String?
    var body: some View {
        if stockDetail?.count ?? 0 > 0 {
            HStack {
                VStack (alignment: .leading, spacing: 10) {
                    HStack {
                        Text("Shares Owned: ")
                        Text("\(stockDetail?.count ?? 0)")
                    }
                    HStack {
                        Text("Avg. Cost / Share: ")
                        Text("$\(averageCostPerShare, specifier: "%.2f")")
                    }
                    HStack {
                        Text("Total Cost: ")
                        Text("$\(stockDetail?.price ?? 0.00, specifier: "%.2f")")
                    }
                    
                    HStack {
                        Text("Change: ")
                        Text("$\( costDiff, specifier: "%.2f")")
                            .foregroundColor(differenceColor)
                    }
                    HStack {
                        Text("Market Value: ")
                        Text("$\(Double(stockDetail?.count ?? 0) * (currPrice ?? 0.00), specifier: "%.2f")")
                            .foregroundColor(differenceColor)
                    }
                }
                .bold()
                .font(.system(size: 15))
                Spacer()
                Button(action: {
                    self.showingTradeSheet = true
                }) {
                    Text("Trade")
                        .fontWeight(.bold)  // Optional: making the text bold
                        .foregroundColor(.white)  // Set the text color to white
                        .padding()
                        .frame(width:140, height: 60)
                }
                .sheet(isPresented: $showingTradeSheet) {
                    // The view that you want to show as a sheet goes here
                    TradeSheetView(stockDetail: stockDetail, stockPrice: currPrice ?? 0, availableFunds: balance ?? 0, name: name ?? "<Company Name>")
                }
                .background(Color.green)  // Set the background color to green
                .clipShape(Capsule())  // Clip the background to a capsule shape
            }
        } else {
            HStack {
                VStack (alignment: .leading, spacing: 10){
                    Text("You have 0 shares of \(stockDetail?.ticker ?? "Ticker"). ")
                    Text("Start trading!")
                }
                .font(.system(size: 15))
                Spacer()
                Button(action: {
                    self.showingTradeSheet = true
                }) {
                    Text("Trade")
                        .fontWeight(.bold)  // Optional: making the text bold
                        .foregroundColor(.white)  // Set the text color to white
                        .padding()
                        .frame(width:140, height:50)
                }
                .background(Color.green)  // Set the background color to green
                .clipShape(Capsule())  // Clip the background to a capsule shape
                .sheet(isPresented: $showingTradeSheet) {
                    // The view that you want to show as a sheet goes here
                    TradeSheetView(stockDetail: stockDetail, stockPrice: currPrice ?? 0, availableFunds: balance ?? 0, name: name ?? "<Company Name>")
                }
            }
        }
        
        
        
        
    }
    private var averageCostPerShare: Double {
            if let price = stockDetail?.price, let count = stockDetail?.count, count > 0 {
                return price / Double(count)
            } else {
                return 0  // Return 0 if count is 0 or if either value is nil
            }
        }
    private var costDiff: Double {
        return (currPrice ?? 0) - averageCostPerShare
        }
    private var differenceColor: Color {
            if costDiff == 0 {
                return .gray
            } else {
                return costDiff < 0 ? .red : .green
            }
        }
}

#Preview {
    StockOwnedView(stockDetail: StockInfo(ticker: "AAPL", watchlist: false, count: 0, price: 1.1), currPrice: 0.5, name: "Apple")
}
