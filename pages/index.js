import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [userInput, setuserInput] = useState({
    companyDescription: "",
    companyName: "",
    productDescription: "",
    targetAudience: "",
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
      setError(false);
      setLoading(true);
      const response = await fetch(`/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInput),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }
      setResult(data.result.split("\n\n"));
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
          <label htmlFor="targetAudience">Target Audience:</label>
          <textarea
            id="targetAudience"
            rows={3}
            cols={50}
            value={userInput.targetAudience}
            type="textarea"
            onChange={handleTextChange}
            placeholder=""
            required
          />
          <input type="submit" value="Generate" />
        </form>
        <div className={styles.result}>
          {loading && <p>Loading...</p>}
          {error && (
            <p className={styles.error}>
              An error occurred during your request. Please try again.
            </p>
          )}
          {!loading &&
            !error &&
            result &&
            result.map((campaign, index) => (
              <div className={styles.campaign} key={index}>
                <pre>{campaign}</pre>
              </div>
            ))}
        </div>
      </main>
    </div>
  );
}
