// Hyperliquid Bridge2 Contract Configuration
// Based on: https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/bridge2

export const HYPERLIQUID_BRIDGE_CONFIG = {
    mainnet: {
        bridgeAddress: "0x2df1c51e09aecf9cacb7bc98cb1742757f163df7" as `0x${string}`,
        usdcAddress: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831" as `0x${string}`,
        chainId: 42161, // Arbitrum
        minDeposit: 5, // USDC
    },
    testnet: {
        bridgeAddress: "0x08cfc1B6b2dCF36A1480b99353A354AA8AC56f89" as `0x${string}`,
        usdcAddress: "0x1baAbB04529D43a73232B713C0FE471f7c7334d5" as `0x${string}`,
        chainId: 421614, // Arbitrum Sepolia
        minDeposit: 5,
    },
};

// Bridge2 ABI (minimal for deposit)
// The deposit is simply sending USDC to the bridge contract
// For batchedDepositWithPermit, the ABI would be more complex
export const BRIDGE2_ABI = [
    {
        inputs: [
            { name: "user", type: "address" },
            { name: "usd", type: "uint64" },
        ],
        name: "deposit",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { name: "user", type: "address" },
                    { name: "usd", type: "uint64" },
                    { name: "deadline", type: "uint256" },
                    { name: "signature", type: "bytes" },
                ],
                name: "deposits",
                type: "tuple[]",
            },
        ],
        name: "batchedDepositWithPermit",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
] as const;

// ERC20 ABI for USDC approval
export const ERC20_ABI = [
    {
        inputs: [
            { name: "spender", type: "address" },
            { name: "amount", type: "uint256" },
        ],
        name: "approve",
        outputs: [{ name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ name: "account", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { name: "owner", type: "address" },
            { name: "spender", type: "address" },
        ],
        name: "allowance",
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ name: "owner", type: "address" }],
        name: "nonces",
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
] as const;
