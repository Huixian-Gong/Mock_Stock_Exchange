//
//  HomeScreenView.swift
//  HW4
//
//  Created by Huixian Gong on 4/9/24.
//

import SwiftUI

struct HomeScreenView: View {
    @State private var editMode: EditMode = EditMode.inactive
    
    @State private var name = "Maria Ruiz"
    
    
    var body: some View {
        NavigationView{
            
            
            Form {
                if editMode == .active {
                    Text("xxx")
                } else {
                    Text("yyy")
                }
            }
            .toolbar {
                Button {
                    if editMode == .inactive {
                        editMode = .active
                        print("editmode:",  editMode)
                    } else {
                        editMode = .inactive
                        print(editMode)
                    }
                } label: {
                    Text("edit")
                }
            }
            .environment(\.editMode, $editMode)
        }
    }
}


#Preview {
    HomeScreenView()
}
