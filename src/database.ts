import type { BggGame } from '@/board_game_geek'
import { initializeApp } from 'firebase/app'
import {
  collection,
  doc,
  Firestore,
  getDoc,
  getDocs,
  getFirestore,
  writeBatch,
  setDoc
} from 'firebase/firestore'

/**
 * Represents a board game, that may or may not be in the club's catalog
 */
export interface Game {
  // The name used to display on the UI. This is usually the primary name from BGG, but some games
  // it may be different because of locality
  name: string
  bgg: BggGame
  ownedByClub: boolean
  // The code used to log a play
  clubCode: string | null
  lastPlayed: Date | null
  totalPlays: number
}

export interface Translations {
  categories: Map<string, string>
  mechanics: Map<string, string>
}

/**
 * Represents the fact that someone from the club played a game
 */
interface PlayActivity {
  // The time part is zeroed
  day: Date
  location: 'club' | 'home' | 'festival'
}

export class Database {
  _firestore: Firestore

  constructor() {
    const firebaseConfig = {
      apiKey: 'AIzaSyBg8ecSB_ogiqWAWCZgWRcOKtkrRFu6fOE',
      authDomain: 'plateaux-aux-conjures.firebaseapp.com',
      projectId: 'plateaux-aux-conjures',
      storageBucket: 'plateaux-aux-conjures.appspot.com',
      messagingSenderId: '656580485619',
      appId: '1:656580485619:web:edaa857b984e6e1bc57286'
    }

    // Initialize Firebase
    const firebaseApp = initializeApp(firebaseConfig)

    // Initialize Cloud Firestore and get a reference to the service
    this._firestore = getFirestore(firebaseApp)
  }

  /**
   * Return all the games from the database
   */
  async getGames() {
    const gameQuerySnapshot = await getDocs(collection(this._firestore, 'games'))
    return gameQuerySnapshot.docs.map((doc) => doc.data() as Game)
  }

  async batchAdd(games: Game[]) {
    if (games.length) {
      const batch = writeBatch(this._firestore)

      for (const game of games) {
        batch.set(doc(this._firestore, 'games', game.bgg.id), game)
      }

      await batch.commit()
    }
  }

  async batchUpdate(games: Map<string, any>) {
    if (games.size) {
      const batch = writeBatch(this._firestore)

      for (const [id, updates] of games.entries()) {
        batch.update(doc(this._firestore, 'games', id), updates)
      }

      await batch.commit()
    }
  }

  async getTranslations(): Promise<Translations> {
    const translationsDoc = await getDoc(doc(this._firestore, 'translations', 'translations'))
    const translationsData = translationsDoc.data() || {}

    function extractMap(value: any): Map<string, string> {
      const map = new Map()
      if (value && typeof value === 'object') {
        for (const [fromText, toText] of Object.entries(value)) {
          if (typeof toText === 'string') {
            map.set(fromText, toText)
          }
        }
      }
      return map
    }

    return {
      categories: extractMap(translationsData?.categories),
      mechanics: extractMap(translationsData?.mechanics)
    }
  }

  async setTranslations(translations: Translations): Promise<void> {
    const asObject = {
      categories: Object.fromEntries(translations.categories.entries()),
      mechanics: Object.fromEntries(translations.mechanics.entries())
    }

    await setDoc(doc(this._firestore, 'translations', 'translations'), asObject)
  }

  // Return when the last sync operation was done
  async getLastSync() {
    // TODO
  }
}
