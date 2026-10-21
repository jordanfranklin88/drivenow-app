# DriveNow — Aplicativo Mobile (React Native + Expo)

Aplicativo mobile completo de aluguel de veículos desenvolvido em **React Native com Expo**, seguindo uma **arquitetura limpa e didática** focada em facilidade de entendimento 

---

## 📱 Como Rodar o Aplicativo no Celular

### Pré-requisitos
1. Ter o **Node.js** instalado no computador.
2. Ter o aplicativo **Expo Go** instalado no seu celular ([Android na Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent) ou [iOS na App Store](https://apps.apple.com/app/expo-go/id982107779)).
3. Celular e computador conectados na **mesma rede Wi-Fi**.
 
### Passo a Passo
```bash
# 1. Instalar as dependências (caso ainda não tenha instalado)
npm install

# 2. Iniciar o servidor de desenvolvimento do Expo
npx expo start
```

Após executar o comando:
- **No Android**: Abra o aplicativo **Expo Go** e escaneie o **QR Code** exibido no terminal.
- **No iOS**: Abra o aplicativo da **Câmera nativa**, aponte para o QR Code e toque no link do Expo Go.
- **No Navegador Web** (opcional para testes no PC): Pressione a tecla `w` no terminal.

---

A arquitetura do projeto foi estruturada para ser **direta, limpa e altamente explicável**, sem complexidades desnecessárias:

```text
DriveNowApp/
├── App.js                     # Ponto de entrada raiz com Providers e StatusBar
├── app.json                   # Configurações do Expo, nome, ícone e permissões nativas
├── eas.json                   # Configuração para publicação e EAS Update (Bônus)
├── assets/                    # Ícones e splash screen nativos
└── src/
    ├── constants/
    │   └── colors.js          # Paleta de cores centralizada (Verde AlugaFácil #008248)
    ├── data/
    │   ├── vehicles.js        # Dados dos veículos, categorias e agências com coordenadas GPS
    │   └── reservations.js    # Dados simulados de reservas ativas e histórico de locações
    ├── services/
    │   └── api.js             # Camada de Serviço de API (Bônus de Backend)
    ├── components/
    │   ├── Header.js          # Cabeçalho global verde com saudação e atalho de localização
    │   ├── VehicleCard.js     # Card de veículo otimizado para renderização em FlatList
    │   └── CategoryPill.js    # Pílula/chip para filtro horizontal em FlatList
    ├── screens/
    │   ├── LoginScreen.js         # 1. Login e Cadastro
    │   ├── HomeScreen.js          # 2. Início com busca, promoções e populares
    │   ├── ResultsScreen.js       # 3. Listagem completa com FlatList e busca em tempo real
    │   ├── DetailScreen.js        # 4. Detalhes completos do carro e especificações
    │   ├── BookingScreen.js       # 5. Confirmação da locação e escolha de pagamento
    │   ├── SuccessScreen.js       # 6. Sucesso com código gerado e atalho de vistoria
    │   ├── ReservationsScreen.js  # 7. Minhas reservas ativas com opção de cancelamento
    │   ├── HistoryScreen.js       # 8. Histórico de viagens e estatísticas em cards
    │   ├── ProfileScreen.js       # 9. Perfil do usuário e configurações
    │   ├── InspectionScreen.js    # 10. RECURSO NATIVO: Câmera para vistoria e CNH
    │   └── LocationScreen.js      # 11. RECURSO NATIVO: GPS em tempo real e agências mais próximas
    └── navigation/
        ├── TabNavigator.js        # NAVEGAÇÃO 1: Bottom Tab Navigation (Abas inferiores)
        └── AppNavigator.js        # NAVEGAÇÃO 2: Stack Navigation (Transições em pilha)
```
