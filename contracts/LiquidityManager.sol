// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title LiquidityManager
 * @dev Manages liquidity pools with FHE support for private DEX
 * @notice This contract handles liquidity provision and AMM functionality
 */
contract LiquidityManager is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    // Events
    event LiquidityAdded(
        address indexed user,
        address indexed tokenA,
        address indexed tokenB,
        bytes32 encryptedAmountA,
        bytes32 encryptedAmountB,
        uint256 timestamp
    );
    
    event LiquidityRemoved(
        address indexed user,
        address indexed tokenA,
        address indexed tokenB,
        bytes32 encryptedAmountA,
        bytes32 encryptedAmountB,
        uint256 timestamp
    );
    
    event SwapExecuted(
        address indexed user,
        address indexed tokenIn,
        address indexed tokenOut,
        bytes32 encryptedAmountIn,
        bytes32 encryptedAmountOut,
        uint256 timestamp
    );

    // Structs
    struct LiquidityPool {
        address tokenA;
        address tokenB;
        uint256 reserveA;
        uint256 reserveB;
        uint256 totalSupply;
        bool isActive;
    }
    
    struct EncryptedLiquidity {
        address user;
        address tokenA;
        address tokenB;
        bytes32 encryptedAmountA;
        bytes32 encryptedAmountB;
        bytes32 publicKey;
        uint256 timestamp;
    }

    // State variables
    mapping(bytes32 => LiquidityPool) public pools;
    mapping(address => mapping(bytes32 => EncryptedLiquidity)) public userLiquidity;
    mapping(address => bool) public supportedTokens;
    mapping(address => uint256) public totalLiquidity;
    
    uint256 public constant FEE_DENOMINATOR = 10000;
    uint256 public swapFee = 30; // 0.3%
    uint256 public protocolFee = 5; // 0.05%
    
    address public dexContract;
    address public fhevmContract;
    bool public fhevmEnabled = true;

    // Modifiers
    modifier onlyDEX() {
        require(msg.sender == dexContract, "Only DEX can call this function");
        _;
    }
    
    modifier onlyFHEVM() {
        require(msg.sender == fhevmContract || !fhevmEnabled, "Only FHEVM can call this function");
        _;
    }
    
    modifier validTokens(address tokenA, address tokenB) {
        require(tokenA != tokenB, "Same tokens");
        require(supportedTokens[tokenA] && supportedTokens[tokenB], "Unsupported tokens");
        _;
    }

    constructor(address _dexContract, address _fhevmContract) {
        dexContract = _dexContract;
        fhevmContract = _fhevmContract;
    }

    /**
     * @dev Create a new liquidity pool
     * @param tokenA First token address
     * @param tokenB Second token address
     */
    function createPool(
        address tokenA,
        address tokenB
    ) external onlyOwner validTokens(tokenA, tokenB) {
        bytes32 poolId = keccak256(abi.encodePacked(tokenA, tokenB));
        require(!pools[poolId].isActive, "Pool already exists");
        
        pools[poolId] = LiquidityPool({
            tokenA: tokenA,
            tokenB: tokenB,
            reserveA: 0,
            reserveB: 0,
            totalSupply: 0,
            isActive: true
        });
    }

    /**
     * @dev Add liquidity to a pool
     * @param tokenA First token address
     * @param tokenB Second token address
     * @param amountA Amount of tokenA
     * @param amountB Amount of tokenB
     * @param encryptedAmountA Encrypted amount of tokenA
     * @param encryptedAmountB Encrypted amount of tokenB
     */
    function addLiquidity(
        address tokenA,
        address tokenB,
        uint256 amountA,
        uint256 amountB,
        bytes32 encryptedAmountA,
        bytes32 encryptedAmountB
    ) external validTokens(tokenA, tokenB) nonReentrant {
        require(amountA > 0 && amountB > 0, "Invalid amounts");
        require(encryptedAmountA != bytes32(0) && encryptedAmountB != bytes32(0), "Invalid encrypted amounts");
        
        bytes32 poolId = keccak256(abi.encodePacked(tokenA, tokenB));
        require(pools[poolId].isActive, "Pool not active");
        
        // Transfer tokens
        IERC20(tokenA).safeTransferFrom(msg.sender, address(this), amountA);
        IERC20(tokenB).safeTransferFrom(msg.sender, address(this), amountB);
        
        // Update pool reserves
        pools[poolId].reserveA += amountA;
        pools[poolId].reserveB += amountB;
        
        // Calculate LP tokens (simplified)
        uint256 liquidity = (amountA * amountB) / 1000; // Simplified calculation
        pools[poolId].totalSupply += liquidity;
        
        // Store encrypted liquidity
        userLiquidity[msg.sender][poolId] = EncryptedLiquidity({
            user: msg.sender,
            tokenA: tokenA,
            tokenB: tokenB,
            encryptedAmountA: encryptedAmountA,
            encryptedAmountB: encryptedAmountB,
            publicKey: bytes32(uint256(uint160(msg.sender))), // Mock public key
            timestamp: block.timestamp
        });
        
        totalLiquidity[tokenA] += amountA;
        totalLiquidity[tokenB] += amountB;
        
        emit LiquidityAdded(msg.sender, tokenA, tokenB, encryptedAmountA, encryptedAmountB, block.timestamp);
    }

    /**
     * @dev Remove liquidity from a pool
     * @param tokenA First token address
     * @param tokenB Second token address
     * @param liquidity Amount of LP tokens to burn
     * @param encryptedAmountA Encrypted amount of tokenA
     * @param encryptedAmountB Encrypted amount of tokenB
     */
    function removeLiquidity(
        address tokenA,
        address tokenB,
        uint256 liquidity,
        bytes32 encryptedAmountA,
        bytes32 encryptedAmountB
    ) external validTokens(tokenA, tokenB) nonReentrant {
        require(liquidity > 0, "Invalid liquidity");
        require(encryptedAmountA != bytes32(0) && encryptedAmountB != bytes32(0), "Invalid encrypted amounts");
        
        bytes32 poolId = keccak256(abi.encodePacked(tokenA, tokenB));
        require(pools[poolId].isActive, "Pool not active");
        require(pools[poolId].totalSupply >= liquidity, "Insufficient liquidity");
        
        // Calculate amounts to return
        uint256 amountA = (liquidity * pools[poolId].reserveA) / pools[poolId].totalSupply;
        uint256 amountB = (liquidity * pools[poolId].reserveB) / pools[poolId].totalSupply;
        
        // Update pool reserves
        pools[poolId].reserveA -= amountA;
        pools[poolId].reserveB -= amountB;
        pools[poolId].totalSupply -= liquidity;
        
        // Transfer tokens back
        IERC20(tokenA).safeTransfer(msg.sender, amountA);
        IERC20(tokenB).safeTransfer(msg.sender, amountB);
        
        // Update encrypted liquidity
        userLiquidity[msg.sender][poolId] = EncryptedLiquidity({
            user: msg.sender,
            tokenA: tokenA,
            tokenB: tokenB,
            encryptedAmountA: encryptedAmountA,
            encryptedAmountB: encryptedAmountB,
            publicKey: bytes32(uint256(uint160(msg.sender))), // Mock public key
            timestamp: block.timestamp
        });
        
        totalLiquidity[tokenA] -= amountA;
        totalLiquidity[tokenB] -= amountB;
        
        emit LiquidityRemoved(msg.sender, tokenA, tokenB, encryptedAmountA, encryptedAmountB, block.timestamp);
    }

    /**
     * @dev Execute a swap
     * @param tokenIn Input token address
     * @param tokenOut Output token address
     * @param amountIn Amount of input tokens
     * @param encryptedAmountIn Encrypted amount of input tokens
     * @param encryptedAmountOut Encrypted amount of output tokens
     */
    function swap(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        bytes32 encryptedAmountIn,
        bytes32 encryptedAmountOut
    ) external validTokens(tokenIn, tokenOut) nonReentrant {
        require(amountIn > 0, "Invalid amount");
        require(encryptedAmountIn != bytes32(0) && encryptedAmountOut != bytes32(0), "Invalid encrypted amounts");
        
        bytes32 poolId = keccak256(abi.encodePacked(tokenIn, tokenOut));
        require(pools[poolId].isActive, "Pool not active");
        
        // Calculate output amount using constant product formula
        uint256 amountOut = calculateSwapOutput(tokenIn, tokenOut, amountIn);
        require(amountOut > 0, "Insufficient output amount");
        
        // Transfer input tokens
        IERC20(tokenIn).safeTransferFrom(msg.sender, address(this), amountIn);
        
        // Transfer output tokens
        IERC20(tokenOut).safeTransfer(msg.sender, amountOut);
        
        // Update pool reserves
        pools[poolId].reserveA += amountIn;
        pools[poolId].reserveB -= amountOut;
        
        emit SwapExecuted(msg.sender, tokenIn, tokenOut, encryptedAmountIn, encryptedAmountOut, block.timestamp);
    }

    /**
     * @dev Calculate swap output using constant product formula
     * @param tokenIn Input token address
     * @param tokenOut Output token address
     * @param amountIn Amount of input tokens
     * @return Amount of output tokens
     */
    function calculateSwapOutput(
        address tokenIn,
        address tokenOut,
        uint256 amountIn
    ) public view returns (uint256) {
        bytes32 poolId = keccak256(abi.encodePacked(tokenIn, tokenOut));
        require(pools[poolId].isActive, "Pool not active");
        
        uint256 reserveIn = tokenIn == pools[poolId].tokenA ? pools[poolId].reserveA : pools[poolId].reserveB;
        uint256 reserveOut = tokenOut == pools[poolId].tokenA ? pools[poolId].reserveA : pools[poolId].reserveB;
        
        require(reserveIn > 0 && reserveOut > 0, "Insufficient liquidity");
        
        // Apply fee
        uint256 amountInWithFee = amountIn * (FEE_DENOMINATOR - swapFee);
        uint256 numerator = amountInWithFee * reserveOut;
        uint256 denominator = (reserveIn * FEE_DENOMINATOR) + amountInWithFee;
        
        return numerator / denominator;
    }

    /**
     * @dev Get pool information
     * @param tokenA First token address
     * @param tokenB Second token address
     * @return LiquidityPool struct
     */
    function getPool(address tokenA, address tokenB) external view returns (LiquidityPool memory) {
        bytes32 poolId = keccak256(abi.encodePacked(tokenA, tokenB));
        return pools[poolId];
    }

    /**
     * @dev Get user's encrypted liquidity
     * @param user User address
     * @param tokenA First token address
     * @param tokenB Second token address
     * @return EncryptedLiquidity struct
     */
    function getUserLiquidity(
        address user,
        address tokenA,
        address tokenB
    ) external view returns (EncryptedLiquidity memory) {
        bytes32 poolId = keccak256(abi.encodePacked(tokenA, tokenB));
        return userLiquidity[user][poolId];
    }

    /**
     * @dev Add supported token
     * @param token Token address
     */
    function addSupportedToken(address token) external onlyOwner {
        supportedTokens[token] = true;
    }

    /**
     * @dev Set swap fee
     * @param _swapFee New swap fee (in basis points)
     */
    function setSwapFee(uint256 _swapFee) external onlyOwner {
        require(_swapFee <= 1000, "Fee too high"); // Max 10%
        swapFee = _swapFee;
    }

    /**
     * @dev Set protocol fee
     * @param _protocolFee New protocol fee (in basis points)
     */
    function setProtocolFee(uint256 _protocolFee) external onlyOwner {
        require(_protocolFee <= 100, "Fee too high"); // Max 1%
        protocolFee = _protocolFee;
    }

    /**
     * @dev Set DEX contract address
     * @param _dexContract DEX contract address
     */
    function setDEXContract(address _dexContract) external onlyOwner {
        dexContract = _dexContract;
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
}
