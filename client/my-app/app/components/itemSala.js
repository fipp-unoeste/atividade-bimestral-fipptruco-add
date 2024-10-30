
export default function ItemSala({ objSala, entrar }) {

    return (
        <table>
            <thead>
                <tr style={{marginBottom: '10px'}}>
                <th>Nome</th>
                <th>Lotação</th> 
                <th>Entrar</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <span style={{marginRight: '25px'}}>{objSala.nome}</span>
                    </td>
                    <td>
                        <span style={{marginRight: '25px'}}>2</span>
                    </td>
                    <td>
                        <button onClick={() => entrar(objSala.sal_id)}>Entrar</button>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}