import visu1 from '../assets/visu_test.webp'
import visu2 from '../assets/visu_test2.jpg'
import visu3 from '../assets/visu_test3.jpg'
import visu4 from '../assets/visu_test4.webp'
import visu5 from '../assets/visu_test5.jpg'
import visu6 from '../assets/visu_test6.webp'

export type Categorie = 'Signature' | 'Classique' | 'Fruité' | 'Sans alcool'

export interface Cocktail {
  id: number
  nom: string
  image: string
  description: string
  categorie: Categorie
  prix: string
}

export const cocktails: Cocktail[] = [
  {
    id: 1,
    nom: 'Rose Éternelle',
    image: visu1,
    description: 'Un équilibre délicat entre le litchi, la rose et le champagne rosé. Une signature florale pensée pour les grandes occasions.',
    categorie: 'Signature',
    prix: 'À partir de 8 €',
  },
  {
    id: 2,
    nom: 'Soleil d\'Été',
    image: visu2,
    description: 'Rhum blanc, mangue fraîche, gingembre et citron vert. Un voyage tropical servi dans une coupe givrée.',
    categorie: 'Fruité',
    prix: 'À partir de 7 €',
  },
  {
    id: 3,
    nom: 'Negroni Sara',
    image: visu3,
    description: 'La version signature du grand classique : gin botanique, vermouth rouge et une touche d\'orange sanguine.',
    categorie: 'Classique',
    prix: 'À partir de 9 €',
  },
  {
    id: 4,
    nom: 'Jardin Secret',
    image: visu4,
    description: 'Concombre, basilic, eau pétillante et sirop de fleur de sureau. Frais, délicat et 100 % sans alcool.',
    categorie: 'Sans alcool',
    prix: 'À partir de 5 €',
  },
  {
    id: 5,
    nom: 'Velvet Crush',
    image: visu5,
    description: 'Vodka premium, mûre, crème de cassis et un nuage de mousse de citron. Intense et soyeux.',
    categorie: 'Signature',
    prix: 'À partir de 9 €',
  },
  {
    id: 6,
    nom: 'Hibiscus Fizz',
    image: visu6,
    description: 'Infusion d\'hibiscus, jus de grenade, eau tonique et menthe fraîche. Une couleur éclatante, zéro alcool.',
    categorie: 'Sans alcool',
    prix: 'À partir de 5 €',
  },
]

export const categories: Categorie[] = ['Signature', 'Classique', 'Fruité', 'Sans alcool']
