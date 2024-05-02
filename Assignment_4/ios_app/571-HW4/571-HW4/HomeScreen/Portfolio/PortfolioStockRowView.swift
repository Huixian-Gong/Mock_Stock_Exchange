//
//  StockRowView.swift
//  571-HW4
//
//  Created by Huixian Gong on 4/10/24.
//

import SwiftUI

struct PortfolioStockRowView: View {
    var ticker: String
    var count: Int
    var price: Double
    var difference: Double?
    var differencePercentage: Double?
    @State private var isShowingDetailView = false

    
    var body: some View {
        NavigationLink(destination: StockDetailView(stockSymbol: ticker, isShowingDetailView: $isShowingDetailView), isActive: $isShowingDetailView) {
            HStack {
                VStack(alignment: .leading) {
                    Text(ticker)
                        .font(.system(size: 20))
                        .bold()
                    Text("\(count) shares")
                        .font(.system(size: 15))
                        .foregroundStyle(.gray)
                }
                
                Spacer()
                
                VStack(alignment: .trailing) {
                    Text("$\(price, specifier: "%.2f")")
                        .bold()
                    HStack {
                        let differenceColor = difference.map {
                            $0 < 0 ? Color.red : ($0 > 0 ? Color.green : Color.gray)
                        } ?? Color.gray
                        
                        Image(systemName: difference.flatMap {
                            $0 < 0 ? "arrow.down.right" : ($0 > 0 ? "arrow.up.right" : "minus")
                        } ?? "minus")

                            .foregroundColor(differenceColor)
                            .font(.system(size: 20))
                        
                        Text("$\(difference ?? 0, specifier: "%.2f")")
                            .foregroundColor(differenceColor)
                        
                        Text("(\(differencePercentage ?? 0, specifier: "%.2f")%)")
                            .foregroundColor(differenceColor)
                    }
                    .font(.system(size: 14))
                }
            }
            
        }
        .onTapGesture {
                    self.isShowingDetailView = true
                }
    }
}


//#Preview {
//    StockRowView()
//}
