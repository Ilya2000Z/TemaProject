import React, { useEffect, useState } from "react";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import { ethers } from "ethers";
import { success, err, warn } from "../utils/responseMessages";
import "react-toastify/dist/ReactToastify.css";
import Select from 'react-select';
import iconUSDT from "/public/USDC2.svg"
import shoes from "../public/image6.png"
import Image from 'next/image';

// Import abi
import abi from "../utils/contract.json";

import usdcAbi from "../utils/usdcContract.json";

const options = [
  { value: 'Binance Coin', label: <div><Image src="/usd2.png" width={50} height={50} alt="Picture of the author"/>Tether</div> },
  { value: 'MakerDao', label: <div><Image src="/usd3.png" width={50} height={50} alt="Picture of the author"/>Binance Coin</div> },
  { value: 'MakerDao', label: <div><Image src="/usd4.png" width={50} height={50} alt="Picture of the author"/>MakerDao</div> },
];
export default function Home() {
  const usdcContractAddress = "0x07865c6E87B9F70255377e024ace6630C1Eaa37F";

  const contractAddress = "0x1A4816A6559f63E253407938C61271EdE76C9687";
  const [selectedOption, setSelectedOption] = useState({ value: 'Tether', label: <div><Image src="/USDC3.png" width={50} height={50} alt="Picture of the author"/>USD Coin</div>});
  /**
   * Create a variable here that references the abi content!
   */
  const contractABI = abi;

  const [currentAccount, setCurrentAccount] = useState("");
  const [sending, setSending] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [approving, setApproving] = useState(false);
  const [amount, setAmount] = useState("");

  /**
   * Check if the user wallet is connected
   */
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      /*
       * Check if we're authorized to access the user's wallet
       */
      const accounts = await ethereum.request({ method: "eth_accounts" });

      // Validate that we have an account
      if (accounts.length !== 0) {
        const account = accounts[0];

        // Set the current account
        setCurrentAccount(account);

        // Display a success message to the user that they are connected
        success("🦄 Wallet is Connected!");
      } else {
        warn("Make sure you have MetaMask Connected!");
      }
    } catch (error) {
      err(`${error.message}`);
    }
  };

  /**
   * Implement your connectWallet method here
   */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      // Check if MetaMask is installed
      if (!ethereum) {
        warn("Make sure you have MetaMask Connected!");
        return;
      }

      // Request account access if needed
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      // Get the first account we get back
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  // Check if the user has approved the contract to spend their USDC
  const Fund = async () => {
    try {
      const { ethereum } = window;

      // Check is user already connected a wallet
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        // Create a contract instance
        const fundContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        console.log("Connected to contract");
        console.log("amount: ", amount);

        // Send the transaction
        const Txn = await fundContract.Fund(amount, {
          gasLimit: 300000,
        });

        console.log("Mining...", Txn.hash);

        // Set the sending state to true
        setSending(true);

        // Wait for the transaction to be mined
        await Txn.wait();

        // Set the sending state to false
        setSending(false);

        console.log("Mined -- ", Txn.hash);

        // Display a success message to the user
        success("🦄 Donation Sent Successfully!");
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      err(`${error.message}`);
    }
  };

  // Check if the user has approved the contract to spend their USDC
  const Approve = async () => {
    try {
      const { ethereum } = window;

      // Check if User already connected a wallet
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        // Create a contract object
        const usdcContract = new ethers.Contract(
          usdcContractAddress,
          usdcAbi,
          signer
        );

        // Use the approval function to send USDC to the contract
        const usdcTxn = await usdcContract.approve(
          contractAddress,
          ethers.utils.parseUnits("1000", 6)
        );

        // Set the approving state to true
        setApproving(true);

        // Wait for the transaction to be mined
        await usdcTxn.wait();

        // Set the approving state to false
        setApproving(false);

        // Set the isApproved state to true
        setIsApproved(true);

        // Display a success message to the user
        success("🦄 USDC Approved Successfully!");
      }
    } catch (error) {
      err(`${error.message}`);
    }
  };

  /*
   * This runs our function when the page loads.
   */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="flex flex-col items-center mt-4 min-h-screen py-2">
      <Head>
        <title>Usdc Demo</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css"
              integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
              crossOrigin="anonymous"/>
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <div className="container walet-container">
          <div className="row">
            <div className="col-lg-8 container-price">
              <div className="item-background">
                  <div className="firstContainer">
                    <div className="col-lg-12 selector-container">
                      <Select
                          defaultValue={selectedOption}
                          onChange={setSelectedOption}
                          options={options}
                      />
                    </div>
                  </div>
                  <div className="secontContainer">
                    <div className="color-price">
                      25 USDT
                    </div>
                    <div className="col-lg-3">
                      <svg width="100" height="24" viewBox="0 0 212 73" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.5" y="0.5" width="211" height="72" rx="25.5" fill="#EEEEEE" fill-opacity="0.4"/>
                        <path d="M53.142 47.5V25.6818H66.3097V28.0256H55.7841V35.3977H65.6278V37.7415H55.7841V45.1562H66.4801V47.5H53.142ZM71.3717 47.5V25.6818H78.7439C80.4484 25.6818 81.8476 25.973 82.9413 26.5554C84.0351 27.1307 84.8447 27.9226 85.3703 28.9311C85.8959 29.9396 86.1587 31.0866 86.1587 32.3722C86.1587 33.6577 85.8959 34.7976 85.3703 35.7919C84.8447 36.7862 84.0386 37.5675 82.952 38.1357C81.8653 38.6967 80.4768 38.9773 78.7865 38.9773H72.8206V36.5909H78.7013C79.8661 36.5909 80.8036 36.4205 81.5138 36.0795C82.2311 35.7386 82.7496 35.2557 83.0692 34.6307C83.3959 33.9986 83.5592 33.2457 83.5592 32.3722C83.5592 31.4986 83.3959 30.7351 83.0692 30.0817C82.7425 29.4283 82.2205 28.924 81.5031 28.5689C80.7858 28.2067 79.8376 28.0256 78.6587 28.0256H74.0138V47.5H71.3717ZM81.6416 37.6989L87.0109 47.5H83.9428L78.6587 37.6989H81.6416ZM108.418 32.5H105.776C105.62 31.7401 105.346 31.0724 104.956 30.4972C104.572 29.9219 104.103 29.4389 103.549 29.0483C103.003 28.6506 102.395 28.3523 101.728 28.1534C101.06 27.9545 100.364 27.8551 99.6396 27.8551C98.3186 27.8551 97.1218 28.1889 96.0494 28.8565C94.9841 29.5241 94.1353 30.5078 93.5032 31.8075C92.8782 33.1072 92.5657 34.7017 92.5657 36.5909C92.5657 38.4801 92.8782 40.0746 93.5032 41.3743C94.1353 42.674 94.9841 43.6577 96.0494 44.3253C97.1218 44.9929 98.3186 45.3267 99.6396 45.3267C100.364 45.3267 101.06 45.2273 101.728 45.0284C102.395 44.8295 103.003 44.5348 103.549 44.1442C104.103 43.7464 104.572 43.2599 104.956 42.6847C105.346 42.1023 105.62 41.4347 105.776 40.6818H108.418C108.219 41.7969 107.857 42.7947 107.331 43.6754C106.806 44.5561 106.152 45.3054 105.371 45.9233C104.59 46.5341 103.713 46.9993 102.74 47.3189C101.774 47.6385 100.74 47.7983 99.6396 47.7983C97.7788 47.7983 96.124 47.3438 94.6751 46.4347C93.2262 45.5256 92.0863 44.233 91.2554 42.5568C90.4244 40.8807 90.0089 38.892 90.0089 36.5909C90.0089 34.2898 90.4244 32.3011 91.2554 30.625C92.0863 28.9489 93.2262 27.6562 94.6751 26.7472C96.124 25.8381 97.7788 25.3835 99.6396 25.3835C100.74 25.3835 101.774 25.5433 102.74 25.8629C103.713 26.1825 104.59 26.6513 105.371 27.2692C106.152 27.88 106.806 28.6257 107.331 29.5064C107.857 30.38 108.219 31.3778 108.418 32.5ZM122.021 35.419V37.7628H112.476V35.419H122.021ZM125.677 47.5V45.5824L132.879 37.6989C133.724 36.7756 134.42 35.973 134.967 35.2912C135.514 34.6023 135.919 33.956 136.182 33.3523C136.451 32.7415 136.586 32.1023 136.586 31.4347C136.586 30.6676 136.402 30.0036 136.032 29.4425C135.67 28.8814 135.173 28.4482 134.541 28.1428C133.909 27.8374 133.199 27.6847 132.41 27.6847C131.572 27.6847 130.841 27.8587 130.216 28.2067C129.598 28.5476 129.118 29.027 128.777 29.6449C128.444 30.2628 128.277 30.9872 128.277 31.8182H125.762C125.762 30.5398 126.057 29.4176 126.647 28.4517C127.236 27.4858 128.039 26.733 129.054 26.1932C130.077 25.6534 131.224 25.3835 132.495 25.3835C133.774 25.3835 134.907 25.6534 135.894 26.1932C136.881 26.733 137.655 27.4609 138.216 28.3771C138.777 29.2933 139.058 30.3125 139.058 31.4347C139.058 32.2372 138.912 33.022 138.621 33.7891C138.337 34.549 137.84 35.3977 137.13 36.3352C136.427 37.2656 135.45 38.402 134.2 39.7443L129.299 44.9858V45.1562H139.441V47.5H125.677ZM151.258 47.7983C149.653 47.7983 148.286 47.3615 147.156 46.4879C146.027 45.6072 145.164 44.3324 144.567 42.6634C143.971 40.9872 143.673 38.9631 143.673 36.5909C143.673 34.233 143.971 32.2195 144.567 30.5504C145.171 28.8743 146.038 27.5959 147.167 26.7152C148.303 25.8274 149.667 25.3835 151.258 25.3835C152.849 25.3835 154.209 25.8274 155.338 26.7152C156.474 27.5959 157.341 28.8743 157.938 30.5504C158.541 32.2195 158.843 34.233 158.843 36.5909C158.843 38.9631 158.545 40.9872 157.948 42.6634C157.352 44.3324 156.489 45.6072 155.359 46.4879C154.23 47.3615 152.863 47.7983 151.258 47.7983ZM151.258 45.4545C152.849 45.4545 154.085 44.6875 154.965 43.1534C155.846 41.6193 156.286 39.4318 156.286 36.5909C156.286 34.7017 156.084 33.093 155.679 31.7649C155.281 30.4368 154.706 29.4247 153.953 28.7287C153.207 28.0327 152.309 27.6847 151.258 27.6847C149.681 27.6847 148.449 28.4624 147.561 30.0178C146.673 31.5661 146.229 33.7571 146.229 36.5909C146.229 38.4801 146.428 40.0852 146.826 41.4062C147.224 42.7273 147.795 43.7322 148.541 44.4212C149.294 45.1101 150.2 45.4545 151.258 45.4545Z" fill="#0F33EE"/>
                        <rect x="0.5" y="0.5" width="211" height="72" rx="25.5" stroke="#DCDCDC"/>
                      </svg>
                    </div>
                  </div>
              </div>
            </div>
            <div className="col-lg-3 container-with-product">
                <div className="container-product">
                  {/* eslint-disable-next-line react/jsx-no-undef */}
                  <div className="name-product">Nike Air Force <div className="img-container">
                    <Image src="/image6.png"
                           width={500}
                           height={500}
                           alt="Picture of the author"
                    />
                  </div></div>
                  <hr/>
                  <div className="row">
                    <div className="col-lg-2">
                      Итого
                    </div>
                    <div className="col-lg-3">
                      25 $
                    </div>
                  </div>
                  <hr/>
                  {currentAccount ? (
                      <div className="w-full max-w-xs sticky top-3 z-50 ">
                        <form className="shadow-md rounded px-8 pt-6 pb-8 mb-4">
                          <div className="flex items-left justify-between">
                            {isApproved ? (
                                <>
                                  <input
                                      type="number"
                                      placeholder="Amount"
                                      className="w-1/2 mr-4 rounded border border-gray-300 focus:outline-none focus:ring-3 focus:ring-blue-600 focus:border-transparent px-2 py-1 text-sm"
                                      onChange={(e) => setAmount(e.target.value)}
                                  />

                                  <button
                                      className="bg-blue-500 hover:bg-blue-700 text-center text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                      type="button"
                                      onClick={Fund}
                                  >
                                    {sending ? "Donating, Please wait..." : "Donate"}
                                  </button>
                                </>
                            ) : (
                                <button
                                    className="bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    type="button"
                                    onClick={Approve}
                                >
                                  {approving
                                      ? `Approving, Please wait...`
                                      : "Yes! I'd like to donate"}
                                </button>
                            )}
                          </div>
                        </form>
                      </div>
                  ) : (
                      <button
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-full mt-4"
                          onClick={connectWallet}
                      >
                        Connect Your Wallet
                      </button>
                  )}
                </div>
            </div>

          </div>
          <div className="row" style={{marginTop:"30px"}}>
            <div className="col-lg-8 container-price send-mile-container">
              <div><label className="switch">
                <input type="checkbox" />
                  <span className="slider round"></span>
              </label>&nbsp;Отправить уведомление на почту</div>
            </div>
            <div className="col-lg-3"></div>
          </div>
        </div>
      </main>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        pauseOnHover={false}
      />
    </div>
  );
}
