import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [sentenceInput, setsentenceInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sentence: sentenceInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setsentenceInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/topic.png" />
      </Head>

      <main className={styles.main}>
        <img src="/topic.png" className={styles.icon} />
        <h3>Classify a sentence</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="sentence"
            placeholder="Enter an sentence"
            value={sentenceInput}
            onChange={(e) => setsentenceInput(e.target.value)}
          />
          <input type="submit" value="Classify" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
