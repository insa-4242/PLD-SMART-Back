# PLD-SMART-Back

On n'utilise pas l'extension dotenv

Pour avoir accès à vos variable d'environnement en mode dev, vous devez créer un fichier nodemon.json avec ceci

```json
{
  "env": {
    "DB_URL": "VOTREURLSECRET"
  }
}
```
