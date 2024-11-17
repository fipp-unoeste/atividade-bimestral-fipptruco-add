import swaggerAutogen from "swagger-autogen";
// import UsuarioModel from "./models/usuarioModel.js";
// import PerfilModel from "./models/perfilModel.js";
const doc = {
    info: {
        title: "PROJETO TRUCO ON-LINE -  ANDRESSA / DAYANE / DEIVID",
        description: "API criada como parte de um projeto da disciplina de Full Stack II, utilizando o padrão REST em um ambiente Node.js com o framework Express, e biblioteca React integrada ao framework Next.js."
    },
    host: 'localhost:5000',
    // components: {
    //     schemas: {
    //         usuarioModel: new UsuarioModel(0, "fulano@email.com", "Fulano", 1, "12345", new PerfilModel(1, "Administrador")).toJSON(),
    //         perfilModel: new PerfilModel(1, "Administrador").toJSON()
    //     },
    //     securitySchemes:{
    //         bearerAuth: {
    //             type: 'http',
    //             scheme: 'bearer'
    //         }
    //     }
    // }
}

const outputJson = "./swagger-output.json";
const routes = ['./server.js']

swaggerAutogen({openapi: '3.0.0'})(outputJson, routes, doc)
.then( async () => {
   await import('./server.js');
})