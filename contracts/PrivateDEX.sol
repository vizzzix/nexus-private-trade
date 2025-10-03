// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title PrivateDEX
 * @dev A decentralized exchange with Fully Homomorphic Encryption (FHE) support
 * @notice This contract enables private trading where order amounts and balances are encrypted
 */
contract PrivateDEX is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    // Events
    event OrderPlaced(
        uint256 indexed orderId,
        address indexed user,
        string pair,
        bool isBuy,
        bytes32 encryptedAmount,
        bytes32 encryptedPrice,
        uint256 timestamp
    );
    
    event OrderMatched(
        uint256 indexed orderId,
        address indexed buyer,
        address indexed seller,
        string pair,
        bytes32 encryptedAmount,
        bytes32 encryptedPrice,
        uint256 timestamp
    );
    
    event OrderCancelled(
        uint256 indexed orderId,
        address indexed user,
        uint256 timestamp
    );
    
    event LiquidityAdded(
        address indexed user,
        address indexed token,
        bytes32 encryptedAmount,
        uint256 timestamp
    );
    
    event LiquidityRemoved(
        address indexed user,
        address indexed token,
        bytes32 encryptedAmount,
        uint256 timestamp
    );

    // Structs
    struct Order {
        uint256 id;
        address user;
        string pair;
        bool isBuy;
        bytes32 encryptedAmount;
        bytes32 encryptedPrice;
        uint256 timestamp;
        bool isActive;
    }
    
    struct EncryptedBalance {
        address token;
        bytes32 encryptedAmount;
        bytes32 publicKey;
    }
    
    struct TradingPair {
        address baseToken;
        address quoteToken;
        bool isActive;
        uint256 totalLiquidity;
    }

    // State variables
    mapping(uint256 => Order) public orders;
    mapping(address => mapping(address => EncryptedBalance)) public encryptedBalances;
    mapping(string => TradingPair) public tradingPairs;
    mapping(address => bool) public supportedTokens;
    mapping(address => uint256[]) public userOrders;
    
    uint256 public nextOrderId = 1;
    uint256 public totalOrders = 0;
    uint256 public totalLiquidity = 0;
    
    // FHEVM integration
    address public fhevmContract;
    bool public fhevmEnabled = true;

    // Modifiers
    modifier onlyFHEVM() {
        require(msg.sender == fhevmContract || !fhevmEnabled, "Only FHEVM can call this function");
        _;
    }
    
    modifier validPair(string memory pair) {
        require(tradingPairs[pair].isActive, "Trading pair not active");
        _;
    }
    
    modifier validToken(address token) {
        require(supportedTokens[token], "Token not supported");
        _;
    }

    constructor(address _fhevmContract) {
        fhevmContract = _fhevmContract;
    }

    /**
     * @dev Place an encrypted order
     * @param pair Trading pair (e.g., "ETH/USDT")
     * @param isBuy True for buy order, false for sell order
     * @param encryptedAmount Encrypted amount using FHE
     * @param encryptedPrice Encrypted price using FHE
     */
    function placeOrder(
        string memory pair,
        bool isBuy,
        bytes32 encryptedAmount,
        bytes32 encryptedPrice
    ) external validPair(pair) nonReentrant returns (uint256) {
        require(encryptedAmount != bytes32(0), "Invalid encrypted amount");
        require(encryptedPrice != bytes32(0), "Invalid encrypted price");
        
        uint256 orderId = nextOrderId++;
        Order memory newOrder = Order({
            id: orderId,
            user: msg.sender,
            pair: pair,
            isBuy: isBuy,
            encryptedAmount: encryptedAmount,
            encryptedPrice: encryptedPrice,
            timestamp: block.timestamp,
            isActive: true
        });
        
        orders[orderId] = newOrder;
        userOrders[msg.sender].push(orderId);
        totalOrders++;
        
        emit OrderPlaced(orderId, msg.sender, pair, isBuy, encryptedAmount, encryptedPrice, block.timestamp);
        
        return orderId;
    }

    /**
     * @dev Cancel an order
     * @param orderId ID of the order to cancel
     */
    function cancelOrder(uint256 orderId) external nonReentrant {
        Order storage order = orders[orderId];
        require(order.user == msg.sender, "Not your order");
        require(order.isActive, "Order not active");
        
        order.isActive = false;
        
        emit OrderCancelled(orderId, msg.sender, block.timestamp);
    }

    /**
     * @dev Match orders (called by FHEVM or authorized matcher)
     * @param buyOrderId ID of the buy order
     * @param sellOrderId ID of the sell order
     */
    function matchOrders(
        uint256 buyOrderId,
        uint256 sellOrderId
    ) external onlyFHEVM nonReentrant {
        Order storage buyOrder = orders[buyOrderId];
        Order storage sellOrder = orders[sellOrderId];
        
        require(buyOrder.isActive && sellOrder.isActive, "Orders not active");
        require(buyOrder.isBuy && !sellOrder.isBuy, "Invalid order types");
        require(keccak256(bytes(buyOrder.pair)) == keccak256(bytes(sellOrder.pair)), "Pairs don't match");
        
        // Mark orders as inactive
        buyOrder.isActive = false;
        sellOrder.isActive = false;
        
        emit OrderMatched(
            buyOrderId,
            buyOrder.user,
            sellOrder.user,
            buyOrder.pair,
            buyOrder.encryptedAmount,
            buyOrder.encryptedPrice,
            block.timestamp
        );
    }

    /**
     * @dev Add liquidity to a trading pair
     * @param token Token address
     * @param amount Amount of tokens to add
     * @param encryptedAmount Encrypted amount using FHE
     */
    function addLiquidity(
        address token,
        uint256 amount,
        bytes32 encryptedAmount
    ) external validToken(token) nonReentrant {
        require(amount > 0, "Amount must be positive");
        require(encryptedAmount != bytes32(0), "Invalid encrypted amount");
        
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        
        // Update encrypted balance
        encryptedBalances[msg.sender][token] = EncryptedBalance({
            token: token,
            encryptedAmount: encryptedAmount,
            publicKey: bytes32(uint256(uint160(msg.sender))) // Mock public key
        });
        
        totalLiquidity += amount;
        
        emit LiquidityAdded(msg.sender, token, encryptedAmount, block.timestamp);
    }

    /**
     * @dev Remove liquidity from a trading pair
     * @param token Token address
     * @param amount Amount of tokens to remove
     * @param encryptedAmount Encrypted amount using FHE
     */
    function removeLiquidity(
        address token,
        uint256 amount,
        bytes32 encryptedAmount
    ) external validToken(token) nonReentrant {
        require(amount > 0, "Amount must be positive");
        require(encryptedAmount != bytes32(0), "Invalid encrypted amount");
        
        IERC20(token).safeTransfer(msg.sender, amount);
        
        // Update encrypted balance
        encryptedBalances[msg.sender][token] = EncryptedBalance({
            token: token,
            encryptedAmount: encryptedAmount,
            publicKey: bytes32(uint256(uint160(msg.sender))) // Mock public key
        });
        
        totalLiquidity -= amount;
        
        emit LiquidityRemoved(msg.sender, token, encryptedAmount, block.timestamp);
    }

    /**
     * @dev Add a new trading pair
     * @param pair Trading pair identifier
     * @param baseToken Base token address
     * @param quoteToken Quote token address
     */
    function addTradingPair(
        string memory pair,
        address baseToken,
        address quoteToken
    ) external onlyOwner {
        require(baseToken != address(0), "Invalid base token");
        require(quoteToken != address(0), "Invalid quote token");
        require(!tradingPairs[pair].isActive, "Pair already exists");
        
        tradingPairs[pair] = TradingPair({
            baseToken: baseToken,
            quoteToken: quoteToken,
            isActive: true,
            totalLiquidity: 0
        });
        
        supportedTokens[baseToken] = true;
        supportedTokens[quoteToken] = true;
    }

    /**
     * @dev Get user's orders
     * @param user User address
     * @return Array of order IDs
     */
    function getUserOrders(address user) external view returns (uint256[] memory) {
        return userOrders[user];
    }

    /**
     * @dev Get order details
     * @param orderId Order ID
     * @return Order struct
     */
    function getOrder(uint256 orderId) external view returns (Order memory) {
        return orders[orderId];
    }

    /**
     * @dev Get encrypted balance for a user and token
     * @param user User address
     * @param token Token address
     * @return EncryptedBalance struct
     */
    function getEncryptedBalance(address user, address token) external view returns (EncryptedBalance memory) {
        return encryptedBalances[user][token];
    }

    /**
     * @dev Get trading pair details
     * @param pair Trading pair identifier
     * @return TradingPair struct
     */
    function getTradingPair(string memory pair) external view returns (TradingPair memory) {
        return tradingPairs[pair];
    }

    /**
     * @dev Set FHEVM contract address
     * @param _fhevmContract FHEVM contract address
     */
    function setFHEVMContract(address _fhevmContract) external onlyOwner {
        fhevmContract = _fhevmContract;
    }

    /**
     * @dev Enable/disable FHEVM integration
     * @param enabled True to enable, false to disable
     */
    function setFHEVMEnabled(bool enabled) external onlyOwner {
        fhevmEnabled = enabled;
    }

    /**
     * @dev Emergency withdraw (only owner)
     * @param token Token address
     * @param amount Amount to withdraw
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        IERC20(token).safeTransfer(owner(), amount);
    }
}
