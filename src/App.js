import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  Paper,
  TextField,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
  Tabs,
  Tab,
  useTheme
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Keypair } from '@solana/web3.js';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0bec5',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#1e1e1e',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        },
        indicator: {
          backgroundColor: '#90caf9',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          marginBottom: 4,
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          },
        },
      },
    },
  },
});

function App() {
  const [wallet, setWallet] = useState(null);
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('');
  const [error, setError] = useState('');
  const [mnemonic, setMnemonic] = useState('');
  const [derivedWallets, setDerivedWallets] = useState([]);
  const [derivationIndex, setDerivationIndex] = useState(0);
  const [hdNode, setHdNode] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [solanaWallets, setSolanaWallets] = useState([]);
  const [seed, setSeed] = useState(null);

  const createWallet = () => {
    try {
      const newMnemonic = ethers.Wallet.createRandom().mnemonic.phrase;
      setMnemonic(newMnemonic);
      const newWallet = ethers.Wallet.fromPhrase(newMnemonic);
      const node = ethers.HDNodeWallet.fromPhrase(newMnemonic);
      setHdNode(node);
      setWallet(newWallet);
      setAddress(newWallet.address);
      setDerivedWallets([{ address: newWallet.address, index: 0 }]);
      setDerivationIndex(1);
      setError('');

      // Create initial Solana wallet
      const solanaWallet = Keypair.generate();
      setSolanaWallets([{ 
        address: solanaWallet.publicKey.toString(),
        index: 0 
      }]);
    } catch (err) {
      setError('Failed to create wallet: ' + err.message);
    }
  };

  const loadWallet = () => {
    try {
      if (!mnemonic) {
        throw new Error('Please enter a mnemonic phrase');
      }
      const loadedWallet = ethers.Wallet.fromPhrase(mnemonic);
      const node = ethers.HDNodeWallet.fromPhrase(mnemonic);
      setHdNode(node);
      setWallet(loadedWallet);
      setAddress(loadedWallet.address);
      setDerivedWallets([{ address: loadedWallet.address, index: 0 }]);
      setDerivationIndex(1);
      setError('');

      // Create initial Solana wallet
      const solanaWallet = Keypair.generate();
      setSolanaWallets([{ 
        address: solanaWallet.publicKey.toString(),
        index: 0 
      }]);
    } catch (err) {
      setError('Failed to load wallet: ' + err.message);
    }
  };

  const deriveNewWallet = () => {
    try {
      if (activeTab === 0) {
        if (!hdNode) {
          throw new Error('No Ethereum wallet loaded');
        }
        // Derive new Ethereum wallet
        const derivedWallet = hdNode.deriveChild(derivationIndex);
        setDerivedWallets(prev => [...prev, { 
          address: derivedWallet.address, 
          index: derivationIndex 
        }]);
      } else {
        // Generate a new Solana keypair
        const solanaWallet = Keypair.generate();
        setSolanaWallets(prev => [...prev, {
          address: solanaWallet.publicKey.toString(),
          index: derivationIndex
        }]);
      }
      
      setDerivationIndex(prev => prev + 1);
      setError('');
    } catch (err) {
      setError('Failed to derive new wallet: ' + err.message);
    }
  };

  useEffect(() => {
    const fetchBalance = async () => {
      if (wallet && activeTab === 0) {
        try {
          const provider = new ethers.JsonRpcProvider('https://eth.llamarpc.com');
          const balance = await provider.getBalance(wallet.address);
          setBalance(ethers.formatEther(balance));
        } catch (err) {
          setError('Failed to fetch balance: ' + err.message);
        }
      }
    };

    fetchBalance();
  }, [wallet, activeTab]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        minHeight: '100vh',
        bgcolor: 'background.default',
        py: 4
      }}>
        <Container maxWidth="sm">
          <Box sx={{ my: 4 }}>
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom 
              align="center"
              sx={{ 
                fontWeight: 600,
                color: 'primary.main',
                mb: 4
              }}
            >
              Web Wallet for GNP
            </Typography>
            
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                mb: 3,
                borderRadius: 2,
                border: '1px solid rgba(255, 255, 255, 0.12)'
              }}
            >
              {!wallet ? (
                <>
                  <Button 
                    variant="contained" 
                    fullWidth 
                    onClick={createWallet}
                    sx={{ 
                      mb: 2,
                      py: 1.5,
                      fontSize: '1.1rem'
                    }}
                  >
                    Create New Wallet
                  </Button>
                  
                  <Typography 
                    variant="subtitle1" 
                    gutterBottom
                    sx={{ 
                      color: 'text.secondary',
                      mb: 2
                    }}
                  >
                    Or load existing wallet:
                  </Typography>
                  
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={mnemonic}
                    onChange={(e) => setMnemonic(e.target.value)}
                    placeholder="Enter your mnemonic phrase"
                    sx={{ mb: 2 }}
                  />
                  
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    onClick={loadWallet}
                    sx={{ 
                      py: 1.5,
                      fontSize: '1.1rem'
                    }}
                  >
                    Load Wallet
                  </Button>
                </>
              ) : (
                <>
                  <Tabs 
                    value={activeTab} 
                    onChange={handleTabChange} 
                    centered 
                    sx={{ 
                      mb: 3,
                      '& .MuiTabs-indicator': {
                        height: 3
                      }
                    }}
                  >
                    <Tab label="Ethereum" />
                    <Tab label="Solana" />
                  </Tabs>

                  {activeTab === 0 ? (
                    <>
                      <Typography 
                        variant="h6" 
                        gutterBottom
                        sx={{ 
                          color: 'primary.main',
                          mb: 1
                        }}
                      >
                        Ethereum Address:
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          wordBreak: 'break-all',
                          mb: 3,
                          p: 2,
                          bgcolor: 'background.paper',
                          borderRadius: 1,
                          border: '1px solid rgba(255, 255, 255, 0.12)'
                        }}
                      >
                        {address}
                      </Typography>
                      
                      <Typography 
                        variant="h6" 
                        gutterBottom
                        sx={{ 
                          color: 'primary.main',
                          mb: 1
                        }}
                      >
                        Balance:
                      </Typography>
                      <Typography 
                        variant="body1" 
                        gutterBottom
                        sx={{ mb: 3 }}
                      >
                        {balance} ETH
                      </Typography>

                      <Button 
                        variant="contained" 
                        fullWidth 
                        onClick={deriveNewWallet}
                        sx={{ 
                          my: 2,
                          py: 1.5,
                          fontSize: '1.1rem'
                        }}
                      >
                        Derive New Ethereum Address
                      </Button>

                      <Typography 
                        variant="h6" 
                        gutterBottom 
                        sx={{ 
                          mt: 3,
                          color: 'primary.main',
                          mb: 2
                        }}
                      >
                        Derived Ethereum Addresses:
                      </Typography>
                      <List>
                        {derivedWallets.map((wallet, index) => (
                          <React.Fragment key={wallet.address}>
                            <ListItem>
                              <ListItemText
                                primary={`Address ${wallet.index}:`}
                                secondary={wallet.address}
                                primaryTypographyProps={{
                                  sx: { color: 'primary.main' }
                                }}
                                secondaryTypographyProps={{
                                  sx: { 
                                    wordBreak: 'break-all',
                                    color: 'text.secondary'
                                  }
                                }}
                              />
                            </ListItem>
                            {index < derivedWallets.length - 1 && <Divider />}
                          </React.Fragment>
                        ))}
                      </List>
                    </>
                  ) : (
                    <>
                      <Typography 
                        variant="h6" 
                        gutterBottom
                        sx={{ 
                          color: 'primary.main',
                          mb: 2
                        }}
                      >
                        Solana Addresses:
                      </Typography>
                      <Button 
                        variant="contained" 
                        fullWidth 
                        onClick={deriveNewWallet}
                        sx={{ 
                          my: 2,
                          py: 1.5,
                          fontSize: '1.1rem'
                        }}
                      >
                        Derive New Solana Address
                      </Button>
                      <List>
                        {solanaWallets.map((wallet, index) => (
                          <React.Fragment key={wallet.address}>
                            <ListItem>
                              <ListItemText
                                primary={`Address ${wallet.index}:`}
                                secondary={wallet.address}
                                primaryTypographyProps={{
                                  sx: { color: 'primary.main' }
                                }}
                                secondaryTypographyProps={{
                                  sx: { 
                                    wordBreak: 'break-all',
                                    color: 'text.secondary'
                                  }
                                }}
                              />
                            </ListItem>
                            {index < solanaWallets.length - 1 && <Divider />}
                          </React.Fragment>
                        ))}
                      </List>
                    </>
                  )}
                  
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      mt: 3,
                      color: 'primary.main',
                      mb: 2
                    }}
                  >
                    Mnemonic Phrase (Keep this safe!):
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      wordBreak: 'break-all',
                      p: 2,
                      bgcolor: 'background.paper',
                      borderRadius: 1,
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: 'text.secondary'
                    }}
                  >
                    {mnemonic}
                  </Typography>
                </>
              )}
              
              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mt: 2,
                    borderRadius: 1
                  }}
                >
                  {error}
                </Alert>
              )}
            </Paper>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App; 