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
    
    
    
    var stockPrice: Double // This would be dynamically fetched from your data source
    var availableFunds: Double // This should also be dynamically fetched
    var name: String
    var body: some View {
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
                        //                        .multilineTextAlignment(.center)
                        //                        .padding(.vertical)
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
                        // Handle buy action
                    }) {
                        Text("Buy")
                            .frame(minWidth: 0, maxWidth: .infinity)
                            .padding()
                            .foregroundColor(.white)
                            .background(Color.green)
                            .cornerRadius(40)
                    }
                    Button(action: {
                        // Handle sell action
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
        }}
}

#Preview {
    TradeSheetView(stockDetail: StockInfo(ticker: "AAPL", watchlist: false, count: 0, price: 1.1), stockPrice: 100.0, availableFunds: 10000, name: "Apple")
}
