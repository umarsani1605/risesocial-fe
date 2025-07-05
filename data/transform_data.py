#!/usr/bin/env python3
"""
Script untuk mengubah struktur data dari Learning Path -> Modules -> Syllabus
menjadi Modules -> Syllabus
"""

import json
import os

def transform_data():
    # Baca file data.json
    with open('data.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Array untuk menyimpan semua modules
    modules_data = []
    
    # Ekstrak modules dari setiap course
    for course in data['coursesData']:
        course_category = course['category']
        
        for module in course['modules']:
            # Buat standalone module dengan data yang diperlukan
            standalone_module = {
                "id": module['id'],
                "module_slug": module['module_slug'],
                "name": module['name'],
                "title": module['title'],
                "category": course_category,  # Ambil kategori dari course
                "completed": module['completed'],
                "duration": module['duration'],
                "materialCount": module['materialCount'],
                "certificate": module['certificate'],
                "rating": module['rating'],
                "ratingCount": module['ratingCount'],
                "price": module['price'],
                "image": module['image'],
                "description": module['description'],
                "instructor": module['instructor'],
                "syllabus": module['syllabus'],
                "testimonials": module.get('testimonials', []),
                "faq": module.get('faq', [])
            }
            
            modules_data.append(standalone_module)
    
    # Buat struktur data baru
    new_data = {
        "modulesData": modules_data
    }
    
    # Simpan sebagai file baru
    with open('data_new.json', 'w', encoding='utf-8') as f:
        json.dump(new_data, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Transformasi selesai!")
    print(f"📊 Total modules: {len(modules_data)}")
    print(f"📁 File baru: data_new.json")
    
    # Tampilkan preview modules
    print("\n🔍 Preview modules:")
    for module in modules_data[:5]:  # Tampilkan 5 modules pertama
        print(f"  - {module['title']} ({module['category']})")

if __name__ == "__main__":
    transform_data() 