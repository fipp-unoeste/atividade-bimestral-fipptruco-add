export default class Adapter {

    constructor() {
    }

    async novoDeck() {
        try {
            let response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?cards=3S,3D,3H,3C,2S,2D,2H,2C,AS,AD,AH,AC,KS,KD,KH,KC,JS,JD,JH,JC,QS,QD,QH,QC,7S,7D,7H,7C,6S,6D,6H,6C,5S,5D,5H,5C,4S,4D,4H,4C');
            let deck = await response.json();
            return deck;
        } catch (ex) {
            throw new Error("Erro ao criar nova mão: " + ex.message);
        }
    }

    async distribuirCartasParaParticipante(deck_id) {
        try {
            let response = await fetch(`https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=3`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            let contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Unexpected content type: " + contentType);
            }
            let cartasDistribuidas = await response.json();
            console.log(cartasDistribuidas); // Log para ver a resposta recebida
            return cartasDistribuidas;
        } catch (ex) {
            throw new Error("Erro ao distribuir cartas: " + ex.message);
        }
    }

    async virarCarta(deck_id) {
        try {
            console.log(`Deck ID: ${deck_id}`); // Verificação do deck_id
            let response = await fetch(`https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=1`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            let contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Unexpected content type: " + contentType);
            }
            let cartaVirada = await response.json();
            console.log(cartaVirada); // Log para ver a resposta recebida
            return cartaVirada;
        } catch (ex) {
            throw new Error("Erro ao virar a carta: " + ex.message);
        }
    }
}
