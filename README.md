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
    "marmitonID":string required, unique
    "imageUrl":string required,
    "title":string required,
    "subtitle": string optionnal,
    "duration":int(en minute) required,
    "difficulty":["facile","moyen","difficile"]required, *pas en ^1.0
    "isVegetarian":boolean required,
    "isVegan":boolean required,
    "isLactoseFree": boolean required,
    "isGlutenFree":boolean required,
    "instructions":["Strings"] required,
    "ingredients":[{idIngredient,quantity,unit}]required, *change de idIngredient à lable:string pour ne devoir pas faire le lien entre eux
    "utensiles":[idUtensile]optionnal, *pas en version ^1.0
}
```
