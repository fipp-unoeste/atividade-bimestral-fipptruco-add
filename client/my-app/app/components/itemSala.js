

export default function ItemSala({ objSala, entrar, atualizar }) {

    return (
        <table>
            <thead>
                <tr style={{marginBottom: '10px'}}>
                <th>Nome</th>
                <th>Editar</th>
                <th>Entrar</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <span style={{marginRight: '25px'}}>{objSala.nome}</span>
                    </td>
                    <td>
                        <button onClick={() => atualizar(objSala.sal_id)}>Editar</button>
                    </td>
                    <td>
                        <button onClick={() => entrar(objSala.sal_id)}>Entrar</button>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}