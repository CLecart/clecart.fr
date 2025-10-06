#!/bin/bash

# Script de conversion des commentaires JavaScript en JSDoc
# Auteur: Christophe Lecart
# Description: Convertit automatiquement les commentaires simples en JSDoc

echo "🔄 Conversion des commentaires JavaScript en JSDoc..."

# Fonction pour convertir un fichier
convert_to_jsdoc() {
    local file="$1"
    echo "📝 Traitement: $file"

    # Sauvegarde
    cp "$file" "$file.backup"

    # Conversions basiques (à adapter selon les besoins)
    sed -i 's|^// \(.*\)\.js|/**\n * @fileoverview \1\n * @version 1.0.0\n * @author Christophe Lecart <djlike@hotmail.fr>\n */|g' "$file"
    sed -i 's|^// \(.*\) function|/**\n * @description \1\n * @function\n * @returns {void}\n */|g' "$file"
    sed -i 's|^// \(.*\)|/**\n * @description \1\n */|g' "$file"

    echo "✅ Converti: $file"
}

# Conversion de tous les fichiers JS
find js/ -name "*.js" -type f | while read -r file; do
    if [[ ! "$file" =~ \.backup$ ]]; then
        convert_to_jsdoc "$file"
    fi
done

echo "🎯 Conversion terminée!"
echo "📚 Pour générer la documentation: npm run docs:generate"
