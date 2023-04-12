import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import Loading from "../components/Loading";
import Error from "../components/Error";

export default function Home() {
  const [userInput, setuserInput] = useState({
    companyDescription: "",
    companyName: "",
    productDescription: "",
    audienceDescription: "",
  });
  const [result, setResult] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleTextChange = (event) => {
    setuserInput({ ...userInput, [event.target.id]: event.target.value });
  };

  async function sendRequest(event) {
    event.preventDefault();
    try {
      setError("");
      setLoading(true);
      const response = await fetch(`/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: userInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setResult(
        Object.entries(data.result).map(([key, value]) => (
          <div key={key}>
            <h2>{key}</h2>
            <p>{value}</p>
          </div>
        ))  
      );           
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError(true);
    }
  }

  return (
    <div>
      <Head>
        <title>MIA</title>
        <link rel="icon" href="/comp.png" />
      </Head>

      <main className={styles.main}>
        <h3>Marketing Ideation Assistant</h3>
        <form onSubmit={sendRequest}>
  
          <label htmlFor="companyName">Company Name:</label>
          <input
            id="companyName"
            value={userInput.companyName}
            type="text"
            onChange={handleTextChange}
            placeholder=""
            required
          />
          
          <label htmlFor="companyDescription">Company Description:</label>
          <input
            id="companyDescription"
            value={userInput.companyDescription}
            type="text"
            onChange={handleTextChange}
            placeholder=""
            required
          />
          <label htmlFor="productDescription">Product Description:</label>
          <textarea
            id="productDescription"
            rows={3}
            cols={50}
            value={userInput.productDescription}
            type="text"
            onChange={handleTextChange}
            placeholder=""
            required
          />
          <label htmlFor="audienceDescription">Audience Description:</label>
          <textarea
            id="audienceDescription"
            rows={3}
            cols={50}
            value={userInput.audienceDescription}
            type="textarea"
            onChange={handleTextChange}
            placeholder=""
            required
          />
          <input type="submit" value="Generate" />
        </form>
        {error ? (
          <div className={styles.error}>
            <Error />
          </div>
        ) : (
          <div className={styles.result}>{loading ? <Loading /> : result}</div>
        )}
      </main>
    </div>
  );
}

