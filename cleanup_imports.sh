#!/bin/bash

# Kullanılmayan import ve değişkenleri kaldırmak için sed komutları
find ./src -type f \( -name "*.tsx" -o -name "*.ts" \) -print0 | while IFS= read -r -d '' file; do
    # Link import'unu kaldır
    sed -i 's/import Link from '"'"'next\/link'"'"';//g' "$file"
    
    # Kullanılmayan değişkenleri kaldır
    sed -i 's/const currencyLogos = .*;//g' "$file"
    sed -i 's/const DEFAULT_CURRENCY = .*;//g' "$file"
    sed -i 's/const validatePrice = .*;//g' "$file"
done
