# PLD-SMART-Back

On n'utilise pas l'extension dotenv, nodemon permet de créer des réeels variable d'environnement enlever cette merde.

Pour avoir accès à vos variable d'environnement en mode dev, vous devez créer un fichier nodemon.json avec ceci

```json
{
  "env": {
    "DB_USER": "TOCHANGE",
    "DB_PASSWORD": "TOCHANGE",
    "DB_NAME": "Recettes"
  }
}
```

## Important

Il faut importer les biblioteques que vous utilisez avec npm, pour éviter les conflits avec yarn

## Todo

TODO --> rename les fichier js en ts

# PLD-SMART-Back

On n'utilise pas l'extension dotenv

Pour avoir accès à vos variable d'environnement en mode dev, vous devez créer un fichier nodemon.json avec ceci

```json
{
  "env": {
    "DB_USER": "TOCHANGE",
    "DB_PASSWORD": "TOCHANGE",
    "DB_NAME": "Recettes"
  }
}
```

```
{
    "isVegetarian":boolean required,
    "isVegan":boolean required,
    "isLactoseFree": boolean required,
    "isGlutenFree":boolean required,
    "duration":int(en minute) required,
    "imageUrl":string required,
    "title":string required,
    "subtitble": string optionnal,
    "instructions":["Strings"] required,
    "difficulty":["easy","medium","hard"]required,
    "ingredient":[{idIngredient,quantité,unit}]required,
    "ustensiles":[idUstendile]optionnal,
}
{
    "label": String required,
    "imgUrl":String optionnal,
}

{
    "label":String label,
    "imgUrl":imgUrl,
}

```
