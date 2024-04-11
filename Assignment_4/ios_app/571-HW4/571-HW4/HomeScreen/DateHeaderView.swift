//
//  HomeScreenView.swift
//  571-HW4
//
//  Created by Huixian Gong on 4/8/24.
//

import SwiftUI

struct DateHeaderView: View {
    let currentDate: Date
    
    var body: some View {
        Text(currentDate, style: .date)
            .font(.title)
            .bold()
            .foregroundStyle(Color(.gray))
            .padding(EdgeInsets(top: 4, leading:0, bottom: 4, trailing:0))
    }
}


#Preview {
    DateHeaderView(currentDate: Date())
}
