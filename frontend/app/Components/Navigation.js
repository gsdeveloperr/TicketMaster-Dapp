import { ethers } from "ethers";
import Link from "next/link";

const Navigation = ({ account, setAccount }) => {
  const connectHandler = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = ethers.utils.getAddress(accounts[0]);
    setAccount(account);
  };

  return (
    <nav>
      <div className="nav__brand">
        <h1>ticketmaster</h1>

        <input
          className="nav__search"
          type="text"
          placeholder="Find millions of experiences"
        />

        <ul className="nav__links">
          <li>
            <Link href="/">Concerts</Link>
          </li>
          <li>
            <Link href="/">Sports</Link>
          </li>
          <li>
            <Link href="/">Arts & Theater</Link>
          </li>
          <li>
            <Link href="/">More</Link>
          </li>
        </ul>
      </div>

      {account ? (
        <button type="button" className="nav__connect">
          {account.slice(0, 6) + "..." + account.slice(38, 42)}
        </button>
      ) : (
        <button type="button" className="nav__connect" onClick={connectHandler}>
          Connect
        </button>
      )}
    </nav>
  );
};

export default Navigation;
