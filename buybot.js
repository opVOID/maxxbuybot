const { ethers } = require('ethers');
const fs = require('fs');
const { Telegraf } = require('telegraf');

const mnemonic = 'robust travel help bundle answer strong window sniff page dance across poem';
const { HDNodeWallet } = require('ethers')
const userWallet = ethers.HDNodeWallet.fromMnemonic(mnemonic)


const bot = new Telegraf('6137459936:AAFbQZKJvdqTHgQCCBsR5Z3-A-QFwiATZXo');
const uniswap = {
  address: '0x9b45ab272a7c500fc03d2b57951fc622e8d27938',
  rpcLink: 'https://mainrpc.maxxchain.org',
  dex: 'Uniswap'
};

const tokenContractAddress = '0x9d1677c605c27d2147ad7A9f220dEe64EA4D05D6'; 
const tokenContract = buildContract(tokenContractAddress, uniswap.rpcLink);

bot.command('startBot', (context) => {
  console.log('Bot triggered from inside the script.');
  context.reply('Bot triggered from inside the script. Scanning...');
});

async function triggerBot() {
  try {
    console.log('Bot started on startup.');
    await bot.telegram.sendMessage('-1001811891703', 'Bot started on startup. Scanning...');
  } catch (error) {
    console.error('An error occurred during bot startup:', error);
    console.log('Restarting the bot...');
    triggerBot(); // Recursive call to trigger the bot on startup again
  }
}

triggerBot();

function startBot() {
  console.log('Initializing the bot...');
  try {
    bot.start((context) => {
      console.log('Bot started.');
      context.reply('Scanning...');
    });

    tokenContract.on('Transfer', async (from, to, amount) => {
      await logTokenEventInfo('Transfer', from, to, amount, uniswap.rpcLink, uniswap.dex, bot);
    });

    tokenContract.on('Swap', async (from, to, amount) => {
      await logTokenEventInfo('Swap', from, to, amount, uniswap.rpcLink, uniswap.dex, bot);
    });

    bot.catch((err) => {
      console.error('An error occurred:', err);
      console.log('Restarting the bot...');
      startBot(); // Recursive call to restart the bot
    });

    bot.launch();
  } catch (error) {
    console.error('An error occurred during bot startup:', error);
    console.log('Restarting the bot...');
    startBot(); // Recursive call to restart the bot
  }
}

startBot();

function buildContract(_address, _rpcLink) {
  const provider = new ethers.providers.JsonRpcProvider(_rpcLink);
  const account = wallet.connect(provider);

  const factory = new ethers.Contract(
    _address,
    ['event Transfer(address indexed from, address indexed to, uint256 value)', 'event Swap(address indexed from, address indexed to, uint256 value)'],
    account
  );

  return factory;
}

async function logTokenEventInfo(eventType, _from, _to, _amount, rpcLink, dex, bot) {
    try {
      if (_from.toLowerCase() === '0x3B2D382526C5202BbfEeb7364662cC8eE61c0f36'.toLowerCase()) {
        const provider = new ethers.providers.JsonRpcProvider(rpcLink);
        const account = wallet.connect(provider);
  
        const keyboard = {
          inline_keyboard: [
            [{ text: 'Join Pairsniffer Group', url: 'https://t.me/pairsniffermaxx' }],
            [{ text: 'Join Maxxdoge Group', url: 'https://t.me/maxxdoge' }],
            [{ text: 'DM to List your Promo', url: 'https://t.me/mannaushack' }],
          ],
        };
  
        const formattedAmount = (parseFloat(_amount) / 1000000000).toLocaleString(undefined, {
            minimumFractionDigits: 3,
            maximumFractionDigits: 3,
          });
  
        const msg = `
          New <code>$MDOGE>/code> Buy detected:
          ⏰ Event took place <code>${getDate()}</code>
            
          🎯  From: <code>${_from}</code>
          💠  To: <code>${_to}</code>
          💰 Amount: <code>${formattedAmount}</code>
          
        `;
  
        await bot.telegram.sendMessage('-1001811891703', msg, {
          parse_mode: 'HTML',
          reply_markup: keyboard,
        });
  
        console.log(`${eventType} message sent successfully.`);
      }
    } catch (error) {
      console.error('An error occurred during message sending:', error);
    }
  }
