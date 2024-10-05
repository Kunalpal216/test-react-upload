import { useState } from "react";

const Home = () => {
  console.log("INSIDE HOME");
  const [file, setFile] = useState(null);

  function handleChange(event) {
    console.log(event.target.files[0]);
    setFile(event.target.files[0]);
  }

  async function sendChunk(start, end) {
    let chunk = file.slice(start, end);
    let formData = new FormData();
    formData.append("file", chunk, file.name);
    return await fetch("http://158.101.194.135:3000/upload", {
      method: "POST",
      body: formData,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    console.log(file, typeof file);
    const chunkSize = 1024 * 1024;
    console.log(chunkSize);
    if (file) {
      const totalChunks = Math.ceil(file.size / chunkSize);

      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = (i + 1) * chunkSize;
        await sendChunk(start, end);
      }
    }
  }

  async function downloadFile() {
    return await fetch(`http://158.101.194.135:3000/download/${file.name}`, {
      method: "GET",
    });
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h1>React File Upload</h1>
        <input type="file" onChange={handleChange} />
        <button type="submit">Upload</button>
      </form>
      {file ? (
        <a href={`http://158.101.194.135:3000/download/${file.name}`}>
          <button>Click to Download</button>
        </a>
      ) : null}
      <button onClick={downloadFile}>Download File</button>
    </>
  );
}

export default Home;