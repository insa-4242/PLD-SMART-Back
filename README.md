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
    "difficulty":["facile","moyen","difficile"]required,
    "isVegetarian":boolean required,
    "isVegan":boolean required,
    "isLactoseFree": boolean required,
    "isGlutenFree":boolean required,
    "instructions":["Strings"] required,
    "ingredients":[{idIngredient,quantity,unit}]required, *change de idIngredient à lable:string pour ne devoir pas faire le lien entre eux
    "utensiles":[idUtensile]optionnal,
}
```

````
{
[1]   url: 'https://www.marmiton.org/recettes/recette_beignets-a-la-banane_28413.aspx',
[1]   name: 'Beignets à la banane',
[1]   images: [
[1]     'https://assets.afcdn.com/recipe/20160719/15567_w1024h1024c1cx1424cy2136.webp',
[1]     'https://assets.afcdn.com/recipe/20160719/15567_w1024h768c1cx1424cy2136.webp',
[1]     'https://assets.afcdn.com/recipe/20160719/15567_w1024h576c1cx1424cy2136.webp',
[1]     'https://assets.afcdn.com/recipe/20160719/15567_w1024h1024c1cx1424cy2136.jpg',
[1]     'https://assets.afcdn.com/recipe/20160719/15567_w1024h768c1cx1424cy2136.jpg',
[1]     'https://assets.afcdn.com/recipe/20160719/15567_w1024h576c1cx1424cy2136.jpg'
[1]   ],
[1]   recipeCategory: 'beignets sucrés',
[1]   datePublished: '2006-10-23T11:43:00+02:00',
[1]   prepTime: 10,
[1]   cookTime: 5,
[1]   totalTime: 15,
[1]   ingredients: [
[1]     { name: 'bananes', quantity: 3, unit: null },
[1]     { name: 'sucre', quantity: 75, unit: ' g ' },
[1]     { name: 'farine', quantity: 150, unit: ' g ' },
[1]     { name: 'oeufs', quantity: 2, unit: null }
[1]   ],
[1]   step: [
[1]     {
[1]       '@type': 'HowToStep',
[1]       text: 'Ecraser les bananes puis ajouter les oeufs. '
[1]     },
[1]     { '@type': 'HowToStep', text: 'Rajouter le sucre, mélanger. ' },
[1]     { '@type': 'HowToStep', text: 'Rajouter la farine, mélanger. ' },
[1]     { '@type': 'HowToStep', text: "Faire cuire dans l'huile." }
[1]   ],
[1]   author: 'Anonyme',
[1]   description: [ 'banane', ' sucre', ' farine', ' oeuf' ],
[1]   keywords: [
[1]     'Beignets à la banane',
[1]     ' banane',
[1]     ' sucre',
[1]     ' farine',
[1]     ' oeuf',
[1]     ' beignets sucrés',
[1]     ' très facile',
[1]     ' bon marché',
[1]     ' rapide'
[1]   ],
[1]   type: null,
[1]   note: {
[1]     '@type': 'AggregateRating',
[1]     reviewCount: 201,
[1]     ratingValue: 4.6,
[1]     worstRating: 0,
[1]     bestRating: 5
[1]   }
[1] }
```
````
