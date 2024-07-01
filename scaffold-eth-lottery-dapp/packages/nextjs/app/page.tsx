"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { EtherInput } from "~~/components/scaffold-eth";
import { Address } from "viem";

const Home: NextPage = () => {
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-2xl mb-2">Group 4/5</span>
            <span className="block text-4xl font-bold">Project week 4</span>
          </h1>
          <p className="text-center text-lg">
            Get started by editing{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/nextjs/pages/index.tsx
            </code>
          </p>
          <PageBody />
        </div>
      </div>
    </>
  );
};

function PageBody() {
  return (
    <>
      <p className="text-center text-lg">Here we are!</p>
      <WalletInfo />
      <CheckLotteryState />
      <OpenLottery />
      <BuyToken />
      <CloseLottery />

    </>
  );
}


function CloseLottery() {
  const handleSubmit = () => {
    fetch('http://localhost:3001/close-lottery', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      }
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("unable to post request")
        }
      })
  }

  return (
    <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h1 className="card-title">Close Lottery?</h1>
        <button className="btn bg-secondary" onClick={handleSubmit}>OK</button>

      </div>

    </div>
  )
}


function BuyToken() {

  const { address, isConnecting, isDisconnected, chain } = useAccount();

  const [ethAmount, setEthAmount] = useState<string>("")
  const [feedback, setFeedback] = useState<string>("")

  const handleSubmit = () => {
    const request = fetch(`http://localhost:3001/purchase-tokens`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },

      body: JSON.stringify({
        address: address,
        amount: ethAmount
      })
    })
      .then((res) => {
        if (!res.ok) {
          setFeedback("Oh no, something went wrong :(")
          throw new Error("unable to make request")
        }

        return res.json()

      })
      .then((data) => {
        setFeedback("You may now participate in the lottery!")
      })
  }

  return (
    <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className=" card-body">
        <h1 className="card-title">Purchase Group5 Tokens</h1>
        {feedback && <p>{feedback}</p>}
        <EtherInput
          value={ethAmount}
          onChange={amount => setEthAmount(amount)}
        />
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  )
}


function CheckLotteryState() {
  const [data, setData] = useState<{ result: string }>();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/check-lottery-state")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Connecting to backend...</p>;
  if (!data) return <p>Connection to backend not working!</p>;

  return (
    <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">Reading from Backend</h2>
        <p>Lottery state: {data.result}</p>
      </div>
    </div>
  );
}


function OpenLottery() {

  const [time, setTime] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");

  const handleSubmit = () => {
    fetch("http://localhost:3001/open-lottery", {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(
        { time: time }
      )
    })
      .then((res) => {
        if (!res.ok) {
          setFeedback("An error has occured.")
          throw new Error("cannot post request")
        }

        return res.json();
      })
      .then((data) => {
        setFeedback("Participants may now begin placing bets!")
        setTime(0);
      })
  }

  return (
    <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h1 className="card-title">Open Lottery for Betting</h1>
        {feedback && <p>{feedback}</p>}
        <div>
          <div>
            <label className="label">
              How long in seconds?
              <input
                type="number"
                value={time}
                onChange={(e) => setTime(e.target.valueAsNumber)}
              />
            </label>
          </div>
        </div>
        <button className="btn bg-secondary" onClick={handleSubmit}>Open Lottery</button>
      </div>
    </div>
  )
}
function RandomWord() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://randomuser.me/api/")
      .then(res => res.json())
      .then(data => {
        setData(data.results[0]);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>No profile data</p>;

  return (
    <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">Testing useState and useEffect from React library</h2>
        <h1>
          Name: {data.name.title} {data.name.first} {data.name.last}
        </h1>
        <p>Email: {data.email}</p>
      </div>
    </div>
  );
}

function WalletInfo() {
  const { address, isConnecting, isDisconnected, chain } = useAccount();

  if (address)
    return (
      <div>
        <p>Your account address is {address}</p>
        <p>Connected to the network {chain?.name}</p>
      </div>
    );
  if (isConnecting)
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  if (isDisconnected)
    return (
      <div>
        <p>Wallet disconnected. Connect wallet to continue</p>
      </div>
    );
  return (
    <div>
      <p>Connect wallet to continue</p>
    </div>
  );
}




export default Home;
