# Event-app
Final assignment for Mobile Programming course

## Koodissa käytettyjä teknologioita
- Kaikkien tapahtumien sijainnin näyttämiseen etusivulla on käytetty MapQuest:n ``Static Map API``:a.
- Omien tapahtumien sivulla sijainnin sekä reitin näyttämiseen on käytetty React Native Maps ``MapView`` komponenttia yhdessä MapQuestin ``Directions API``:n kanssa.
  - Käyttäjän sijainnin saamiseen on käytetty ``Expo Location`` komponenttia.
- Tapahtuman lisäämisessä puhelimen kalenteriin on käytetty ``Expo Calendar`` komponenttia.
- Käyttöliittymästä tehty hieman tyylikkäämpi React Native Elements komponenttikirjastosta ``@rneui/themed`` UI kirjastolla.
- Sovelluksen tapahtumat ovat ``firebase`` tietokannassa.
- Sovelluksessa liikkumiseen sivujen välillä on käytetty React Navigation komponenttia.
- Tapahtuman luomisessa päivän valitsemisessa on käytetty React Native DateTimePicker komponenttia.
- Ympäristömuuttujien määrittelemiseen (esim MapQuest API key), on käytetty react-native-dotenv laajennusta.
