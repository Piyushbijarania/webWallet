# Web Wallet for GNP

A web-based cryptocurrency wallet that supports both Ethereum and Solana networks. Built with React and Material-UI.

## Features

- Create new HD wallets
- Load existing wallets using mnemonic phrases
- Support for both Ethereum and Solana networks
- Derive multiple addresses from the same seed
- Dark mode UI
- Responsive design

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone <your-repository-url>
cd web-wallet
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Usage

1. Create a new wallet:
   - Click "Create New Wallet"
   - Save your mnemonic phrase securely

2. Load existing wallet:
   - Enter your mnemonic phrase
   - Click "Load Wallet"

3. Derive new addresses:
   - Switch between Ethereum and Solana tabs
   - Click "Derive New Address" to generate additional addresses

## Security Notes

- Never share your mnemonic phrase
- Keep your mnemonic phrase in a secure location
- This is a client-side application, all operations happen in your browser

## Technologies Used

- React
- Material-UI
- ethers.js
- @solana/web3.js
- bip39

## License

MIT 