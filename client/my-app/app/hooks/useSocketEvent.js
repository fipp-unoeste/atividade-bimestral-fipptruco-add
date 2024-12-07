import { useEffect } from 'react';
import { getSocket } from '../libs/socket';

/**
 * Hook para gerenciar eventos do WebSocket.
 * @param {string} eventName - O nome do evento do socket.
 * @param {function} callback - A função de callback que será chamada quando o evento for recebido.
 */
const useSocketEvent = (eventName, callback) => {
    useEffect(() => {
        const socket = getSocket();

        // Registrar o evento
        socket.on(eventName, callback);

        // Limpar o evento ao desmontar
        return () => {
            socket.off(eventName, callback);
        };
    }, [eventName, callback]); // Reexecuta o efeito se o evento ou callback mudar
};

export default useSocketEvent;