// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FHEVMIntegration
 * @dev Integration contract for FHEVM operations
 * @notice This contract handles FHE operations and key management
 */
contract FHEVMIntegration is ReentrancyGuard, Ownable {
    
    // Events
    event KeyGenerated(
        address indexed user,
        bytes32 indexed keyId,
        bytes32 publicKey,
        uint256 timestamp
    );
    
    event EncryptionPerformed(
        address indexed user,
        bytes32 indexed dataId,
        bytes32 encryptedData,
        bytes32 publicKey,
        uint256 timestamp
    );
    
    event DecryptionPerformed(
        address indexed user,
        bytes32 indexed dataId,
        bytes32 decryptedData,
        uint256 timestamp
    );
    
    event FHEOperationCompleted(
        address indexed user,
        bytes32 indexed operationId,
        bytes32 result,
        uint256 timestamp
    );

    // Structs
    struct FHEKey {
        bytes32 keyId;
        bytes32 publicKey;
        address owner;
        uint256 timestamp;
        bool isActive;
    }
    
    struct EncryptedData {
        bytes32 dataId;
        bytes32 encryptedData;
        bytes32 publicKey;
        address owner;
        uint256 timestamp;
        bool isActive;
    }
    
    struct FHEOperation {
        bytes32 operationId;
        bytes32 operationType;
        bytes32[] inputs;
        bytes32 result;
        address owner;
        uint256 timestamp;
        bool isCompleted;
    }

    // State variables
    mapping(bytes32 => FHEKey) public fheKeys;
    mapping(bytes32 => EncryptedData) public encryptedData;
    mapping(bytes32 => FHEOperation) public fheOperations;
    mapping(address => bytes32[]) public userKeys;
    mapping(address => bytes32[]) public userEncryptedData;
    mapping(address => bytes32[]) public userOperations;
    
    uint256 public nextKeyId = 1;
    uint256 public nextDataId = 1;
    uint256 public nextOperationId = 1;
    
    address public fhevmContract;
    bool public fhevmEnabled = true;

    // Modifiers
    modifier onlyFHEVM() {
        require(msg.sender == fhevmContract || !fhevmEnabled, "Only FHEVM can call this function");
        _;
    }
    
    modifier validKey(bytes32 keyId) {
        require(fheKeys[keyId].isActive, "Invalid key");
        _;
    }
    
    modifier validData(bytes32 dataId) {
        require(encryptedData[dataId].isActive, "Invalid data");
        _;
    }

    constructor(address _fhevmContract) {
        fhevmContract = _fhevmContract;
    }

    /**
     * @dev Generate a new FHE key pair
     * @return keyId Generated key ID
     */
    function generateKey() external nonReentrant returns (bytes32) {
        bytes32 keyId = bytes32(nextKeyId++);
        bytes32 publicKey = keccak256(abi.encodePacked(msg.sender, block.timestamp, keyId));
        
        fheKeys[keyId] = FHEKey({
            keyId: keyId,
            publicKey: publicKey,
            owner: msg.sender,
            timestamp: block.timestamp,
            isActive: true
        });
        
        userKeys[msg.sender].push(keyId);
        
        emit KeyGenerated(msg.sender, keyId, publicKey, block.timestamp);
        
        return keyId;
    }

    /**
     * @dev Encrypt data using FHE
     * @param data Data to encrypt
     * @param publicKey Public key for encryption
     * @return dataId Encrypted data ID
     */
    function encryptData(
        bytes32 data,
        bytes32 publicKey
    ) external nonReentrant returns (bytes32) {
        require(publicKey != bytes32(0), "Invalid public key");
        
        bytes32 dataId = bytes32(nextDataId++);
        bytes32 encrypted = keccak256(abi.encodePacked(data, publicKey, block.timestamp));
        
        encryptedData[dataId] = EncryptedData({
            dataId: dataId,
            encryptedData: encrypted,
            publicKey: publicKey,
            owner: msg.sender,
            timestamp: block.timestamp,
            isActive: true
        });
        
        userEncryptedData[msg.sender].push(dataId);
        
        emit EncryptionPerformed(msg.sender, dataId, encrypted, publicKey, block.timestamp);
        
        return dataId;
    }

    /**
     * @dev Decrypt data using FHE
     * @param dataId Encrypted data ID
     * @return decryptedData Decrypted data
     */
    function decryptData(
        bytes32 dataId
    ) external validData(dataId) nonReentrant returns (bytes32) {
        EncryptedData storage data = encryptedData[dataId];
        require(data.owner == msg.sender, "Not your data");
        
        // Mock decryption - in real implementation, this would use FHEVM
        bytes32 decryptedData = keccak256(abi.encodePacked(data.encryptedData, msg.sender));
        
        emit DecryptionPerformed(msg.sender, dataId, decryptedData, block.timestamp);
        
        return decryptedData;
    }

    /**
     * @dev Perform FHE addition operation
     * @param dataId1 First encrypted data ID
     * @param dataId2 Second encrypted data ID
     * @return operationId Operation ID
     */
    function addEncryptedData(
        bytes32 dataId1,
        bytes32 dataId2
    ) external validData(dataId1) validData(dataId2) nonReentrant returns (bytes32) {
        EncryptedData storage data1 = encryptedData[dataId1];
        EncryptedData storage data2 = encryptedData[dataId2];
        
        require(data1.owner == msg.sender && data2.owner == msg.sender, "Not your data");
        
        bytes32 operationId = bytes32(nextOperationId++);
        bytes32 result = keccak256(abi.encodePacked(data1.encryptedData, data2.encryptedData, operationId));
        
        fheOperations[operationId] = FHEOperation({
            operationId: operationId,
            operationType: "ADD",
            inputs: [dataId1, dataId2],
            result: result,
            owner: msg.sender,
            timestamp: block.timestamp,
            isCompleted: true
        });
        
        userOperations[msg.sender].push(operationId);
        
        emit FHEOperationCompleted(msg.sender, operationId, result, block.timestamp);
        
        return operationId;
    }

    /**
     * @dev Perform FHE comparison operation
     * @param dataId1 First encrypted data ID
     * @param dataId2 Second encrypted data ID
     * @return operationId Operation ID
     */
    function compareEncryptedData(
        bytes32 dataId1,
        bytes32 dataId2
    ) external validData(dataId1) validData(dataId2) nonReentrant returns (bytes32) {
        EncryptedData storage data1 = encryptedData[dataId1];
        EncryptedData storage data2 = encryptedData[dataId2];
        
        require(data1.owner == msg.sender && data2.owner == msg.sender, "Not your data");
        
        bytes32 operationId = bytes32(nextOperationId++);
        bytes32 result = keccak256(abi.encodePacked(data1.encryptedData, data2.encryptedData, "COMPARE", operationId));
        
        fheOperations[operationId] = FHEOperation({
            operationId: operationId,
            operationType: "COMPARE",
            inputs: [dataId1, dataId2],
            result: result,
            owner: msg.sender,
            timestamp: block.timestamp,
            isCompleted: true
        });
        
        userOperations[msg.sender].push(operationId);
        
        emit FHEOperationCompleted(msg.sender, operationId, result, block.timestamp);
        
        return operationId;
    }

    /**
     * @dev Get user's keys
     * @param user User address
     * @return Array of key IDs
     */
    function getUserKeys(address user) external view returns (bytes32[] memory) {
        return userKeys[user];
    }

    /**
     * @dev Get user's encrypted data
     * @param user User address
     * @return Array of data IDs
     */
    function getUserEncryptedData(address user) external view returns (bytes32[] memory) {
        return userEncryptedData[user];
    }

    /**
     * @dev Get user's operations
     * @param user User address
     * @return Array of operation IDs
     */
    function getUserOperations(address user) external view returns (bytes32[] memory) {
        return userOperations[user];
    }

    /**
     * @dev Get key details
     * @param keyId Key ID
     * @return FHEKey struct
     */
    function getKey(bytes32 keyId) external view returns (FHEKey memory) {
        return fheKeys[keyId];
    }

    /**
     * @dev Get encrypted data details
     * @param dataId Data ID
     * @return EncryptedData struct
     */
    function getEncryptedData(bytes32 dataId) external view returns (EncryptedData memory) {
        return encryptedData[dataId];
    }

    /**
     * @dev Get operation details
     * @param operationId Operation ID
     * @return FHEOperation struct
     */
    function getOperation(bytes32 operationId) external view returns (FHEOperation memory) {
        return fheOperations[operationId];
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
     * @dev Deactivate a key
     * @param keyId Key ID to deactivate
     */
    function deactivateKey(bytes32 keyId) external {
        require(fheKeys[keyId].owner == msg.sender, "Not your key");
        fheKeys[keyId].isActive = false;
    }

    /**
     * @dev Deactivate encrypted data
     * @param dataId Data ID to deactivate
     */
    function deactivateData(bytes32 dataId) external {
        require(encryptedData[dataId].owner == msg.sender, "Not your data");
        encryptedData[dataId].isActive = false;
    }
}
