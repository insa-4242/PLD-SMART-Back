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

##Important


Il faut importer les biblioteques que vous utilisez avec npm, pour éviter les conflits avec yarn



##Todo 

TODO --> rename les fichier js en ts
