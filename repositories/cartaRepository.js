import CartaEntity from "../entities/cartaEntity.js";
import BaseRepository from "./baseRepository.js";

export default class CartaRepository extends BaseRepository{
    constructor(db) {
        super(db);
    }
   
    async cadastrar(carta) {
        const sql = `INSERT INTO tb_carta (car_codigo, car_imagem, car_valor, car_naipe, car_vira, par_id, mao_id) VALUES (?,?,?,?,?,?,?)`;
        const params = [carta.carCod, carta.carImg, carta.carValor, carta.carNaipe, carta.carVira, carta.parId, carta.maoId];

        let cartaId = await this.db.ExecutaComandoLastInserted(sql, params);

        if(cartaId > 0){
            return cartaId;
        }
        else{
            return null;
        }
    }

    async buscarPorId(id) {
        let sql = "select * from tb_carta where car_id = ?";
        let valores = [id];

        let row = await this.db.ExecutaComando(sql, valores);
        return this.toMap(row[0]);
    }

    toMap(rows) {
        if (!rows) return null;
   
        return Array.isArray(rows)
        ? rows.map(row => {
            const carta = new CartaEntity();
            carta.carId = row.car_id;
            carta.carCod = row.car_codigo;
            carta.carImg = row.car_imagem;
            carta.carValor = row.car_valor;
            carta.carNaipe = row.car_naipe;
            carta.carVira = row.car_vira;
            carta.parId = row.par_id;
            carta.maoId = row.mao_id;
            return carta;
        })
        : new CartaEntity(rows.car_id, rows.car_codigo, rows.car_imagem, rows.car_valor, rows.car_naipe, rows.car_vira, rows.par_id, rows.mao_id);
    }
}
