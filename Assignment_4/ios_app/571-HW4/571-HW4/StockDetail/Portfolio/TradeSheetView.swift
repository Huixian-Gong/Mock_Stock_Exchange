//
//  TradeSheetView.swift
//  571-HW4
//
//  Created by Huixian Gong on 4/18/24.
//

import SwiftUI

struct TradeSheetView: View {
    @Environment(\.presentationMode) var presentationMode
    @State private var numberOfShares = ""
    var stockDetail: StockInfo?
    @StateObject private var viewModel = StockDetailViewModel()
    var stockPrice: Double
    var availableFunds: Double // This should also be dynamically fetched
    var name: String
    @State private var showToast = false
    @State private var toastMessage = ""
    @State private var toastOpacity = 0.0
    @State private var tradeType: String = ""
    @State private var success: Bool = false
    @State private var shareTrade: Int = 0
    @EnvironmentObject var portfolioViewModel: PortfolioViewModel
    @EnvironmentObject var watchlistViewModel: WatchlistViewModel
    
    var body: some View {
        ZStack {
            if !success {
                NavigationView{
                    VStack {
                        // Header with close button
                        Text("Trade \(name) shares")
                            .font(.headline)
                            .padding(.bottom, 5)
                        let shareCount = Int(numberOfShares) ?? 0
                        Spacer()
                        VStack {
                            HStack {
                                // TextField for number of shares
                                TextField("0", text: $numberOfShares)
                                
                                    .font(.system(size: 100))
                                    .frame(maxWidth: .infinity, alignment: .leading)
                                
                                Spacer()
                                // Dynamic share/shares text
                                Text(shareCount == 1 || shareCount == 0 ? "Share" : "Shares")
                                    .font(.system(size: 30))
                                    .foregroundColor(.black)
                                    .frame(maxHeight:80, alignment: .bottom)
                                
                                
                            }
                            .padding(.vertical)
                            // Calculation result
                            Text("× $\(stockPrice, specifier: "%.2f")/share = $\(Double(shareCount) * stockPrice, specifier: "%.2f")")
                                .font(.system(size: 15))
                                .foregroundColor(.black)
                                .padding(.bottom, 5)
                                .frame(maxWidth: .infinity, alignment: .trailing)
                            
                        }
                        Spacer()
                        
                        // Available funds
                        Text("$\(availableFunds, specifier: "%.2f") available to buy \(stockDetail?.ticker ?? "<Ticker>")")
                            .font(.caption)
                            .foregroundColor(.gray)
                            .padding(.bottom, 20)
                        
                        // Buy and Sell buttons
                        HStack(spacing: 20) {
                            Button(action: {
                                if (!numberOfShares.allSatisfy({ $0.isNumber })) && (numberOfShares != "-1") {
                                    toastMessage = "Please enter a valid amount"
                                    showToast = true

                                } else if (Double(shareCount) * stockPrice > availableFunds ?? 0) {
                                    toastMessage = "Not enough money to buy"
                                    showToast = true

                                } else if (shareCount <= 0) {
                                    toastMessage = "Cannot buy non-positive shares"
                                    showToast = true

                                } else {
                                    tradeType = "bought"
                                    shareTrade = shareCount
                                    portfolioViewModel.buyStock(for: stockDetail?.ticker ?? "TICKER", count: shareCount, price: stockPrice)
                                    withAnimation{
                                        success = true
                                    }
                                }
                            }) {
                                Text("Buy")
                                    .frame(minWidth: 0, maxWidth: .infinity)
                                    .padding()
                                    .foregroundColor(.white)
                                    .background(Color.green)
                                    .cornerRadius(40)
                            }
                            Button(action: {
                                if (!numberOfShares.allSatisfy({ $0.isNumber })) && (numberOfShares != "-1") {
                                    toastMessage = "Please enter a valid amount"
                                    showToast = true

                                } else if (shareCount > portfolioViewModel.getCount(for: stockDetail?.ticker ?? "Ticker")) {
                                    toastMessage = "Not Enough shares to sell"
                                    showToast = true

                                } else if (shareCount <= 0) {
                                    toastMessage = "Cannot sell non-positive shares"
                                    showToast = true

                                } else {
                                    if shareCount == portfolioViewModel.getCount(for: stockDetail?.ticker ?? "Ticker") {
                                        portfolioViewModel.sellStock(for: stockDetail?.ticker ?? "TICKER", count: shareCount, price: stockPrice, sellAll: 0)
                                    } else  {
                                        portfolioViewModel.sellStock(for: stockDetail?.ticker ?? "TICKER", count: shareCount, price: stockPrice, sellAll: 1)
                                    }
                                    tradeType = "sold"
                                    shareTrade = shareCount
                                    withAnimation {
                                        success = true
                                    }
                                    portfolioViewModel.fetchStocks()
                                }
                            }) {
                                Text("Sell")
                                    .frame(minWidth: 0, maxWidth: .infinity)
                                    .padding()
                                    .foregroundColor(.white)
                                    .background(Color.green)
                                    .cornerRadius(40)
                            }
                        }
                        .padding(.horizontal)
                        
                        
                    }
                    .padding()
                    .navigationBarItems(trailing: Button(action: {
                        self.presentationMode.wrappedValue.dismiss()
                    }) {
                        Image(systemName: "xmark")
                            .foregroundColor(.black)
                            .imageScale(.medium)
                    })
                    
                }
                
                if showToast {
                    VStack {
                        Spacer()
                        ToastView(message: toastMessage)
                            .opacity(toastOpacity)  // Use the opacity state for the fade animation
                            .onAppear {
                                withAnimation(.easeIn(duration: 0.2)) {
                                    toastOpacity = 1.0
                                }
                                // Schedule the fade out after 3 seconds
                                DispatchQueue.main.asyncAfter(deadline: .now() + 3) {
                                    withAnimation(.easeOut(duration: 0.2)) {
                                        toastOpacity = 0.0
                                    }
                                }
                                DispatchQueue.main.asyncAfter(deadline: .now() + 3.2) {
                                    showToast = false
                                }
                            }
                    }
                    .padding()
                }
            } else  {
                VStack {
                    Spacer()
                    Text("Congratulations!")
                        .font(.largeTitle)
                        .fontWeight(.bold)
                    if (shareTrade == 1) {
                        Text("You have successfully \(tradeType) \(shareTrade) share of \(stockDetail?.ticker ?? "unknown").")
                            .multilineTextAlignment(.center)
                            .padding()
                    } else  {
                        Text("You have successfully \(tradeType) \(shareTrade) shares of \(stockDetail?.ticker ?? "unknown").")
                            .multilineTextAlignment(.center)
                            .padding()
                    }
                    
                    Spacer()
                    Button("Done") {
                        success = false
                        shareTrade = 0
                        tradeType = ""
                        
                        self.presentationMode.wrappedValue.dismiss()
                    }
                    .padding(.horizontal, 130)
                    .padding(.vertical, 15)
                    .background(Color.white)
                    .foregroundColor(Color.green)
                    .clipShape(Capsule())  // Clip the background to a capsule shape
                    
                    
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .background(Color.green)
                .foregroundColor(.white)
                
            }
        }
    }
}

#Preview {
    TradeSheetView(stockDetail: StockInfo(ticker: "AAPL", watchlist: false, count: 10, price: 1.1), stockPrice: 30.0, availableFunds: 10000, name: "Apple")
}
