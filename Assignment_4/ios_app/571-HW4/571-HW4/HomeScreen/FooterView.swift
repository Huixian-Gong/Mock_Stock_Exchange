//
//  FooterView.swift
//  571-HW4
//
//  Created by Huixian Gong on 4/8/24.
//

import SwiftUI

struct FooterView: View {
    var body: some View {
        Link("Powered by Finnhub.io", destination: URL(string: "https://www.finnhub.io")!)
            .foregroundColor(Color.gray)
            .padding(EdgeInsets(top: 4, leading: 10, bottom: 4, trailing: 10))
            .frame(maxWidth: /*@START_MENU_TOKEN@*/.infinity/*@END_MENU_TOKEN@*/ ,alignment: .center)
            .font(.system(size: 15))
    }

}

#Preview {
    FooterView()
}
