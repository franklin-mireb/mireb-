import { createRequire } from 'module';
const require = createRequire(import.meta.url);

export const setupSocketIO = (server) => {
  const { Server } = require('socket.io');
  
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"]
    },
    transports: ['websocket', 'polling']
  });

  // Stockage des sessions actives
  const activeSessions = new Map();
  const activeRooms = new Map();

  io.on('connection', (socket) => {
    console.log(`Nouvelle connexion WebSocket: ${socket.id}`);

    // Rejoindre une session utilisateur
    socket.on('join-session', (data) => {
      try {
        const { userId, userName, userType = 'client' } = data;
        
        if (!userId) {
          socket.emit('error', { message: 'ID utilisateur requis' });
          return;
        }

        // Quitter les anciennes rooms
        Object.keys(socket.rooms).forEach(room => {
          if (room !== socket.id) {
            socket.leave(room);
          }
        });

        // Rejoindre la room utilisateur
        const roomId = `user-${userId}`;
        socket.join(roomId);
        
        // Enregistrer la session
        activeSessions.set(socket.id, {
          userId,
          userName: userName || `Utilisateur ${userId}`,
          userType,
          roomId,
          connectedAt: new Date(),
          lastActivity: new Date()
        });

        socket.emit('session-joined', {
          roomId,
          message: 'Connecté au chat en temps réel'
        });

        // Notifier les administrateurs de la nouvelle connexion
        socket.to('admin-room').emit('user-connected', {
          userId,
          userName: userName || `Utilisateur ${userId}`,
          userType,
          connectedAt: new Date()
        });

        console.log(`Utilisateur ${userId} rejoint la session ${roomId}`);

      } catch (error) {
        console.error('Erreur join-session:', error);
        socket.emit('error', { message: 'Erreur lors de la connexion' });
      }
    });

    // Rejoindre la room admin
    socket.on('join-admin', (data) => {
      try {
        const { adminId, adminName } = data;
        
        if (!adminId) {
          socket.emit('error', { message: 'ID administrateur requis' });
          return;
        }

        socket.join('admin-room');
        
        activeSessions.set(socket.id, {
          userId: adminId,
          userName: adminName || `Admin ${adminId}`,
          userType: 'admin',
          roomId: 'admin-room',
          connectedAt: new Date(),
          lastActivity: new Date()
        });

        // Envoyer la liste des utilisateurs connectés
        const connectedUsers = Array.from(activeSessions.values())
          .filter(session => session.userType === 'client')
          .map(session => ({
            userId: session.userId,
            userName: session.userName,
            connectedAt: session.connectedAt,
            lastActivity: session.lastActivity
          }));

        socket.emit('admin-joined', {
          message: 'Connecté en tant qu\'administrateur',
          connectedUsers
        });

        console.log(`Admin ${adminId} rejoint la room admin`);

      } catch (error) {
        console.error('Erreur join-admin:', error);
        socket.emit('error', { message: 'Erreur lors de la connexion admin' });
      }
    });

    // Envoi de message
    socket.on('send-message', async (data) => {
      try {
        const session = activeSessions.get(socket.id);
        if (!session) {
          socket.emit('error', { message: 'Session non trouvée' });
          return;
        }

        const { message, targetUserId, messageType = 'text' } = data;
        
        if (!message || message.trim() === '') {
          socket.emit('error', { message: 'Message vide' });
          return;
        }

        // Mettre à jour l'activité
        session.lastActivity = new Date();

        const messageData = {
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          senderId: session.userId,
          senderName: session.userName,
          senderType: session.userType,
          message: message.trim(),
          messageType,
          timestamp: new Date(),
          roomId: session.roomId
        };

        // Si c'est un admin qui envoie à un utilisateur spécifique
        if (session.userType === 'admin' && targetUserId) {
          const targetRoom = `user-${targetUserId}`;
          
          // Envoyer à l'utilisateur cible
          socket.to(targetRoom).emit('new-message', messageData);
          
          // Confirmer l'envoi à l'admin
          socket.emit('message-sent', {
            ...messageData,
            targetUserId,
            status: 'delivered'
          });

          // Notifier les autres admins
          socket.to('admin-room').emit('admin-message-sent', {
            ...messageData,
            targetUserId
          });

          console.log(`Message admin envoyé de ${session.userId} vers ${targetUserId}`);
        }
        // Si c'est un client qui envoie aux admins
        else if (session.userType === 'client') {
          // Envoyer à tous les admins
          socket.to('admin-room').emit('new-message', messageData);
          
          // Confirmer l'envoi au client
          socket.emit('message-sent', {
            ...messageData,
            status: 'delivered'
          });

          console.log(`Message client envoyé de ${session.userId} aux admins`);
        }
        // Broadcast dans la même room
        else {
          socket.to(session.roomId).emit('new-message', messageData);
          socket.emit('message-sent', {
            ...messageData,
            status: 'delivered'
          });
        }

        // Ici, vous pourriez sauvegarder le message en base de données
        // await saveMessageToDatabase(messageData);

      } catch (error) {
        console.error('Erreur send-message:', error);
        socket.emit('error', { message: 'Erreur lors de l\'envoi du message' });
      }
    });

    // Indicateur de frappe
    socket.on('typing-start', (data) => {
      try {
        const session = activeSessions.get(socket.id);
        if (!session) return;

        const typingData = {
          userId: session.userId,
          userName: session.userName,
          timestamp: new Date()
        };

        if (session.userType === 'admin' && data.targetUserId) {
          socket.to(`user-${data.targetUserId}`).emit('user-typing', typingData);
        } else if (session.userType === 'client') {
          socket.to('admin-room').emit('user-typing', typingData);
        }

      } catch (error) {
        console.error('Erreur typing-start:', error);
      }
    });

    socket.on('typing-stop', (data) => {
      try {
        const session = activeSessions.get(socket.id);
        if (!session) return;

        const typingData = {
          userId: session.userId,
          userName: session.userName
        };

        if (session.userType === 'admin' && data.targetUserId) {
          socket.to(`user-${data.targetUserId}`).emit('user-stopped-typing', typingData);
        } else if (session.userType === 'client') {
          socket.to('admin-room').emit('user-stopped-typing', typingData);
        }

      } catch (error) {
        console.error('Erreur typing-stop:', error);
      }
    });

    // Demande de l'historique des messages
    socket.on('get-message-history', async (data) => {
      try {
        const session = activeSessions.get(socket.id);
        if (!session) {
          socket.emit('error', { message: 'Session non trouvée' });
          return;
        }

        // Ici, vous récupéreriez l'historique depuis la base de données
        // const messages = await getMessageHistory(session.userId, data.limit || 50);
        
        // Simulation d'historique
        const mockHistory = [
          {
            id: 'msg_1',
            senderId: 'system',
            senderName: 'Assistant MIREB',
            senderType: 'system',
            message: 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?',
            messageType: 'text',
            timestamp: new Date(Date.now() - 300000) // 5 minutes ago
          }
        ];

        socket.emit('message-history', {
          messages: mockHistory,
          hasMore: false
        });

      } catch (error) {
        console.error('Erreur get-message-history:', error);
        socket.emit('error', { message: 'Erreur lors de la récupération de l\'historique' });
      }
    });

    // Statut en ligne
    socket.on('update-status', (data) => {
      try {
        const session = activeSessions.get(socket.id);
        if (!session) return;

        const { status = 'online' } = data;
        session.status = status;
        session.lastActivity = new Date();

        // Notifier les admins du changement de statut
        if (session.userType === 'client') {
          socket.to('admin-room').emit('user-status-changed', {
            userId: session.userId,
            userName: session.userName,
            status,
            lastActivity: session.lastActivity
          });
        }

      } catch (error) {
        console.error('Erreur update-status:', error);
      }
    });

    // Déconnexion
    socket.on('disconnect', () => {
      try {
        const session = activeSessions.get(socket.id);
        
        if (session) {
          console.log(`Déconnexion: ${session.userName} (${session.userId})`);
          
          // Notifier la déconnexion
          if (session.userType === 'client') {
            socket.to('admin-room').emit('user-disconnected', {
              userId: session.userId,
              userName: session.userName,
              disconnectedAt: new Date()
            });
          }
          
          // Nettoyer la session
          activeSessions.delete(socket.id);
        }

        console.log(`Connexion WebSocket fermée: ${socket.id}`);

      } catch (error) {
        console.error('Erreur disconnect:', error);
      }
    });

    // Ping/Pong pour maintenir la connexion
    socket.on('ping', () => {
      socket.emit('pong');
      
      const session = activeSessions.get(socket.id);
      if (session) {
        session.lastActivity = new Date();
      }
    });

    // Gestion des erreurs de socket
    socket.on('error', (error) => {
      console.error('Erreur WebSocket:', error);
    });
  });

  // Nettoyage périodique des sessions inactives
  setInterval(() => {
    const now = new Date();
    const timeout = 30 * 60 * 1000; // 30 minutes
    
    for (const [socketId, session] of activeSessions.entries()) {
      if (now - session.lastActivity > timeout) {
        console.log(`Session expirée: ${session.userName} (${session.userId})`);
        activeSessions.delete(socketId);
        
        // Notifier la déconnexion si c'était un client
        if (session.userType === 'client') {
          io.to('admin-room').emit('user-disconnected', {
            userId: session.userId,
            userName: session.userName,
            disconnectedAt: now,
            reason: 'timeout'
          });
        }
      }
    }
  }, 5 * 60 * 1000); // Vérifier toutes les 5 minutes

  return io;
};
