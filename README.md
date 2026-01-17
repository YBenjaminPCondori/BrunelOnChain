# BrunelOnChain: Hyperliquid Onboarding & Theme Trading

**Winner of the "Cleanest UX" Category (Target)**

> A seamless, one-click onboarding experience for Hyperliquid, powered by **LI.FI**.

BrunelOnChain bridges the gap between fragmented liquidity and the Hyperliquid ecosystem. We enable users to easily bridge funds from any chain (Arbitrum, Optimism, Base, etc.) directly into HyperEVM, and immediately deploy those funds into curated "Trading Themes" (AI, L2, Solana Eco).

## 🚀 Key Features

- **Custom LI.FI Integration**: Not just a widget. We built a custom SDK integration to provide a "Pro" onboarding experience with transparency.
- **Detailed Route Preview**: See exact gas costs, bridge providers, and estimated time before you sign.
- **Real-Time Execution Tracking**: Step-by-step visual progress for cross-chain transactions.
- **Theme-Based Trading**: Don't just bridge—trade narratives. Select a theme (e.g., "AI Basket") and onboard directly into it.
- **Mobile-First Design**: Fully responsive UI that works perfectly on your phone.

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Bridging/Swapping**: LI.FI SDK (`@lifi/sdk`)
- **Blockchain Interaction**: Wagmi, Viem, TanStack Query
- **Styling**: TailwindCSS, Shadcn/UI, Lucide React
- **Font**: Geist Sans (Vercel)

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- NPM or Yarn

### Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/YBenjaminPCondori/BrunelOnChain.git
   cd BrunelOnChain
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 💡 How it Works

1. **Choose a Theme**: Select a trading narrative (e.g., "AI Basket") from the home page.
2. **Onboard**: You are directed to the Onboarding page with the theme context.
3. **Bridge**: Select your source chain (e.g., Arbitrum) and token. The UI fetches the best route via LI.FI.
4. **Execute**: Confirm the transaction. Our custom execution tracker guides you through the cross-chain process.
5. **Trade**: (Coming V2) Once funds arrive on HyperEVM, they are auto-deployed into the selected basket.

## 🏆 Hackathon Tracks

- **Hyperliquid Onboarding**: One-click flow from external chains to HyperEVM.
- **Clean UX**: Transparent fees, detailed steps, and mobile optimization.
- **Creative Use of LI.FI**: Custom hooks and UI components instead of the default widget.

---

Built with ❤️ by the BrunelOnChain Team.
