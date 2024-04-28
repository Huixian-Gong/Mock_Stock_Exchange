//
//  ToastView.swift
//  571-HW4
//
//  Created by Huixian Gong on 4/18/24.
//

import SwiftUI

struct ToastView: View {
    let message: String
    
    var body: some View {
        Text(message)
            .font(.system(size: 20))
            .foregroundColor(.white)
            .padding(35)
            .background(Color.gray)
            .cornerRadius(50)
    }
}

#Preview {
    ToastView(message: "Please enter a valid amount")
}
