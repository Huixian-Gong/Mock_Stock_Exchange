//
//  HomeScreenViewModel.swift
//  571-HW4
//
//  Created by Huixian Gong on 4/8/24.
//

import Foundation

class HomeScreenViewModel: ObservableObject{
    @Published var meals = []
    @Published var ticker: String = ""
    
}
